var scene,camera,renderer;
var geometry,material,mesh;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1000);
    camera.position.x = 10;
    camera.position.y = 50;
    camera.position.z = 300;
    
    geometry = new THREE.BoxGeometry(50,50,50);
    
    for(var i=0;i<geometry.faces.length;i+=2){
        var hex = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i+1].color.setHex(hex);
    }
    
    var texture1 = new THREE.TextureLoader();
    
    
    material = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,overdraw:0.5 });
    
    mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    
    renderer.render(scene,camera);
}

window.onload= function () {
    init();
    animate();
};