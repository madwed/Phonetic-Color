/* 
Input string
Convert to phonemes
	Options
		Use dictionary server
		Use local dictionary
			Access local dictionary?
			Separate dictionary file
Translate phonemes to color
	Create consonant map
	Decide default values for vowel sounds
*/

var fs = require('fs');
var split = require('split');

function makeDict(){
	var phoneDictStream = fs.createReadStream('./cmudict/cmudict.0.7a_SPHINX_40.txt','utf8')
		.pipe(split());
	var dictionary = {};
	var num = 0;
	phoneDictStream.on('data', function(line){
		var entry = line.split(/\s/);
		dictionary[entry[0]] = entry.splice(1,entry.length);
	});
	phoneDictStream.on('error',function(err){
		return console.log(err);
	});
	phoneDictStream.on('end',function(){
		console.log(stringToPhonemes("boston face price choice goat mouth nurse start north force near square cure comma letter happy",dictionary));
	});
}

//Takes a space separated string.
function stringToPhonemes(string,dict){
	var words = string.split(/\s/);
	var phonemes = [];
	phonemes = words.map(function(word,index){
		return phonemes[index] = dict[word.toUpperCase()].slice();
	});
	return phonemes;
}

makeDict();