
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 8, 8, 8 );


//Builds color cube
/*for(var x = 128; x < 256; x += 25){
	for(var y = 128; y < 256; y += 25){
		for(var z = 128; z < 256; z += 25){
			var color = new THREE.Color();
			color.setRGB(x / 255, y / 255, z / 255);
			console.log(color);
			var material = new THREE.MeshBasicMaterial( { color: color } );
			var cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
			cube.position.set(x, y, z);
		}
	}
}*/

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

var font = {
	size: 4,
	height: 3
};

for (vowel in vowels){
	var color = new THREE.Color();
	var letter = new THREE.TextGeometry(vowel, font);
	var phoneme = vowels[vowel];
	var roundness = Number.parseInt(phoneme[0]) / 5;
	var backness = Number.parseInt(phoneme[1]) / 10;
	var height = Number.parseInt(phoneme[2]) / 10;
	console.log(vowel, roundness, backness, height);
	color.setRGB(roundness, backness, height);
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var cube = new THREE.Mesh( geometry, material );
	var label = new THREE.Mesh(letter, material);
	scene.add( cube );
	scene.add(label);
	cube.position.set(roundness * 150, backness * 150, height * 150);
	label.position.set(roundness * 150 + 3, backness * 150 + 3, height * 150 + 3);
}

for (consonant in consonants){
	var color = new THREE.Color();
	var letter = new THREE.TextGeometry(consonant, font);
	var phoneme = consonants[consonant];
	var manner = Number.parseInt(phoneme[0]) / 10 + 0.3;
	var voicing = Number.parseInt(phoneme[1]) / 11.666 + 0.4;
	var place = Number.parseInt(phoneme[2]) / 14 + 0.5;
	console.log(consonant, manner, voicing, place);
	color.setRGB(manner, voicing, place);
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var cube = new THREE.Mesh( geometry, material );
	var label = new THREE.Mesh(letter, material);
	scene.add( cube );
	scene.add(label);
	cube.position.set(manner * 150, voicing * 150, place * 150);
	label.position.set(manner * 150 + 3, voicing * 150 + 3, place * 150 + 3);
}


camera.position.set(128, 128, 500);

var controls = new THREE.OrbitControls( camera );
controls.damping = 0.2;
controls.addEventListener( 'change', render );

var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
};

render();
