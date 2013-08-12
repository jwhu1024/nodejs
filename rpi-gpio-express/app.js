/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var routes = require('./routes');
var user = require('./routes/user');
var gpio = require('./routes/gpio');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// Home page
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/users', user.list);
app.get('/gpio', gpio.gpioControl);      // gpio on/off depend on query string (act)
//app.get('/gpioOn', routes.gpioOn);     // gpio on only
//app.get('/gpioOff', routes.gpioOff);   // gpio off only
//app.post('/gpio', routes.gpio);        // gpio on/off depend on query string (act)

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
