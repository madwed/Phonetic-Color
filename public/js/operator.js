"use strict";



function Operator () {
	//Scroll to the top of the page on refresh/ page-load.
	//Ensures everything renders correctly.
	window.scrollTo(0, 0);
	this.resetFuncs = [];
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
	var self = this;
	var postText = function () {
		var string = document.getElementById("text_field").value,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				self.lastString = xmlhttp.responseText;
				if(self.lastString){
					self.drawContent(self.lastString);
					self.tally(self.lastString);
					self.wordy(self.lastString);
				}
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
	var resizeHandler = function (event) {
		this.drawContent(this.lastString);
		this.resizeCubes();
		this.initKeys();
		this.drawKeys(true);	
	};
	keyClickHandler = keyClickHandler.bind(this);
	keyCanvas.addEventListener("click", keyClickHandler);
	resizeHandler = resizeHandler.bind(this);
	window.onresize = resizeHandler;

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
}

//Takes a hex color string or a code object
Operator.prototype.color = function (colorCode) {
	var code, customCode = this.customCode;
	//If the colorCode is a code object, set clone it to customCode
	if(typeof colorCode === "object"){
		customCode = JSON.parse(JSON.stringify(colorCode));
	}else{
		//Else loop over and assign each color to the color string
		for(code in customCode){
			customCode[code].color = colorCode;
		}
	}
	//Reset the keys
	this.drawKeys(true);
	//Reset the Cubes
	this.resetCubes();
	//If there is a lastString reset the content
	if(this.lastString){
		this.drawContent(this.lastString);
	}
}

