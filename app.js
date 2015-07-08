(function () {

"use strict";

var express = require("express"),
	routes = require("router.js"),
	bodyParser = require("body-parser"),
	app = express();

app.use(express.static("/public"));
app.use(bodyParser.text());
app.use("/", routes);

app.listen(3000, function (err) {
	if (err) { console.error(err); }
	console.log("Up and running");
});

})();
