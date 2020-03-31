const express = require('express');
const router = express.Router();

/* smoke test route */
router.get('/booyah', (req, res) => {
  res.send('booyah');
});

module.exports = router;
