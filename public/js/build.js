(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (Raphael) {
    Raphael.colorwheel = function (x, y, size, initcolor, element) {
        return new ColorWheel(x, y, size, initcolor, element);
    };
    var pi = Math.PI,
        doc = document,
        win = window,
        ColorWheel = function (x, y, size, initcolor, element) {
            size = size || 200;
            var w3 = 3 * size / 200,
                w1 = size / 200,
                fi = 1.6180339887,
                segments = pi * size / 5,
                size20 = size / 20,
                size2 = size / 2,
                padding = 2 * size / 200,
                t = this;

            var H = 1, S = 1, B = 1, s = size - (size20 * 4);
            var r = element ? Raphael(element, size, size) : Raphael(x, y, size, size),
                xy = s / 6 + size20 * 2 + padding,
                wh = s * 2 / 3 - padding * 2;
            w1 < 1 && (w1 = 1);
            w3 < 1 && (w3 = 1);


            // ring drawing
            var a = pi / 2 - pi * 2 / segments * 1.3,
                R = size2 - padding,
                R2 = size2 - padding - size20 * 2,
                path = ["M", size2, padding, "A", R, R, 0, 0, 1, R * Math.cos(a) + R + padding, R - R * Math.sin(a) + padding, "L", R2 * Math.cos(a) + R + padding, R - R2 * Math.sin(a) + padding, "A", R2, R2, 0, 0, 0, size2, padding + size20 * 2, "z"].join();
            for (var i = 0; i < segments; i++) {
                r.path(path).attr({
                    stroke: "none",
                    fill: "hsb(" + i * (255 / segments) / 255 + ", 1, 0.78)",
                    transform: "r" + [(360 / segments) * i, size2, size2]
                });
            }
            r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0", "M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                "stroke-width": w3,
                stroke: "#fff"
            });
            t.cursorhsb = r.set();
            var h = size20 * 2 + 2;
            t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding - 1, h / fi, h, 3 * size / 200).attr({
                stroke: "#000",
                opacity: .5,
                "stroke-width": w3
            }));
            t.cursorhsb.push(t.cursorhsb[0].clone().attr({
                stroke: "#fff",
                opacity: 1,
                "stroke-width": w1
            }));
            t.ring = r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                fill: "#000",
                opacity: 0,
                stroke: "none"
            });

            // rect drawing
            t.main = r.rect(xy, xy, wh, wh).attr({
                stroke: "none",
                fill: "#f00",
                opacity: 1
            });
            t.main.clone().attr({
                stroke: "none",
                fill: "0-#fff-#fff",
                opacity: 0
            });
            t.square = r.rect(xy - 1, xy - 1, wh + 2, wh + 2).attr({
                r: 2,
                stroke: "#fff",
                "stroke-width": w3,
                fill: "90-#000-#000",
                opacity: 0,
                cursor: "crosshair"
            });
            t.cursor = r.set();
            t.cursor.push(r.circle(size2, size2, size20 / 2).attr({
                stroke: "#000",
                opacity: .5,
                "stroke-width": w3
            }));
            t.cursor.push(t.cursor[0].clone().attr({
                stroke: "#fff",
                opacity: 1,
                "stroke-width": w1
            }));
            t.H = t.S = t.B = 1;
            t.raphael = r;
            t.size2 = size2;
            t.wh = wh;
            t.x = x;
            t.xy = xy;
            t.y = y;

            // events
            t.ring.drag(function (dx, dy, x, y) {
                t.docOnMove(dx, dy, x, y);
            }, function (x, y) {
                t.hsbOnTheMove = true;
                t.setH(x - t.x - t.size2, y - t.y - t.size2);
            }, function () {
                t.hsbOnTheMove = false;
            });
            t.square.drag(function (dx, dy, x, y) {
                t.docOnMove(dx, dy, x, y);
            }, function (x, y) {
                t.clrOnTheMove = true;
                t.setSB(x - t.x, y - t.y);
            }, function () {
                t.clrOnTheMove = false;
            });

            t.color(initcolor || "#f00");
            this.onchanged && this.onchanged(this.color());
        },
        proto = ColorWheel.prototype;
    proto.setH = function (x, y) {
        var d = Raphael.angle(x, y, 0, 0),
            rd = Raphael.rad(d);
        this.cursorhsb.attr({transform: "r" + [d + 90, this.size2, this.size2]});
        this.H = (d + 90) / 360;
        this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
        this.onchange && this.onchange(this.color());
    };
    proto.setSB = function (x, y) {
        var me = this;
        x < me.size2 - me.wh / 2 && (x = me.size2 - me.wh / 2);
        x > me.size2 + me.wh / 2 && (x = me.size2 + me.wh / 2);
        y < me.size2 - me.wh / 2 && (y = me.size2 - me.wh / 2);
        y > me.size2 + me.wh / 2 && (y = me.size2 + me.wh / 2);
        me.cursor.attr({cx: x, cy: y});
        me.B = 1 - (y - me.xy) / me.wh;
        me.S = (x - me.xy) / me.wh;
        me.onchange && me.onchange(me.color());
    };
    proto.docOnMove = function (dx, dy, x, y) {
        if (this.hsbOnTheMove) {
            this.setH(x - this.x - this.size2, y - this.y - this.size2);
        }
        if (this.clrOnTheMove) {
            this.setSB(x - this.x, y - this.y);
        }
    };
    proto.remove = function () {
        this.raphael.remove();
        this.color = function () {
            return false;
        };
    };
    proto.color = function (color) {
        if (color) {
            color = Raphael.color(color);
            var d = color.h * 360;
            this.H = color.h;
            this.S = color.s;
            this.B = color.v;
            this.cursorhsb.attr({transform: "r" + [d, this.size2, this.size2]});
            this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
            var x = this.S * this.wh + this.xy,
                y = (1 - this.B) * this.wh + this.xy;
            this.cursor.attr({cx: x, cy: y});
            return this;
        } else {
            return Raphael.hsb2rgb(this.H, this.S, this.B).hex;
        }
    };
})(window.Raphael);
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function () {

"use strict";

var cubeCanvas = document.getElementById("cubeCanvas"),
	cubeCol = document.getElementById("sizer"),
	mousePresent = false;

var calculateCubeCanvas = function () {
	cubeCanvas.width = cubeCol.clientWidth * 0.98;
	cubeCanvas.height = cubeCanvas.width * 2 / 3;
	cubeCanvas.style.height = cubeCanvas.height + "px";
	cubeCanvas.style.width = cubeCanvas.width + "px";
};
calculateCubeCanvas();

var vowels = {
	AA: [0, 0, 0], AE: [0, 3, 1], AH: [0, 0, 2], AO: [1, 0, 2], E: [0, 3, 3],
	EH: [0, 3, 2], IH: [0, 2, 4], IY: [0, 3, 5], O: [1, 0, 3], UH: [1, 1, 4],
	UW: [1, 0, 5]
};

var consonants = {
	B: [5, 0, 0], CH: [4, 2, 4], D: [5, 0, 3], DH: [2, 0, 2], F: [2, 2, 1],
	G: [5, 0, 6], HH: [2, 1, 7], JH: [4, 0, 4], K: [5, 2, 6], L: [0, 0, 3],
	M: [6, 0, 0], N: [6, 0, 3], NG: [6, 0, 6], P: [5, 2, 0], R: [1, 0, 3],
	S: [3, 2, 3], SH: [3, 2, 4], T: [5, 2, 3], TH: [1, 2, 2], V: [1, 0, 1],
	W: [0, 0, 0], Y: [0, 0, 5], Z: [2, 0, 3], ZH: [2, 0, 4]
};

var font = {
	size: 4,
	height: 1
};

var scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera( 20, cubeCanvas.width / cubeCanvas.height, 0.1, 1000 ),
	cubeGeometry = new THREE.BoxGeometry( 8, 8, 8 ),
	labels = new THREE.Object3D(),
	boxColor = new THREE.Color(),
	labelMaterial = new THREE.MeshBasicMaterial({color: 0x000000}),
	labelOffset = 4,
	scale = 150,
	gray = parseInt("999999", 16);

var axisMaterial = new THREE.LineBasicMaterial({ color: gray});
var vOrgVal = -0.06 * scale;
// vowelAxes
var vOrg = new THREE.Vector3(vOrgVal, vOrgVal, vOrgVal);

var vx = new THREE.Geometry();
var vxEnd = new THREE.Vector3(0.25 * scale, vOrgVal, vOrgVal);
vx.vertices.push(vOrg, vxEnd);
scene.add(new THREE.Line(vx, axisMaterial));

var vy = new THREE.Geometry();
var vyEnd = new THREE.Vector3(vOrgVal, 0.35 * scale, vOrgVal);
vy.vertices.push(vOrg, vyEnd);
scene.add(new THREE.Line(vy, axisMaterial));

var vz = new THREE.Geometry();
var vzEnd = new THREE.Vector3(vOrgVal, vOrgVal, 0.55 * scale)
vz.vertices.push(vOrg, vzEnd);
scene.add(new THREE.Line(vz, axisMaterial));

// consonantAxes
var xOrg = 0.24 * scale, yOrg = 0.34 * scale, zOrg = 0.44 * scale;
var cOrg = new THREE.Vector3(xOrg, yOrg, zOrg);

var cx = new THREE.Geometry();
var cxEnd = new THREE.Vector3(0.95 * scale, yOrg, zOrg);
cx.vertices.push(cOrg, cxEnd);
scene.add(new THREE.Line(cx, axisMaterial));

var cy = new THREE.Geometry();
var cyEnd = new THREE.Vector3(xOrg, 0.65 * scale, zOrg);
cy.vertices.push(cOrg, cyEnd);
scene.add(new THREE.Line(cy, axisMaterial));

var cz = new THREE.Geometry();
var czEnd = new THREE.Vector3(xOrg, yOrg, 1.05 * scale);
cz.vertices.push(cOrg, czEnd);
scene.add(new THREE.Line(cz, axisMaterial));
// vowelLabels
//Roundness, Backness, Height
var rx = new THREE.TextGeometry("Roundness", font);
var rLabel = new THREE.Mesh(rx, axisMaterial);
rLabel.position.copy(vxEnd);
labels.add(rLabel);
var by = new THREE.TextGeometry("Backness", font);
var bLabel = new THREE.Mesh(by, axisMaterial);
bLabel.position.copy(vyEnd);
labels.add(bLabel);
var hz = new THREE.TextGeometry("Height", font);
var hLabel = new THREE.Mesh(hz, axisMaterial);
hLabel.position.copy(vzEnd);
labels.add(hLabel);
// consonantLabels
//Manner, Voicing, Place
var mx = new THREE.TextGeometry("Manner", font);
var mLabel = new THREE.Mesh(mx, axisMaterial);
mLabel.position.copy(cxEnd);
labels.add(mLabel);
var voicey = new THREE.TextGeometry("Voicing", font);
var vLabel = new THREE.Mesh(voicey, axisMaterial);
vLabel.position.copy(cyEnd);
labels.add(vLabel);
var pz = new THREE.TextGeometry("Place", font);
var pLabel = new THREE.Mesh(pz, axisMaterial);
pLabel.position.copy(czEnd);
labels.add(pLabel);


var vowelScaler = function (phoneme) {
	var roundness = phoneme[0] / 5,
		backness = phoneme[1] / 10,
		height = phoneme[2] / 10,
		axes = [roundness, backness, height];
		return axes;
};

var consonantScaler = function (phoneme) {
	var manner = phoneme[0] / 10 + 0.3,
		voicing = phoneme[1] / 11.666 + 0.4,
		place = phoneme[2] / 14 + 0.5,
		axes = [manner, voicing, place];
		return axes;
};

var cubes = {};
var addToModel = function (phonemes, scaler) {
	var neme;
	for (neme in phonemes) {
		var letter = new THREE.TextGeometry(neme, font);
		var phoneme = scaler(phonemes[neme]);
		//Scale the roundness, backness and height of each vowel to fit the RGB scale of 0.0-1.0
		boxColor.setRGB(phoneme[0], phoneme[1], phoneme[2]);
		//Create the cube and label
		var material = new THREE.MeshBasicMaterial( { color: boxColor } );
		var cube = new THREE.Mesh( cubeGeometry, material );
		var cubeFrame = new THREE.BoxHelper(cube);
		cubeFrame.material.color.setHex(gray);
		var label = new THREE.Mesh(letter, labelMaterial);

		scene.add( cube );
		scene.add( cubeFrame );
		labels.add(label);

		//Set the position of each cube and label
		cube.position.set(phoneme[0] * scale, phoneme[1] * scale, phoneme[2] * scale);
		cubeFrame.position.set(phoneme[0] * scale, phoneme[1] * scale, phoneme[2] * scale);
		label.position.set(phoneme[0] * scale + labelOffset, phoneme[1] * scale + labelOffset, phoneme[2] * scale + labelOffset);

		cubes[neme] = {cube: cube};
	}
};

addToModel(vowels, vowelScaler);
addToModel(consonants, consonantScaler);
scene.add(labels);

var renderer = new THREE.WebGLRenderer({canvas: cubeCanvas, antialias: true, alpha: true, precision: "highp"});
renderer.setSize(cubeCanvas.width, cubeCanvas.height);
var render = function (force) {
	if(!mousePresent && !force) { return; }
	var labelRotate = labels.children;
	for(var i = 0; i < labelRotate.length; i++) {
		labelRotate[i].lookAt(camera.position);
	}
	renderer.render(scene, camera);
};

var controls = new THREE.OrbitControls(camera, cubeCanvas);
controls.damping = 0.2;
controls.addEventListener( "change", render );

camera.position.set(-213, 406, 289);
camera.lookAt(new THREE.Vector3(60, 60, 80));

render(true);

var startRender = function () {
	mousePresent = true;
};
var stopRender = function () {
	mousePresent = false;
};

cubeCanvas.addEventListener("mousedown", startRender);
cubeCanvas.addEventListener("mousemove", render);
cubeCanvas.addEventListener("mouseup", stopRender);
cubeCanvas.addEventListener("touchstart", startRender);
cubeCanvas.addEventListener("touchmove", render);
cubeCanvas.addEventListener("touchend", stopRender);

var addCubeProto = function (operator) {

	operator.prototype.resizeCubes = function () {
		calculateCubeCanvas();
		renderer.setSize( cubeCanvas.width, cubeCanvas.height );
		render(true);
	};

	operator.prototype.renderCubes = function () {
		render(true);
	};

	operator.prototype.updateCube = function (phoneme, color) {
		cubes[phoneme].cube.material.color = new THREE.Color(color);
		render(true);
	};

	operator.prototype.resetCubes = function () {
		var customCode = this.customCode;
		Object.keys(customCode).forEach(function (code) {
			var phoneme = customCode[code];
			cubes[phoneme.phoneme].cube.material.color = new THREE.Color(phoneme.color);
		});
		render(true);
	};
};

module.exports = addCubeProto;

})();

},{}],4:[function(require,module,exports){
(function () {

"use strict";

var frequencyBox = document.getElementById("frequency");

module.exports = function (operator) {

operator.prototype.tally = function (string) {
	var count = {}, letter;
	for(var i = 0; i < string.length; i++) {
		letter = string[i];
		if(!count[letter]) {
			count[letter] = 1;
		}else {
			count[letter] += 1;
		}
	}
	var phonemes = Object.keys(count);
	var frequency = [], phone;
	for(var neme = 0; neme < phonemes.length; neme++) {
		phone = phonemes[neme];
		if(phone === "J" || phone === "K") {
			continue;
		}
		frequency.push([this.customCode[phone].phoneme, count[phone]]);
	}
	frequency.sort(function (a, b) {
		return a[1] > b[1] ? -1 : 1;
	});
	if(frequencyBox.children.length > 1) {
		frequencyBox.children[1].remove();
	}
	var freqHolder = document.createElement("div");
	for(var j = 0; j < frequency.length; j++) {
		var phonCount = document.createElement("div");
		phonCount.innerHTML = frequency[j].join(": ");
		phonCount.setAttribute("class", "frequencyContent");
		freqHolder.appendChild(phonCount);
	}

	frequencyBox.appendChild(freqHolder);
};
};

})();

},{}],5:[function(require,module,exports){
(function () {

"use strict";
require("./colorwheel.js");

//Get the keyCanvas, keyCtx, column containing the canvas
var keyCanvas = document.getElementById("keyCanvas"),
	keyCtx = keyCanvas.getContext("2d"),
	cubeCol = document.getElementById("sizer"),
	colorBox = document.getElementById("color"),
//Set up the Raphael Regex
	reg = /^#(.)\1(.)\2(.)\3$/;
//Set the color box value on the first run
colorBox.value = "#655555";


var addKeyProto = function (operator) {
	operator.prototype.initKeys = function () {
		//Calculate the width and height of the keyCanvas
		keyCanvas.width = cubeCol.clientWidth * 0.925;
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
		this.cp = Raphael.colorwheel(keyRect.right - scale * 3 / 5, keyRect.bottom - scale * 7 / 6, scale, colorBox.value);
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
		operator.prototype.drawKeys = function (reset) {
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
		operator.prototype.updateKeyCanvas = function (x, y) {
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
				this.drawContent(this.lastString);
				this.updateCube(updateSwatch.phoneme, colorBox.value);
			}
		};
	};
};

module.exports = addKeyProto;

})();

},{"./colorwheel.js":1}],6:[function(require,module,exports){

"use strict";


function Operator () {
	//Scroll to the top of the page on refresh/ page-load.
	//Ensures everything renders correctly.
	window.scrollTo(0, 0);
	//Preset codes
	this.defaultCode = {
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
	};
	this.hslCode = {
		a: {phoneme: "AA", color: "#000000"}, b: {phoneme: "AE", color: "#221010"}, c: {phoneme: "AH", color: "#382d2d"},
		d: {phoneme: "AO", color: "#38382d"}, e: {phoneme: "E", color: "#673131"}, f: {phoneme: "EH", color: "#442121"},
		g: {phoneme: "IH", color: "#814a4a"}, h: {phoneme: "IY", color: "#ac5252"}, i: {phoneme: "O", color: "#545444"},
		j: {phoneme: "UH", color: "#787853"}, k: {phoneme: "UW", color: "#8c8c72"}, l: {phoneme: "B", color: "#683299"},
		m: {phoneme: "CH", color: "#797be4"}, n: {phoneme: "D", color: "#9f6bcd"}, o: {phoneme: "DH", color: "#50c4b7"},
		p: {phoneme: "F", color: "#27c8b7"}, q: {phoneme: "G", color: "#d4bde9"}, r: {phoneme: "HH", color: "#b9e4e9"},
		s: {phoneme: "JH", color: "#8688d6"}, t: {phoneme: "K", color: "#d4b5f0"}, u: {phoneme: "L", color: "#7fcd6b"},
		v: {phoneme: "M", color: "#993291"}, w: {phoneme: "N", color: "#cd6bc6"}, x: {phoneme: "NG", color: "#e9bde5"},
		y: {phoneme: "P", color: "#6921aa"}, z: {phoneme: "R", color: "#6bcd8d"}, A: {phoneme: "S", color: "#5aa5de"},
		B: {phoneme: "SH", color: "#79b5e4"}, C: {phoneme: "T", color: "#a05ade"}, D: {phoneme: "TH", color: "#3cd872"},
		E: {phoneme: "V", color: "#3cb465"}, F: {phoneme: "W", color: "#479932"}, G: {phoneme: "Y", color: "#aee0a2"},
		H: {phoneme: "Z", color: "#6bcdc3"}, I: {phoneme: "ZH", color: "#86d6ce"}

	};
	//Clone the defaultCode
	this.customCode = JSON.parse(JSON.stringify(this.defaultCode));
	this.lastString = "";
	var submitButton = document.getElementById("submit"),
		keyCanvas = document.getElementById("keyCanvas");
	document.getElementById("text_field").innerHTML = "The old man was thin and gaunt with deep wrinkles in the back of his neck. The brown blotches of the benevolent skin cancer the sun brings from its reflection on the tropic sea were on his cheeks. The blotches ran well down the sides of his face and his hands had the deep-creased scars from handling heavy fish on the cords. But none of these scars were fresh. They were as old as erosions in a fishless desert.\n\nEverything about him was old except his eyes and they were the same color as the sea and were cheerful and undefeated.";
	var self = this;
	var postText = function () {
		var string = document.getElementById("text_field").value,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				self.lastString = xmlhttp.responseText;
				self.drawContent(self.lastString);
				self.tally(self.lastString);
				self.wordy(self.lastString);
			}
		};
		xmlhttp.open("POST", "/submit", true);
		xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(string);
	};
	postText.bind(this);
	submitButton.addEventListener("mousedown", postText);

	var keyClickHandler = function (event) {
		event.preventDefault();

		event = event || window.event; // IE-ism

		//Doesn't support old IE
		var rect = keyCanvas.getBoundingClientRect();
		var x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * keyCanvas.width);
		var y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * keyCanvas.height);
		this.updateKeyCanvas(x, y);
		this.renderCubes();
	};
	var resizeHandler = function () {
		this.drawContent(this.lastString);
		this.resizeCubes();
		this.initKeys();
		this.drawKeys(true);
	};
	keyClickHandler = keyClickHandler.bind(this);
	keyCanvas.addEventListener("click", keyClickHandler);
	resizeHandler = resizeHandler.bind(this);
	window.onresize = resizeHandler;

	//Button set up
	var rgbButton = document.getElementById("rgb"),
		hslButton = document.getElementById("hsl"),
		blackButton = document.getElementById("black"),
		whiteButton = document.getElementById("white");
	rgbButton.addEventListener("click", this.color.bind(this, this.defaultCode));
	hslButton.addEventListener("click", this.color.bind(this, this.hslCode));
	blackButton.addEventListener("click", this.color.bind(this, "#000000"));
	whiteButton.addEventListener("click", this.color.bind(this, "#ffffff"));

	this.initKeys();
	this.drawKeys(true);
	this.drawContent("");
}

//Takes a hex color string or a code object
Operator.prototype.color = function (colorCode) {
	//If the colorCode is a code object, set clone it to customCode
	if(typeof colorCode === "object") {
		this.customCode = JSON.parse(JSON.stringify(colorCode));
	}else {
		var code, customCode = this.customCode;
		//Else loop over and assign each color to the color string
		for(code in customCode) {
			customCode[code].color = colorCode;
		}
	}
	//Reset the keys
	this.drawKeys(true);
	//Reset the Cubes
	this.resetCubes();
	//If there is a lastString reset the content
	this.drawContent(this.lastString);
};

require("./contentCanvas")(Operator);
require("./keyCanvas")(Operator);
require("./cubeCanvas")(Operator);
require("./frequency")(Operator);

module.exports = Operator;


},{"./contentCanvas":2,"./cubeCanvas":3,"./frequency":4,"./keyCanvas":5}],7:[function(require,module,exports){
"use strict";

var Operator = require("./operator.js");
console.log(Operator, Operator.prototype);

//Set the window to the top so the page will load correctly (for refreshing)
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};



//Starts the program
(function () {
	//Sad little function to fix safari webgl rendering issue
	var browserDetection = function () {
		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
			return;
		} else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			document.getElementById("cubeCanvas").style.borderRadius = "0px";
		}
	};
	browserDetection();
	var operator = new Operator();
}());
},{"./operator.js":6}]},{},[7]);
