var connect			= require("connect"),
	app				= connect.createServer(),
	redirect		= require("connect-redirection"),
	account			= require("./conf/account.json"),
	util			= require("util"),
	sessionManager	= require("./sessionManager.js"),
	mime 			= require('mime');

var keepSession = true;

app
	.use(connect.logger("tiny"))				// for logger
	.use(connect.favicon("public/favicon.ico"))	// favicon setting
	.use(connect.query())						// gives us req.query
	.use(connect.bodyParser())					// gives us req.body
	.use(connect.cookieParser())				// parse cookie
	.use(redirect())							// middleware for redirect
    .use(connect.session({
		secret: "0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK",
		cookie: {
			maxAge: (keepSession) ? null : 30 * 1000	// 30secs
		},
		key: "sid"
	}))
	.use(connect.static(__dirname + "/public")) // serve static file
	.use(connect.static(__dirname + "/static")) // serve static file
	.use(connect.router(function(router) {
		router.all("*", function(req, res, next) {
			//sessionManager.checkSession(req, res, next);
			next();
		});

		router.get("/upload_dir/*", function (req, res) {
			console.log("########################################");
			var downloadFile = "./upload_dir/" + req.params[0];
			console.log(downloadFile);
			require("fs").readFile(downloadFile, function (err, data) {
				if (err) {
					console.log(err);
				}
			  	console.log(data);
			  	res.write(data);
			  	res.end();
			});
			// require("fs").exists(downloadFile, function(exists) {

			// }
			//res.download(downloadFile);
			// var downloadFile = uploadFolder + "/" + req.params[0];
			// require("fs").exists(downloadFile, function(exists) {
			// 	if (exists) {
			// 		res.download(downloadFile);
			// 	} else {
			// 		res.end("File Not Found");
			// 	}
			// });
		});
		
		router.get("/", function (req, res) {
			// for debug
			sessionManager.dumpSession();
			
			// for demo
			if (req.session.views) {
				++req.session.views;
			} else {
				req.session.views = 1;
			}

			// check this session have been login
			if (req.session.user === undefined) {
				res.redirect("http://" + req.headers.host + "/login.html");
			} else {
				res.write("<h1> Welcome </h1>");
				res.write("<p><a href=\"/\">Refresh</a></p>");
				res.write("<p><a href=\"/logout\">LogOut</a></p>");
				res.write("<p>viewed <strong>" + req.session.views + "</strong> times.</p>");
				res.write("<p>session-stored user: <strong>" + req.session.user + "</strong></p>");
				res.end("<p>session-stored id: <strong>" + req.session.id + "</strong></p>");
			}
		});

		router.post("/login", function(req, res) {
			// authentication here
			if (req.body.name === account.name && req.body.pwd === account.pwd) {
				sessionManager.registerSession(req);
				res.end("/welcome.html");
			} else {
				req.session.destroy(null);
				res.end("/login.html");
			}
		});

		router.get("/logout", function(req, res) {
			sessionManager.destroySession(req);
			res.redirect("http://" + req.headers.host + "/login.html");
		});
	}))
.listen(3000);


