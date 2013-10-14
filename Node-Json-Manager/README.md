Node-Json-Manager
==============
Wrapper file-json from https://github.com/UmbraEngineering/json-file

* `npm install`
* `node app.js`

##Creating an object
```javascript
var conf = new jsonMgr({        // create new object
        path   : "./conf.json", // file path
        indent : 4,             // json indent
        sync   : true           // write to file when setting?
    });
```

##How to setting the value?
```javascript
conf.set("a", "1");
conf.set("a.b.c", "2");
```

##How to get the value?
```javascript
conf.get("a", "1");             // 1
conf.get("a.b.c", "2");         // 2
```
