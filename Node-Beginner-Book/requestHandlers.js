var fs = require("fs");
var querystring = require("querystring");
var formidable = require("formidable");
var gpio = require("rpi-gpio");
var url = require("url");

function homepage(response, request) {
    console.log("Request handler 'homepage' was called.");
    fs.readFile(__dirname + "/index.html", "utf8", function(err, text) {
        if (err) {
            throw err;
        }
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(text);  
        response.end();
    });
}

function start(response, request) {
	console.log("Request handler 'start' was called.");
    var body =
        "<html>" +
        "<head>"+
        "<meta http-equiv=\"Content-Type\" content=\"text/html; "+
        "charset=UTF-8\" />"+
        "</head>"+
        "<body>"+
        "<form action=\"/upload\" enctype=\"multipart/form-data\" "+
        "method=\"post\">"+
        "<input type=\"file\" name=\"upload\">"+
        "<input type=\"submit\" value=\"Upload file\" />"+
        "</form>"+
        "</body>"+
        "</html>";

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "./fromuser.png");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, postData) {
    console.log("Request handler 'show' was called.");
    fs.readFile("./fromuser.png", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

function GpioControl(response, request) {
    console.log("Request handler 'GpioControl' was called.");
    var value = querystring.parse(url.parse(request.url).query);
    //console.log(value.pin);
    //console.log(value.act);
    
    gpio.setup(value.pin, gpio.DIR_OUT, function(){
        gpio.write(value.pin, value.act, function(err) {
            if (err) {
                console.log("function writeOn()");
                throw err;
            }
            console.log("Written to pin");
        });
    });

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
}

exports.homepage = homepage;
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.GpioControl = GpioControl;