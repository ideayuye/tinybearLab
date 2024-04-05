import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera, scene, renderer, controls;
let curveObj, curve;

function init() {
  const container = document.getElementById("container");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
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

  addLight();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);
}

function addLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(20, 20, 20);
  scene.add(dirLight);
}

function addSphere() {
  const geometry = new THREE.SphereGeometry(15, 64, 32);
  const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    // flatShading: true,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

// 获取球体上的点
function getPointFromSphere(radius, phi, theta) {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function addArc() {
  // 使用 ArcCurve 在球体上绘制一条弧线
  const arc = new THREE.ArcCurve(
    0,
    0,
    15,
    0,
    Math.PI,
    false,
    new THREE.Vector3(0, 0, 0)
  );
  const points = arc.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const arcObj = new THREE.Line(geometry, material);
  scene.add(arcObj);
}

function calculateTangentPoint(p1, p2) {
  const r = 30;
  const center = new THREE.Vector3(
    (p1.x + p2.x) * 0.5,
    (p1.y + p2.y) * 0.5,
    (p1.z + p2.z) * 0.5
  );
  const innerR = Math.sqrt(
    Math.pow(center.x, 2) + Math.pow(center.y, 2) + Math.pow(center.z, 2)
  );
  const ratio = r / innerR;

  return new THREE.Vector3(
    center.x * ratio,
    center.y * ratio,
    center.z * ratio
  );
}

function generateCurve() {
  const points = [];
  const radius = 15;
  for (let i = 0; i < 2; i++) {
    const phi = Math.PI * 2 * Math.random();
    const theta = Math.PI * 2 * Math.random();
    const point = getPointFromSphere(radius, phi, theta);
    points.push(point);
  }
  const p1 = points[0];
  const p2 = points[1];
  points.splice(1, 0, calculateTangentPoint(p1, p2));

  curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
  const ps = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(ps);
  const material = new THREE.LineBasicMaterial({ color: 0xff2fbc });
  const curveObj = new THREE.Line(geometry, material);
  scene.add(curveObj);
  return curveObj;
  // addPoint(points);
}

let num = 3;
const clock = new THREE.Clock();
function updateCurve() {
  // console.log(clock.getDelta(), "delta");
  if (curveObj && curve) {
    if (num > 50) {
      // num = 3;
      return;
    }
    num++;
    const ps = curve.getPoints(50).slice(0, num);
    const geometry = new THREE.BufferGeometry().setFromPoints(ps);
    curveObj.geometry.dispose();
    curveObj.geometry = geometry;
  }
}

function addPoint(points) {
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array(points.map((p) => p.toArray()).flat());
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.5 });
  const pointObjs = new THREE.Points(geo, material);
  scene.add(pointObjs);
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  // 更新动画
  updateCurve();
  render();
}

init();
addSphere();
// addArc();
curveObj = generateCurve();
// render();
animate();
