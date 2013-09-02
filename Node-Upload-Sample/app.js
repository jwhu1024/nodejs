var express       = require("express"),
    fs            = require("fs"),
    upload        = require("./upload.js"),
    app           = express();

// configure Express
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.logger("tiny"));
    app.use(express.cookieParser());
    app.use(express.bodyParser({
        keepExtensions: true,
        defer: true
    }));
    app.use(app.router);
    app.use(express.static(__dirname + upload.setting.uploadDir)); // serve static file
    app.use(express.errorHandler());
});

// download
app.get("/attachment/:fileName", function(req, res, next){
    res.download(__dirname + upload.setting.uploadDir + req.params.fileName);
});

// home
app.get("/", function(req, res) {
    res.render("index");
});

// upload
app.post("/upload_form", function(req, res) {
    upload.handleFileUpload(req, res);
});

app.listen(3000);