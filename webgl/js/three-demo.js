var scene, camera, renderer;
var geometry, material, mesh;
var hemiLight, dirLight;
var controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 10;
  camera.position.y = 20;
  camera.position.z = 300;

  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1, 75, 1);
  dirLight.position.multiplyScalar(50);
  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;
  var d = 50;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;

  geometry = new THREE.BoxGeometry(100, 100, 100);

  // for(var i=0;i<geometry.faces.length;i+=2){
  //     var hex = Math.random() * 0xffffff;
  //     geometry.faces[i].color.setHex(hex);
  //     geometry.faces[i+1].color.setHex(hex);
  // }
  // material = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,overdraw:0.5 });

  var loader = new THREE.TextureLoader();
  return Q.Promise(function (resolve, reject) {
    loader.load(
      // resource URL
      "images/cb1.png",
      // Function when resource is loaded
      function (texture) {
        // do something with the texture
        material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.cullFace = THREE.CullFaceBack;

        document.body.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        resolve();
      },
      // Function called when download progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // Function called when download errors
      function (xhr) {
        console.log("An error happened");
        reject(xhr);
      }
    );
  });
}

function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  // controls.update();

  renderer.render(scene, camera);
}

window.onload = function () {
  init().then(function () {
    animate();
  });
  // animate();
};
