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
  this.emit('newGameCreated', { gameId, socketId: this.id });
  this.join(gameId);

  console.log('-----');
  console.log(this.adapter.rooms[gameId]);
}

function onJoinGame(gameId) {
  if (this.adapter.rooms[gameId] && this.adapter.rooms[gameId].length === 1) {
    this.join(gameId);
    this.in(gameId).emit('info', `starting game! ${gameId}`)
  } else {
    console.log('ROOM NO GOOD', gameId);
  }
}

function onGetStatus() {
  this.emit('status', 'I gotcher status.');
}
