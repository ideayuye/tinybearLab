

/*
*@description 图形变换
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

function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,3);
}

initShader();

//传递位置信息
var aVertexPosition = gl.getAttribLocation(shaderProgram,'aVertexPosition');
gl.vertexAttrib3f(aVertexPosition,0.5,0.0,0.0);
drawScene();

var points = [
    0.5,0,
    -0.5,0,
    0.0,0.5
];

var drawTriangle = function(){
    //把数据传输到缓冲区对象
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
    var aVertexPosition = gl.getAttribLocation(shaderProgram,'aVertexPosition');
    gl.vertexAttribPointer(aVertexPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(aVertexPosition);
    drawScene();
}

drawTriangle();


