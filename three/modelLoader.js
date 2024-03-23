import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

let camera, scene, renderer;

function init() {
  const container = document.getElementById("container");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(20, 20, 20);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);
}

function render() {
  renderer.render(scene, camera);
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    "./models/Cow.gltf",
    async function (gltf) {
      const model = gltf.scene;
      const animations = gltf.animations;
      await renderer.compileAsync(model, camera, scene);
      scene.add(model);

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
          // render();
        }
        requestAnimationFrame(update);
      }

      // 开始更新循环
      update();
      render();
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function loadBox() {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

init();
// loadBox();
loadModel();
render();
