var jsonFile = require('json-file'),
	jsonMgr  = exports.jsonMgr = function(_opts) {
		this.path   = _opts.path;
		this.indent = _opts.indent;
		this.sync   = _opts.sync;
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