var fs            = require("fs"),
    util          = require("util"),
    uploadSetting = require("./upload.json");

exports.setting = uploadSetting;

exports.handleFileUpload = function(req, res, uploadDir) {
    var uploadObj,
        oldPath,
        newPath,
        prevPercent=0,
    procFileEvent = function(name, file) {
        util.log("Handle formidable file event");
        uploadObj = file;
        oldPath   = uploadObj.path;
        newPath   = uploadDir + uploadObj.name;

        if (uploadSetting.limitEnable && (file.size > uploadSetting.limit)) {
            console.log(file.size + "size######################");
            // remove temp file
            _unlinkFile(oldPath);

            // unregister our listener
            _handleEvent(req, regEvent, false);

            // display limit
            util.log(util.format("%d larger than %d", file.size, uploadSetting.limit));

            // end of this request
            res.end("Exceeds the upper limit");
        }
    },
    procProgressEvent = function(bytesReceived, bytesExpected) {
        // display progress
        var curPercent = Math.round((bytesReceived / bytesExpected) * 100);

        if (prevPercent !== curPercent) {
            util.log(curPercent + "% uploaded");
            prevPercent = curPercent;
        }
    },
    procEndEvent = function() {
        util.log("Handle formidable end event");
        // do something when form transfer complete
        fs.rename(oldPath, newPath, function () {
            util.log("upload succeed");
            res.render("result", {
                uploadInfo: uploadObj
            });
        });
    },
    procAbortEvent = function() {
        util.log("Handle formidable abort event");
        _unlinkFile(oldPath);
        // unregister our listener
        _handleEvent(req, regEvent, false);
    },
    procErrorEvent = function(err) {
        // just return error message
        res.end("Unknown Error");
    },
    // Event & Callback
    regEvent = {
        file     : procFileEvent,
        progress : procProgressEvent,
        end      : procEndEvent,
        aborted  : procAbortEvent,
        error    : procErrorEvent
    };

    // register event listener
    _handleEvent(req, regEvent, true);
};

/**
 * [handleEvent description]
 * @param action [true: register, false: unregister]
 */
function _handleEvent(req, regEvent, reg) {
    // skip progress event if disabled
    if (uploadSetting.progress === false) {
        regEvent.progress=null;
    }

    for (var localEvent in regEvent) {
        if (regEvent[localEvent]) {
            if (reg) {
                // Register event
                req.form.on(localEvent, regEvent[localEvent]);    
            } else {
                // Unregister event
                req.form.removeListener(localEvent, regEvent[localEvent]);
            }
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

/*
exports.handleFileUpload = function(req, res) {
    var prevPercent = 0,
        targetFile,
        outputStream,
    procProgress = function(bytesReceived, bytesExpected) {
        // abort this request if data size exceeds the limit size
        if (uploadSetting.limitEnable && bytesExpected > uploadSetting.limit) {
            // unregister our listener
            _handleEvent(req, regEvent, false);

            // display limit
            util.log(util.format("%d larger than %d", bytesExpected, uploadSetting.limit));

            // end of this request
            res.end("Exceeds the upper limit");
        } else {
            // display progress if enabled
            if (uploadSetting.progress) {
                var curPercent = Math.round((bytesReceived / bytesExpected) * 100);

                if (prevPercent !== curPercent) {
                    util.log(curPercent + "% uploaded");
                    prevPercent = curPercent;
                }
            }
        }
    },
    procEndEvent = function() {
        util.log("end event trigger");
        // do something when form transfer complete
    },
    procErrorEvent = function(err) {
        // just print error message
        res.end("Unknown Error");
    },
    procAbortEvent = function () {
        if (targetFile) {
            outputStream.end();
            _unlinkFile(targetFile);
        }
    },
    // Event & Callback
    regEvent = {
        progress: procProgress,
        end     : procEndEvent,
        error   : procErrorEvent,
        aborted : procAbortEvent
    };
    
    // register event listener
    _handleEvent(req, regEvent, true);

    // overwrite this method for directly accessing the multipart stream
    req.form.onPart = function(part){
        if (!part.filename) {
            // let formidable handle all non-file parts
            req.form.handlePart(part);
            _handleEvent(req, regEvent, false);
            res.end("File is not selected!");
            return;
        } else {
            targetFile = uploadDir + part.filename;

            // remove previous temp file
            _unlinkFile(targetFile);
            
            // create writable stream
            outputStream = fs.createWriteStream(targetFile, {
                flags: "w+",
                autoclose: true,
                bufferSize: 209715200
            });

            // listen on data event
            part.on("data", function(raw) {
                outputStream.write(raw);
            });

            // listen on end event
            part.on("end", function() {
                res.render("result", {
                    uploadInfo: part
                });
                outputStream.end();
            });

            // listen on error event
            part.on("error", function(err) {
                util.log("###################");
            });
        }
    };

    // overwrite this method for directly accessing the multipart stream
    req.form.onPart = function(part){
        if (!part.filename) {
            // let formidable handle all non-file parts
            req.form.handlePart(part);
            _handleEvent(req, regEvent, false);
            res.end("File is not selected!");
            return;
        } else {
            targetFile = uploadDir + part.filename;

            // remove previous temp file
            _unlinkFile(targetFile);
            
            // create writable stream
            outputStream = fs.createWriteStream(targetFile, {
                flags: "w+",
                autoclose: true
            });

            inputStream = fs.createReadStream(file.path, {
                flags: "r+",
                autoclose: true
            });

            // listen on data event
            part.on("data", function(raw) {
                if (outputStream.write(raw) === false) {
                    part.pause();
                }
            });

            // listen on end event
            part.on("end", function() {
                res.render("result", {
                    uploadInfo: part
                });
                outputStream.end();
            });

            // listen on error event
            part.on("error", function(err) {
                util.log("###################");
            });

            // listen on drain event
            outputStream.on("drain", function() {
                part.resume();
            });
        }
    };
    
};

exports.handleFileUpload = function(req, res) {
    var prevPercent = 0,
    procFileEvent = function(name, file) {
        console.log(file);
        if (file.name) {
            var newPath = __dirname + uploadSetting.uploadDir + file.name,
            input = fs.createReadStream(file.path, {
                flags: "r+",
                autoclose: true,
                bufferSize: 2097152
            }),
            output = fs.createWriteStream(newPath, {
                flags: "w+",
                autoclose: true
            });

            input.pipe(output);

            output.on("close", function () {
                console.log("Close#########################");
                // remove temp file
                fs.unlink(req.files.upload.path, null);
                
                // return result page
                res.render("result", {
                    uploadInfo: file
                });

                output.end();
            });

            input.on("data", function(chunk) {
                if (output.write(chunk) === false) {
                    input.pause();
                }
            });

            input.on("close", function() {
                // remove temp file
                fs.unlink(req.files.upload.path, null);
                
                // return result page
                res.render("result", {
                    uploadInfo: file
                });
            });
            
            input.on("error", function(err) {
                util.log("input error event");
            });

            output.on("drain", function() {
                input.resume();
            });

            output.on("error", function(err) {
                util.log("output error event");
            });

        } else {
            handleEvent(req, regEvent, false);
            res.end("File is not selected!");
        }
    },
    procProgress = function(bytesReceived, bytesExpected) {
        // abort this request if data size exceeds the limit size
        if (uploadSetting.limitEnable && bytesExpected > uploadSetting.limit) {
            // unregister our listener
            handleEvent(req, regEvent, false);

            // display limit
            util.log(util.format("%d larger than %d", bytesExpected, uploadSetting.limit));

            // end of this request
            res.end("Exceeds the upper limit");
        } else {
            // display progress if enabled
            if (uploadSetting.progress) {
                var curPercent = Math.round((bytesReceived / bytesExpected) * 100);

                if (prevPercent !== curPercent) {
                    util.log(curPercent + "% uploaded");
                    prevPercent = curPercent;
                }
            }
        }
    },
    procEndEvent = function() {
        // do something when form transfer complete
    },
    procErrorEvent = function(err) {
        // just print error message
        res.end("Unknown Error");
    },    
    // Event & Callback
    regEvent = {
        progress : procProgress,
        end      : procEndEvent,
        error    : procErrorEvent,
        file     : procFileEvent
    };
    
    // register event listener
    handleEvent(req, regEvent, true);
};
*/

