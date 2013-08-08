var fs = require('fs');
var rpiGpio = require('../public/javascripts/gpiolib.js');
/*
 * GET users listing.
 */

exports.gpioControl = function(req, res) {
	rpiGpio.act(req.query.pin, req.query.act);
	fs.readFile('index.html', 'utf-8', function(err, data) {
		if (err) {
			res.send(404, "No Gpio page");
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
};