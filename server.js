var express = require('express'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule'),
    request = require('request'),
    url = require('url'),
    fs = require('fs'),
    events = require('./routes/events');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/events', events.findAll);
app.get('/events/:start:end', events.findRange);


app.listen(3000);
console.log('Listening on port 3000...');
