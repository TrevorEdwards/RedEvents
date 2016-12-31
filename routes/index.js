"use strict";
let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/index.txt'));
});

module.exports = router;
