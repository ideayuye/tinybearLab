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
let axisData;
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
  axisData = createAxisData();

  // 设置画布尺寸
  function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

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

  // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(axisData.positions),
    gl.STATIC_DRAW
  );
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
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(axisData.colors),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

  // var texcoordLocation = gl.getAttribLocation(shaderProgram, "a_texcoord");
  // var buffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // gl.enableVertexAttribArray(texcoordLocation);
  // gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  // setTexcoords(gl);

  // Create a texture.
  // var texture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  // gl.texImage2D(
  //   gl.TEXTURE_2D,
  //   0,
  //   gl.RGBA,
  //   1,
  //   1,
  //   0,
  //   gl.RGBA,
  //   gl.UNSIGNED_BYTE,
  //   new Uint8Array([0, 0, 255, 255])
  // );

  // Asynchronously load an image
  // var image = new Image();
  // image.src = "images/water.png";
  // image.addEventListener("load", function () {
  //   // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //   // Now that the image has loaded make copy it to the texture.
  //   gl.bindTexture(gl.TEXTURE_2D, texture);
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //   gl.generateMipmap(gl.TEXTURE_2D);
  // });
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
  gl.drawArrays(gl.LINES, 0, axisData.positions.length / 3);

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
  const projectionMatrix = createPerspectiveMatrix(gl, canvas);
  gl.uniformMatrix4fv(pUniform, false, projectionMatrix);

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  const modelViewMatrix = createModelViewMatrix(rotationX, rotationY);
  gl.uniformMatrix4fv(mvUniform, false, modelViewMatrix);
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

// 创建坐标轴数据
function createAxisData() {
  const positions = [];
  const colors = [];

  // 坐标轴长度和箭头大小
  const axisLength = 1.5;
  const arrowSize = 0.2;

  // 添加X轴（红色）
  addAxis(positions, colors, [1, 0, 0], [1, 0, 0], axisLength, arrowSize);

  // 添加Y轴（绿色）
  addAxis(positions, colors, [0, 1, 0], [0, 1, 0], axisLength, arrowSize);

  // 添加Z轴（蓝色）
  addAxis(positions, colors, [0, 0, 1], [0, 0, 1], axisLength, arrowSize);

  return { positions, colors };
}

// 添加单个坐标轴
function addAxis(positions, colors, direction, color, length, arrowSize) {
  // 主轴（从原点到方向）
  // 起点 (0, 0, 0)
  positions.push(0, 0, 0);
  colors.push(...color);

  // 终点
  const endX = direction[0] * length;
  const endY = direction[1] * length;
  const endZ = direction[2] * length;
  positions.push(endX, endY, endZ);
  colors.push(...color);

  // 箭头部分（两个斜线）
  // 计算垂直向量
  let perp;
  if (direction[0] !== 0) {
    perp = [0, 1, 0]; // 如果方向不是垂直的，使用Y轴作为垂直向量
  } else {
    perp = [1, 0, 0]; // 否则使用X轴
  }

  // 箭头点1
  positions.push(endX, endY, endZ);
  colors.push(...color);

  positions.push(
    endX - direction[0] * arrowSize + perp[0] * arrowSize * 0.5,
    endY - direction[1] * arrowSize + perp[1] * arrowSize * 0.5,
    endZ - direction[2] * arrowSize + perp[2] * arrowSize * 0.5
  );
  colors.push(...color);

  // 箭头点2
  positions.push(endX, endY, endZ);
  colors.push(...color);

  positions.push(
    endX - direction[0] * arrowSize - perp[0] * arrowSize * 0.5,
    endY - direction[1] * arrowSize - perp[1] * arrowSize * 0.5,
    endZ - direction[2] * arrowSize - perp[2] * arrowSize * 0.5
  );
  colors.push(...color);
}

// 创建透视投影矩阵
function createPerspectiveMatrix(gl, canvas) {
  const fieldOfView = (45 * Math.PI) / 180; // 45度视角
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const projectionMatrix = new Float32Array(16);
  const f = 1.0 / Math.tan(fieldOfView / 2);

  projectionMatrix[0] = f / aspect;
  projectionMatrix[1] = 0;
  projectionMatrix[2] = 0;
  projectionMatrix[3] = 0;

  projectionMatrix[4] = 0;
  projectionMatrix[5] = f;
  projectionMatrix[6] = 0;
  projectionMatrix[7] = 0;

  projectionMatrix[8] = 0;
  projectionMatrix[9] = 0;
  projectionMatrix[10] = (zFar + zNear) / (zNear - zFar);
  projectionMatrix[11] = -1;

  projectionMatrix[12] = 0;
  projectionMatrix[13] = 0;
  projectionMatrix[14] = (2 * zFar * zNear) / (zNear - zFar);
  projectionMatrix[15] = 0;

  return projectionMatrix;
}

// 创建模型视图矩阵
function createModelViewMatrix(rotationX, rotationY) {
  const modelViewMatrix = new Float32Array(16);

  // 初始化为单位矩阵
  for (let i = 0; i < 16; i++) {
    modelViewMatrix[i] = 0;
  }
  modelViewMatrix[0] = 1;
  modelViewMatrix[5] = 1;
  modelViewMatrix[10] = 1;
  modelViewMatrix[15] = 1;

  // 平移（将坐标轴移入视图中）
  modelViewMatrix[14] = -4.0;

  // 绕Y轴旋转
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);

  const temp = new Float32Array(16);
  temp[0] = cosY;
  temp[2] = sinY;
  temp[5] = 1;
  temp[8] = -sinY;
  temp[10] = cosY;
  temp[15] = 1;

  multiplyMatrices(modelViewMatrix, modelViewMatrix, temp);

  // 绕X轴旋转
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);

  const temp2 = new Float32Array(16);
  temp2[0] = 1;
  temp2[5] = cosX;
  temp2[6] = -sinX;
  temp2[9] = sinX;
  temp2[10] = cosX;
  temp2[15] = 1;

  multiplyMatrices(modelViewMatrix, modelViewMatrix, temp2);

  return modelViewMatrix;
}

// 矩阵乘法
function multiplyMatrices(out, a, b) {
  const a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  const a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  const a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  const a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  let b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
}

window.onload = start();
