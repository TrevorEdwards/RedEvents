"use strict";
let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    title: {type: String},
    startTime: {type: Date},
    readableData: {type: String},
    description: {type: String},
    link: {type: String, required: true, index: true},
    mediaURL: {type: String},
    geoLat: {type: String},
    geoLon: {type: String},
});

module.exports = mongoose.model('Event', schema);