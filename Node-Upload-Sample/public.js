var fs = require("fs");

exports.createStream = function (oldPath, oldName) {
    var newPath = __dirname + "\\upload_dir\\" + oldName,
        input   = fs.createReadStream(oldPath, {flags: "r"}),
        output  = fs.createWriteStream(newPath, {flags: "w"});
    
    // pipe here
    input.pipe(output);

    // remove temp file
    fs.unlinkSync(oldPath);
};