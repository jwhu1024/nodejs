var server = require("./server.js");
var router = require("./router.js");
var requestHandlers = require("./requestHandlers.js");

var handle = {};

handle["/"] = requestHandlers.homepage;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/gpio"] = requestHandlers.GpioControl;
handle["/shell"] = requestHandlers.ShellCmd;

server.start(router.route, handle);