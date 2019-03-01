var parent, renderer, scene, camera, controls, composer, mesh, light, afterimagePass;
var params = {
  enable: true
};
var inititalYPos = 20

init();
createGUI();

animate();

function init() {

	// renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

  // camera
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
	camera.position.set( 0, 0, 35 );

	// scene
	scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

	// controls

	controls = new THREE.OrbitControls( camera );
    controls.minDistance = 10;
    controls.maxDistance = 50;

	// axes
	//scene.add( new THREE.AxisHelper( 20 ) );

  // geometry
  //var geometry = new THREE.BoxGeometry( 2, 2, 2 );
  var geometry = new THREE.SphereGeometry( 0.7, 12, 12 );

  // material
  // TODO: make white solid
  var material = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    wireframe: false
  } );

  // parent
  parent = new THREE.Object3D();
  scene.add( parent );

  // pivots
  var pivot1 = new THREE.Object3D();
  var pivot2 = new THREE.Object3D();
  var pivot3 = new THREE.Object3D();
  var pivot4 = new THREE.Object3D();
  var pivot5 = new THREE.Object3D();
  var pivot6 = new THREE.Object3D();
  var pivot7 = new THREE.Object3D();
  pivot1.rotation.z = 0;
  pivot2.rotation.z = 2 * Math.PI / 7;
  pivot3.rotation.z = 4 * Math.PI / 7;
  pivot4.rotation.z = 6 * Math.PI / 7;
  pivot5.rotation.z = 8 * Math.PI / 7;
  pivot6.rotation.z = 10 * Math.PI / 7;
  pivot7.rotation.z = 12 * Math.PI / 7;

  parent.add( pivot1 );
  parent.add( pivot2 );
  parent.add( pivot3 );
  parent.add( pivot4 );
  parent.add( pivot5 );
  parent.add( pivot6 );
  parent.add( pivot7 );

  // mesh
  var mesh1 = new THREE.Mesh( geometry, material );
  var mesh2 = new THREE.Mesh( geometry, material );
  var mesh3 = new THREE.Mesh( geometry, material );
  var mesh4 = new THREE.Mesh( geometry, material );
  var mesh5 = new THREE.Mesh( geometry, material );
  var mesh6 = new THREE.Mesh( geometry, material );
  var mesh7 = new THREE.Mesh( geometry, material );
  mesh1.position.y = 20;
  mesh2.position.y = 20;
  mesh3.position.y = 20;
  mesh4.position.y = 20;
  mesh5.position.y = 20;
  mesh6.position.y = 20;
  mesh7.position.y = 20;
  pivot1.add( mesh1 );
  pivot2.add( mesh2 );
  pivot3.add( mesh3 );
  pivot4.add( mesh4 );
  pivot5.add( mesh5 );
  pivot6.add( mesh6 );
  pivot7.add( mesh7 );

  parent.position.set(10, 0, 0);


  scene.add( new THREE.AmbientLight( 0x222222 ) );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );

  afterimagePass = new THREE.AfterimagePass();
  afterimagePass.renderToScreen = true;
  composer.addPass( afterimagePass );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );

}

function createGUI() {
  var gui = new dat.GUI( { name: 'Damp setting' } );
  gui.add( afterimagePass.uniforms[ "damp" ], 'value', 0, 1 ).step( 0.001 );
  gui.add( params, 'enable' );
}

function animate() {

	requestAnimationFrame( animate );
	parent.rotation.z += 0.06;
  parent.rotation.x += 0.02;

  parent.children[0].rotation.z -= 0.01
  parent.children[1].rotation.z -= 0.013
  parent.children[2].rotation.z -= 0.016
  parent.children[3].rotation.z -= 0.019
  parent.children[4].rotation.z -= 0.022
  parent.children[5].rotation.z -= 0.025
  parent.children[6].rotation.z -= 0.028

  if(inititalYPos > 5) {
    parent.children[0].children[0].position.y -= 0.15
    parent.children[1].children[0].position.y -= 0.15
    parent.children[2].children[0].position.y -= 0.15
    parent.children[3].children[0].position.y -= 0.15
    parent.children[4].children[0].position.y -= 0.15
    parent.children[5].children[0].position.y -= 0.15
    parent.children[6].children[0].position.y -= 0.15

    inititalYPos -= 0.15
    console.log(parent.children[0].position.y);
  }

	controls.update();

  if ( params.enable ) {
    composer.render();
  } else {
    renderer.render( scene, camera );
  }
}
