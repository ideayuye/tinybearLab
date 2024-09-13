const BUFFER_SIZE = 2048;

async function init() {
  const shader = `
@group(0) @binding(0)
var<storage, read_write> output: array<f32>;

@group(0) @binding(1)
var<storage, read> input: array<f32>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id)
  global_id: vec3u,
  @builtin(local_invocation_id)
  local_id: vec3u,
) {
  if (global_id.x >= ${BUFFER_SIZE}u) {
    return;
  }

  output[global_id.x] = input[global_id.x] * 1000. + f32(local_id.x);
}
`;

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  let device = await adapter.requestDevice();

  const shaderModule = device.createShaderModule({
    code: shader,
  });

  const output = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const input = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const inputData = new Float32Array(BUFFER_SIZE).fill(2);
  for (let i = 0; i < BUFFER_SIZE; i++) {
    inputData[i] = i;
  }

  device.queue.writeBuffer(input, 0, inputData);

  // input.mapAsync(GPUMapMode.WRITE, 0, BUFFER_SIZE * 4);
  // new Float32Array(input.getMappedRange()).set(inputData);
  // input.unmap();

  const stagingBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
    ],
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: output,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: input,
        },
      },
    ],
  });

  const computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();

  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(Math.ceil(BUFFER_SIZE / 64));

  passEncoder.end();

  // 复制 output 缓冲去到 staging 缓冲区
  commandEncoder.copyBufferToBuffer(
    output,
    0, // 来源缓冲区偏移量
    stagingBuffer,
    0, // 目的缓冲区偏移量
    BUFFER_SIZE
  );

  // 通过将命令缓冲区数组传递给命令队列以执行来结束
  device.queue.submit([commandEncoder.finish()]);

  // 映射 staging 缓冲区，以便读回到 JS
  await stagingBuffer.mapAsync(
    GPUMapMode.READ,
    0, // 偏移量
    BUFFER_SIZE // 长度
  );

  const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE);
  const data = copyArrayBuffer.slice();
  stagingBuffer.unmap();
  console.log("whr", new Float32Array(data));
}

init();
