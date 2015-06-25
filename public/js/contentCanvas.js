(function(){

var textCanvas = document.getElementById("textCanvas"),
textCtx = textCanvas.getContext("2d"),
contentBox = document.getElementById("mapper");

Operator.prototype.drawContent = function (codeString) {
	var codedWords = codeString.split("J"), codedWordsLength = codedWords.length,
		phoWidth = 4, phoHeight = 20,
		margin = 40, rightMargin = contentBox.clientWidth - margin - phoWidth,
		col = margin, row = margin / 4, newLine = phoHeight + 2, space = phoWidth * 2,
		word, codedWord, codedLength, canvasHeight;
	//Calculate the height the ca nvas should be for the input
	canvasHeight = codedWords.reduce(function(col0Row1, currentWord){
		col0Row1[1] += currentWord.length * phoWidth;
		if(col0Row1[1] > rightMargin){
			col0Row1[1] = currentWord.length * phoWidth + margin;
			col0Row1[0] += newLine;
		}
		col0Row1[1] += space;
		return col0Row1;
	}, [phoHeight, 0]);
	canvasHeight = canvasHeight[0] + row + row;
	textCanvas.height = canvasHeight;
	textCanvas.width = contentBox.clientWidth;
	textCanvas.style.height = canvasHeight + "px";
	textCanvas.style.width = contentBox.clientWidth + "px";

	//Decode the words into arrays of colors
	codedWords = codedWords.map(function(word){
		var colors = [], letter = 0, wordLength = word.length;
		for(letter; letter < wordLength; letter++){
			colors.push(this.customCode[word[letter]].color);
		}
		return colors;
	}, this);
	
	//For each color coded word
	for(word = 0; word < codedWordsLength; word++){
		codedWord = codedWords[word], codedLength = codedWord.length;
		//If the word would cross the right margin, \n
		if((col + codedLength * phoWidth) > rightMargin){
			col = margin;
			row += newLine;
		}
		//Draw the word
		codedWord.forEach(function(color){
			textCtx.fillStyle = color;			
			textCtx.fillRect(col, row, phoWidth, phoHeight);
			col += phoWidth;
		});

		col += space;
	}
}

})();