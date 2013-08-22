var http = require('http');
var setting = require('./setting.js');
var mime = require('./mime');
var url = require('url');
var util = require('util');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var number = 0;
var accesses = {};

http.createServer(function(req, res) {
    res.number = ++number;
    accesses[res.number] = {
        startTime: new Date().getTime()
    };
    var pathname = url.parse(req.url).pathname;

    pathname = pathname.replace(/\.\./g, '');
    var realPath = setting.webroot + pathname;
    accesses[res.number].path = pathname;
    readPath(req, res, realPath, pathname);
}).listen(8000);

console.log('http server start at parth 8000\n\n\n');

function readPath(req, res, realPath, pathname) {
    /* Resource exist? */
    console.log(realPath);
    path.exists(realPath, function(ex) {
        console.log('path.exists--%s', ex);
        if (!ex) {
            responseWrite(res, 404, {
                    'Content-Type': 'text/plain'
                },
                'This request URL ' + pathname + ' was not found on this server.');
        } else {
            /* Document type */
            fs.stat(realPath, function(err, stat) {
                if (err) {
                    responseWrite(res, 500, err);
                } else {
                    if (stat.isDirectory()) {
                        /* Read dir */
                        if (setting.viewdir) {
                            fs.readdir(realPath, function(err, files) {
                                if (err) {
                                    responseWrite(res, 500, err);
                                } else {
                                    var htm = '<html><head><title>' + pathname + '</title></head><body>' + pathname + '<hr>';
                                    for (var i = 0; i < files.length; i++) {
                                        htm += '<br><a href="' + pathname + (pathname.slice(-1) != '/' ? '/' : '') + files[i] + '">' + files[i] + '</a>', 'utf8';
                                    }
                                    responseWrite(res, 200, {
                                        'Content-Type': 'text/html'
                                    }, htm);
                                }
                            });
                        } else if (setting.index && realPath.indexOf(setting.index) < 0) {
                            readPath(req, res, path.join(realPath, '/', setting.index), path.join(pathname, '/', setting.index));
                        } else {
                            responseWrite(res, 404, {
                                    'Content-Type': 'text/plain'
                                },
                                'This request URL ' + pathname + ' was not found on this server.');
                        }
                    } else {
                        var type = path.extname(realPath);
                        type = type ? type.slice(1) : 'nuknown';
                        var header = {
                            'Content-Type': mime[type] || 'text/plain'
                        };
                        /* Cache support */
                        if (setting.expires && setting.expires.filematch && type.match(setting.expires.filematch)) {
                            var expires = new Date(),
                                maxAge = setting.expires.maxAge || 3600 * 30;
                            expires.setTime(expires.getTime() + maxAge * 1000);
                            header['Expires'] = expires.toUTCString();
                            header['Cache-Control'] = 'max-age=' + maxAge;
                            var lastModified = stat.mtime.toUTCString();
                            header['Last-Modified'] = lastModified;
                            /* 304? */
                            if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
                                responseWrite(res, 304, 'Not Modified');
                            } else {
                                readFile(req, res, realPath, header, type);
                            }
                        } else {
                            readFile(req, res, realPath, header, type);
                        }
                    }
                }
            });
        }
    });
}

function readFile(req, res, realPath, header, type) {
    var raw = fs.createReadStream(realPath),
        cFun;
    /* Compress with gzip? */
    if (setting.compress && setting.compress.match && type.match(setting.compress.match) && req.headers['accept-encoding']) {
        if (req.headers['accept-encoding'].match(/\bgzip\b/)) {
            header['Content-Encoding'] = 'gzip';
            cFun = 'createGzip';
        } else if (req.headers['accept-encoding'].match(/\bdeflate\b/)) {
            header['Content-Encoding'] = 'deflate';
            cFun = 'createDeflate';
        }
    }
    res.writeHead(200, header);
    if (cFun) {
        raw.pipe(zlib[cFun]()).pipe(res);
    } else {
        raw.pipe(res);
    }
}

function responseWrite(res, starus, header, output, encoding) {
    encoding = encoding || 'utf8';
    res.writeHead(starus, header);
    if (output) {
        res.write(output, encoding);
    }
    res.end();
    accesses[res.number].endTime = new Date().getTime();
    /* Output log */
    console.log('access[%s]--%s--%s--%s--%s\n\n', res.number, accesses[res.number].path, (accesses[res.number].endTime - accesses[res.number].startTime),
        starus, (output ? output.length : 0));
    delete accesses[res.number];
}