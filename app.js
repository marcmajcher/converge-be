require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const socketInit = require('./socket');

const port = process.env.PORT || '8000';
const app = express();
const server = http.createServer(app);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.set('port', port);
app.use(logger('dev'));
app.disable('x-powered-by');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

server.on('error', error => { throw error; });
server.on('listening', () => console.info(`Listening on port ${port}`));

socketInit(server);
server.listen(port);
