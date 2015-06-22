
"use strict";

var express = require("express"),
	router = express.Router(),
	fs = require("fs"),
	index = fs.readFileSync("./index.html", "utf8"),
	encode = require("./wordColorer.js");

router.get("/", function (req, res, next) {
	res.send(index);
});

router.post("/submit", function (req, res, next) {
	var encodedPara = encode(req.body);
	res.send(encodedPara);
});

module.exports = router;
