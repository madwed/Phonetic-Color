"use strict";



function Operator () {
	//Phoneme, color, 3D reference
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
	};
	this.initKeys();
	keyClickHandler = keyClickHandler.bind(this);
	keyCanvas.addEventListener("click", keyClickHandler);
	var defaultButton = document.getElementById("default");
	defaultButton.addEventListener("click", this.reset.bind(this));

}

Operator.prototype.reset = function () {
	this.customCode = JSON.parse(JSON.stringify(this.defaultCode));
	this.drawKeys();
	this.drawContent(this.lastString);
	this.resetCubes();
};


