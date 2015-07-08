(function () {

"use strict";

var express = require("express"),
	routes = require(__dirname + "/router.js"),
	bodyParser = require("body-parser"),
	app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.text());
app.use("/", routes);

app.listen(3000, function (err) {
	if (err) { console.error(err); }
	console.log("Up and running");
});

})();
