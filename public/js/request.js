(function (){

	"use strict";
	//Phoneme, color, 3D reference
	var defaultCode = {
		a: {phoneme: "AA", color: "#000000"}, b: {phoneme: "AE", color: "#004c19"}, c: {phoneme: "AH", color: "#000033"},
		d: {phoneme: "AO", color: "#330033"}, e: {phoneme: "E", color: "#004c4c"}, f: {phoneme: "EH", color: "#004c33"},
		g: {phoneme: "IH", color: "#003366"}, h: {phoneme: "IY", color: "#004c7f"}, i: {phoneme: "O", color: "#33004c"},
		j: {phoneme: "UH", color: "#331966"}, k: {phoneme: "UW", color: "#33007f"}, l: {phoneme: "B", color: "#cc667f"},
		m: {phoneme: "CH", color: "#b291c8"}, n: {phoneme: "D", color: "#cc66b6"}, o: {phoneme: "DH", color: "#7f66a3"},
		p: {phoneme: "F", color: "#7f9191"}, q: {phoneme: "G", color: "#cc66ec"}, r: {phoneme: "HH", color: "#7f7bff"},
		s: {phoneme: "JH", color: "#b266c8"}, t: {phoneme: "K", color: "#cc91ec"}, u: {phoneme: "L", color: "#4c66b6"},
		v: {phoneme: "M", color: "#e5667f"}, w: {phoneme: "N", color: "#e566b6"}, x: {phoneme: "NG", color: "#e566ec"},
		y: {phoneme: "P", color: "#cc917f"}, z: {phoneme: "R", color: "#6666b6"}, A: {phoneme: "S", color: "#9991b6"},
		B: {phoneme: "SH", color: "#9991c8"}, C: {phoneme: "T", color: "#cc91b6"}, D: {phoneme: "TH", color: "#6691a3"},
		E: {phoneme: "V", color: "#666691"}, F: {phoneme: "W", color: "#4c667f"}, G: {phoneme: "Y", color: "#4c66da"},
		H: {phoneme: "Z", color: "#7f66b6"}, I: {phoneme: "ZH", color: "#7f66c8"}
	},
		//Clone the defaultCode
		customCode = JSON.parse(JSON.stringify(defaultCode)),
		lastString = "",
		submitButton = document.getElementById("submit"),
		textCanvas = document.getElementById("textCanvas"),
		textCtx = textCanvas.getContext("2d"),
		keyCanvas = document.getElementById("keyCanvas"),
		keyCtx = keyCanvas.getContext("2d"),
		keyRect = keyCanvas.getBoundingClientRect(),
		colorBox = document.getElementById("color");

	
       var reg = /^#(.)\1(.)\2(.)\3$/;
    
    // this is where colorpicker created
    var cp = Raphael.colorwheel(keyRect.right - 35, keyRect.bottom - 80, 100, "#655555");
    
    cp.onchange = function (clr) {
        colorBox.value = clr.replace(reg, "#$1$2$3");
        colorBox.style.background = clr;
        colorBox.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
    };
    // that’s it. Too easy



	function drawText (codeString) {
		var codedWords = codeString.split("J"), codedWordsLength = codedWords.length,
			phoWidth = 2, phoHeight = 10,
			margin = 40, rightMargin = textCanvas.width - margin - phoWidth,
			col = margin, row = margin / 4, newLine = phoHeight + 1, space = phoWidth * 2,
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
		textCanvas.style.height = canvasHeight + "px";

		//Decode the words into arrays of colors
		codedWords = codedWords.map(function(word){
			var colors = [], letter = 0, wordLength = word.length;
			for(letter; letter < wordLength; letter++){
				colors.push(customCode[word[letter]].color);
			}
			return colors;
		});
		
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

	function drawKeys(){
		var swatches = [];
		keyCtx.font = "20px sans-serif";
		for(var key in customCode){
			swatches.push({
				key: key, 
				phoneme: customCode[key].phoneme, 
				color: customCode[key].color, 
				position: {x:0, y:0}
			});
		}
		swatches.sort(function(a, b){
			if(a.phoneme > b.phoneme) { return 1; }
			return -1;
		});
		var startX = 30, startY = 20, swatchSize = 20;
		for(var i = 0; i < swatches.length; i++){
			if(startX > 350){
				startY += 35;
				startX = 30;
			}
			keyCtx.fillStyle = swatches[i].color;
			keyCtx.fillText(swatches[i].phoneme, startX + 25, startY+18);	
			keyCtx.fillRect(startX, startY, swatchSize, swatchSize);
			swatches[i].position.x = startX + swatchSize / 2;
			swatches[i].position.y = startY + swatchSize / 2;
			startX += 65;
		}
		function updateKeyCanvas(x, y){ 
			var updateSwatch;
			for(var i = 0; i < swatches.length; i++){
				var swatch = swatches[i];
				if(Math.abs(swatch.position.x - x) < swatchSize / 2 &&  Math.abs(swatch.position.y - y) < swatchSize / 2){
					updateSwatch = swatch;
					break;
				}
			}
			if(updateSwatch){
				var startX = updateSwatch.position.x - swatchSize / 2;
				var startY = updateSwatch.position.y - swatchSize / 2;
				keyCtx.clearRect(startX - 5, startY - 5, 65, 35);
				keyCtx.fillStyle = colorBox.value;
				keyCtx.fillText(updateSwatch.phoneme, startX + 25, startY+18);	
				keyCtx.fillRect(startX, startY, swatchSize, swatchSize);
				customCode[updateSwatch.key].color = colorBox.value;
				drawText(lastString);
			}

		}
		function keyClickHandler (event){
			event.preventDefault();
			var eventDoc, doc, body;

		    event = event || window.event; // IE-ism

		    // If pageX/Y aren't available and clientX/Y are,
		    // calculate pageX/Y - logic taken from jQuery.
		    // (This is to support old IE)
		    if (event.pageX === null && event.clientX !== null) {
		        eventDoc = (event.target && event.target.ownerDocument) || document;
		        doc = eventDoc.documentElement;
		        body = eventDoc.body;

		        event.pageX = event.clientX +
		          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		          (doc && doc.clientLeft || body && body.clientLeft || 0);
		        event.pageY = event.clientY +
		          (doc && doc.scrollTop || body && body.scrollTop || 0) -
		          (doc && doc.clientTop || body && body.clientTop || 0 );
		    }
		    var rect = keyCanvas.getBoundingClientRect();
		    var x = Math.round((event.pageX - rect.left) / (rect.right - rect.left) * keyCanvas.width);
		    var y = Math.round((event.pageY - rect.top) / (rect.bottom - rect.top) * keyCanvas.height);
		    updateKeyCanvas(x,y);
		}
		keyCanvas.addEventListener("click", keyClickHandler);
		
	}
	

	function postText() {
		var string = document.getElementById("text_field").value,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				lastString = xmlhttp.responseText;
				drawText(lastString);
				console.log(lastString);
			}
		};
		xmlhttp.open("POST", "/submit", true);
		xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(string);
	}

	submitButton.addEventListener("mousedown", postText);
	drawKeys();
})();
