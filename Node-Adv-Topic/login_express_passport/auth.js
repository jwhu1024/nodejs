users = require("./public/users.json");

var MAX_USER_CNT = 2;

exports.findById = function findById(id, fn) {
	if (users[id]) {
		fn(null, users[id]);
	} else {
		fn(new Error('User ' + id + ' does not exist'));
	}
};

exports.findByUsername = function findByUsername(username, fn) {
	for (var i = 1; i <= MAX_USER_CNT; i++) {
		if (users[i].username === username) {
			return fn(null, users[i]);
		}
	}
	return fn(null, null);
};

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

exports.users = users;