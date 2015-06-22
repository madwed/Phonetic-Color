(function () {

"use strict";

var path = require("path"),
	express = require("express"),
	routes = require(path.join(__dirname, "router.js")),
	logger = require("morgan"),
	bodyParser = require("body-parser"),
	app = express();


app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.text());
app.use("/", routes);

app.listen(3000, function (err) {
	if (err) { console.error(err); }
	console.log("Up and running");
});

})();
