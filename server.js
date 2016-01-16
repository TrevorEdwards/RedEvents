var express = require('express'),
    events = require('./routes/events');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/events', events.findAll);
app.get('/events/:start:end', events.findRange);


app.listen(3000);
console.log('Listening on port 3000...');

//DEBUG
process.on('uncaughtException', function (err) {
    console.log(err);
});
