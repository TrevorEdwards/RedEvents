var express = require('express'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule'),
    request = require('request'),
    url = require('url'),
    fs = require('fs'),
    events = require('./routes/events');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/events', events.findAll);
app.get('/events/:start:end', events.findRange);


//Scrape calendar xml, convert to json
fetchData = function(){
  console.log('Fetching data at ' + Date.now());
  var myURL = url.format('http://events.cornell.edu/calendar.xml');
  request(myURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body.toString(), function (err, result) {

        //Store data to a file
        // fs.writeFile("./data/events.json", JSON.stringify(result), function(err) {
        //   if (err) throw err;
        //   console.log('json file logged.');
        // });

        //Also store the data in mongo
        console.log('about to insert into mongo');
        try{
          events.updateData( result.rss );
        } catch( error ){
          console.log('A topology error probably occured:');
          console.log(error);
        }

      });
    } else {
      console.log('Error in grabbing calendar data');
      console.log(error);
      if (!error ){
        console.log('Response Code: ' + response.statusCode);
      }
    }
  });
}

//Grab data every 15 seconds TODO: Make this a reasonable interval after testing
schedule.scheduleJob('*/15 * * * * *', function(){
  fetchData();
});



app.listen(3000);
console.log('Listening on port 3000...');
