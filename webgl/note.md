### webgpu api invoke flow

1. request device and adapter
2. create shader module
3. create webgpu context
4. configure context
5. create buffer & write buffer
6. create a GPUVertexBufferLayout and GPURenderPipelineDescriptor
7. create pipeline
8. create GPURenderPassDescriptor
9. create command encoder
10. create render pass encoder
11. set pipeline & set vertex buffer && draw
12. end render pass & end pass array of command buffers to command queue for execution

### webgl api invoke flow

1. create webgl context
2. create shader and attach shader
3. init program
4. create program info
5. create buffer
6. set model matrix && perspective matrix
7. bind buffer & use vertex
8. draw
