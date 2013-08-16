var server          = require("./server.js"),
	router          = require("./router.js"),
	requestHandlers = require("./requestHandlers.js"),
	util            = require("util");

var handle = {};

handle["/"]           = requestHandlers.Homepage;
handle["/start"]      = requestHandlers.start;
handle["/upload"]     = requestHandlers.upload;
handle["/show"]       = requestHandlers.show;
handle["/gpio"]       = requestHandlers.GpioControl;
handle["/shell"]      = requestHandlers.ShellCommand;
handle["/async"]      = requestHandlers.AsyncCase;
handle["/gmailcheck"] = requestHandlers.GmailCheck;

server.start(router.route, handle);