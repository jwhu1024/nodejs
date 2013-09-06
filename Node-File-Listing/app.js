var express         = require("express"),
    util            = require("util"),
    upload          = require("./upload.js"),
    list            = require("./list.js"),
    uploadFolder    = __dirname + upload.setting.uploadDir,
    app             = express();

// configure Express
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.logger("tiny"));
    app.use(express.cookieParser());
    //app.use(express.limit("4mb"));
    app.use(express.bodyParser({
        keepExtensions: true,
        defer: true,
        uploadDir: uploadFolder
    }));
    app.use(app.router);
    app.use(express.static(__dirname + upload.setting.uploadDir));
    app.use(express.static(__dirname + "/static"));
    app.use(express.errorHandler());    
});

// extend this function for ejs view engine
app.locals.linkTo = function(name) {
    return util.format("<a href=\"/upload_dir/%s\" class=\"btn btn-primary btn-mini\">%s</a>", name, name);
};

// home - file listing
app.get("/", function(req, res) {
    list.handleFileList(req, res, upload.setting.uploadDir);
});

app.get("/upload_page", function(req, res) {
    res.render("upload");
});

// download
app.get("/upload_dir/:fileName", function(req, res, next) {
    var downloadFile = uploadFolder + req.params.fileName;
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
    upload.handleFileUpload(req, res, uploadFolder);
});

app.listen(3000);

// var http       = require("http"),
//     util       = require("util"),
//     multiparty = require("multiparty"),
//     fs         = require("fs"),
//     PORT       = process.env.PORT || 3000;

// var server = http.createServer(function(req, res) {
//     if (req.url === "/") {
//         res.writeHead(200, {
//             "content-type": "text/html"
//         });
//         res.end(
//             '<form action="/upload" enctype="multipart/form-data" method="post">' +
//             '<input type="text" name="title"><br>' +
//             '<input type="file" name="upload" multiple="multiple"><br>' +
//             '<input type="submit" value="Upload">' +
//             '</form>'
//         );
//     } else if (req.url === "/upload") {
//         var form = new multiparty.Form({uploadDir: __dirname + "/upload_dir/"});

//         form.parse(req, function(err, fields, files) {
//             if (err) {
//                 res.writeHead(400, {
//                     "content-type": "text/plain"
//                 });
//                 res.end("invalid request: " + err.message);
//                 return;
//             }
//             res.writeHead(200, {
//                 "content-type": "text/plain"
//             });

//             // test area
//             var oldPath = files.upload.path,
//                 newPath = __dirname + "/upload_dir/" + files.upload.originalFilename;
//             fs.rename(
//                 oldPath,
//                 newPath,
//                 function () {
//                     console.log("upload succeed");
//                 }
//             );
//             // test area

//             res.write("received fields:\n\n " + util.inspect(fields));
//             res.write("\n\n");
//             res.end("received files:\n\n " + util.inspect(files));
//         });

//         form.on("progress", function(bytesReceived, bytesExpected) {
//             util.log(Math.round((bytesReceived / bytesExpected) * 100));
//         });
//     } else {
//         res.writeHead(404, {
//             "content-type": "text/plain"
//         });
//         res.end("404");
//     }


// });
// server.listen(PORT, function() {
//     console.info("listening on http://0.0.0.0:" + PORT + "/");
// });