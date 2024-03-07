import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//加载纹理贴图
const texture = new THREE.TextureLoader().load("images/water.png");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const materialLine = new THREE.LineBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry1 = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry1, materialLine);
scene.add(line);

// const geo = new THREE.TextGeometry(text, {
//   font: undefined, // 这里需要替换为加载的字体对象
//   size: 2,
//   height: 0.1,
//   curveSegments: 12,
// });

// // 添加 OrbitControls 控制器
// controls = new THREE.OrbitControls(camera, renderer.domElement);

// 监听鼠标左键按下事件
document.addEventListener("mouseup", onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
  event.preventDefault();

  if (event.button === 0 && controls.enabled) {
    // 左键按下
    var intersectedObject = getIntersectionObject(event.clientX, event.clientY);

    // if (intersectedObject !== null) {
    //   // 清除之前高亮显示的对
    //   clearHighlightedObject();

    //   // 将当前拾取到的对象高亮显示
    //   highlightSelectedObject(intersectedObject);
    // } else {
    //   clearHighlightedObject();
    // }
  }
}

// 根据鼠标位置计算交集对象
function getIntersectionObject(x, y) {
  var vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.5
  ).unproject(camera);
  var raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );
  return raycaster.intersectObjects(scene.children)[0]
    ? raycaster.intersectObjects(scene.children)[0].object
    : null;
}

// 清除之前高亮显示的对象
function clearHighlightedObject() {
  scene.traverse(function (child) {
    if (child.children.length) {
      child.children[0].material.color.setHex("0x00ff00");
    }
  });
}

// 将当前拾取到的对象高亮显示
function highlightSelectedObject(selectedObject) {
  selectedObject.material.color.setRGB(1, 0, 0); // 红色高亮显示
}

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
