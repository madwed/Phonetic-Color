(function(){

"use strict";

var keyCanvas = document.getElementById("keyCanvas"),
		keyCtx = keyCanvas.getContext("2d"),
		keyRect = keyCanvas.getBoundingClientRect(),
		colorBox = document.getElementById("color");
		var reg = /^#(.)\1(.)\2(.)\3$/;

    // this is where colorpicker created
    var cp = Raphael.colorwheel(keyRect.right - 35, keyRect.bottom - 80, 100, "#655555");
    colorBox.value = "#655555";

	cp.onchange = function (clr) {
		colorBox.value = clr.replace(reg, "#$1$2$3");
		colorBox.style.background = clr;
		colorBox.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
	};

    Operator.prototype.initKeys = function(){
		var swatches = [];
		var swatchSize = 20;
		Operator.prototype.drawKeys = function(reset){
			var startX = 30, startY = 20, customCode = this.customCode;
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
			keyCtx.font = "20px sans-serif";
			keyCtx.lineWidth = 0.3;
			keyCtx.clearRect(0, 0, keyCanvas.width, keyCanvas.height);
			for(var i = 0; i < swatches.length; i++){
				if(startX > 350){
					startY += 35;
					startX = 30;
				}
				keyCtx.fillStyle = swatches[i].color;
				keyCtx.fillText(swatches[i].phoneme, startX + 25, startY + 18);
				keyCtx.fillRect(startX, startY, swatchSize, swatchSize);
				keyCtx.fillStyle = "#cccccc";
				keyCtx.strokeText(swatches[i].phoneme, startX + 25, startY + 18);
				keyCtx.strokeRect(startX, startY, swatchSize, swatchSize);
				swatches[i].position.x = startX + swatchSize / 2;
				swatches[i].position.y = startY + swatchSize / 2;
				startX += 65;
			}
		};
		Operator.prototype.updateKeyCanvas = function(x, y){
			var updateSwatch, code = this.customCode;
			for(var i = 0; i < swatches.length; i++){
				var swatch = swatches[i];
				if(Math.abs(swatch.position.x - x) < swatchSize / 2 + 10 && Math.abs(swatch.position.y - y) < swatchSize / 2 + 10){
					updateSwatch = swatch;
					break;
				}
			}
			if(updateSwatch){
				var startX = updateSwatch.position.x - swatchSize / 2;
				var startY = updateSwatch.position.y - swatchSize / 2;
				keyCtx.clearRect(startX - 5, startY - 5, 65, 35);
				keyCtx.fillStyle = colorBox.value;
				keyCtx.fillText(updateSwatch.phoneme, startX + 25, startY + 18);
				keyCtx.fillRect(startX, startY, swatchSize, swatchSize);
				keyCtx.fillStyle = "#cccccc";
				keyCtx.strokeText(swatches[i].phoneme, startX + 25, startY + 18);
				keyCtx.strokeRect(startX, startY, swatchSize, swatchSize);
				code[updateSwatch.key].color = colorBox.value;
				if(this.lastString){
					this.drawContent(this.lastString);
				}
				this.updateCube(updateSwatch.phoneme, colorBox.value);
			}
		};
	};
})();
