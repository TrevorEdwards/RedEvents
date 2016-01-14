var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('eventsdb', server);

db.open(function(err, db) {
  console.log('opening db');
    if(!err) {
        console.log("Connected to 'eventsdb' database");
        db.createCollection('events', {strict:true}, function(err, collection) {
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
        console.log('about to insert into mongo');
        console.log( JSON.stringify(result.rss.channel) );
        updateData( result.rss.channel );

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

updateData = function(data) {
  console.log('update data called');
  db.collection('events', function(err, collection) {

    collection.insert( { test: 'trolololo'}, function(err,records){console.log("wow!")});

  });
};

//Grab data every 15 seconds TODO: Make this a reasonable interval after testing
//schedule.scheduleJob('*/5 * * * *', function(){
//  fetchData();
//});

//TODO
exports.findRange = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving events in range: ' + id);
    db.collection('events', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

//TODO
exports.findAll = function(req, res) {
    db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('im trying!');
            res.send(items);
        });
    });
};
