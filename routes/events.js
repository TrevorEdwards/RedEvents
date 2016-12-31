"use strict";
let url = require('url');
let request = require('request');
let parseString = require('xml2js').parseString;
let schedule = require('node-schedule');
let async = require('async');
let express = require('express');
let router = express.Router();

let Event = require('../models/event');

// Routes

router.get('/:end', function _findRange(req, res) {
    let end = Number( req.params.end );

    if (!end) {
        return res.status(500);
    }

    Event.find({startTime : {$lt : end}}, function (err, events) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        return res.status(200).send(events);
    });
});

router.get('/:begin/:end', function _findRangeExclusive(req, res) {

    let begin = Number( req.params.begin );
    let end = Number( req.params.end );

    if (!end || !begin) {
        return res.status(500);
    }

    Event.find({startTime : { $lt: end, $gte: begin }}, function (err, events) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        return res.status(200).send(events);
    });
});

router.get('/', function _findAll(req, res) {
    Event.find({}, function (err, events) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        return res.status(200).send(events);
    });
});

// Data Scraping

//Scrape calendar xml, convert to json
function fetchData(){
    console.log('Fetching events at ' + Date.now());
    const CORNELL_EVENTS_URL = url.format('http://events.cornell.edu/calendar.xml');
    request(CORNELL_EVENTS_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parseString(body.toString(), function (err, result) {
                //Store the data in mongo
                updateData( formatData( result.rss.channel[0].item ) );
            });
        } else {
            console.error('Error in grabbing calendar data');
            console.error(error);
            if (!error){
                console.error('Response Code: ' + response.statusCode);
            }
        }
    });
}

function formatData(data) {
    let obj = JSON.parse( JSON.stringify( data ) );
    for (let i = 0; i < obj.length; i++){
        let event = obj[i];
        if (event.title != undefined){
            let tempTitle = event.title.toString();
            let dateEndIndex = tempTitle.indexOf(":");
            event.readableDate = tempTitle.substring(0,dateEndIndex);
            event.title = tempTitle.substring(dateEndIndex+1).trim();
            event.startTime = Date.parse( event['dc:date'].toString() );
            event.description = event.description.toString();
            event.link = event.link.toString();
            if( event['geo:lat']) event.geoLon = event['geo:lat'].toString();
            if( event['geo:long']) event.geoLat = event['geo:long'].toString();
            event.mediaURL = event["media:content"][0]['$'].url.toString();
        }
    }

    return obj;
}

/**
 * Updates data, deleting events that started over a day ago, then grabbing events and updating or making new events.
 * Event uniqueness is derived from the link and time combination.
 * @param data Formatted event data
 */
function updateData(data) {
    // Delete Old Data
    const ONE_DAY_AGO = Date.now() - 1000 * 60 * 60 * 24;
    Event.remove({startTime: {$lte: ONE_DAY_AGO}}, function(err) {
        if (err) {
            console.error(err);
            return;
        }

        // Update data
        async.each(data, function(datum, cb) {
            Event.findOne({link: datum.link, startTime: datum.startTime}, function(err,event) {
                if (!event) {
                    event = new Event(datum);
                } else {
                    event.title = datum.title;
                    event.description = datum.description;
                    event.readableDate = datum.readableDate;
                    event.geoLat = datum.geoLat;
                    event.geoLon = datum.geoLon;
                    event.mediaURL = datum.mediaURL;
                }
                event.save(cb);
            });
        }, function(err) {
            if (err) console.error(err);
        });
    });
}

let rule = new schedule.RecurrenceRule();
rule.minute = 5; // Check every 5 minutes
schedule.scheduleJob(rule, function(){
    fetchData();
});

// Init
fetchData();

module.exports = router;
