require('dotenv').config();
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const randomstring = require('randomstring');
const session = require('cookie-session');
// const socket = require('./socket');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
app.use(logger('dev'));
app.disable('x-powered-by');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sessionMiddleware = session({
  keys: new Array(Math.ceil(Math.random() * 8) + 8)
    .fill(0)
    .map(randomstring.generate),
});
app.use(sessionMiddleware);

// app.use(socket.expressSocket(server, sessionMiddleware));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
