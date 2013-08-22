var connect  = require("connect"),
	app      = connect.createServer(),
	redirect = require("connect-redirection"),
	account  = require("./conf/account.json");

var keepSession = true;

app
	.use(connect.logger("tiny"))	// for logger
	.use(connect.query())			// gives us req.query
	.use(connect.bodyParser())		// gives us req.body
	.use(connect.cookieParser())	// parse cookie
	.use(redirect())				// middleware for redirect
	.use(connect.session({
		secret: "0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK",
		cookie: {
			maxAge: (keepSession) ? null : 30 * 1000	// 30secs
		},
		key: "sid"
	}))
	.use(connect.router(function(router) {
		router.get("/", function(req, res) {
			// check this session have been login
			if (req.session.user === undefined) {
				res.redirect("http://" + req.headers.host + "/login.html");
			} else {
				res.write("<h1> Welcome </h1>");
				res.end("session-stored user: " + req.session.user + "\n");
			}
		});

		router.post("/login", function(req, res) {
			// authentication here
			if (req.body.name === account.name && req.body.pwd === account.pwd) {
				req.session.user = req.body.name;
				res.end("/welcome.html");
			} else {
				req.session.destroy(null);
				res.end("/login.html");
			}
		});

		router.get("/logout", function(req, res) {
			req.session.destroy(null);
			res.redirect("http://" + req.headers.host + "/login.html");
		});
	}))
	.use(connect.static(__dirname + "/public")) // serve static file
	.use(connect.static(__dirname + "/static")) // serve static file
	
.listen(3000);
