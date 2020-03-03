const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const APP_ID =
  '730966416306-dv0e9pb4m0k6khl2nrn5r9vskv2j8hmk.apps.googleusercontent.com';
const client = new OAuth2Client(APP_ID);
const SECRET = '__C_H_A_N_G_E_M_E__';

const userInfo = {};

router.post('/', function(req, res, next) {
  client
    .verifyIdToken({
      idToken: req.body.token,
      audience: APP_ID,
    })
    .then(ticket => ticket.getPayload()['sub'])
    .then(user_id => {
      userInfo[user_id] = req.body.userData;
      res.json({ token: jwt.sign(userInfo[user_id], SECRET) });
    })
    .catch(console.error);
});

router.get('/logout', (req, res) => {
  res.redirect('/');
});

router.post('/verify', (req, res) => {
  jwt.verify(req.body.token, SECRET, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json(userInfo[data.googleId]);
    }
  });
});

module.exports = router;
