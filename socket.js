const socketioJwt = require('socketio-jwt');
const socketio = require('socket.io');
const numberStation = require('./numberStation');
const randomWords = require('random-words');
const secret = '__C_H_A_N_G_E_M_E__';

module.exports = function socketInit(server) {
  const io = socketio(server);
  numberStation.init(io);

  io.use(
    socketioJwt.authorize({
      secret,
      handshake: true,
    })
  );

  io.on('connection', socket => {
    const googleId = socket.decoded_token;
    console.log(`>> Client ${googleId} connected`);

    socket.on('booyah', data => console.log(`BOOYAH: ${data}`));
    socket.on('startNewGame', onStartNewGame);

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
