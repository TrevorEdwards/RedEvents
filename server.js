var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

console.log('Preparing to listen on port ' + server_port + ":" + server_ip_address);
// server.listen(server_port, server_ip_address, function(){
//   console.log("Listening on " + server_ip_address + ", server_port " + server_port)
// });

var express = require('express'),
    events = require('./routes/events');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/events', events.findAll);
app.get('/events/:end', events.findRange);


app.listen(server_port, server_ip_address);
console.log('Listening on port ' + server_port + ":" + server_ip_address);

//DEBUG
// process.on('uncaughtException', function (err) {
//     console.log(err);
// });
