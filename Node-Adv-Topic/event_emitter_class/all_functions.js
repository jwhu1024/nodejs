/**
 * [eventEmitter description]
 * emitter.on(event, listener)
 * emitter.once(event, listener)
 * emitter.removeListener(event, listener)
 * emitter.removeAllListeners(event)
 * emitter.setMaxListeners(n)
 * emitter.listeners(event)
 * emitter.emit(event, [arg1], [arg2], [...])
 */
var eventEmitter = require("events").EventEmitter,
	emitter      = new eventEmitter(),
	util         = require("util"),
	cnt          = 0;

//emitter.setMaxListeners(4);

function listener(data) {
	util.log("I'm listener -> " + cnt++);
}

function listener1(data) {
	util.log("I'm listener1 -> " + data);
}

function listener2(data) {
	util.log("I'm listener2 -> " + data);
}

function listener3(data) {
	util.log("I'm listener3 -> " + data);
}

function listener4(data) {
	util.log("I'm listener4 -> " + data);
}

emitter.on("some", listener);
//emitter.once("some", listener);

/*
emitter.on("some", listener1);
emitter.on("some", listener2);
emitter.on("some", listener3);
emitter.on("some", listener4);
 */

setInterval(function () {
	emitter.emit("some", Date.now());
}, 200);

setTimeout(function() {
	util.log("removing");
	//emitter.removeAllListeners("some");
	emitter.removeListener("some", listener);
}, 2000);

util.log(util.inspect(emitter.listeners("some")));