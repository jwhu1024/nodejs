var fs            = require("fs"),
    util          = require("util"),
    uploadSetting = require("./upload.json");

exports.setting = uploadSetting;

exports.handleFileUpload = function(req, res) {
    var prevPercent = 0,
    procFileEvent = function(name, file) {
        var newPath = __dirname + uploadSetting.uploadDir + file.name,
            input = fs.createReadStream(file.path, {
                flags: "r",
                autoclose: true
            }),
            output = fs.createWriteStream(newPath, {
                flags: "w",
                autoclose: true
            });

        input.on("data", function(chunk) {
            output.write(chunk);
        });

        input.on("error", function(err) {
            util.log("input error event");
        });

        output.on("error", function(err) {
            util.log("output error event");
        });
    },
    procProgress = function(bytesReceived, bytesExpected) {
        /* abort this request if data size exceeds the limit size */
        if (!uploadSetting.limitEnable && bytesExpected > uploadSetting.limit) {
            /* unregister our listener */
            handleEvent(req, regEvent, false);

            /* display limit */
            util.log(util.format("%d larger than %d", bytesExpected, uploadSetting.limit));

            /* end of this request */
            res.end("Exceeds the upper limit");
        } else {
            /* display progress if enabled */
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
        /* save file through stream and return result page */
        var uploadObj = req.files.upload;

        // remove temp file
        fs.unlinkSync(uploadObj.path);

        res.render("result", {
            uploadInfo: uploadObj
        });
    },
    procErrorEvent = function(err) {
        /* just print error message */
        res.end("Unknown Error");
    },
    /* Event & Callback */
    regEvent = {
        progress : procProgress,
        end      : procEndEvent,
        error    : procErrorEvent,
        file     : procFileEvent
    };

    /* register event listener */
    handleEvent(req, regEvent, true);
};

/**
 * [handleEvent description]
 * @param action [true: register, false: unregister]
 */
function handleEvent(req, regEvent, action) {
    for (var localEvent in regEvent) {
        if (action) {
            /* Register event */
            req.form.on(localEvent, regEvent[localEvent]);
        } else {
            /* Unregister event */
            req.form.removeListener(localEvent, regEvent[localEvent]);
        }
    }
}