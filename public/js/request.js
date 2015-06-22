(function (){

	"use strict";
	var codeToColor = {
		a: "#000000", b: "#004c19", c: "#000033", d: "#330033", e: "#004c4c", f: "#004c33",
		g: "#003366", h: "#004c7f", i: "#33004c", j: "#331966", k: "#33007f", l: "#cc667f",
		m: "#b291c8", n: "#cc66b6", o: "#7f66a3", p: "#7f9191", q: "#cc66ec", r: "#7f7bff",
		s: "#b266c8", t: "#cc91ec", u: "#4c66b6", v: "#e5667f", w: "#e566b6", x: "#e566ec",
		y: "#cc917f", z: "#6666b6", A: "#9991b6", B: "#9991c8", C: "#cc91b6", D: "#6691a3",
		E: "#666691", F: "#4c667f", G: "#4c66da", H: "#7f66b6", I: "#7f66c8", J: "#ffffff"
	},
		submitButton = document.getElementById("submit"),
		canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");



	function draw (codeString) {
		var nemes = codeString.split("J");
		var color, phoWidth = 2, phoHeight = 8,
			margin = 40, rightMargin = canvas.width - margin - phoWidth,
			row = margin, col = margin / 4, spacing = 1,
			
			index, phoneme,
			phoLength = codeString.length;
		
		var canvHeight2 = nemes.reduce(function(prev, current){
			prev[1] += current.length * phoWidth;
			if(prev[1] > rightMargin){
				prev[1] = current.length * phoWidth + margin;
				prev[0] += 1;
			}
			prev[1] += phoWidth * 2;
			return prev;
		}, [1, 0]);
		canvHeight2 = (canvHeight2[0] * phoHeight) + (canvHeight2[0] - 1 * spacing) + col + col;

		canvas.height = canvHeight2;
		canvas.style.height = canvHeight2 + "px";


		for(index = 0; index < phoLength; index++){
			phoneme = codeString[index];
			color = codeToColor[phoneme];
			if(color === "#ffffff"){
				row += phoWidth * 2;
			}else{
				ctx.fillStyle = color;
				ctx.fillRect(row, col, phoWidth, phoHeight);
				row += phoWidth;
			}
			if(row > rightMargin){
				row = margin;
				col += phoHeight + spacing;
			}
		}
	}

	function postText() {
		var string = document.getElementById("text_field").value,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				draw(xmlhttp.responseText);
			}
		};
		xmlhttp.open("POST", "/submit", true);
		xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(string);
	}

	submitButton.addEventListener("click", postText);

})();
