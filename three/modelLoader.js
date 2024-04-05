import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { SelectionBox } from "three/addons/interactive/SelectionBox.js";
import { SelectionHelper } from "three/addons/interactive/SelectionHelper.js";

let camera, scene, renderer, controls;
let modelCurrent,
  modelList = [];

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

function render() {
  renderer.render(scene, camera);
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    // "./models/Cow.gltf",
    "./models/WRITTENBYMDANALYSIS.glb",
    async function (gltf) {
      const model = gltf.scene;
      modelCurrent = model;
      modelList.push(model);
      const animations = gltf.animations;
      await renderer.compileAsync(model, camera, scene);
      scene.add(model);
      console.log(model, "model");

      // 添加动画混音器（用于管理和播放动画）
      const mixer = new THREE.AnimationMixer(model);

      const clip = THREE.AnimationClip.findByName(animations, "Walk");
      let animateClipAction;
      const loopMap = {
        LoopOnce: THREE.LoopOnce, // 只播放一次
        LoopRepeat: THREE.LoopRepeat, //循环播放
        LoopPingPong: THREE.LoopPingPong, // 来回播放
      };
      if (clip) {
        animateClipAction = mixer.clipAction(clip);
        animateClipAction.timeScale = 1;
        animateClipAction.setEffectiveWeight(1);
        animateClipAction.setLoop(loopMap["LoopRepeat"]);
        animateClipAction.play();
      }

      // 为每一个动画clip创建Action
      // for (let i = 0; i < animations.length; i++) {
      //   const animationClip = animations[i];
      //   const action = mixer.clipAction(animationClip);
      //   action.play(); // 默认播放每个动画
      // }

      // 创建一个Clock实例
      const clock = new THREE.Clock();

      // 更新动画
      function update() {
        if (mixer) {
          mixer.update(clock.getDelta()); // clock 必须是一个 THREE.Clock 实例
          render();
        }
        requestAnimationFrame(update);
      }

      // 开始更新循环
      update();
      render();
      fullView();
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function loadFBX() {
  const loader = new FBXLoader();
  loader.load("./models/nurbs.fbx", async function (model) {
    console.log("model", model);
    scene.add(model);
    modelCurrent = model;
    modelList.push(model);
    render();
  });
}

function loadMichelle() {
  const loader = new GLTFLoader();
  loader.load("models/Michelle.glb", async function (gltf) {
    const model = gltf.scene;
    console.log("model", model);
    scene.add(model);
    modelCurrent = model;
    modelList.push(model);
    render();
  });
}

function loadBox() {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function fullView() {
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

function bindButton() {
  const button = document.getElementById("view_model");
  button.addEventListener("click", function () {
    fullView();
  });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(modelCurrent.children, true);
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    console.log(selectedObject, "oklj");
    selectedObject.material = selectedObject.material.clone();
    selectedObject.material.color.setRGB(1, 0, 0);
    selectedObject.material.wireframe = true;
    selectedObject.visible = false;
  }
}

// document.addEventListener("mousedown", onMouseClick, false);

function bindSelection() {
  const selectionBox = new SelectionBox(camera, scene);
  const helper = new SelectionHelper(renderer, "selectBox");

  document.addEventListener("pointerdown", function (event) {
    for (const item of selectionBox.collection) {
      item.material.emissive.set(0x000000);
    }

    selectionBox.startPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
  });

  document.addEventListener("pointermove", function (event) {
    if (helper.isDown) {
      for (let i = 0; i < selectionBox.collection.length; i++) {
        selectionBox.collection[i].material.emissive.set(0x000000);
      }

      selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );

      const intersects = selectionBox.select();
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].material.emissive.set(0xff0000);
      }
    }
  });

  document.addEventListener("pointerup", function (event) {
    selectionBox.endPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );

    const intersects = selectionBox.select();
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].material.emissive.set(0xff0000);
    }
  });
}

init();
// loadBox();
// loadModel();
loadFBX();
loadMichelle();
render();
bindButton();
// controls.enabled = false;
// bindSelection();
