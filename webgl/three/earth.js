

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,10);
camera.position.set(0,0,6);

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
// scene.add(cube);

var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
var geoLine = new THREE.Geometry();
geoLine.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0)
);
var line = new THREE.Line(geoLine, lineMaterial);
var geoLine1 = new THREE.Geometry();
geoLine1.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 10, 0)
);
var line1 = new THREE.Line(geoLine1, lineMaterial);

var lineMaterialG = new THREE.LineBasicMaterial({color:0x00ff00});
var geoLine2 = new THREE.Geometry();
    geoLine2.vertices.push(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0,0,10)
    );
var line2 = new THREE.Line(geoLine2,lineMaterialG);

scene.add(line);
scene.add(line1);
scene.add(line2);

var materialBasic = new THREE.MeshBasicMaterial({
    // color:0xff6600,
    // wireframe :true
    fog:0xffffff
});
//sphere
var sphereGeo = new THREE.SphereGeometry(2,40,40);
var loader = new THREE.TextureLoader();
var loadPsb = function(){
    return Q.Promise(function(resolve,reject){
        loader.load(
            // resource URL
            // './../images/psb.jpg',
            // './../images/Tutorial81_pic1.png',
            // "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/earthmap.jpg",
            './../images/earthmap.jpg',
            // Function when resource is loaded
            function ( texture ) {
                materialBasic.map = texture;
                resolve();
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
                reject(xhr);
            }
        );
    });
}
loadPsb().done(function(){
    var sphere = new THREE.Mesh(sphereGeo,materialBasic);
    sphere.position.set(0,0,0);
    scene.add(sphere);
});

//经纬度转空间坐标
var fromDegrees = function(lon,lat){
    var x,y,z;
    r = 2;
    var rlat = lat/180*Math.PI,
        rlon = lon/180*Math.PI;
    y = r * Math.sin(rlat);
    var pl = r*Math.cos(rlat);
    x = pl*Math.cos(rlon);
    z = -pl*Math.sin(rlon);
    return {
        x:x,
        y:y,
        z:z
    }
}

// console.log(-10,20,fromDegrees(-10,20));
// console.log(0,0,fromDegrees(0,0));
console.log(-90,0,fromDegrees(-90,0));
console.log(-180,0,fromDegrees(-180,0));
console.log(180,0,fromDegrees(180,0));

console.log(20,20,fromDegrees(20,20));
console.log(90,0,fromDegrees(90,0));

console.log(0,90,fromDegrees(0,90));
console.log(0,-90,fromDegrees(0,-90));

var geometry = new THREE.CircleGeometry( 0.05, 50);
var material = new THREE.MeshBasicMaterial( { color: 0xff0000 ,side:THREE.DoubleSide} );
var circle = new THREE.Mesh( geometry, material );
var ps = fromDegrees(118.78,32.04);
// var ps = fromDegrees(38.91,15.44);
// var ps = fromDegrees(1.5,0.2);
// var ps = fromDegrees(0,0);
circle.position.set(ps.x,ps.y,ps.z);

scene.add(circle);

var geoLineX1 = new THREE.Geometry();
geoLineX1.vertices.push(
    new THREE.Vector3(ps.x, ps.y, ps.z),
    new THREE.Vector3(ps.x*2, ps.y*2, ps.z*2)
);
var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
var linex1 = new THREE.Line(geoLineX1, lineMaterial);
scene.add(linex1);

var geometryPl = new THREE.PlaneGeometry( 1, 0.5, 16 );
var materialPl = new THREE.MeshBasicMaterial( {color: 0x1111ff, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometryPl, materialPl );
plane.position.set(ps.x*2, ps.y*2, ps.z*2);
// plane.translate(-0,-0,0);
scene.add(plane);


/*var tween = new TWEEN.Tween({x:0,y:0});
tween.to({ x: 3, y:1}, 500);
tween.onUpdate(function(){
    sphere.position.x = this.x;
    sphere.position.y = this.y;
});
tween.start();*/


var controls = new THREE.OrbitControls(camera,render.domElement);

var animate = function(){
    controls.update();
    render.render(scene,camera);
    // TWEEN.update();
    requestAnimationFrame(animate);
}

animate();





