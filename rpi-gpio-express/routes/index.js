/**
 *
 * GPIO controller
 *
 **/

exports.index = function(req, res) {
	res.send('hello');
};

/*
exports.gpioOn = function(req, res) {
	rpiGpio.on(16);
	res.send('gpio 16 on');
};

exports.gpioOff = function(req, res) {
	rpiGpio.off(16);
	res.send('gpio 16 off');
};
*/