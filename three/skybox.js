import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let container;
let camera, scene, renderer;

function init() {
  container = document.getElementById("container");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(5, 5, 5);
  scene.add(camera);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);
}

function render() {
  renderer.render(scene, camera);
}

function addSkyBox() {
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const pics = [
    "bottom.jpeg",
    "far.jpeg",
    "left.jpg",
    "near.jpeg",
    "right.jpeg",
    "top.jpg",
  ];

  const boxMaterials = [];
  let boxMesh;

  pics.forEach((p) => {
    let texture = new THREE.TextureLoader().load(`./images/${p}`);
    boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
  });
  boxMesh = new THREE.Mesh(boxGeometry, boxMaterials);
  scene.add(boxMesh);
  boxMesh.geometry.scale(10, 10, -10);
}

init();
addSkyBox();
render();
