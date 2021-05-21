const express = require('express');
const morgan = require('morgan');
const app = express();
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

db.sync();
app.use(require('body-parser'));
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);

module.exports = app;