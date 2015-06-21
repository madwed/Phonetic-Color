var express = require("express");
var router = express.Router();
var fs = require("fs");

var index = fs.readFileSync("./index.html", "utf8");
var xmlRequest = fs.readFileSync("./request.js", "utf8");

var encode = require("./wordColorer.js");

router.get("/", function (req, res, next) {
	res.send(index);
});

router.get("/request.js", function (req, res, next) {
	res.send(xmlRequest);
});

router.post("/submit", function (req, res, next) {
	var encodedPara = encode(req.body);
	res.send(encodedPara);
});



module.exports = router;