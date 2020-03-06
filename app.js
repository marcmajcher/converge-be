require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const logger = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const socketio = require('socket.io');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(logger('dev'));
app.disable('x-powered-by');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', socket => {
  console.log('Client connected');
  setInterval(() => {
    socket.emit('number', `Here's a random number: ${Math.random()}`);
  }, 1000);
  socket.on('disconnect', () => console.log('...disconnected.'));
});

module.exports = { app, server };
