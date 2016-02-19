var mongo = require('mongodb'),
    url = require('url'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    schedule = require('node-schedule');

var Server = mongo.Server,
    Db = mongo.Db;

var MONGO_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var MONGO_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;

var server = new Server(MONGO_HOST, MONGO_PORT, {auto_reconnect: true});
db = new Db('redevents', server);
exports.db = db;

db.open(function(err, db) {
  console.log('opening db');
    if(!err) {
        console.log("Connected to 'RedEvents' database.  Authenticating...");
        if (MONGO_HOST != 'localhost'){
          db.authenticate("admin", "Z2DJRT81KAJZ", function(err, res){
            if (err) throw err;
            console.log('Authenticated!');
          });
        }
        db.collection('events', {strict:true}, function(err, collection) {
            if (err) {
                console.log('The events collection doesn’t exist. Popuating now...');
                  fetchData();
              }
        });
    } else{
      throw err;
    }
});
