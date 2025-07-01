// 主WebGL上下文
const mainCanvas = document.getElementById("outputCanvas");
const gl = mainCanvas.getContext("webgl");
if (!gl) {
  alert("您的浏览器不支持WebGL！");
}

// 为FBO1和FBO2创建显示画布
const fbo1Canvas = document.getElementById("fbo1Canvas");
const fbo2Canvas = document.getElementById("fbo2Canvas");

// 着色器代码
const vertexShaderSource = `
            attribute vec2 aPosition;
            varying vec2 vPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
                vPosition = aPosition;
            }
        `;

const fragmentShaderSource1 = `
            precision mediump float;
            uniform float uTime;
            uniform float uRotation;
            uniform vec2 uResolution;
            varying vec2 vPosition;
            
            void main() {
                // 创建旋转效果
                vec2 pos = vPosition;
                float angle = uRotation;
                mat2 rot = mat2(cos(angle), -sin(angle), 
                                sin(angle), cos(angle));
                pos = rot * pos;
                
                // 创建彩色三角形图案
                vec3 color = vec3(0.0);
                if (abs(pos.x) + abs(pos.y) < 0.5) {
                    color.r = 0.8 + 0.2 * sin(uTime);
                    color.g = 0.4 + 0.2 * cos(uTime * 1.3);
                    color.b = 0.2 + 0.3 * sin(uTime * 0.7);
                } else {
                    color.r = 0.2;
                    color.g = 0.1;
                    color.b = 0.3;
                }
                
                // 添加一些动态效果
                color.r += 0.1 * sin(10.0 * pos.x + uTime * 2.0);
                color.g += 0.1 * cos(8.0 * pos.y + uTime * 1.7);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

const fragmentShaderSource2 = `
            precision mediump float;
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec2 vPosition;
            
            void main() {
                vec2 uv = vPosition * 0.5 + 0.5;
                vec2 center = vec2(0.5);
                
                // 创建动态圆形图案
                float dist = distance(uv, center);
                float circle = smoothstep(0.3, 0.29, dist);
                
                // 创建移动的小圆
                float smallCircles = 0.0;
                for (int i = 0; i < 5; i++) {
                    float fi = float(i);
                    vec2 offset = vec2(
                        sin(uTime * (0.5 + fi * 0.2)),
                        cos(uTime * (0.3 + fi * 0.15))
                    ) * 0.2;
                    float d = distance(uv, center + offset);
                    smallCircles += smoothstep(0.1, 0.09, d) * (0.4 + 0.6 * sin(uTime + fi));
                }
                
                // 组合效果
                vec3 color = vec3(0.0);
                color.b = circle * 0.8;
                color.r = smallCircles * 0.6;
                color.g = (circle * 0.3 + smallCircles * 0.2) * (0.5 + 0.5 * sin(uTime * 0.5));
                
                gl_FragColor = vec4(color, circle * 0.8 + smallCircles * 0.5);
            }
        `;

const blendFragmentShaderSource = `
            precision mediump float;
            uniform sampler2D uTexture1;
            uniform sampler2D uTexture2;
            uniform int uBlendMode;
            uniform float uOpacity1;
            uniform float uOpacity2;
            varying vec2 vPosition;
            
            void main() {
                vec2 uv = vPosition * 0.5 + 0.5;
                vec4 color1 = texture2D(uTexture1, uv) * uOpacity1;
                vec4 color2 = texture2D(uTexture2, uv) * uOpacity2;
                
                vec4 result;
                
                if (uBlendMode == 0) { // 相加混合
                    result = color1 + color2;
                } else if (uBlendMode == 1) { // 相乘混合
                    result = color1 * color2;
                } else if (uBlendMode == 2) { // 叠加混合
                    result = vec4(
                        color1.r < 0.5 ? 2.0 * color1.r * color2.r : 1.0 - 2.0 * (1.0 - color1.r) * (1.0 - color2.r),
                        color1.g < 0.5 ? 2.0 * color1.g * color2.g : 1.0 - 2.0 * (1.0 - color1.g) * (1.0 - color2.g),
                        color1.b < 0.5 ? 2.0 * color1.b * color2.b : 1.0 - 2.0 * (1.0 - color1.b) * (1.0 - color2.b),
                        1.0
                    );
                } else { // 屏幕混合
                    result = 1.0 - (1.0 - color1) * (1.0 - color2);
                }
                
                // 防止颜色值超过1.0
                result = clamp(result, 0.0, 1.0);
                result.a = 1.0;
                
                gl_FragColor = result;
            }
        `;

// 设置画布尺寸
function resizeCanvases() {
  const width = Math.min(400, window.innerWidth * 0.9);
  const height = Math.min(width * 0.75, window.innerHeight * 0.4);

  [mainCanvas, fbo1Canvas, fbo2Canvas].forEach((canvas) => {
    canvas.width = width;
    canvas.height = height;
  });
}
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

// 创建两个帧缓冲区
const fbo1 = gl.createFramebuffer();
const fbo2 = gl.createFramebuffer();

// 创建纹理附件
const texture1 = createTextureAttachment(
  gl,
  mainCanvas.width,
  mainCanvas.height
);
const texture2 = createTextureAttachment(
  gl,
  mainCanvas.width,
  mainCanvas.height
);

// 设置帧缓冲区
setupFramebuffer(gl, fbo1, texture1);
setupFramebuffer(gl, fbo2, texture2);

// 创建渲染缓冲区（用于深度测试）
const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(
  gl.RENDERBUFFER,
  gl.DEPTH_COMPONENT16,
  mainCanvas.width,
  mainCanvas.height
);

// 将深度缓冲区附加到两个FBO
attachDepthBuffer(gl, fbo1, depthBuffer);
attachDepthBuffer(gl, fbo2, depthBuffer);

// 检查帧缓冲区完整性
checkFramebufferStatus(gl, fbo1);
checkFramebufferStatus(gl, fbo2);

// 编译着色器程序
const program1 = createShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource1
);
const program2 = createShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource2
);
const blendProgram = createShaderProgram(
  gl,
  vertexShaderSource,
  blendFragmentShaderSource
);

// 设置顶点数据
const positionBuffer = createFullscreenQuad(gl);

// 设置混合着色器的uniform位置
const uTexture1Location = gl.getUniformLocation(blendProgram, "uTexture1");
const uTexture2Location = gl.getUniformLocation(blendProgram, "uTexture2");
const uBlendModeLocation = gl.getUniformLocation(blendProgram, "uBlendMode");
const uOpacity1Location = gl.getUniformLocation(blendProgram, "uOpacity1");
const uOpacity2Location = gl.getUniformLocation(blendProgram, "uOpacity2");

// 动画控制
let isAnimating = true;
let lastTime = 0;
let rotation = 0;

mainCanvas.addEventListener("mouseover", () => {
  isAnimating = !isAnimating;
});

// 更新不透明度显示
const opacity1Slider = document.getElementById("fbo1Opacity");
const opacity2Slider = document.getElementById("fbo2Opacity");
const opacity1Value = document.getElementById("opacity1Value");
const opacity2Value = document.getElementById("opacity2Value");

opacity1Slider.addEventListener("input", () => {
  opacity1Value.textContent = opacity1Slider.value;
});

opacity2Slider.addEventListener("input", () => {
  opacity2Value.textContent = opacity2Slider.value;
});

// 渲染循环
function render(time) {
  if (!lastTime) lastTime = time;
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  if (isAnimating) {
    rotation += deltaTime * 0.5;
  }

  // 渲染到FBO1
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
  gl.viewport(0, 0, mainCanvas.width, mainCanvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  renderScene(gl, program1, positionBuffer, rotation, 0);
  updatePreview(fbo1Canvas, texture1);

  // 渲染到FBO2
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
  gl.viewport(0, 0, mainCanvas.width, mainCanvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0); // 透明背景
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene(gl, program2, positionBuffer, rotation, 1);
  updatePreview(fbo2Canvas, texture2);

  // 渲染到屏幕（混合两个纹理）
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, mainCanvas.width, mainCanvas.height);
  gl.clearColor(0.08, 0.08, 0.12, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);

  // 设置混合着色器
  gl.useProgram(blendProgram);

  // 绑定纹理
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.uniform1i(uTexture1Location, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.uniform1i(uTexture2Location, 1);

  // 设置混合参数
  const blendModeSelect = document.getElementById("blendMode");
  const blendMode = blendModeSelect.value;
  gl.uniform1i(
    uBlendModeLocation,
    blendMode === "add"
      ? 0
      : blendMode === "multiply"
      ? 1
      : blendMode === "overlay"
      ? 2
      : 3
  );

  gl.uniform1f(uOpacity1Location, parseFloat(opacity1Slider.value));
  gl.uniform1f(uOpacity2Location, parseFloat(opacity2Slider.value));

  // 绘制全屏四边形
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positionAttribute = gl.getAttribLocation(blendProgram, "aPosition");
  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// 工具函数
function createTextureAttachment(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

function setupFramebuffer(gl, fbo, texture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
}

function attachDepthBuffer(gl, fbo, depthBuffer) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer
  );
}

function checkFramebufferStatus(gl, fbo) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error(`Framebuffer is not complete: ${status}`);
  }
}

function createShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    return null;
  }

  return program;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createFullscreenQuad(gl) {
  const positions = new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  return buffer;
}

function renderScene(gl, program, positionBuffer, rotation, sceneType) {
  gl.useProgram(program);

  // 设置顶点位置
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positionAttribute = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  // 设置uniform变量
  const uTimeLocation = gl.getUniformLocation(program, "uTime");
  const uResolutionLocation = gl.getUniformLocation(program, "uResolution");
  const uRotationLocation = gl.getUniformLocation(program, "uRotation");
  const uSceneTypeLocation = gl.getUniformLocation(program, "uSceneType");

  gl.uniform1f(uTimeLocation, performance.now() / 1000);
  gl.uniform2f(
    uResolutionLocation,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight
  );
  gl.uniform1f(uRotationLocation, rotation);
  gl.uniform1i(uSceneTypeLocation, sceneType);

  // 绘制场景
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function updatePreview(canvas, texture) {
  const previewCtx = canvas.getContext("2d");
  const image = new Image();

  // 从纹理创建图像
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  // 临时绑定纹理并读取像素
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(
    0,
    0,
    canvas.width,
    canvas.height,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels
  );

  // 将像素绘制到临时canvas
  const imageData = tempCtx.createImageData(canvas.width, canvas.height);
  imageData.data.set(pixels);
  tempCtx.putImageData(imageData, 0, 0);

  // 更新预览画布
  previewCtx.clearRect(0, 0, canvas.width, canvas.height);
  previewCtx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}
