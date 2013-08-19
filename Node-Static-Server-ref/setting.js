var setting = {
    webroot: "./node_modules",
    viewdir: true,
    /* Effective when viewdir is TRUE */
    index: "index.html",
    expires: {
        filematch: /^(gif|png|jpg|js|css)$/ig,
        /* Default for a month */
        maxAge: 60 * 60
    },
    compress: {
        match: /css|js|html/ig
    }
};
module.exports = setting;