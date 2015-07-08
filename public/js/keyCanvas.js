(function(){

"use strict";
//Get the keyCanvas, keyCtx, column containing the canvas
var keyCanvas = document.getElementById("keyCanvas"),
	keyCtx = keyCanvas.getContext("2d"),
	cubeCol = document.getElementById("sizer"),
	colorBox = document.getElementById("color");
//Set up the Raphael Regex
var reg = /^#(.)\1(.)\2(.)\3$/;

	
Operator.prototype.initKeys = function(){
	//Calculate the width and height of the keyCanvas
	keyCanvas.width = cubeCol.clientWidth * 0.85;
	keyCanvas.height = keyCanvas.width * 3 / 4;
	keyCanvas.style.height = keyCanvas.height + "px";
	keyCanvas.style.width = keyCanvas.width + "px";
	//Calculate the height of the colorBox
	colorBox.height = keyCanvas.height / 3;
	colorBox.style.height = colorBox.height + "px";
	//Position the colorBox relative to the keyCanvas
	var keyRect = keyCanvas.getBoundingClientRect();
	colorBox.style.left = keyRect.right - 15 + "px";
	colorBox.style.top = keyRect.bottom - colorBox.height * 8 / 5 + "px";
	
	//Set the scale of the colorPicker
	var scale = keyCanvas.height / 4;
	//If the colorPicker exists this is a resize, remove the colorPicker
	if(this.cp){ this.cp.remove(); }
	//If the colorBox has a value, keep its value, otherwise this is the first init and set it
	colorBox.value = colorBox.value ? colorBox.value : "#655555";
	//Set up the colorPicker
	this.cp = Raphael.colorwheel(keyRect.right - scale * 3 / 5, keyRect.bottom - scale * 4 / 5, scale, colorBox.value);
	this.cp.onchange = function (clr) {
		colorBox.value = clr.replace(reg, "#$1$2$3");
		colorBox.style.background = clr;
	};
	//Set the swatch array and swatch dimensions
	var swatches = [],
		swatchWidth = keyCanvas.width * 0.0541, 
		swatchHeight = keyCanvas.height * 0.0714;
	Operator.prototype.drawKeys = function(reset){
		var marginLeft = swatchWidth * 1.5,
			marginRight = keyCanvas.width - marginLeft - swatchWidth,
			startX = marginLeft,
			startY = swatchHeight,
			spacing = swatchHeight * 0.7,
			customCode = this.customCode;
		if(reset){
			swatches = [];
			for(var key in customCode){
				swatches.push({
					key: key,
					phoneme: customCode[key].phoneme,
					color: customCode[key].color,
					position: {x: 0, y: 0}
				});
			}
			swatches.sort(function(a, b){
				if(a.phoneme > b.phoneme) { return 1; }
				return -1;
			});
		}
		keyCtx.font = swatchHeight + "px sans-serif";
		keyCtx.lineWidth = 1;
		keyCtx.strokeStyle = "#cccccc";
		keyCtx.clearRect(0, 0, keyCanvas.width, keyCanvas.height);
		for(var i = 0; i < swatches.length; i++){
			if(startX > marginRight){
				startY += swatchHeight + spacing;
				startX = marginLeft;
			}
			keyCtx.fillStyle = swatches[i].color;
			keyCtx.fillText(swatches[i].phoneme, startX + swatchWidth + (swatchWidth / 4), startY + swatchHeight * 9 / 10);
			keyCtx.fillRect(startX, startY, swatchWidth, swatchHeight);
			keyCtx.strokeText(swatches[i].phoneme, startX + swatchWidth + (swatchWidth / 4), startY + swatchHeight * 9 / 10);
			keyCtx.strokeRect(startX, startY, swatchWidth, swatchHeight);
			swatches[i].position.x = startX + swatchWidth / 2;
			swatches[i].position.y = startY + swatchHeight / 2;
			startX += swatchWidth * 13 / 4;
		}
	};
	Operator.prototype.updateKeyCanvas = function(x, y){
		var updateSwatch, code = this.customCode;
		for(var i = 0; i < swatches.length; i++){
			var swatch = swatches[i];
			//////Calculate the 10 below to make sure it works for various sizes (or at least check)
			if(Math.abs(swatch.position.x - x) < swatchWidth / 2 + 10 && Math.abs(swatch.position.y - y) < swatchHeight / 2 + 10){
				updateSwatch = swatch;
				break;
			}
		}
		if(updateSwatch){
			var startX = updateSwatch.position.x - swatchWidth / 2;
			var startY = updateSwatch.position.y - swatchHeight / 2;
			keyCtx.clearRect(startX - 1, startY - 1, swatchWidth * 13 / 4, swatchHeight * 17 / 10);
			keyCtx.fillStyle = colorBox.value;
			keyCtx.fillText(updateSwatch.phoneme, startX + swatchWidth + (swatchWidth / 4), startY + swatchHeight * 9 / 10);
			keyCtx.fillRect(startX, startY, swatchWidth, swatchHeight);
			keyCtx.strokeStyle = "#cccccc";
			keyCtx.strokeText(swatches[i].phoneme, startX + swatchWidth + (swatchWidth / 4), startY + swatchHeight * 9 / 10);
			keyCtx.strokeRect(startX, startY, swatchWidth, swatchHeight);
			code[updateSwatch.key].color = colorBox.value;
			if(this.lastString){
				this.drawContent(this.lastString);
			}
			this.updateCube(updateSwatch.phoneme, colorBox.value);
		}
	};
};
})();
