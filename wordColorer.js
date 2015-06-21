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
"use strict";

var fs = require("fs");
var path = require("path");

function makeDict(filePath, entryFunc) {
	var phoneDict = fs.readFileSync(filePath, "utf8");
	var dictionary = {};
	phoneDict = phoneDict.split(/[\n\r]/);
	phoneDict.forEach(function (line) {
		var entry = line.split(/\s/);
		dictionary[entry[0]] = entryFunc(entry);
	});
	return dictionary;
}

var phonemePath = path.join(__dirname, "/cmudict/finalDict.txt");
var phonemeEntry = function (entry) {
	return entry.splice(1, entry.length);
};

var colorPath = path.join(__dirname, "/cmudict/phonemeColor.txt");
var colorEntry = function (entry) {
	return entry[1];
};

// Dictionary to map words to phonemes
var dict = makeDict(phonemePath, phonemeEntry);
// Dictionary to map phonemes to a code
var colorDict = makeDict(colorPath, colorEntry);

// Takes a space separated string
// Returns an array of phoneme arrays
var stringToPhonemes = function (string) {
	string = string.replace(/[^\w\s|_]/g, "");
	var words = string.split(/\s/);
	var phonemes = [];
	phonemes = words.map(function (word) {
		return dict[word.toUpperCase()];
	});
	return phonemes;
};

// Turns the array of phoneme arrays into a coded string
var phonemesToColorString = function (phonemes) {
	var colorString = "",
		phonemeLength = phonemes.length, wordLength,
		wordEntry, phoEntry, word;
	for(wordEntry = 0; wordEntry < phonemeLength; wordEntry++){
		word = phonemes[wordEntry];
		if(!word){ continue; }
		wordLength = word.length;
		for(phoEntry = 0; phoEntry < wordLength; phoEntry++){
			colorString += colorDict[word[phoEntry]];
		}
		colorString += "J";
	}
	return colorString;
};

module.exports = function (string) {
	return phonemesToColorString(stringToPhonemes(string));
};
