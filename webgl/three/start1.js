

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,10);
camera.position.set(2,0,5);

var render = new THREE.WebGLRenderer({
    canvas:document.getElementById('test')
});

render.setSize(window.innerWidth,window.innerHeight);
render.setClearColor(0x000000);

var geo = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color:0xff0000,wireframe :true});
var cube = new THREE.Mesh(geo,material);
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

render.render(scene,camera);



