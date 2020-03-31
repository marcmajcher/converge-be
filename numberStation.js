module.exports = {
  interval: -1,
  init(io) {
    this.interval = setInterval(() => {
      io.emit('number', Math.random());
    }, 1000);
  },
};
