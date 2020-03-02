const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const APP_ID =
  '730966416306-dv0e9pb4m0k6khl2nrn5r9vskv2j8hmk.apps.googleusercontent.com';
const client = new OAuth2Client(APP_ID);

router.post('/', function(req, res, next) {
  client
    .verifyIdToken({
      idToken: req.body.token,
      audience: APP_ID,
    })
    .then(ticket => ticket.getPayload()['sub'])
    .then(id => res.send(`USER ID: ${id}`))
    .catch(console.error);
});

module.exports = router;
