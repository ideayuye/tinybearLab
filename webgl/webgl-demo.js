/**
 * Created by tinybear on 2016/4/17.
 */

var canvas;
var gl;
var squareVerticesBuffer;
var squareVerticesColorBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;

var lastMouseX = 0;
var lastMouseY = 0;
var rotationX = 0;
var rotationY = 0;

function start() {
  canvas = document.getElementById("glcanvas");
  initWebGL(canvas); // Initialize the GL context
  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.lineWidth(1);
  }

  initShaders();

  initBuffers();

  // 添加鼠标事件监听器
  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);
  canvas.addEventListener("mouseout", handleMouseUp, false);

  drawScene();
}
//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  gl = null;
  try {
    gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
  } catch (e) {}
  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

function getShader(gl, id) {
  var shaderScript, theSource, currentChild, shader;

  shaderScript = document.getElementById(id);

  if (!shaderScript) {
    return null;
  }

  theSource = "";
  currentChild = shaderScript.firstChild;

  while (currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    // Unknown shader type
    return null;
  }

  gl.shaderSource(shader, theSource);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    return null;
  }

  return shader;
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  gl.useProgram(shaderProgram);
}
const size = 1;
function initBuffers() {
  vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(vertexPositionAttribute);
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

  // var vertices = [
  //   1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0,
  // ];
  // for (let i = 0; i < 100; i++) {
  //   let data = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -0.5, 0.0];
  //   vertices = vertices.concat(data);
  // }

  var vertices = new Float32Array(12 * size);

  for (let i = 0; i < size; i++) {
    let data = new Float32Array([
      // 1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -0.5, 0.0,
      0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
    ]);

    const start = 12 * i;
    data.forEach((d, index) => {
      vertices[start + index] = d;
    });
  }

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  var colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);

  squareVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  var texcoordLocation = gl.getAttribLocation(shaderProgram, "a_texcoord");
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  setTexcoords(gl);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  // Asynchronously load an image
  var image = new Image();
  image.src = "images/water.png";
  image.addEventListener("load", function () {
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });
}

function setTexcoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0,
      0, // 左下角 (0, 0)
      1,
      0, // 右下角 (1, 0)
      0,
      1, // 左上角 (0, 1)
      1,
      1, // 右上角 (1, 1)
    ]),
    gl.STATIC_DRAW
  );
}

let frameCount = 0;
let lastTime = performance.now();
function drawScene() {
  // 帧数统计
  frameCount++;
  const now = performance.now();
  const elapsed = now - lastTime;
  if (elapsed >= 1000) {
    // 每秒打印一次帧数
    console.log(`FPS: ${Math.round((frameCount * 1000) / elapsed)}`);
    lastTime = now;
    frameCount = 0;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);

  loadIdentity();
  mvTranslate([-0.0, 0.0, -3.0]);

  // 应用旋转
  // mvRotate(rotationX, [1, 0, 0]);
  // mvRotate(rotationY, [0, 1, 0]);

  setMatrixUniforms();
  gl.drawArrays(gl.LINE_LOOP, 0, size * 4);

  window.requestAnimationFrame(drawScene);
}

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function mvRotate(angle, v) {
  var inRadians = (angle * Math.PI) / 180.0;

  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(
    pUniform,
    false,
    new Float32Array(perspectiveMatrix.flatten())
  );

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

// gl.uniformMatrix4fv 为顶点着色器赋投影矩阵、视图矩阵的值
// gl.vertexAttribPointer //提取位置、颜色信息到着色器
// gl.enableVertexAttribArray // 应用着色器里的 顶点信息

var mouseDown = false;

function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  if (!mouseDown) {
    return;
  }
  var newX = event.clientX;
  var newY = event.clientY;

  var deltaX = newX - lastMouseX;
  var deltaY = newY - lastMouseY;

  rotationX += deltaX / 5;
  rotationY += deltaY / 5;

  lastMouseX = newX;
  lastMouseY = newY;
}

window.onload = start();
