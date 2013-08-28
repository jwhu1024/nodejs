var http = require("http"),
    fs   = require("fs");

/**
 * http://localhost:3000/app.js
 *                      -------
 */
http.createServer(function(req, res) {
    var filename   = __dirname + req.url,
        readStream = fs.ReadStream(filename);

    readStream.pipe(res);
    
    readStream.on("error", function(err) {
        res.end(err.toString());
    });
}).listen(3000);

/*
    readStream.on("open", function() {
        readStream.pipe(res);
    });
    
    readStream.on("error", function(err) {
        res.end(err.toString());
    });
*/