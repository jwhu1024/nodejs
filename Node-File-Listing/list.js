var readdirp = require("readdirp"),
    util = require("util"),
    path = require("path");

exports.handleFileList = function(req, res, listFolder) {
    var list = [];

    readdirp({
        root             : "./" + listFolder,
        //depth          : 10,
        fileFilter       : "*",
        //directoryFilter: ""
    }, parseData);

    function parseData(errors, res) {
        // error handler
        if (errors) {
            errors.forEach(function(err) {
                console.error("Error: ", err);
            });
        } else {
            var idx  = 0,
            dir  = res.directories,
            file = res.files,
            len  = dir.length + file.length;

            // insert dir name if exist
            if (dir.length) {
                for (idx = 0; idx < dir.length; idx++) {
                    list[idx] = dir[idx].name;
                }
            } 

            // insert file name if exist
            if (file.length) {
                for (var dirIdx=0; dirIdx < file.length; dirIdx++) {
                    list[idx++] = file[dirIdx].name;
                }
            }
            util.log("all files\n", list);
            renderList();
        }
    }

    function renderList() {
        res.render("list", {
            title: "Listing Files",
            supplies: list
        });
    }
};