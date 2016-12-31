// FIXME
/*
var Plant = require('plant.js'),
    schedule = require('node-schedule'),
    sdb = require('./shareddb');

var parseCalendar = function(){
    console.log('parsing academic calendar at ' + Date.now());
    var browser = new Plant();

    browser.get('https://www.cornell.edu/academics/calendar')
        .then(function($){
            var result = $('td');
            var cal_events = [];
            for( var i = 0; i < result.length / 3; i=i+3){
                try{
                    if(result[i].children[0].data != undefined){
                        cal_events.push( {
                            event: result[i].children[0].data,
                            dayOfWeek: result[i+1].children[0].data,
                            date: result[i+2].children[0].data,
                        })
                    }
                } catch(e){
                    console.log(e);
                }
            }
            //Insert into the database
            sdb.db.collection('academiccalendar', function(err, collection) {
                if( collection != undefined){
                    collection.drop(); //TODO: Replace data more reliably
                }
                for( var i = 0; i < cal_events.length; i++ ) {
                    collection.insert( cal_events[i], function(err,records){
                        if (err) throw err;
                    });
                }
            });
        })
        .catch(function(e){
            return console.trace(e);
        });
}


//Above seems to not be working :/
//45 second consistency
var rule = new schedule.RecurrenceRule();
rule.second = 45;
schedule.scheduleJob(rule, function(){
    parseCalendar();
});

//initialization
parseCalendar();

//exports
exports.findAll = function(req, res) {
    sdb.db.collection('academiccalendar', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
*/