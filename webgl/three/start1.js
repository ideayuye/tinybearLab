

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,10);
camera.position.set(0,0,5);

var render = new THREE.WebGLRenderer({
    canvas:document.getElementById('test')
});
render.setPixelRatio(window.devicePixelRatio);

render.setSize(window.innerWidth,window.innerHeight);
render.setClearColor(0x000000);

var geo = new THREE.BoxGeometry(1,1,1);
/*var material = new THREE.MeshBasicMaterial({
    color:0xff6600,
    // wireframe :true
});*/
var material = new THREE.MeshLambertMaterial({
    color:"#2194ce",
    emissive:"#000000"
    // wireframe:true
});
var cube = new THREE.Mesh(geo,material);

cube.rotation.y = 45 % (Math.PI * 2);
cube.rotation.x = 45 % (Math.PI * 2);
scene.add(cube);

var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
var geoLine = new THREE.Geometry();
geoLine.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0)
);
var line = new THREE.Line(geoLine, lineMaterial);
var geoLine1 = new THREE.Geometry();
geoLine1.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0)
);
var line1 = new THREE.Line(geoLine1, lineMaterial);

var lineMaterialG = new THREE.LineBasicMaterial({color:0x00ff00});
var geoLine2 = new THREE.Geometry();
    geoLine2.vertices.push(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0,0,1)
    );
var line2 = new THREE.Line(geoLine2,lineMaterialG);

scene.add(line);
scene.add(line1);
scene.add(line2);

//light
var ambientLight = new THREE.AmbientLight(0x000000);
scene.add(ambientLight);
var light = new THREE.PointLight(0xffffff,1,0);
light.position.set(-5,2,3);
var light1 = new THREE.PointLight(0xffffff,1,0);
light1.position.set(5,2,3);
var light2 = new THREE.PointLight(0xffffff,1,0);
light2.position.set(0,-5,3);
scene.add(light);
scene.add(light1);
scene.add(light2);

render.render(scene,camera);



