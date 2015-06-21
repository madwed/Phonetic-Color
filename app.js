(function () {
"use strict";

var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded());

var routes = require(path.join(__dirname, "router.js"));

app.use("/", routes);

app.listen(3000, function (err) {
	if (err) { console.error(err); }
	console.log("Up and running");
});

})();
