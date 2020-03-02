const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'My App' });
});

/* smoke test route */
router.get('/booyah', (req, res) => {
  res.send('booyah');
});

module.exports = router;
