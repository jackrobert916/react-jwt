const express = require('express');
const user = require('./user');
const company = require('./company');

const router = express.Router();

router.get('/health', (req, res) => {
  res.send('OK Cool!');
});

router.use('/user', user);
router.use('/company', company);

module.exports = router;
