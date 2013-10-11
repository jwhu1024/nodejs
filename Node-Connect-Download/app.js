var connect			= require("connect"),
	app				= connect.createServer(),
	redirect		= require("connect-redirection"),
	mime			= require("mime"),
	fs				= require("fs"),
	util			= require("util");

app
	.use(connect.logger("tiny"))				// for logger
	.use(connect.favicon("public/favicon.ico"))	// favicon setting
	.use(connect.query())						// gives us req.query
	.use(connect.bodyParser())					// gives us req.body
	.use(connect.cookieParser())				// parse cookie
	.use(redirect())							// middleware for redirect
	.use(connect.static(__dirname + "/static")) // serve static file
	.use(connect.router(function(router) {
		router.get("/upload_dir/*", function (req, res) {
			w
		});
	}))
.listen(3000);

function notFoundResponse (_res) {
	_res.statusCode = 404;
	_res.end("File Not Found");
}

function internelErrorResponse (_res) {
	_res.statusCode = 500;
	_res.end("Internel Server Error");
}