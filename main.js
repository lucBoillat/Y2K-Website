var parent, cubeMesh, renderer, scene, camera, controls, composer, mesh, light, afterimagePass, glitchPass;
var params = {
  enable: true
};
var easeConst = 0.16
const stretchFactor = 4

init();
createGUI();
animate();

function init() {

  // renderer
  renderer = new THREE.WebGLRenderer( {alpha: true});
  renderer.setClearColor( 0x000000, 0 );

  renderer.setSize(window.innerWidth / stretchFactor, window.innerHeight / stretchFactor);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.width = renderer.domElement.width * stretchFactor + 'px';
  renderer.domElement.style.height = renderer.domElement.height * stretchFactor + 'px';

  // camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 0, 35);

  // scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 1000);

  // controls

  controls = new THREE.OrbitControls(camera);
  controls.minDistance = 10;
  controls.maxDistance = 50;

  // axes
  //scene.add( new THREE.AxisHelper( 20 ) );

  // geometry
  var geometry = new THREE.SphereGeometry(0.6, 12, 12);

  // material
  var materialCube = new THREE.MeshBasicMaterial({
    color: 0x777777,
    wireframe: true
  });
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false
  });

  //BG cube
  var cubeGeometry = new THREE.BoxGeometry(17, 17, 17);
  cubeMesh = new THREE.Mesh(cubeGeometry, materialCube);
  scene.add(cubeMesh)
  cubeMesh.position.set(-10, 0, 0)

  // parent
  parent = new THREE.Object3D();
  scene.add(parent);
  parent.position.set(10, 0, 0);


  //create spheres and add to parent
  let zPos = 0
  for (let i = 0; i < 7; i++) {
    let pivot = new THREE.Object3D();
    pivot.rotation.z = zPos * Math.PI / 7;
    parent.add(pivot)

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 20;
    pivot.add(mesh);

    zPos += 2;
  }

  //Post Processing
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  afterimagePass = new THREE.AfterimagePass();
  //afterimagePass.renderToScreen = true;
  composer.addPass(afterimagePass);

  glitchPass = new THREE.GlitchPass();
  glitchPass.renderToScreen = true;
  composer.addPass(glitchPass);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  // TODO: scale on resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / stretchFactor, window.innerHeight / stretchFactor);
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.width = renderer.domElement.width * stretchFactor + 'px';
  renderer.domElement.style.height = renderer.domElement.height * stretchFactor + 'px';

}

function createGUI() {
  var gui = new dat.GUI({
    name: 'Damp setting'
  });
  gui.add(afterimagePass.uniforms["damp"], 'value', 0, 1).step(0.001);
  gui.add(params, 'enable');
}

function animate() {

  requestAnimationFrame(animate);
  cubeMesh.rotation.z += 0.005;
  cubeMesh.rotation.x += 0.005;
  parent.rotation.z += 0.06;
  parent.rotation.x += 0.02;

  parent.children[0].rotation.z -= 0.01
  parent.children[1].rotation.z -= 0.013
  parent.children[2].rotation.z -= 0.016
  parent.children[3].rotation.z -= 0.019
  parent.children[4].rotation.z -= 0.022
  parent.children[5].rotation.z -= 0.025
  parent.children[6].rotation.z -= 0.028

  if (parent.children[0].children[0].position.y > 5) {
    parent.children[0].children[0].position.y -= easeConst
    parent.children[1].children[0].position.y -= easeConst
    parent.children[2].children[0].position.y -= easeConst
    parent.children[3].children[0].position.y -= easeConst
    parent.children[4].children[0].position.y -= easeConst
    parent.children[5].children[0].position.y -= easeConst
    parent.children[6].children[0].position.y -= easeConst

  }

  if (easeConst > 0.06) {
    easeConst -= 0.001
  }
  //console.log(easeConst);
  //console.log(parent.children[0].children[0].position.y);

  controls.update();

  if (params.enable) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}
