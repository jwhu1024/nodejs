var http = require("http");
var url  = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		/* Ignored favicon requested */
		if (request.url === "/favicon.ico") {
			response.writeHead(200, {
				"Content-Type": "image/x-icon"
			});
			response.end();
			return;
		}

		// debug only
		console.log(request.url);

		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;