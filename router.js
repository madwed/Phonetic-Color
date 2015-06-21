var express = require("express");
var router = express.Router();
var fs = require("fs");

var index = fs.readFileSync("./index.html", "utf8");

var encode = require("./wordColorer.js");

router.get("/", function (req, res, next) {
	res.send(index);
});

router.post("/", function (req, res, next) {
	var encodedPara = encode(req.body.text);
	res.send(encodedPara);
});

module.exports = router;