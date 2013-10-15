var prompt = require('prompt'),
	colors = require('colors');

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

var cmd_tbl = {
	'1'  : 'LED-BlinkPeriod',
	'2'  : 'LED-PickPeriod',
	'3'  : 'LED-InitBlink',
	'4'  : 'WIFI-Enable',
	'5'  : 'WIFI-SSID',
	'6'  : 'WIFI-User_ctrl',
	'7'  : 'WIFI-Range',
	'8'  : 'WIFI-Mac',
	'9'  : 'WIFI-Mode',
	'10' : 'WIFI-Channel',
	'11' : 'WIFI-Rts_threshould',
	'12' : 'WIFI-Fragmentation_threshould',
	'13' : 'WIFI-SSID_broadcast',
	'14' : 'WIFI-Encryption',
	'15' : 'WIFI-Key',
	'16' : 'WIFI-Mac_filter',
	'17' : 'WIFI-Region',
	'18' : 'WIFI-AclTable',
	'19' : 'WIFI-Sharing',
	'20' : 'Major_Ver',
	'21' : 'WIFI-Minor_Ver'
};

(function display_table() {
	console.log('-----------------------------------------'.yellow);
	for (var idx in cmd_tbl) {
		console.log('%d. %s'.info, idx, cmd_tbl[idx]);
	}
	console.log('-----------------------------------------'.yellow);
})();

(function getCommandLineArgument() {
	// Start the prompt
	prompt.message = '';
	prompt.colors = false;
	prompt.start();

	prompt.get(['Command'], function(err, result) {
		console.log('Command Received : ' + result.Command);
		console.log('Action : ' + cmd_tbl[result.Command]);
	});
})();