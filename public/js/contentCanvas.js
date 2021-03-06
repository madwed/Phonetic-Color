(function () {

"use strict";

var textCanvas = document.getElementById("textCanvas"),
	textCtx = textCanvas.getContext("2d"),
	contentCol = document.getElementById("mapper");

var addContentProto = function (operator) {

	operator.prototype.drawContent = function (codeString) {
		textCanvas.width = contentCol.clientWidth * 0.9;
		textCanvas.style.width = textCanvas.width + "px";
		codeString = codeString ? codeString : "";
		var codedWords = codeString.split("J"), codedWordsLength = codedWords.length,
			phoWidth = 4, phoHeight = 20,
			margin = 40, rightMargin = textCanvas.clientWidth - margin - phoWidth,
			col = margin, row = margin / 4, newLine = phoHeight + 2, space = phoWidth * 2,
			word, codedWord, codedLength, canvasHeight,
			color, cIndex;
		//Calculate the height the canvas should be for the input
		if(codeString) {
			canvasHeight = codedWords.reduce(function (col0Row1, currentWord) {
				if(currentWord === "K") {
					col0Row1[1] = margin;
					col0Row1[0] += newLine;
					return col0Row1;
				}
				col0Row1[1] += currentWord.length * phoWidth;
				if (col0Row1[1] > rightMargin) {
					col0Row1[1] = currentWord.length * phoWidth + margin;
					col0Row1[0] += newLine;
				}
				col0Row1[1] += space;
				return col0Row1;
			}, [phoHeight, 0]);
			//Calculate the number of newlines and add to canvasHeight
			canvasHeight = canvasHeight[0] + row + row;
			textCanvas.height = canvasHeight;
			textCanvas.style.height = canvasHeight + "px";
		}


		//Decode the words into arrays of colors
		codedWords = codedWords.map(function (codeWord) {
			if(codeWord === "K") { return "NEWLINE"; }
			var colors = [], letter = 0, wordLength = codeWord.length;
			for(letter; letter < wordLength; letter++) {
				colors.push(this.customCode[codeWord[letter]].color);
			}
			return colors;
		}, this);
		//For each color coded word
		for(word = 0; word < codedWordsLength; word++) {
			codedWord = codedWords[word];
			if(codedWord === "NEWLINE") {
				col = margin;
				row += newLine;
				continue;
			}
			codedLength = codedWord.length;
			//If the word would cross the right margin, \n
			if(col + codedLength * phoWidth > rightMargin) {
				col = margin;
				row += newLine;
			}
			//Draw the word
			for(cIndex = 0; cIndex < codedWord.length; cIndex++) {
				color = codedWord[cIndex];
				textCtx.fillStyle = color;
				textCtx.fillRect(col, row, phoWidth, phoHeight);
				col += phoWidth;
			}

			col += space;
		}
	};
};

module.exports = addContentProto;

}());
