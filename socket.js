const socketioJwt = require('socketio-jwt');
const socketio = require('socket.io');
const randomWords = require('random-words');
const secret = process.env.SECRET || '__C_H_A_N_G_E_M_E__';
const Game = require('./Game');

module.exports = function socketInit(server) {
  const io = socketio(server);
  io.use(
    socketioJwt.authorize({
      secret,
      handshake: true,
    })
  );

  io.on('connection', (socket) => {
    const googleId = socket.decoded_token;
    console.log(`>> Client ${googleId} connected`);

    socket.on('startNewGame', onStartNewGame);
    socket.on('joinGame', onJoinGame);
    socket.on('sendWord', onWordSent);

    socket.on('getStatus', onGetStatus);
    socket.on('disconnect', () => onDisconnect(googleId));
    socket.emit('info', 'Connected to socket - Welcome to Converge!');
  });
};

function onDisconnect(id) {
  console.log(`<< User ${id} disconnected.`);
}

function onStartNewGame() {
  const gameId = randomWords({
    exactly: 2,
    join: '-',
    maxLength: 7,
  });
  new Game(gameId, this.id);
  // this.emit('info', `Starting a new game! ID: ${gameId}`);
  this.join(gameId, () => this.emit('newGameCreated', { gameId }));
}

function onJoinGame(gameId) {
  if (this.adapter.rooms[gameId] && this.adapter.rooms[gameId].length === 1) {
    Game.joinGame(gameId, this.id);
    this.join(gameId, () => countdown(this, gameId));
  } else {
    console.error('ROOM NO GOOD', gameId);
  }
}

function onWordSent(word) {
  console.log('WORD SENT', word, 'from', this.id);
  const game = Game.byPlayer(this.id);
  const done = game.addWord(this.id, word);
  console.log(game);
  console.log('DONE?', done);
  if (done) {
    this.nsp.in(game.id).emit('roundOver', game.words);
    game.nextRound();
  }
  //   this.nsp.in(game.id).emit('winGame', game.words);
}

function countdown(socket, gameId) {
  // console.log('Counting down for game: ', Game.byId(gameId));
  const room = socket.nsp.in(gameId);
  room.emit('info', `starting game!!!! ${gameId}`);
  let count = 5;
  const interval = setInterval(() => {
    room.emit('startCountdown', count--);
    if (count < 0) {
      clearInterval(interval);
      room.emit('startGame');
    }
  }, 1000);
}

function onGetStatus() {
  this.emit('status', 'I gotcher status.');
}
