
/*
*@description 光源
*/
var canvas = document.getElementById('testCanvas');
var gl = canvas.getContext('webgl');
var shaderProgram ;

function getShader(gl,id){
    var shaderScript,theSource,currentChild,shader;

    shaderScript = document.getElementById(id);

    if(!shaderScript){
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while(currentChild){
        if(currentChild.nodeType == currentChild.TEXT_NODE){
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    if(shaderScript.type == "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else if(shaderScript.type == "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }else{
        return null;
    }

    gl.shaderSource(shader,theSource);

    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShader(){
    var fragmentShader = getShader(gl,'shader-fs');
    var vertexShader = getShader(gl,'shader-vs');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vertexShader);
    gl.attachShader(shaderProgram,fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);
}

function drawScene(n){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS,0,12);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}

initShader();

var points = [
    0.5,0,0,
    -0.5,0,0,
    0.0,0.5,0,

    0,0.1,0.3,
    0.5,0,0,
    -0.5,0,0,

    0,0.1,0.3,
    -0.5,0,0,
    0.0,0.5,0,

    0,0.1,0.3,
    0.5,0,0,
    0.0,0.5,0
];

var colors = [
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,

    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,

    0.0,0.0,1.0,
    0.0,0.0,1.0,
    0.0,0.0,1.0,

    0.0,0.0,0.0,
    0.0,0.0,0.0,
    0.0,0.0,0.0
];

var indices = new Uint8Array([
    0,1,2,
    3,4,5,
    6,7,8,
    9,10,11
]);

var matrix = new Matrix4();
matrix.setOrtho(-1.0,1.0,-1.0,1.0,-1.0,1.0);
matrix.lookAt(0,0,0, 0,0,-1, 0,1,0);

var uLightColor = gl.getUniformLocation(shaderProgram,'uLightColor');
var uLightDirection = gl.getUniformLocation(shaderProgram,'uLightDirection');

gl.uniform3f(uLightColor,1.0,1.0,1.0);
var lightDirection = new Vector3([0.5,3.0,4.0]);
lightDirection.normalize();
gl.uniform3fv(uLightDirection,lightDirection.elements);

var drawTriangle = function(){
    //设置旋转矩阵
    var uMatrix = gl.getUniformLocation(shaderProgram,'uMatrix');
    gl.uniformMatrix4fv(uMatrix,false,matrix.elements);

    //把数据传输到缓冲区对象
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
    var aVertexPosition = gl.getAttribLocation(shaderProgram,'aVertexPosition');
    gl.vertexAttribPointer(aVertexPosition,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(aVertexPosition);

    //把颜色传递到缓冲区
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
    var aColors = gl.getAttribLocation(shaderProgram,'aColors');
    gl.vertexAttribPointer(aColors,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(aColors);

    //传递绘制面的顺序
    var indexBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

    drawScene(indices.length);
}

drawTriangle();



