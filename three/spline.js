import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

let container;
let camera, scene, renderer;
const splineHelperObjects = [];
let splinePointsLength = 4;
const positions = [];
const point = new THREE.Vector3();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();

let transformControl;

const ARC_SEGMENTS = 200;

const splines = {};

const params = {
  uniform: true,
  tension: 0.5,
  centripetal: true,
  chordal: true,
  // addPoint: addPoint,
  // removePoint: removePoint,
  // exportSpline: exportSpline,
};

function addCurve() {
  let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ]);
  curve.curveType = "catmullrom";
  const geometry = new THREE.BufferGeometry().setFromPoints(
    curve.getPoints(ARC_SEGMENTS)
  );
  curve.mesh = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 5,
    })
  );
  scene.add(curve.mesh);
}

function addSplineObject(position) {
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
  });
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const object = new THREE.Mesh(geometry, material);

  object.position.x = -10;
  object.position.y = 0;
  object.position.z = 10;

  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);
  splineHelperObjects.push(object);
}

init();
function init() {
  container = document.getElementById("container");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 250, 1000);
  scene.add(camera);

  // scene.add(new THREE.AmbientLight(0xf0f0f0, 3));
  const light = new THREE.SpotLight(0xffffff, 4.5);
  light.position.set(0, 1500, 200);
  light.angle = Math.PI * 0.2;
  light.decay = 0;
  light.castShadow = true;
  light.shadow.camera.near = 200;
  light.shadow.camera.far = 200;
  light.shadow.bias = -0.000222;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  scene.add(light);

  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  planeGeometry.rotateX(-Math.PI / 2);
  const planeMaterial = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity: 0.2,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -200;
  plane.receiveShadow = true;
  scene.add(plane);

  const helper = new THREE.GridHelper(2000, 100);
  helper.position.y = -199;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  // const testGeo = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const cube = new THREE.Mesh(testGeo, material);
  // scene.add(cube);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);

  transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.addEventListener("change", render);
  transformControl.addEventListener("dragging-changed", function (event) {
    controls.enabled = !event.value;
  });
  scene.add(transformControl);

  addCurve();
  addSplineObject();

  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  document.addEventListener("pointermove", onPointerMove);
}

render();

function onPointerDown(event) {
  onDownPosition.x = event.clientX;
  onDownPosition.y = event.clientY;
}

function onPointerUp(event) {
  onUpPosition.x = event.clientX;
  onUpPosition.y = event.clientY;

  if (onDownPosition.distanceTo(onUpPosition) === 0) {
    transformControl.detach();
    render();
  }
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(splineHelperObjects, false);

  if (intersects.length > 0) {
    const object = intersects[0].object;

    if (object !== transformControl.object) {
      transformControl.attach(object);
    }
  }
}

function render() {
  // splines.uniform.mesh.visible = params.uniform;
  // splines.centripetal.mesh.visible = params.centripetal;
  // splines.chordal.mesh.visible = params.chordal;
  renderer.render(scene, camera);
}
