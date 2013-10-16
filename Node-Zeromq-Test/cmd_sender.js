var zmq     = require('zmq'),
	prompt  = require('prompt'),
	colors  = require('colors'),
	cmd_tbl = require('./command.json');

colors.setTheme({
	silly   : 'rainbow',
	input   : 'grey',
	verbose : 'cyan',
	prompts : 'grey',
	info    : 'green',
	data    : 'grey',
	help    : 'cyan',
	warn    : 'yellow',
	debug   : 'blue',
	error   : 'red'
});

(function initialize() {
	// zmq initialize
	var rPub = zmq.socket('pub');
	
	// zmq settings
	rPub.bind('tcp://127.0.0.1:5565');

	// prompt settings
	prompt.message = '';
	prompt.colors  = false;

	// main function
	entry(rPub);

	process.on('exit', function() {
		rPub.send('END');
		rPub.close();
	});
})();

function entry(_rPub) {
	// show help
	display_table();

	// get command line
	getCommandLineArgument();

	function zmqSendCommand(_cmd, _val) {
		if (_val) {
			console.log('send multipart message'.info);
			_rPub.send(_cmd, zmq.ZMQ_SNDMORE);
			_rPub.send(_val, 0);
		} else {
			_rPub.send(_cmd, 0);
		}
	}

	function display_table() {
		console.log('-----------------------------------------'.yellow);
		for (var idx in cmd_tbl) {
			console.log('%d. %s'.info, idx, cmd_tbl[idx]);
		}
		console.log('-----------------------------------------'.yellow);
	}

	function getCommandLineArgument() {
		// Setting the prompt
		var schema = {
			properties: {
				Command: {
					required: true,
					type: 'number'
				},
				Value: {
					required: false
				}
			}
		};

		// Start the prompt
		prompt.start();
		prompt.get(schema, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log('Command Received : ' + result.Command);
				console.log('Value   Received : ' + result.Value);
				console.log('Action : ' + cmd_tbl[result.Command]);
				
				zmqSendCommand(result.Command, result.Value);
				entry(_rPub);
			}
		});
	}
}