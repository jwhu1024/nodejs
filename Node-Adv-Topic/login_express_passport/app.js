var flash           = require("connect-flash"),
	express         = require("express"),
	passport        = require("passport"),
	util            = require("util"),
	LocalStrategy   = require("passport-local").Strategy,
	fs				= require("fs"),
	auth			= require("./auth.js"),
	ensureAuth		= auth.ensureAuthenticated;

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	auth.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		process.nextTick(function() {
			auth.findByUsername(username, function(err, user) {
				if (err) {
					return done(err);
				}
				
				if (!user) {
					return done(null, false, {
						message: "Unknown user " + username
					});
				}

				if (user.password != password) {
					return done(null, false, {
						message: "Invalid password"
					});
				}
				return done(null, user);
			});
		});
	}
));

var app = express();

// configure Express
app.configure(function() {
	app.set("views", __dirname + "/views");
	app.set("view engine", "ejs");
	app.use(express.logger("tiny"));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({
		secret: "IdczacmUfNmqb7RQN8WFzO7iYC7ujXSyIPyumBscDCgRdtc0b4",
		cookie: {
			maxAge: null	// 5 minutes
		},
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + "/static")); // serve static file
});

// route
app.get("/", ensureAuth, function(req, res) {
	res.render("index", {
		user: req.user
	});
});

app.get("/login", function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/account");
	} else {
		res.render("login");
	}
});

app.get("/account", ensureAuth, function(req, res) {
	res.render("profile", {
		user: req.user
	});
});

app.post("/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true
	}),
	function(req, res) {
		res.end("/");
	});

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

app.listen(3000);
