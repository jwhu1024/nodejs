Node-Json-Manager
==============
Wrapper file-json from https://github.com/UmbraEngineering/json-file

* `npm install`
* `node app.js`

##Creating an object
```javascript
var conf = new jsonMgr({        // create new object
        path   : "./conf.json", // file path (default: './conf.json')
        indent : 4,             // json indent (default: 0)
        sync   : true           // write to file when setting? (default: false)
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
###The set method returns the file object itself,so this method can be chained.
```javascript
conf.set("value_1", "1")
    .set("value_2", "2");
```
More example please refer to app.js
