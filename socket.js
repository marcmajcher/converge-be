const socketioJwt = require('socketio-jwt');
const socketio = require('socket.io');
const numberStation = require('./numberStation');
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
    console.log(`Client ${googleId} connected`);

    socket.on('booyah', data => console.log(`BOOYAH: ${data}`));
    socket.on('startNewGame', () => console.log('ASDAT START NEW GAME'));
    
    socket.on('disconnect', () => onDisconnect(googleId));
    socket.emit('info', 'Connected to socket - Welcome to Converge!')
  });
};

function onDisconnect(id) {
  console.log(`User ${id} disconnected.`);
}
