(function () {

Operator.prototype.wordy = function (string) {
	var wordiness = string.split("J");
	wordiness = wordiness.map(function (word) {
		return word.length;
	});
	console.log(wordiness);
};

})();
