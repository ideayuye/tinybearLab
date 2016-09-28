

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
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

initShader();

var vertics = new Float32Array([
    0.5,0.0, 1.0,0.0,
    0.5,0.5, 1.0,1.0,
    0.0,0.0, 0.0,0.0,
    0.0,0.5, 0.0,1.0
]);

var drawGeometry = function(){
    //把数据传输到缓冲区对象
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertics,gl.STATIC_DRAW);
    var aVertexPosition = gl.getAttribLocation(shaderProgram,'aVertexPosition');
    var FSIZE = vertics.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(aVertexPosition,2,gl.FLOAT,false,FSIZE*4,0);
    gl.enableVertexAttribArray(aVertexPosition);
    
    /*var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertics,gl.STATIC_DRAW);*/
    var aTexCoord = gl.getAttribLocation(shaderProgram,'aTexCoord');
    gl.vertexAttribPointer(aTexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(aTexCoord);

    //配置纹理
    var texture = gl.createTexture();
    var uSampler = gl.getUniformLocation(shaderProgram,'uSampler');

    var image = new Image();

    image.onload = function(){
        //配置纹理参数
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        // gl.bindTexture(gl.TEXTURE_2D, null);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(uSampler,0);
        drawScene();
    }

    image.src="images/tiles.jpg";
    // image.src="images/zuangtou.jpg";

    // drawScene();
}

drawGeometry();


