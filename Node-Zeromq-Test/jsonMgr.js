var jsonFile = require('json-file'),
	jsonMgr  = exports.jsonMgr = function(_opts) {
		var options = _opts || {};
		this.path   = options.path   || './conf.json';
		this.indent = options.indent || 0;
		this.sync   = options.sync   || false;
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
		if (this.sync === true) {
			this.writeToFile();
		}
	} catch (err) {
		throw err;
	}
	return this;
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
