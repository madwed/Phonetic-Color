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
	gray = parseInt("cccccc", 16);

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

Operator.prototype.resizeCubes = function () {
	calculateCubeCanvas();
	renderer.setSize( cubeCanvas.width, cubeCanvas.height );
	render(true);
};

Operator.prototype.renderCubes = function () {
	render(true);
};

Operator.prototype.updateCube = function (phoneme, color) {
	cubes[phoneme].cube.material.color = new THREE.Color(color);
	render(true);
};

Operator.prototype.resetCubes = function () {
	var customCode = this.customCode;
	Object.keys(customCode).forEach(function (code) {
		var phoneme = customCode[code];
		cubes[phoneme.phoneme].cube.material.color = new THREE.Color(phoneme.color);
	});
	render(true);
};

})();
