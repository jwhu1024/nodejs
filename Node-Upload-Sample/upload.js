var fs            = require("fs"),
    util          = require("util"),
    uploadSetting = require("./upload.json");

exports.setting = uploadSetting;

exports.createStream = function (oldPath, oldName) {
    var newPath = __dirname + uploadSetting.uploadDir + oldName,
        input   = fs.createReadStream(oldPath, {flags: "r"}),
        output  = fs.createWriteStream(newPath, {flags: "w"});

    // pipe here
    input.pipe(output);

    // remove temp file
    fs.unlinkSync(oldPath);

    input.on("error", function(err) {
        console.log("Ignored1");
    });

    output.on("error", function(err) {
		console.log("Ignored2");
    });
};

exports.handleFileUpload = function (req, res) {
    var prevPercent = 0,
        size = 0,
        procProgress = function(bytesReceived, bytesExpected) {
            /* abort this request if data size exceeds the limit size */            
            if (uploadSetting.limitEnable && bytesExpected > uploadSetting.limit) {
                /* unregister our listener */
                req.form.removeListener("progress", procProgress);
                req.form.removeListener("end", procEndEvent);

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
            upload.createStream(uploadObj.path, uploadObj.name);
            res.render("result", {
                uploadInfo: uploadObj
            });
        },
        procErrorEvent = function(err) {
            /* just print error message */
            util.log(err);
        };

    /* register event listener */
    req.form.on("progress", procProgress);
    req.form.on("end", procEndEvent);
    req.form.on("error", procErrorEvent);
};
