import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

let scene, camera, renderer, controls, container;
let mesh;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0x8fbcd4, 1.5));

  const pointLight = new THREE.PointLight(0xffffff, 200);
  camera.add(pointLight);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
}

let clock = new THREE.Clock();
let mixer;
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
}

function loadMorphTargets() {
  const geo = new THREE.BoxGeometry(10, 10, 10);
  const mat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    flatShading: true,
  });
  geo.morphAttributes.position = [];
  mesh = new THREE.Mesh(geo, mat);

  const positions = geo.attributes.position.array;
  const morphPositions = new Float32Array(positions.length);

  const morphTarget = new THREE.Float32BufferAttribute(morphPositions, 3);
  geo.morphAttributes.position.push(morphTarget);
  scene.add(mesh);
  console.log(mesh.morphTargetInfluences, "morphTargetInfluences");
}

function setMorphInfluence() {
  mesh.morphTargetInfluences[0] = 0.5;
  render();
}

window.setMorphInfluence = setMorphInfluence;

function addAnimation() {
  const track = new THREE.KeyframeTrack(
    ".morphTargetInfluences[0]",
    [0, 10, 20],
    [0, 1, 0]
  );
  mixer = new THREE.AnimationMixer(mesh);
  const clip = new THREE.AnimationClip("default", 20, [track]);
  const AnimationAction = mixer.clipAction(clip);
  AnimationAction.timeScale = 5;
  AnimationAction.play();
}

init();
loadMorphTargets();
// setMorphInfluence();
render();
addAnimation();
