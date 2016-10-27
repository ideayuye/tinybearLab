

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
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
var light = new THREE.PointLight(0xffffff,1,0);
light.position.set(-5,2,3);
var light1 = new THREE.PointLight(0xffffff,1,0);
light1.position.set(5,5,3);
var light2 = new THREE.PointLight(0xffffff,1,0);
light2.position.set(0,-5,3);
/*scene.add(light);
scene.add(light1);
scene.add(light2);*/
var dirLight = new THREE.DirectionalLight(0xff0000,0.5);
dirLight.position.set(0,1,0);


//自定义shader
var geoPlane = new THREE.PlaneGeometry(3,3,3,3);
// geoPlane.translate(3,1,1);

var vertexShader = [
    'void main(){',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
].join('\n');
var fragmentShader = [
    'void main(){',
    'gl_FragColor = vec4(1.0,0.2588,0.0,1.0);',
    '}'
].join('\n');
var shaderMaterial = new THREE.ShaderMaterial({
    vertexShader:vertexShader,
    fragmentShader:fragmentShader
});
shaderMaterial.side = THREE.DoubleSide;
var materialBasic = new THREE.MeshBasicMaterial({
    color:0xff6600,
    // wireframe :true
    fog:0xffffff
});
var materialLabert = new THREE.MeshLambertMaterial({
    color:0xff6600,
    fog:0xffffff,
    emissive:"#000000"
});
// var plane = new THREE.Mesh(geoPlane,materialBasic);
var plane = new THREE.Mesh(geoPlane,shaderMaterial);

// scene.add(plane);

//sphere
var sphereGeo = new THREE.SphereGeometry(2,40,40);
var loader = new THREE.TextureLoader();
var loadPsb = function(){
    return Q.Promise(function(resolve,reject){
        loader.load(
            // resource URL
            './../images/psb.jpg',
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
/*loadPsb().done(function(){
    
});*/


var sphere = new THREE.Mesh(sphereGeo,materialLabert);
    // scene.add(sphere);

var tween = new TWEEN.Tween({x:0,y:0});
tween.to({ x: 3, y:1}, 500);
tween.onUpdate(function(){
    sphere.position.x = this.x;
    sphere.position.y = this.y;
});
tween.start();




var controls = new THREE.OrbitControls(camera,render.domElement);

var animate = function(){
    controls.update();
    render.render(scene,camera);
    TWEEN.update();
    requestAnimationFrame(animate);
}

animate();





