
"use strict";

var fs = require("fs");
var path = require("path");


function makeDict (filePath, entryFunc) {
	//Should use Async here
	var phoneDict = fs.readFileSync(filePath, "utf8"),
		dictionary = {};
	//Split dict file on newlines
	phoneDict = phoneDict.split(/[\n\r]/);
	phoneDict.forEach(function (line) {
		//Then split on spaces and form each word - phonemes pair
		var entry = line.split(/\s/);
		dictionary[entry[0]] = entryFunc(entry);
	});
	return dictionary;
}


//Paths for word to phoneme dict (finalDict) and phoneme to color dict (phonemeColor)
//(could combine the two, but this way it's easier to add words to the finalDict)
var phonemePath = path.join(__dirname, "/cmudict/finalDict.txt"),
	phonemeEntry = function (entry) {
		return entry.splice(1, entry.length);
	},
	colorPath = path.join(__dirname, "/cmudict/phonemeColor.txt"),
	colorEntry = function (entry) {
		return entry[1];
	};

// Dictionary to map words to phonemes
var dict = makeDict(phonemePath, phonemeEntry);
// Dictionary to map phonemes to a code
var colorDict = makeDict(colorPath, colorEntry);

// Takes a space separated string
// Returns an array of phoneme arrays
var stringToPhonemes = function (string) {
	if(!string) { return []; }
	//Clean string, replacing non-readable characters
	string = string.replace(/[^\w\s|_]/g, "");
	//Replace newlines with newline keyword and split on space to get words
	var words = string.replace(/\n/g, " NEWLINE ").split(/\s+/),
		phonemes = [];
	//Translate words to phonemes (or undefined if not in dict) or return NEWLINE
	phonemes = words.map(function (word) {
		if(word === "NEWLINE") { return word; }
		return dict[word.toUpperCase()];
	});
	return phonemes;
};

// Turns the array of phoneme arrays into a coded string
var phonemesToColorString = function (phonemes) {
	var colorString = "",
		phonemeLength = phonemes.length, wordLength,
		wordEntry, phoEntry, word;
	for(wordEntry = 0; wordEntry < phonemeLength; wordEntry++) {
		//Grab the phoneme array for the specified word
		word = phonemes[wordEntry];
		if(!word) { continue; }
		//Add newline character and space (for parsing later) if newline keyword
		if(word === "NEWLINE") { colorString += "KJ"; continue; }
		wordLength = word.length;
		//Translate the phoneme array to its coded color equivalent
		for(phoEntry = 0; phoEntry < wordLength; phoEntry++) {
			colorString += colorDict[word[phoEntry]];
		}
		colorString += "J";
	}
	return colorString.slice(0, -1);
};

module.exports = function (string) {
	return phonemesToColorString(stringToPhonemes(string));
};
