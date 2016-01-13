var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true, keepAlive: 1});
db = new Db('eventsdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'eventsdb' database");
        db.collection('events', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'events' collection doesn't exist.");
            }
        });
    }
});

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
            res.send(items);
        });
    });
};

exports.updateData = function(data) {
  console.log('update data called');
  db.collection('events', function(err, collection) {

      collection.insert( data, function(err,records){
        if (err) throw err;
        console.log('mongo successfully saved.');
      });
  });
};
