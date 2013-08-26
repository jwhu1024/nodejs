var _util        = require("util"),
	_sessionList = [];

exports.registerSession = function (req) {
	req.session.user = req.body.name;
	_sessionList.push(req.session.id.toString());
};

exports.destroySession = function (req) {
	_sessionList.splice(_sessionList.indexOf(req.session.id), 1);
	req.session.destroy(null);
};

exports.dumpSession = function () {
	var stringbeauty = JSON.stringify(_sessionList, null, 4);
	_util.log("######################");	
	_util.log("Session List On Server :\n" + stringbeauty);
	_util.log("######################");
};

exports.checkSession = function (req, res, next) {
	var sess=false;
	// find session
	for (var i = 0; i < _sessionList.length; i++) {
		if (req.session.id === _sessionList[i]) {
			sess=true;
		}
	}

	// redirect to login page if session not available
	if (sess	=== false			&&
		req.url !== "/login"		&&
		req.url !== "/favicon.ico"	){
		res.redirect("http://" + req.headers.host + "/login.html");
	} else {
		next();
	}
};

//exports.registerSession = registerSession;
//exports.destroySession = destroySession;
//exports.dumpSession = dumpSession;
//exports.checkSession = checkSession;
