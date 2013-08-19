var server          = require("./server.js"),
	router          = require("./router.js"),
	requestHandlers = require("./requestHandlers.js");

var handle = {
    "/"          : requestHandlers.Homepage,
	"/start"     : requestHandlers.start,
	"/upload"    : requestHandlers.upload,
	"/show"      : requestHandlers.show,
	"/gpio"      : requestHandlers.GpioControl,
	"/shell"     : requestHandlers.ShellCommand,
	"/async"     : requestHandlers.AsyncCase,
	"/gmailcheck": requestHandlers.GmailCheck
};

server.start(router.route, handle);

/*
handle["/"] = requestHandlers.Homepage;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/gpio"] = requestHandlers.GpioControl;
handle["/shell"] = requestHandlers.ShellCommand;
handle["/async"] = requestHandlers.AsyncCase;
handle["/gmailcheck"] = requestHandlers.GmailCheck;
*/