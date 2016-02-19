var mongo = require('mongodb'),
    url = require('url'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule'),
    sdb = require('./shareddb');


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
        if( event['geo:lat']) event['geo:lat'] = event['geo:lat'].toString();
        if( event['geo:long']) event['geo:long'] = event['geo:long'].toString();
        event["media:content"] = event["media:content"][0]['$'].url.toString();

        delete event.guid;
        delete event['pubDate'];
        delete event['dc:date'];
    }
  }
  return obj;

}

updateData = function(data) {
  sdb.db.collection('events', function(err, collection) {

    collection.drop(); //TODO: Replace data more reliably

    for( var i = 0; i < data.length; i++ ) {
      collection.insert( data[i], function(err,records){
        if (err) throw err;
    });
    }
});
};

//Fetch data every 30 minutes
schedule.scheduleJob('*/30 * * * *', function(){
 fetchData();
});

exports.findRange = function(req, res) {

    var end = Number( req.params.end );

    sdb.db.collection('events', function(err, collection) {
        // collection.find( { 'uniDate': { $lte: end } }).toArray( function(err, items) {
        collection.find( { uniDate: { $lt: end } }).toArray( function(err, items) {
            console.log(items);
            res.send(items);
        });
    });
};

exports.findRangeExclusive = function(req, res) {

    var begin = Number( req.params.begin );
    var end = Number( req.params.end );

    sdb.db.collection('events', function(err, collection) {
        // collection.find( { 'uniDate': { $lte: end } }).toArray( function(err, items) {
        collection.find( { uniDate: { $lt: end, $gte: begin } }).toArray( function(err, items) {
            console.log(items);
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    sdb.db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
