/* Event Trigger */ 
var EventEmitter = require("events").EventEmitter,
    event        = new EventEmitter();

event.on("trigger", function(data) {
    console.log(data);
});

setInterval(function() {
    event.emit("trigger", "this is data");
}, 300);