var http	= require("http"),
	url		= require("url"),
	exec	= require("child_process").exec,
	fs		= require("fs"),
	util	= require("util");

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

		if (request.url.match("bootstrap-combined.min.css")	||
			request.url.match("bootstrap.min.js")			||
			request.url.match("jquery.min.js")				||
			request.url.match("lester.css")) {
			fs.readFile(__dirname + request.url, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
					throw error;
				} else {
					response.writeHead(200, {
						"Content-Type": "text/css"
					});
					response.end(content, "utf-8");
				}
			});
			return;
		}
		
		var pathname = url.parse(request.url).pathname;
		util.log("===================================");
		util.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8888);
	util.log("Server has started.");
}

exports.start = start;