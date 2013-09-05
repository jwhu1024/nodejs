var express      = require("express"),
	http         = require("http"),
	path         = require("path"),
	fs           = require("fs"),
	util         = require("util"),
	app          = express(),
	uploadFolder = __dirname + "/public/images/";

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.logger("tiny"));
app.use(express.bodyParser({
	defer: true,
	uploadDir: uploadFolder
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env")) {
	app.use(express.errorHandler());
}

app.get("/", function(req, res) {
	res.render("index");
});

app.post("/upload", function(req, res) {
	var prevPercent = 0,
		oldPath,
        newPath,
		procProgressEvent = function(bytesReceived, bytesExpected) {
			// display progress
			var curPercent = Math.round((bytesReceived / bytesExpected) * 100);

			if (prevPercent !== curPercent) {
				console.log(curPercent + "% uploaded");
				prevPercent = curPercent;
			}
		},
		procFileEvent = function(name, file) {
			util.log("Handle file event");
			uploadObj = file;
			oldPath   = uploadObj.path;
			newPath   = uploadFolder + uploadObj.name;
		},
		procEndEvent = function() {
			util.log("Handle end event");
			// do something when form transfer complete
			fs.rename(
				oldPath,
				newPath,
				function(error) {
					if (error) {
						res.send({
							error: "Ah crap! Something bad happened"
						});
						return;
					}
					res.send({
						path: newPath
					});
				}
			);
		},
		procAbortEvent = function() {
			util.log("Handle abort event");

			if (oldPath) {
				_unlinkFile(oldPath);
			}

			// unregister our listener
			_handleEvent(req, regEvent, false);
		},
		procErrorEvent = function(err) {
			// just return error message
			res.end("Unknown Error");
		},
		regEvent = {
			file     : procFileEvent,
			progress : procProgressEvent,
			end      : procEndEvent,
			aborted  : procAbortEvent,
			error    : procErrorEvent
		};

	_handleEvent(req, regEvent, true);
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});

function _handleEvent(req, regEvent, reg) {
	for (var localEvent in regEvent) {
		if (reg) {
			// Register event
			req.form.on(localEvent, regEvent[localEvent]);
		} else {
			// Unregister event
			req.form.removeListener(localEvent, regEvent[localEvent]);
		}
	}
}

function _unlinkFile (_path) {
    fs.exists(_path, function(exists) {
        if (exists) {
            fs.unlink(_path, function (err) {
				util.log("successfully deleted file");
			});
		}
	});
}