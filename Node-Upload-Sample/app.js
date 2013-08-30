var express   = require("express"),
    util      = require("util"),
    fs        = require("fs"),
    pub       = require("./public.js"),
    uploadDir = __dirname + "//upload_dir",
    app       = express();

// configure Express
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.logger("tiny"));
    app.use(express.cookieParser());
    app.use(express.limit(10240000));
    app.use(express.bodyParser({
        keepExtensions: true,
        limit: "10mb",
        //limit = 2 * 1024 * 1024,
        defer: true
    }));
    app.use(app.router);
    //app.use(express.directory(uploadDir));
    app.use(express.static(uploadDir)); // serve static file
    app.use(express.errorHandler());
});

// download
app.get("/attachment/:fileName", function(req, res, next){
    res.download(uploadDir + "//" + req.params.fileName);
});

// home
app.get("/", function(req, res) {
    res.render("index");
});

// upload
app.post("/upload_form", function(req, res) {
    req.form.on("progress", function(bytesReceived, bytesExpected) {
        console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
    });
    
    req.form.on("end", function() {
        console.log(req.files);
        var uploadObj = req.files.upload;
        pub.createStream(uploadObj.path, uploadObj.name);
        
        res.render("result", {
            uploadInfo: uploadObj
        });
    });
});

app.listen(3000);

/*
    form.on("complete", function (err) {
        console.log("##############################################################");
    });
    req.form.on("error", function(error) {
        console.log("dkfjlsdkjflsdjflsd");
    });
*/