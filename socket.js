const socketioJwt = require('socketio-jwt');
const socketio = require('socket.io');
const randomWords = require('random-words');
const secret = '__C_H_A_N_G_E_M_E__';

module.exports = function socketInit(server) {
  const io = socketio(server);
  io.use(
    socketioJwt.authorize({
      secret,
      handshake: true,
    })
  );

  io.on('connection', socket => {
    const googleId = socket.decoded_token;
    console.log(`>> Client ${googleId} connected`);

    socket.on('startNewGame', onStartNewGame);
    socket.on('joinGame', onJoinGame);

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
  this.emit('info', `Starting a new game! ID: ${gameId}`);
  this.join(gameId, () =>
    this.emit('newGameCreated', { gameId, socketId: this.id })
  );
}

function onJoinGame(gameId) {
  if (this.adapter.rooms[gameId] && this.adapter.rooms[gameId].length === 1) {
    this.join(gameId, () => onCountdown(this, gameId));
  } else {
    console.log('ROOM NO GOOD', gameId);
  }
}

function onCountdown(socket, gameId) {
  const room = socket.nsp.in(gameId)
  room.emit('info', `starting game!!!! ${gameId}`);
  let count = 5;
  const interval = setInterval(() => {
    if (count === 0) {
      clearInterval(interval);
      room.emit('startGame', '----BEGIN----')
    }
    room.emit('startCountdown', count--);
  }, 1000);

}

function onGetStatus() {
  this.emit('status', 'I gotcher status.');
}
