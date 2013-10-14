var jsonFile = require('json-file'),
	jsonMgr  = exports.jsonMgr = function(_opts) {
		this.path   = _opts.path   || './conf.json';
		this.indent = _opts.indent || 0;
		this.sync   = _opts.sync   || false;
		this.data   = jsonFile.read(this.path);
	};

jsonMgr.prototype.get = function(_key) {
	try {
		return this.data.get(_key);
	} catch (err) {
		throw err;
	}
};

jsonMgr.prototype.set = function(_key, _value) {
	try {
		this.data.set(_key, _value);
		console.log(this.sync);
		if (this.sync === true) {
			this.writeToFile();
		}
	} catch (err) {
		throw err;
	}
};

jsonMgr.prototype.writeToFile = function() {
	try {
		this.data.write(function (err) {
			if (err) {
				throw err;
			}
		});
	} catch (err) {
		throw err;
	}
	return;
};