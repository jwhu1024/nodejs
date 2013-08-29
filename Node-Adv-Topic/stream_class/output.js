var fs = require("fs"),
	input = fs.createReadStream("./in.txt", {
		flags: "r"
	}),
	out = fs.createWriteStream("./out.txt", {
		flags: "w"
	});

input.pipe(out);

/*
input.on("data", function(data) {
	console.log("data", data);
	out.write(data);
});

input.on("end", function() {
	console.log("end");
	out.end(function() {
		console.log("Finputished writinputg to in.txt");
	});
});
*/

/*
/**
*
* Readable
** readable
** end
** data
** error
** close

* Writeable
** drain
** error
** close
** finish
** pipe
** unpipe
*/