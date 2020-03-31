module.exports = {
  interval: undefined,
  start() {
    this.interval = setInterval(() => {
      socket.emit('number', Math.random());
    }, 1000);
  },
  subscribe(socket) {},
};
