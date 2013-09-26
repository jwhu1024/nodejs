var fs            = require("fs"),
    util          = require("util"),
    uploadSetting = require("./conf/upload.json");

exports.setting = uploadSetting;

exports.handleFileUpload = function(req, res, uploadDir) {
    var oldPath,
        newPath,
        prevPercent=0,
    procFileBegin = function(name, file) {
        util.log("Handle formidable fileBegin event");
        oldPath = file.path;
        newPath = uploadDir + "/" + file.name;
    },
    procProgressEvent = function(bytesReceived, bytesExpected) {
        if (uploadSetting.limitEnable && (bytesReceived > uploadSetting.limit)) {
            // remove temp file
            _unlinkFile(oldPath);

            // unregister our listener
            _handleEvent(req, regEvent, false);

            // display limit
            util.log(util.format("%d larger than %d", bytesReceived, uploadSetting.limit));

            // end of this request
            res.writeHeader(500, "Internel Error");
            res.end();
        } else {
            // display progress
            var curPercent = Math.round((bytesReceived / bytesExpected) * 100);

            if (prevPercent !== curPercent) {
                util.log(curPercent + "% uploaded");
                prevPercent = curPercent;
            }    
        }
    },
    procFileEvent = function(name, file) {
        // util.log("Handle formidable file event");
        // oldPath   = uploadObj.path;
        // newPath   = uploadDir + "/" + uploadObj.name;

        // if (uploadSetting.limitEnable && (file.size > uploadSetting.limit)) {
        //     // remove temp file
        //     _unlinkFile(oldPath);

        //     // unregister our listener
        //     _handleEvent(req, regEvent, false);

        //     // display limit
        //     util.log(util.format("%d larger than %d", file.size, uploadSetting.limit));

        //     // end of this request
        //     res.end("Exceeds the upper limit");
        // }
    },
    procEndEvent = function() {
        util.log("Handle formidable end event");
        // do something when form transfer complete
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.log(err);
            }
            util.log("upload succeed");
            res.end("");
        });
    },
    procAbortEvent = function() {
        util.log("Handle formidable abort event");

        if (oldPath) {
            _unlinkFile(oldPath);
        }
                
        // unregister our listener
        _handleEvent(req, regEvent, false);
    },
    procErrorEvent = function(err) {
        // just return error message
        res.end("Unknown Error");
    },
    
    // Event & Callback
    regEvent = {
        fileBegin: procFileBegin,
        progress : procProgressEvent,
        //file     : procFileEvent,
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
    fs.exists(_path, function (exists) {
        if (exists) {
            setTimeout(function () {
                fs.unlink(_path, function (err) {
                    util.log("successfully deleted file");
                    oldPath = "";
                });
            }, 0);
        }        
    });
}