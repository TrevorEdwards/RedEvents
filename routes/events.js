var mongo = require('mongodb'),
    url = require('url'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('eventsdb', server);

db.open(function(err, db) {
  console.log('opening db');
    if(!err) {
        console.log("Connected to 'eventsdb' database");
        db.collection('events', {strict:true}, function(err, collection) {
            if (err) {
                console.log('The events collection doesn’t exist. Creating it with sample data…');
                  fetchData();
              }
        });
    } else{
      throw err;
    }
});

//Scrape calendar xml, convert to json
fetchData = function(){
  console.log('Fetching data at ' + Date.now());
  var myURL = url.format('http://events.cornell.edu/calendar.xml');
  request(myURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body.toString(), function (err, result) {
        //Store the data in mongo
        updateData( formatData( result.rss.channel[0].item ) );

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

formatData = function(data) {
  var obj = JSON.parse( JSON.stringify( data ) );
  console.log(obj);
  for (var i = 0; i < obj.length; i++){
      var event = obj[i];
      if (event.title != undefined){
        var tempTitle = event.title.toString();
        var dateEndIndex = tempTitle.indexOf(":");
        event.readableDate = tempTitle.substring(0,dateEndIndex);
        event.title = tempTitle.substring(dateEndIndex+1).trim();
        event.uniDate = Date.parse( event['dc:date'].toString() );
        event.description = event.description.toString();
        event.link = event.link.toString();
        event["media:content"] = event["media:content"][0]['$'].url.toString();

        delete event.guid;
        delete event['pubDate'];
        delete event['dc:date'];
    }
  }
  return obj;

}

updateData = function(data) {
  db.collection('events', function(err, collection) {

    collection.drop(); //TODO: Replace data more reliably

    for( var i = 0; i < data.length; i++ ) {
      collection.insert( data[i], function(err,records){
        if (err) throw err;
    });
    }
});
};

fetchData();

schedule.scheduleJob('*/5 * * * *', function(){
 fetchData();
});

// TODO Find all Unix dates less than or equal to the provided end parameter
exports.findRange = function(req, res) {
    var end = req.params.end;

    console.log(end);

    db.collection('events', function(err, collection) {
        collection.find( { 'uniDate': { $lte: end } }).toArray( function(err, items) {
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
