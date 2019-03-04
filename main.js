let renderer, scene, camera, composer, controls;
let cubeMesh, mesh;
let light;
let afterimagePass, glitchPass;

let params = {
  enable: false
};

let sphereDeltaY = 0.16
let rodDeltaY = 0.01
const stretchFactor = 1

initializeScene();
initializeObjects();
initializeShaders();
createGUI();
animate();

function initializeScene() {
  // renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);

  renderer.setSize(window.innerWidth / stretchFactor, window.innerHeight / stretchFactor);
  renderer.domElement.style.width = renderer.domElement.width * stretchFactor + 'px';
  renderer.domElement.style.height = renderer.domElement.height * stretchFactor + 'px';
  document.body.appendChild(renderer.domElement);

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

  window.addEventListener('resize', onWindowResize, false);
}

function initializeObjects() {
  // geometries
  var sphereGeometry = new THREE.SphereGeometry(0.6, 12, 12);
  var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 6);

  // materials
  var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x777777,
    wireframe: true
  });
  var solidMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false
  });

  //BG cube
  /*
  var cubeGeometry = new THREE.BoxGeometry(17, 17, 17);
  cubeMesh = new THREE.Mesh(cubeGeometry, wireframeMaterial);
  scene.add(cubeMesh)
  cubeMesh.position.set(-10, 0, 0)
  */
  createOrbitingObject(12, 12, cylinderGeometry, wireframeMaterial, -10)
  createOrbitingObject(7, 20, sphereGeometry, solidMaterial, 10)

  function createOrbitingObject(nrObjects, parentSpacing, geometry, material, xPosition) {
    parent = new THREE.Object3D();
    scene.add(parent)
    parent.position.set(xPosition, 0, 0)

    let zPos = 0
    for (let i = 0; i < nrObjects; i++) {
      let pivot = new THREE.Object3D();
      pivot.rotation.z = zPos * Math.PI / nrObjects;
      parent.add(pivot)

      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = parentSpacing;
      pivot.add(mesh);

      zPos += 2;
    }
  }
}

function initializeShaders() {
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  afterimagePass = new THREE.AfterimagePass();
  //afterimagePass.renderToScreen = true;
  composer.addPass(afterimagePass);

  glitchPass = new THREE.GlitchPass();
  glitchPass.renderToScreen = true;
  composer.addPass(glitchPass);
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
  //cubeMesh.rotation.z += 0.005;
  //cubeMesh.rotation.x += 0.005;
  let rodParent = scene.children[0]
  let sphereParent = scene.children[1]

  rodParent.rotation.y += 0.003

  for (var i = 0; i < rodParent.children.length; i++) {
    rodParent.children[i].children[0].rotation.y += 0.004
  }

  if (rodParent.children[0].children[0].position.y > 11) {
    for (var i = 0; i < rodParent.children.length; i++) {
      rodParent.children[i].children[0].position.y -= rodDeltaY
    }
  }

  sphereParent.rotation.z += 0.06;
  sphereParent.rotation.x += 0.02;

  let zRotation = 0.01
  for (var i = 0; i < sphereParent.children.length; i++) {
    sphereParent.children[i].rotation.z -= zRotation
    zRotation += 0.003
  }

  if (sphereParent.children[0].children[0].position.y > 5) {
    for (var i = 0; i < sphereParent.children.length; i++) {
      sphereParent.children[i].children[0].position.y -= sphereDeltaY
    }
  }

  if (sphereDeltaY > 0.06) {
    sphereDeltaY -= 0.001
  }

  controls.update();

  if (params.enable) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}
