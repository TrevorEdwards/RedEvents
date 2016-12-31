"use strict";
let path = require('path');
let express = require('express');
let router = express.Router();

const BIKE_PATH = path.join(__dirname + "/../data/maps/bikeracks.json");
const BLUE_PATH = path.join(__dirname + "/../data/maps/bluelights.json");
const BUILDING_PATH = path.join(__dirname + "/../data/maps/buildings.json");
const STOP_PATH = path.join(__dirname + "/../data/maps/stop-locations.json");

router.get('/bikeracks', function(req, res) {
    res.sendFile( BIKE_PATH );
});

router.get('/bluelight', function(req, res) {
    res.sendFile( BLUE_PATH );
});

router.get('/buildings', function(req, res) {
    res.sendFile(BUILDING_PATH);
});

router.get('/stops', function(req, res) {
    res.sendFile( STOP_PATH );
});

module.exports = router;