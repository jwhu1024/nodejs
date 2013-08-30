var express = require("express"),
    util    = require("util"),
    fs      = require("fs"),
    pub     = require("./public.js"),
    app     = express();

// configure Express
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.logger("tiny"));
    app.use(express.cookieParser());
    app.use(express.bodyParser({}));
    app.use(app.router);
    app.use(express.static(__dirname + "//upload_dir")); // serve static file
});

// route
app.get("/", function(req, res) {
    res.render("index");
});

app.post('/upload_form', function(req, res) {
    var uploadObj = req.files.upload;
    pub.createStream(uploadObj.path, uploadObj.name);

    res.render("result", {
        uploadInfo: req.files.upload
    });
});

app.listen(3000);