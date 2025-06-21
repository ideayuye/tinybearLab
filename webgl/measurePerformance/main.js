const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  console.error("WebGL not supported, falling back on experimental-webgl");
  gl = canvas.getContext("experimental-webgl");
}

if (!gl) {
  alert("Your browser does not support WebGL");
}

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

// Fragment shader program
const fsSource = `
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

// Initialize a shader program, so WebGL knows how to draw our data
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

// Collect all the info needed to use the shader program.
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
  },
};

// Here's where we call the routine that builds all the objects we'll be drawing.
let buffers = initBuffers(gl);

// Draw the scene repeatedly
let then = 0;
let rotation = 0;

// Mouse control variables
let isDragging = false;
let lastX = 0,
  lastY = 0;
let xRot = 0,
  yRot = 0;

canvas.addEventListener("mousedown", function (e) {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging) {
    let deltaX = e.clientX - lastX;
    let deltaY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    xRot += deltaY * 0.01;
    yRot += deltaX * 0.01;
  }
});

function render(now) {
  now *= 0.001; // Convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(gl, programInfo, buffers, xRot, yRot);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// function initBuffers(gl) {
//   // Create a buffer for the square's positions.
//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Define the positions for the square
//   const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

//   // Pass the positions into WebGL to build the shape
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//   return {
//     position: positionBuffer,
//   };
// }

function initBuffers(gl) {
  const numVertices = 1000000; // 1000 万个顶点
  const chunkSize = 1000000; // 每块 100 万个顶点
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 预分配缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, numVertices * 2 * 4, gl.STATIC_DRAW); // 每个顶点 2 个 float，每个 float 4 字节

  // 分块上传数据
  for (let i = 0; i < numVertices; i += chunkSize) {
    const chunk = new Float32Array(chunkSize * 2);
    for (let j = 0; j < chunkSize; j++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      chunk[j * 2] = x;
      chunk[j * 2 + 1] = y;
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, i * 2 * 4, chunk); // 上传当前块
  }

  return {
    position: positionBuffer,
    vertexCount: numVertices,
  };
}

function drawScene(gl, programInfo, buffers, xRot, yRot) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate

  mat4.rotate(modelViewMatrix, modelViewMatrix, xRot, [1, 0, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, yRot, [0, 1, 0]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, buffers.vertexCount);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
