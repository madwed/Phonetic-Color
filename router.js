
"use strict";

var express = require("express"),
	router = express.Router(),
	encode = require("./wordColorer.js");

router.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

router.post("/submit", function (req, res) {
	var encodedPara = encode(req.body);
	res.send(encodedPara);
});

module.exports = router;
