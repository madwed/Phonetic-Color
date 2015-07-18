(function () {

//Start of function to create a graph of length of word in phonemes over word
Operator.prototype.wordy = function (string) {
	var wordiness = string.split("J");
	wordiness = wordiness.map(function (word) {
		return word.length;
	});
	console.log(wordiness);
};

})();
