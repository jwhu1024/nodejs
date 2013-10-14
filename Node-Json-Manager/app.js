var jsonMgr = require('./jsonMgr.js').jsonMgr,
	brConf = new jsonMgr({		// create new database
		path: "./conf.json",
		indent: 4,
		sync : true
	});

// create value
brConf.set("LED_CONFIG.New_Value", "99");

// setting value
brConf.set("WIFI_CONFIG.SSID", "BR_LTE_LESTER");

// get value
console.log('---------------------------------');
console.log('LED Config Key/Value :');
console.log('---------------------------------');
console.log("LED-Blink_period : " + brConf.get('LED_CONFIG.Blink_period'));
console.log("LED-Pick_period  : " + brConf.get('LED_CONFIG.Pick_period'));
console.log("LED-Init_blink   : " + brConf.get('LED_CONFIG.Init_blink'));
console.log('---------------------------------');
console.log('---------------------------------');
console.log('WIFI Config Key/Value :');
console.log('---------------------------------');
console.log("WIFI-Enable                     : " + brConf.get('WIFI_CONFIG.Enable'));
console.log("WIFI-SSID                       : " + brConf.get('WIFI_CONFIG.SSID'));
console.log("WIFI-User_ctrl                  : " + brConf.get('WIFI_CONFIG.User_ctrl'));
console.log("WIFI-Range                      : " + brConf.get('WIFI_CONFIG.Range'));
console.log("WIFI-Mac                        : " + brConf.get('WIFI_CONFIG.Mac'));
console.log("WIFI-Mode                       : " + brConf.get('WIFI_CONFIG.Mode'));
console.log("WIFI-Channel                    : " + brConf.get('WIFI_CONFIG.Channel'));
console.log("WIFI-Nested_obj                 : " + brConf.get('WIFI_CONFIG.Nested_obj.obj1'));
console.log('---------------------------------');

// Handle exception otherwise node will crash when error occured
process.on('uncaughtException', function(err) {
    console.error(err.stack);
});