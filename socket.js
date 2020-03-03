const socketio = require('socket.io');
const sessions = {};

const driverSocket = driverid => sessions[driverid];
const driverEmitter = driverid => ({
  socket: sessions[driverid],
  emit(eventName, message) {
    if (this.socket) {
      this.socket.emit(eventName, message);
    }
  }
});

const expressMiddleware = (server, session) => {
  const io = socketio(server);

  io.use((socket, next) => {
    session(socket.request, socket.request.res, next);
  });

  io.on('connection', (socket) => {
    const driverid = socket.request.session.user.driverid;
    sessions[driverid] = socket;

    socket.on('disconnect', () => {
      delete sessions[driverid];
    });
  });

  return (req, res, next) => {
    res.io = io;
    next();
  };
};

module.exports = {
  expressSocket: expressMiddleware,
  driverSocket,
  driverEmitter
};


/*

npm install socketio-jwt


---

// set authorization for socket.io
io.sockets
  .on('connection', socketioJwt.authorize({
    secret: 'your secret or public key',
    timeout: 15000 // 15 seconds to send the authentication message
  }))
  .on('authenticated', (socket) => {
    //this socket is authenticated, we are good to handle more events from it.
    console.log(`hello! ${socket.decoded_token.name}`);
  });


*/