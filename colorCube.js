
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 10, 10, 10 );

for(var x = 128; x < 256; x += 25){
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
