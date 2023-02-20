import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";

var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 5;
camera.position.y = 2.5;

var light = new THREE.DirectionalLight(0xefefff, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);

var light = new THREE.DirectionalLight(0xffefef, 2);
light.position.set(-1, -1, -1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight("white", 3);
scene.add(ambientLight);

window.addEventListener("resize", function() {
let width = window.innerWidth;
let height = window.innerHeight;
renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();
});

var orbCtrl = new OrbitControls(camera, renderer.domElement);
orbCtrl.target.set(0, 0.5, 0);
orbCtrl.update();

var grid = new THREE.GridHelper(5000, 1000, 0x000000, 0x000000);
grid.position.y = 0;
grid.material.transparent = true;
grid.material.opacity = 0.3;
scene.add(grid);

var loader = new THREE.GLTFLoader();
var mixer;
var model;
loader.load("machine_a016gltf.gltf", function(gltf) {
model = gltf.scene;
model.scale.set(.35,.35,.35);
scene.add(model);

mixer = new THREE.AnimationMixer(model);
mixer.clipAction(gltf.animations[1]).play();

document.body.addEventListener("click", kill);
function kill() {
mixer.clipAction(gltf.animations[1]).stop();
mixer.clipAction(gltf.animations[0]).play();
setTimeout(function() {
mixer.clipAction(gltf.animations[0]).stop();
mixer.clipAction(gltf.animations[1]).play();
}, 4000);
}
});

var clock = new THREE.Clock();
function render() {
requestAnimationFrame(render);
var delta = clock.getDelta();
if (mixer != null) mixer.update(delta);
renderer.render(scene, camera);
}

render();