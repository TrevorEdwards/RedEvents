"use strict";
let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {type: String},
    hours: {type: String},
});

module.exports = mongoose.model('Library', schema);