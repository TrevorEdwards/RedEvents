var express = require('express'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule'),
    request = require('request'),
    url = require('url'),
    fs = require('fs'),
    wine = require('./routes/wines');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);


//Scrape calendar xml, convert to json
fetchData = function(){
  console.log('Fetching data at ' + Date.now());
  var myURL = url.format('http://events.cornell.edu/calendar.xml');
  request(myURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body.toString(), function (err, result) {
        fs.writeFile("./data/events.json", JSON.stringify(result), function(err) {
          if (err){
            console.log( err );
          }
          console.log('data logged.');
        });
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

//Grab data every 10 seconds TODO: Make this a reasonable interval after testing
schedule.scheduleJob('*/10 * * * * *', function(){
  fetchData();
});



app.listen(3000);
console.log('Listening on port 3000...');
