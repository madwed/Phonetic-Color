(function () {

"use strict";
//Get the keyCanvas, keyCtx, column containing the canvas
var keyCanvas = document.getElementById("keyCanvas"),
	keyCtx = keyCanvas.getContext("2d"),
	cubeCol = document.getElementById("sizer"),
	colorBox = document.getElementById("color"),
//Set up the Raphael Regex
	reg = /^#(.)\1(.)\2(.)\3$/;
//Set the color box value on the first run
colorBox.value = "#655555";


Operator.prototype.initKeys = function () {
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
	colorBox.style.top = keyRect.bottom / 2.25 + "px";

	//Set the scale of the colorPicker
	var scale = keyCanvas.height / 4;
	//If the colorPicker exists this is a resize, remove the colorPicker
	if(this.cp) { this.cp.remove(); }
	//Set up the colorPicker
	this.cp = Raphael.colorwheel(keyRect.right - scale * 3 / 5, keyRect.bottom - scale * 4 / 5, scale, colorBox.value);
	//Fix for colorPicker positioning
	if(window.innerWidth > 1200) {
        this.cp.raphael.canvas.style.position = "fixed";
    }else {
        this.cp.raphael.canvas.style.position = "absolute";
    }
	this.cp.onchange = function (clr) {
		colorBox.value = clr.replace(reg, "#$1$2$3");
		colorBox.style.background = clr;
	};
	// Set the swatch array and swatch dimensions
	var swatches = [],
		swatchWidth = keyCanvas.width * 0.0541,
		swatchHeight = keyCanvas.height * 0.0714,
		drawKey = function (color, phonemeText, x, y) {
			var xPosText, yPosText, colorHsb;
			keyCtx.fillStyle = color;
			xPosText = x + swatchWidth + swatchWidth / 4;
			yPosText = y + swatchHeight * 9 / 10;

			keyCtx.fillText(phonemeText, xPosText, yPosText);
			keyCtx.fillRect(x, y, swatchWidth, swatchHeight);

			colorHsb = Raphael.rgb2hsb(color);
			if(colorHsb.b > 0.9 && colorHsb.s < 0.21) {
				keyCtx.strokeText(phonemeText, xPosText, yPosText);
				keyCtx.strokeRect(x, y, swatchWidth, swatchHeight);
			}
		};
	Operator.prototype.drawKeys = function (reset) {
		var marginLeft = swatchWidth * 1.5,
			marginRight = keyCanvas.width - marginLeft - swatchWidth,
			startX = marginLeft,
			startY = swatchHeight,
			spacing = swatchHeight * 0.7,
			customCode = this.customCode,
			swatch;
		if(reset) {
			swatches = [];
			for(var key in customCode) {
				swatches.push({
					key: key,
					phoneme: customCode[key].phoneme,
					color: customCode[key].color,
					position: {x: 0, y: 0}
				});
			}
			swatches.sort(function (a, b) {
				if(a.phoneme > b.phoneme) {return 1; }
				return -1;
			});
		}
		keyCtx.font = swatchHeight + "px sans-serif";
		keyCtx.lineWidth = 1;
		keyCtx.clearRect(0, 0, keyCanvas.width, keyCanvas.height);
		keyCtx.strokeStyle = "#cccccc";
		for(swatch = 0; swatch < swatches.length; swatch++) {
			if(startX > marginRight) {
				startY += swatchHeight + spacing;
				startX = marginLeft;
			}

			drawKey(swatches[swatch].color, swatches[swatch].phoneme, startX, startY);

			swatches[swatch].position.x = startX + swatchWidth / 2;
			swatches[swatch].position.y = startY + swatchHeight / 2;
			startX += swatchWidth * 13 / 4;
		}
	};
	Operator.prototype.updateKeyCanvas = function (x, y) {
		var updateSwatch, code = this.customCode, i;
		for(i = 0; i < swatches.length; i++) {
			var swatch = swatches[i];

			if(Math.abs(swatch.position.x - x) < swatchWidth / 2 + 10 && Math.abs(swatch.position.y - y) < swatchHeight / 2 + 10) {
				updateSwatch = swatch;
				break;
			}
		}
		if (updateSwatch) {
			var updateX = updateSwatch.position.x - swatchWidth / 2;
			var updateY = updateSwatch.position.y - swatchHeight / 2;
			var color = colorBox.value;
			keyCtx.clearRect(updateX - 1, updateY - 1, swatchWidth * 13 / 4, swatchHeight * 17 / 10);
			keyCtx.strokeStyle = "#cccccc";

			drawKey(color, updateSwatch.phoneme, updateX, updateY);

			code[updateSwatch.key].color = colorBox.value;
			if (this.lastString) {
				this.drawContent(this.lastString);
			}
			this.updateCube(updateSwatch.phoneme, colorBox.value);
		}
	};
};

})();
