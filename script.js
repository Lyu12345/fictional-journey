import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

const light1 = new THREE.DirectionalLight(0xefefff, 3);
light1.position.set(1, 1, 1).normalize();
scene.add(light1);

const orbCtrl = new OrbitControls(camera, renderer.domElement);
orbCtrl.target.set(0, 0.5, 0);
orbCtrl.update();

const grid = new THREE.GridHelper(5000, 1000, 0x000000, 0x000000);
grid.position.y = 0;
grid.material.transparent = true;
grid.material.opacity = 0.3;
scene.add(grid);

const loader = new GLTFLoader();
let mixer;
// let model;
// let modelA, modelB, modelC;
let modelA, modelB, modelC, modelD;
const modelAPos = { x: 0, y: 0, z: 0 };
const modelARot = { y: 0 }; 
const modelBPos = { x: 0, y: 0.945, z: -0.14 };
const modelBRot = { x: 0 };
const modelCPos = { x: 0, y: 0.882 , z: 0.4515 };
const modelCRot = { x: 0 };
const modelDPos = { x: 0, y: 0 , z: -1.3 };
const modelDRot = { x: 0 };

loader.load("./assets/Arm_024a.gltf", function (gltf) {
  modelA = gltf.scene;
  modelA.position.set(modelAPos.x, modelAPos.y, modelAPos.z);
  scene.add(modelA);
//   const mixerA = new THREE.AnimationMixer(modelA);
//   mixerA.clipAction(gltf.animations[1]).play();
});

  // Add Arm_023b.glb as a child of Arm_023a.glb
loader.load("./assets/Arm_024b.gltf", function (gltf) {
  modelB = gltf.scene;
  modelB.position.set(modelBPos.x, modelBPos.y, modelBPos.z);
  // scene.add(modelB);  // 이걸
  modelA.add(modelB);   // 이렇게 해줘야 자식 설정이 된다.
  // const mixerB = new THREE.AnimationMixer(modelB);
  // mixerB.clipAction(gltf.animations[1]).play();

  // directly modify position and rotation of modelB
  modelB.rotation.x = modelBRot.x;
  
});

loader.load("./assets/Arm_024c.gltf", function (gltf) {
  modelC = gltf.scene;
  modelC.position.set(modelCPos.x, modelCPos.y, modelCPos.z);
  modelB.add(modelC); 
  // const mixerC = new THREE.AnimationMixer(modelC);
  // mixerC.clipAction(gltf.animations[1]).play();
  modelC.rotation.x = modelCRot.x;
});

loader.load("./assets/Arm_024d.gltf", function (gltf) {
  modelD = gltf.scene;
  modelD.position.set(modelDPos.x, modelDPos.y, modelDPos.z);
  modelC.add(modelD); 
  // const mixerD = new THREE.AnimationMixer(modelD);
  // mixerD.clipAction(gltf.animations[1]).play();
  modelD.rotation.x = modelDRot.x;
});

const clock = new THREE.Clock();

// function render() {
//   requestAnimationFrame(render);
//   var delta = clock.getDelta();
//   if (mixer != null) mixer.update(delta);
//   // if (model) {
//   //   model.rotation.y = modelRot.y;
//   // }
//   renderer.render(scene, camera);
// }

function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);

  // rotate modelC but not modelD
  if (modelC) {
    modelC.rotation.x = modelCRot.x;
    if (modelD) {
      modelD.rotation.x = -modelCRot.x -modelBRot.x ; 
      modelD.rotation.x = -modelCRot.x -modelBRot.x ; // negate the rotation of modelC
      
    }
  }

  renderer.render(scene, camera);
}



const gui = new GUI();
const folderA = gui.addFolder("Arm A");
folderA.add(modelAPos, 'x', -2, 2).name('xxx').onChange(() => {
  if (modelA) {
    modelA.position.x = modelAPos.x;
  }
});
folderA.add(modelAPos, 'y', 0, 2).name('yyy').onChange(() => {
  if (modelA) {
    modelA.position.y = modelAPos.y;
  }
});
folderA.add(modelAPos, 'z', -2, 2).name('zzz').onChange(() => {
  if (modelA) {
    modelA.position.z = modelAPos.z;
  }
});
folderA.add(modelARot, 'y', -Math.PI, Math.PI).name('rrr').onChange(() => {
  if (modelA) {
    modelA.rotation.y = modelARot.y;
  }
});

const folderB = gui.addFolder("Arm B");
folderB.add(modelBRot, 'x', -1, 1).name('rrr').onChange(() => {
  if (modelB) {
    modelB.rotation.x = modelBRot.x;
  }
});

const folderC = gui.addFolder("Arm C");
folderC.add(modelCRot, 'x', -0.5, 0.5).name('rrr').onChange(() => {
  if (modelC) {
    modelC.rotation.x = modelCRot.x;
  }
});



render();


function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);

  // Rotate modelA and modelC
  if (modelA) {
    modelA.rotation.y = modelARot.y;
  }

  if (modelC) {
    modelC.rotation.x = modelCRot.x;
  }

  // Render the scene
  renderer.render(scene, camera);
}

animate();



