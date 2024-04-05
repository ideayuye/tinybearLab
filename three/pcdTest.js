import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

let camera, scene, renderer, controls;
let currentModel;

function init() {
  const container = document.getElementById("container");
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xffffff);
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
  );
  camera.position.set(20, 20, 20);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);
}

function render() {
  renderer.render(scene, camera);
}

function loadPCD() {
  const loader = new PCDLoader();
  loader.load("./models/Zaghetto.pcd", function (points) {
    points.geometry.center();
    points.geometry.rotateX(Math.PI);
    points.material.size = 0.001;
    points.name = "Zaghetto";
    currentModel = points;
    console.log(points, "points");
    scene.add(points);
    fullView([points]);
    render();
  });
}

function fullView(modelList) {
  const box = new THREE.Box3();
  // box.setFromObject(modelCurrent);
  for (let i = 0; i < modelList.length; i++) {
    const boxTemp = new THREE.Box3().setFromObject(modelList[i]);
    box.union(boxTemp);
  }
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const distance = size / (2 * Math.tan((Math.PI * camera.fov) / 360));
  camera.position.copy(center).add(new THREE.Vector3(0, 0, distance));
  camera.lookAt(center);
}

const raycaster = new THREE.Raycaster();
function onMouseMove(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(currentModel, true);
  if (intersects.length > 0) {
    console.log(intersects, "select items");
  }
}

function initPointEvent() {
  window.addEventListener("pointermove", onMouseMove, false);
}

init();
loadPCD();
initPointEvent();
