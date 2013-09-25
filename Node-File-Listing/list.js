var util      = require("util"),
    path      = require("path"),
    fs        = require("fs"),
    settings  = require("./conf/setting.json");

exports.handleFileList = function(req, res, listFolder) {
    var curDir  = "./" + listFolder,
        _filter = {
            depth   : settings.depth,
            depthAt : settings.depthAt,
            hidden  : settings.hidden,
            root    : curDir
        };

    res.setHeader("Content-Type", "application/json");

    readDirectory(curDir, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            setTimeout(function() {
                res.end(JSON.stringify(data));
            }, 100);
        }
    }, _filter);
};

/**
 * [calcDepth description]
 * @param  {[string]} rootDir [root directory path]
 * @param  {[string]} curDir  [prepare to compare with rootdir]
 * @return {[number]}         [current depth]
 */
var calcDepth = function (rootDir, curDir) {
    var isWin = !!process.platform.match(/^win/);


    var relPath = "/" + path.relative(rootDir, curDir);

    if (isWin) {
        relPath = relPath.replace(/\b\\\b/gi, "/");
    }

    return relPath.match(/\//g).length;
};

/**
 * read a directory (recursively deep)
 * data[] = an object for each element in the directory
 *      .name = item's name (file or folder name)
 *      .stat = item's stat (.stat.isDirectory() == true IF a folder)
 *      .children = another data[] for the children
 * filter = an object with various filter settings:
 *      .depth      = max directory recursion depth to travel
 *                      (0 or missing means: infinite)
 *                      (1 means: only the folder passed in)
 *      .hidden     = true means: process hidden files and folders (defaults to false)
 *      .callback   = callback function: callback(name, path, filter) -- returns truthy to keep the file
 *
 *
 * @param path      = path to directory to read (".", ".\apps")
 * @param callback  = function to callback to: callback(err, data)
 * @param [filter]  = (optional) filter object
 */
var readDirectory = function(path, callback, filter) {
    if (filter) {
        // process filter. are we too deep yet?
        if (!filter.depthAt) {
            // initialize what depth we are at
            filter.depthAt = 1;
        }

        if (filter.depth && filter.depth < filter.depthAt) {
            // we are too deep. return "nothing found"
            callback(undefined, []);
            return;
        }
    }

    // queue up a "readdir" file system call (and return)
    fs.readdir(path, function(err, files) {
        if (err) {
            callback(err);
            return;
        }

        // true means: process hidden files and folders
        var doHidden = false;

        if (filter && filter.hidden) {
            // filter requests to process hidden files and folders
            doHidden = true;
        }

        // count the number of "stat" calls queued up
        var count = 0;

        // count the number of "folders" calls queued up
        var countFolders = 0;

        // the data to return
        var data = [];

        // iterate over each file in the dir
        files.forEach(function(title) {
            // ignore files that start with a "." UNLESS requested to process hidden files and folders
            if (doHidden || title.indexOf(".") !== 0) {
                // queue up a "stat" file system call for every file (and return)
                count += 1;
                fs.stat(path + "/" + title, function(err, stat) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    var processFile = true;

                    if (filter && filter.callback) {
                        processFile = filter.callback(title, stat, filter);
                    }

                    if (processFile) {
                        var obj = {
                            title: title,
                            path: path + "/" + title
                        };

                        if (stat.isFile()) {
                            obj.size = stat.size;
                        }

                        // push data 
                        data.push(obj);

                        if (stat.isDirectory()) {
                            countFolders += 1;

                            // add this property - lester_hu@bandrich.com [2013/09/14]
                            obj.isFolder = true;

                            // perform "readDirectory" on each child folder (which queues up a readdir and returns)
                            (function(obj2) {
                                var nextPath = path + "/" + title,
                                    curDepth = calcDepth(filter.root, nextPath);

                                // check depth before recursive - lester_hu@bandrich.com [2013/09/25]
                                if (filter.depth && curDepth > filter.depth) {
                                    // too deep! we don't remove whole object, just assign null array for current object - lester_hu@bandrich.com [2013/09/25]
                                    obj2.children = [];
                                    countFolders -= 1;
                                    callback(undefined, data);
                                } else {
                                    readDirectory(nextPath, function(err, data2) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        // entire child folder info is in "data2" (1 fewer child folders to wait to be processed)
                                        countFolders -= 1;
                                        obj2.children = data2;
                                        if (countFolders <= 0) {
                                            // sub-folders found. This was the last sub-folder to processes.
                                            callback(undefined, data); // callback w/ data
                                        } else {
                                            // more children folders to be processed. do nothing here.
                                        }
                                    }, filter);
                                }
                            })(obj);
                        }
                    }

                    // one more file has been processed (or skipped)
                    count -= 1;
                    if (count <= 0) {
                        // all files have been processed.
                        if (countFolders <= 0) {
                            // no sub-folders were found. DONE. no sub-folders found
                            callback(undefined, data); // callback w/ data
                        } else {
                            // children folders were found. do nothing here (we are waiting for the children to callback)
                            //console.log("children folders were found. do nothing here");
                        }
                    }
                });
            }
        });

        // if no "stat" calls started, then this was an empty folder
        if (count <= 0) {
            // callback w/ empty
            callback(undefined, []);
        }
    });
};