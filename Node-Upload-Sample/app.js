var express = require("express"),
    upload  = require("./upload.js"),
    app     = express();

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
    app.use(express.static(__dirname + upload.setting.uploadDir));
    app.use(express.errorHandler());
});

// home
app.get("/", function(req, res) {
    res.render("index");
});

// download
app.get("/attachment/:fileName", function(req, res, next) {
    var downloadFile = __dirname + upload.setting.uploadDir + req.params.fileName;
    require("fs").exists(downloadFile, function (exists) {
        if (exists) {
            res.download(downloadFile);
        } else {
            res.end("File Not Found");
        }
    });    
});

// upload
app.post("/upload_form", function(req, res) {
    upload.handleFileUpload(req, res);
});

app.listen(3000);