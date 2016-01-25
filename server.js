var express = require('express'),
    events = require('./routes/events'),
    app = express(),
    http = require('http');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var createIndex = function(req, res){
  res.sendFile(__dirname + '/index.txt');
  return console.log( 'Creating index with version: ' + process.version );
}

app.set('port', server_port);
app.set('ip', server_ip_address);

//app.use(express.logger('dev'));
//app.use(express.bodyParser());

app.get('/', createIndex); //Index
app.get('/events', events.findAll);
app.get('/events/:end', events.findRange);
app.get('/events/:begin/:end', events.findRangeExclusive);

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("RedEvents server listening at %s:%d ", app.get('ip'),app.get('port'));
});



//DEBUG
// process.on('uncaughtException', function (err) {
//     console.log(err);
// });
