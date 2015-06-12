
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

var vowels = { 
	AA: [ '0', '0', '0' ],
	AE: [ '0', '3', '1' ],
	AH: [ '0', '0', '2' ],
	AO: [ '1', '0', '2' ],
	e: [ '0', '3', '3' ],
	EH: [ '0', '3', '2' ],
	IH: [ '0', '2', '4' ],
	IY: [ '0', '3', '5' ],
	o: [ '1', '0', '3' ],
	UH: [ '1', '1', '4' ],
	UW: [ '1', '0', '5' ] 
};

var consonants = { 
	B: [ '5', '0', '0' ],
	CH: [ '4', '2', '4' ],
	D: [ '5', '0', '3' ],
	DH: [ '2', '0', '2' ],
	F: [ '2', '2', '1' ],
	G: [ '5', '0', '6' ],
	HH: [ '2', '1', '7' ],
	JH: [ '4', '0', '4' ],
	K: [ '5', '2', '6' ],
	L: [ '0', '0', '3' ],
	M: [ '6', '0', '0' ],
	N: [ '6', '0', '3' ],
	NG: [ '6', '0', '6' ],
	P: [ '5', '2', '0' ],
	R: [ '1', '0', '3' ],
	S: [ '3', '2', '3' ],
	SH: [ '3', '2', '4' ],
	T: [ '5', '2', '3' ],
	TH: [ '1', '2', '2' ],
	V: [ '1', '0', '1' ],
	W: [ '0', '0', '0' ],
	Y: [ '0', '0', '5' ],
	Z: [ '2', '0', '3' ],
	ZH: [ '2', '0', '4' ] 
};

var cubeGeometry = new THREE.BoxGeometry( 8, 8, 8 );
var labels = new THREE.Object3D();


//Builds color cube
/*for(var x = 128; x < 256; x += 25){
	for(var y = 128; y < 256; y += 25){
		for(var z = 128; z < 256; z += 25){
			var color = new THREE.Color();
			color.setRGB(x / 255, y / 255, z / 255);
			console.log(color);
			var material = new THREE.MeshBasicMaterial( { color: color } );
			var cube = new THREE.Mesh( cubeGeometry, material );
			scene.add( cube );
			cube.position.set(x, y, z);
		}
	}
}*/

var font = {
	size: 4,
	height: 1
};

var color = new THREE.Color();
var labelMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
var letter, phoneme;
var labelOffset = 4;
var scale = 150;

for (vowel in vowels){
	letter = new THREE.TextGeometry(vowel, font);
	phoneme = vowels[vowel];
	//Scale the roundness, backness and height of each vowel to fit the RGB scale of 0.0-1.0
	var roundness = Number.parseInt(phoneme[0]) / 5;
	var backness = Number.parseInt(phoneme[1]) / 10;
	var height = Number.parseInt(phoneme[2]) / 10;
	color.setRGB(roundness, backness, height);
	//Create the cube and label
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var cube = new THREE.Mesh( cubeGeometry, material );
	var label = new THREE.Mesh(letter, labelMaterial);
	scene.add( cube );
	labels.add(label);
	//Set the position of each cube and label
	cube.position.set(roundness * scale, backness * scale, height * scale);
	label.position.set(roundness * scale + labelOffset, backness * scale + labelOffset, height * scale + labelOffset);
	//Build and position the outline of each label
	var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
	var outlineMesh = new THREE.Mesh( letter, outlineMaterial1 );
	outlineMesh.position.set(roundness * scale + labelOffset, backness * scale + labelOffset, height * scale + labelOffset);
	outlineMesh.scale.multiplyScalar(1.07);
	labels.add( outlineMesh );
}

for (consonant in consonants){
	letter = new THREE.TextGeometry(consonant, font);
	phoneme = consonants[consonant];
	//Scale the manner, voicing and place of each consonant to fit the RGB scale of 0.0-1.0
	var manner = Number.parseInt(phoneme[0]) / 10 + 0.3;
	var voicing = Number.parseInt(phoneme[1]) / 11.666 + 0.4;
	var place = Number.parseInt(phoneme[2]) / 14 + 0.5;
	color.setRGB(manner, voicing, place);
	//Create the cube and label
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var cube = new THREE.Mesh( cubeGeometry, material );
	var label = new THREE.Mesh(letter, labelMaterial);
	scene.add( cube );
	labels.add(label);
	//Set the position of each cube and label
	cube.position.set(manner * scale, voicing * scale, place * scale);
	label.position.set(manner * scale + labelOffset, voicing * scale + labelOffset, place * scale + labelOffset);
	//Build and position the outline of each label
	var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
	var outlineMesh = new THREE.Mesh( letter, outlineMaterial1 );
	outlineMesh.position.set(manner * scale + labelOffset, voicing * scale + labelOffset, place * scale + labelOffset);
	outlineMesh.scale.multiplyScalar(1.07);
	labels.add( outlineMesh );
}

scene.add(labels);


camera.position.set(128, 128, 500);


var controls = new THREE.OrbitControls( camera );
controls.damping = 0.2;
controls.addEventListener( 'change', render );

var render = function () {
	requestAnimationFrame( render );
	camera.lookAt(new THREE.Vector3(75, 75, 75));
	var labelRotate = labels.children;	
	for(var i = 0; i < labelRotate.length; i++){
		labelRotate[i].lookAt(camera.position);
	}
	renderer.render(scene, camera);
};

render();
