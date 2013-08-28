/* Event Trigger */
var EventEmitter = require("events").EventEmitter,
	event        = new EventEmitter(),
	mycount      = 0;

var timerId = setInterval(function() {
	if (mycount++ < 10) {
		var data = "this is data - " + mycount.toString();
		event.emit("trigger", data);
	} else {
		clearInterval(timerId);
		event.emit("error");		
	}
}, 300);

event.on("trigger", function(data) {
	console.log(data);
});

/*
event.on("error", function() {
	console.log("Error capture");
});
 */