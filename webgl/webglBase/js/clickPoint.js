/*
*@description 根据点击的位置绘制点
*/
var canvas = document.getElementById('testCanvas');
var gl = canvas.getContext('webgl');

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
    gl.drawArrays(gl.POINTS,0,1);
}

initShader();

//传递位置信息
var aVertexPosition = gl.getAttribLocation(shaderProgram,'aVertexPosition');
gl.vertexAttrib3f(aVertexPosition,0.5,0.0,0.0);

drawScene();


canvas.addEventListener('click',function(e){
    var w = canvas.width;
    var h = canvas.height;
    var x = (e.x-w*0.5)/w*2;
    var y = (h*0.5-e.y)/h*2;
    gl.vertexAttrib3f(aVertexPosition,x,y,0.0);
    drawScene();
});