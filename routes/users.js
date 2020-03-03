const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const User = require('../models/user');

const APP_ID =
  '730966416306-dv0e9pb4m0k6khl2nrn5r9vskv2j8hmk.apps.googleusercontent.com';
const client = new OAuth2Client(APP_ID);
const SECRET = '__C_H_A_N_G_E_M_E__';

router.post('/', function(req, res, next) {
  client
    .verifyIdToken({
      idToken: req.body.token,
      audience: APP_ID,
    })
    .then(ticket => ticket.getPayload()['sub'])
    .then(user_id => {
      const user = User.create(req.body.userData);
      user.sayHi();
      res.json({ token: jwt.sign(user.id, SECRET) });
    })
    .catch(console.error);
});

router.get('/logout', (req, res) => {
  res.redirect('/');
});

router.post('/verify', (req, res) => {
  jwt.verify(req.body.token, SECRET, (err, userid) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json(User.find(userid).data);
    }
  });
});

module.exports = router;
