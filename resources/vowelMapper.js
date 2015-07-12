var fs = require('fs');
var split = require('split');

var vowelMap = function(){
	var vowelStream = fs.createReadStream('./data/consonants.csv','utf8')
		.pipe(split(/\r/));
	var dictionary = {};
	vowelStream.on('data', function(line){
		var entry = line.split(",");
		dictionary[entry[0]] = entry.splice(1,entry.length);
	});
	vowelStream.on('error', function(err){
		return console.log(err)
	})
	vowelStream.on('end', function(){
		console.log(dictionary);
		return dictionary;
	});
}

module.exports = vowelMap;

vowelMap();