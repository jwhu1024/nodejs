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
// set(key, value)
conf.set("a", "1");
conf.set("a.b.c", "2");
```

##How to get the value?
```javascript
// get(key)
conf.get("a"));     // output : 1
conf.get("a.b.c");  // output : 2      
```

##Nested objects using the "dot" separated
```javascript
var nestObj = {
    obj : {
        obj1 : "12345"
    }
};

// read nested object
conf.get("nestObj.obj.obj1");           // output : 12345

// write nested object
conf.set("nestObj.obj.obj1", "45678");  // obj1 will be changed to 45678
```
