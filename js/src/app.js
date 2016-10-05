

var width = 500, height = 600;
var aspect = width/height; 

var scene, camera, controls, renderer, clock, loader;

var material, robot;
var upper_body, lower_body, head, trunk, l_arm, r_arm, stanchion, base;
var l_arm_socket, r_arm_socket, eye1;

var tickFunc;

init();
animate();

// *************** Add Objects to the Scene *************************

function addObjectstoWorld(){

	// make a clock
	clock = new THREE.Clock();

	// Create a scene 
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( "#3f7b9d", 0.002 );

	// Load a texture
	loader = new THREE.TextureLoader();
	// load a resource
	var robot_texture = loader.load('data/textures/Rusty_Metal_Steel_Texture.jpg');

	// Add Material and FlatShading
	material =  new THREE.MeshPhongMaterial( { color:"#2a96cd", map: robot_texture, specular: "#111111", emissive: "#000000", shininess: 25, shading: THREE.SmoothShading, vertexColors: THREE.FaceColors } );	/** Make the Base object for the Robot **/ 
	eye_material = new THREE.MeshBasicMaterial( { color: "#000000", opacity: 0.8, shading: THREE.SmoothShading } )



	robot = new THREE.Object3D(); 
	robot.position.set(0, 1, 0)

	// Add Velocity vector to robot ! 
	robot.velocity = new THREE.Vector3(-Math.random(), 0, 0)

	//console.log(robot.velocity)

	/** Make Upper Body **/  
	
	// Container for the upper body parts 
	upper_body = new THREE.Object3D();

	// Add Head 
	head = new THREE.Mesh(new THREE.BoxGeometry( 0.6, 0.6, 0.6, 2, 2, 2 ), material);
	head.position.set(0, 0.8, 0)

	eye1 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 0.1, 0.1, 2, 2, 2 ), eye_material)
	eye1.position.set(0.1, 0.1, 0.28)

	eye2 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 0.1, 0.1, 2, 2, 2 ), eye_material)
	eye2.position.set(-0.1, 0.1, 0.28)

	head.add(eye1)
	head.add(eye2)

	// Add trunk
	trunk = new THREE.Mesh(new THREE.BoxGeometry( 1.2, 2, 1.2, 2, 2, 2 ), material);
	trunk.position.set(0, -0.5, 0)

	// Add left and right Arms
	l_arm = new THREE.Mesh(new THREE.BoxGeometry( 0.2, 1.5, 0.2, 2, 2, 2 ), material);
	l_arm.position.set(0, -0.5, 0)
	l_arm_socket = new THREE.Object3D();
	l_arm_socket.position.set(-0.7, -0.0, 0)
	l_arm_socket.rotation.x = degree2radians(-45);

	l_arm_socket.add(l_arm) 
	
	r_arm = new THREE.Mesh(new THREE.BoxGeometry( 0.2, 1.5, 0.2, 2, 2, 2 ), material);
	r_arm.position.set(0, -0.5, 0)
	r_arm_socket = new THREE.Object3D();
	r_arm_socket.position.set(0.7, -0.0, 0)
	r_arm_socket.rotation.x = degree2radians(0); 

	r_arm_socket.add(r_arm)


	// Append upper body parts to the container 
	upper_body.add(head)
	upper_body.add(trunk)
	upper_body.add(l_arm_socket)
	upper_body.add(r_arm_socket)

	/** Make Lower Body **/  

	lower_body = new THREE.Object3D();

	// Add Stanchion and base 
	stanchion = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.12, 1.5, 32 ), material);
	stanchion.position.set(0, -2.2, 0);

	base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), material);
	base.position.set(0, -3, 0)

	// Add the lower body parts to the container 
	lower_body.add(stanchion)
	lower_body.add(base)


	/** Add the upper body and lower body to the Base container **/ 

	robot.add(upper_body)
	robot.add(lower_body)

	robot.updateMatrix();
	robot.matrixAutoUpdate = false;

	// create a velocity vector
	robot.velocity = new THREE.Vector3(0, -Math.random(), 0);  

	//Add the robot to the scene
	scene.add(robot)


}

// *************** End of adding Objects to the Scene *************************


// **************** Rendering the Scene ***************************

function init()
{
	// Parameters are (field of view, aspect ratio, near clipping from camera, far clipping from camera) 
	camera = new THREE.PerspectiveCamera( 75, aspect, 1, 1000 );
	// Move the camera elsewhere from the center
	camera.position.z = 5;
	camera.position.x = -2;
	camera.position.y = 1.5;

	// Add controls 
	controls = new THREE.TrackballControls( camera, container );
	controls.rotateSpeed = 2.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];

	controls.addEventListener( 'change', render );

	addObjectstoWorld();

	// Lights 
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0.5, 0.5, 1 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -4, -4, -1 );
	scene.add( light );
	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	// Let's render
	renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize( width, height );
	renderer.setViewport(10, -20, width + 10, height - 20)
	
	container = document.getElementById( 'canvas' );
	document.body.appendChild( container );

	container.appendChild( renderer.domElement );
	// render();
	//tickFunc = getDataStream( d3.range(50).map(d => (Math.random() * 0.6446018366025527) -0.8553981633974483 ) )
}

function degree2radians(degree){
	return degree * (Math.PI / 180); 
}

var delta = 0;
var swap = true;
var delta2 = 0;

//var minMax = [-0.8553981633974483, 0.6446018366025527];

function animate() {

	requestAnimationFrame( animate );
	render();

	// Rotate Robot arms 
	delta += clock.getDelta();
	delta2 += clock.getDelta();
	
	if (delta >= 2.5) { 
		swap = !swap 
		delta = 0 
	}

	l_arm_socket.rotation.x += swap? 0.01: -0.01 
	r_arm_socket.rotation.x += swap? -0.01: 0.01 
	upper_body.rotation.x += swap? 0.002 : -0.002

	//console.log(l_arm_socket.rotation.x)

	//if(delta2 >= 1){
	//	tickFunc(l_arm_socket.rotation.x); 	
	//	delta2 = 0;
	//}

	//robot_position = robot.position.set(Math.random(), Math.random(), 0)
	//console.log(robot_position); 
	
	controls.update();
}

function update(){

	// update the velocity with a splat of randomniz
    robot.velocity.x -= Math.random() * 0.1; 
    console.log(robot.velocity.x)
}


function render() {
	//requestAnimationFrame( render );

	renderer.render( scene, camera );
}





