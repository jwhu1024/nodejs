var zmq     = require('zmq'),
	rSub    = zmq.socket('sub'),
	cmd_tbl = require('./command.json'),
	jsonMgr = require('./jsonMgr.js').jsonMgr,
	colors  = require('colors'),
	brConf  = new jsonMgr({
		path   : './conf.json',
		indent : 4,
		sync   : true
	});

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

rSub.connect('tcp://127.0.0.1:5565');
rSub.subscribe('');

rSub.on('message', function(data) {
	var args = arguments,
		dataArr = [];

	for (var i = 0; i < args.length; i++) {
		dataArr.push(args[i].toString());
	}

	var cmd = dataArr[0];
	console.log('Command Received : '.info + cmd.debug);

	if (cmd === 'END') {			// on 'END' close connections
		rSub.close();
	} else if (cmd >= "1001" && cmd <= "1021") {
		printDebugMsg(cmd, 0);
	} else if (cmd >= "2001" && cmd <= "2021") {
		var dataObj = {
			key   : arguments[0].toString(),
			value : arguments[1].toString()
		};

		brConf.set(cmd_tbl[dataObj.key], dataObj.value);
		printDebugMsg(dataObj.key, 1);
	}
});

function printDebugMsg (_idx, _type) {
	var token = (_type === 0) ? 'GET' : 'SET';
	console.log('--------------------------------'.warn);
	console.log('Type  : '.info + token.debug);
	console.log('Key   : '.info + cmd_tbl[_idx].debug);
	console.log('Value : '.info + brConf.get(cmd_tbl[_idx]).toString().debug);
	console.log('--------------------------------'.warn);
}

// Handle exception otherwise node will crash when error occured
process.on('uncaughtException', function(err) {
    console.error(err.stack);
});

var socket = zmq.socket('pull'),
	port   = "tcp://127.0.0.1:7777";
socket.connect(port);
console.log('connected!');

socket.on('message', function(data) {
	console.log('response from czmq : ' + arguments[0].toString());
	console.log('response from czmq : ' + arguments[1].toString());
});
