"use strict";
let path = require('path');
let express = require('express');
let router = express.Router();

const CONTACTS_PATH = path.join(__dirname + "/../data/emergencycontacts.json");

router.get('/', function(req, res) {
    res.sendFile( CONTACTS_PATH );
});

module.exports = router;