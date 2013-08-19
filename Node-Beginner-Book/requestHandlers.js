var fs          = require("fs"),
    querystring = require("querystring"),
    formidable  = require("formidable"),
    gpio        = require("rpi-gpio"),
    url         = require("url"),
    exec        = require("child_process").exec,
    util        = require("util");

function Homepage(response, request) {
    util.log("Request handler 'Homepage' was called.");
    fs.readFile(__dirname + "/index.html", "utf8", function(err, text) {
        if (err) {
            throw err;
        }
        response.writeHeader(200, {
            "Content-Type": "text/html"
            //"Cache-Control": "no-cache",
            //"Expires": "-1"
        });
        response.write(text);
        response.end();
    });
}

function start(response, request) {
    util.log("Request handler 'start' was called.");
    var body =
        "<html>" +
        "<head>" +
        "<meta http-equiv=\"Content-Type\" content=\"text/html; " +
        "charset=UTF-8\" />" +
        "</head>" +
        "<body>" +
        "<form action=\"/upload\" enctype=\"multipart/form-data\" " +
        "method=\"post\">" +
        "<input type=\"file\" name=\"upload\">" +
        "<input type=\"submit\" value=\"Upload file\" />" +
        "</form>" +
        "</body>" +
        "</html>";

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    util.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();

    form.parse(request, function(error, fields, files) {
        fs.renameSync(files.upload.path, "./fromuser.png");
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request) {
    util.log("Request handler 'show' was called.");
    fs.readFile("./fromuser.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

function GpioControl(response, request) {
    util.log("Request handler 'GpioControl' was called.");
    var value = querystring.parse(url.parse(request.url).query);

    gpio.setup(value.pin, gpio.DIR_OUT, function() {
        gpio.write(value.pin, value.act, function(err) {
            if (err) {
                util.log("function GpioControl() failed");
                throw err;
            }
            util.log("Written to pin");
        });
    });

    response.writeHead(200, {
        "Content-Type": "text/plain",
        //"Expires": "-1"
        //"Cache-Control": "no-cache"
    });
    response.end();
}

function ShellCommand(response, request) {
    console.log("Request handler 'ShellCommand' was called.");
    var cmd = querystring.parse(url.parse(request.url).query).cmd;

    exec(cmd, function(error, stdout, stderr) {
        //exec("ps -aux", function(error, stdout, stderr) {
        var rsplen = (stdout) ? stdout.length : stderr.length,
            result = (stdout) ? stdout : stderr;

        response.writeHead(200, {
            "Content-Type": "text/plain",
            "Content-Length": rsplen
        });
        response.write(result);
        response.end();
    });
}

function AsyncCase(response, request) {
    util.log("Request handler 'AsyncCase' was called.");
    exec("find /", {
            encoding: "utf8",
            timeout: 10000000,
            maxBuffer: 2000000 * 1024 * 1024,
            cwd: null,
            env: null
        },
        function(error, stdout, stderr) {
            util.log("\n##############Callback################\n");
            response.writeHead(200, {
                "Content-Type": "text/plain",
                "Content-Length": stdout.length
            });
            response.write(stdout);
            response.end();
        });
}

function GmailCheck(response, request) {
    util.log("Request handler 'GmailCheck' was called.");

    exec("python demo_mail_notify.py", {
            encoding: "utf8",
            timeout: 10000,
            maxBuffer: 1024 * 1024,
            cwd: null,
            env: null
        },
        function(error, stdout, stderr) {
            var rsplen = (stdout) ? stdout.length : stderr.length,
                result = (stdout) ? stdout : stderr;

            response.writeHead(200, {
                "Content-Type": "text/plain",
                "Content-Length": rsplen,
                //"Cache-Control": "no-cache"
            });
            response.write(result);
            response.end();
        });
}

function Echo(response, request) {
    util.log("Request handler 'Echo' was called.");
}

exports.Homepage     = Homepage;
exports.start        = start;
exports.upload       = upload;
exports.show         = show;
exports.GpioControl  = GpioControl;
exports.ShellCommand = ShellCommand;
exports.AsyncCase    = AsyncCase;
exports.GmailCheck   = GmailCheck;
exports.Echo         = Echo;