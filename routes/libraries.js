"use strict";
let Plant = require('plant.js');
let schedule = require('node-schedule');
let async = require('async');
let express = require('express');
let router = express.Router();

let Library = require('../models/library');

// Routes
router.get('/', function _findAll(req, res) {
    Library.find({}, function(err, hours) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        return res.status(200).send({
            lastUpdated: lastUpdated,
            hours: hours
        });
    });
});

// Data Scraping

let lastUpdated = 0;

function parseLibraries(){
    console.log('parsing libraries at ' + Date.now());
    lastUpdated = Date.now();
    let browser = new Plant();

    browser.get('https://www.library.cornell.edu/libraries')
        .then(function($){
            let result = $('.today-hours , .library-info h2');
            let lib = null;
            let lib_stats = [];
            for( let i = 0; i < result.length; i++){
                try{
                    if(result[i].children[0].data != undefined){
                        if(lib == null)
                            lib = result[i].children[0].data;
                        else{
                            lib_stats.push( {name: lib, hours: result[i].children[0].data})
                            lib = null;
                        }
                    }
                    if(result[i].children[1].data != undefined){
                        if(lib == null){
                            lib = result[i].children[1].data;
                        }
                        else{
                            lib_stats.push( {name: lib.trim(), hours: result[i].children[1].data.trim()});
                            lib = null;
                        }
                    }
                }
                catch(e){
                    //do nothing
                }
            }

            //Insert into the database
            Library.remove({}, function(err) {
                async.each(lib_stats, function (lib,cb) {
                    new Library(lib).save(cb);
                }, function(err) {
                    if (err) console.error(err);
                });
            });
        })
        .catch(function(e){
            return console.trace(e);
        });
}

// 45 second consistency
let rule = new schedule.RecurrenceRule();
rule.second = 45;
schedule.scheduleJob(rule, function(){
    parseLibraries();
});

// Initialize
parseLibraries();

module.exports = router;
