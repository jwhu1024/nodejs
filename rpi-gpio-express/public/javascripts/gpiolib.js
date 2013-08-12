var gpio = require('rpi-gpio');

var lightGpioControl = {
	//pin: 16,
	//delay: 100,
	//count: 0,

	on: function(pin) {
		gpio.setup(pin, gpio.DIR_OUT, function(){
			gpio.write(16, true, function(err) {
				if (err) {
					console.log('function writeOn()');
					throw err;
				}
				console.log('Written to pin on');
			});
		});
		console.log('on func()');
	},

	off: function(pin) {
		gpio.setup(pin, gpio.DIR_OUT, function(){
			gpio.write(16, false, function(err) {
				if (err) {
					console.log('function writeOff()');
					throw err;
				}
				console.log('Written to pin off');
			});
		});
		console.log('off func()');
	},

	act: function(pin, enable) {
		gpio.setup(pin, gpio.DIR_OUT, function(){
			gpio.write(16, enable, function(err) {
				if (err) {
					console.log('function writeOn()');
					throw err;
				}
				console.log('Written to pin on');
			});
		});
		console.log('on func()');
	},
};

module.exports = lightGpioControl;

/*
lightGpioControl.on();

setTimeout(function() {
	lightGpioControl.off();
}, 2000);

module.exports = {
	on: function() {
		console.log('gpio 23 on');
		gpio.write(lightGpioControl.pin, 1, null);
	},
	off: function() {
		console.log('gpio 23 off');
		gpio.write(lightGpioControl.pin, 0, null);
	}
};
*/
