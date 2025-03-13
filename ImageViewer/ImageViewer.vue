<template>
  <div ref="conRef" class="AMHS-img">
    <img
      ref="imgRef"
      :src="src"
      draggable="false"
      @load="onImgLoaded"
      @click="setOriginal"
    />
    <span
      :class="['close-button', 'iconfont', 'icon-guanbi-small']"
      @click="closeHandle"
    ></span>
    <span
      class="center"
      :style="{ left: `${centerMark.x}px`, top: `${centerMark.y}px` }"
    ></span>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Hammer from "hammerjs";
// import { mat3, vec3, vec2 } from 'gl-matrix';
// import { initMatrix, moveCenter } from './imageTransform';

defineProps({
  src: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);



const closeHandle = () => {
  emit("close");
}

const imgRef = ref(null);
const conRef = ref(null);
const centerMark = ref({x: 0, y:0})

let currentScale = 0.81;
let currentX = 0;
let currentY = 0;
const minScale = 0.4;
const maxScale = 4;
let original = {x: 0, y: 0}
// let matrix = createScalingMatrix(1, 1, 0, 0, 0, 0);
let w = 0;
let h = 0;
let left = 0;
let top = 0;
// let matrix3 = mat3.create();
let centerX = 0;
let centerY = 0;


let reparation = {x: 0, y: 0}
function setOriginal(e) {
  let oldX = original.x
  let oldY = original.y
  // e.offset 得到的是缩放比例为1的坐标
  original.x = e.offsetX
  original.y = e.offsetY

  console.log(original, 'original')
  const {left, top} = imgRef.value.getBoundingClientRect();
  const imgPos = {
    x: Math.round(left + currentX + centerX),
    y: Math.round(top + currentY + centerY),
    right: Math.round(left + imgRef.value.clientWidth * currentScale + currentX + centerX),
    bottom: Math.round(top + imgRef.value.clientHeight * currentScale + currentY + centerY)
  }

  centerMark.value.x = original.x*currentScale + imgPos.x;
  centerMark.value.y = original.y*currentScale + imgPos.y;
  imgRef.value.style['transform-origin'] = `${original.x}px ${original.y}px`
  const dx = -(original.x - oldX)*(1-currentScale)
  const dy = -(original.y - oldY)*(1-currentScale)
  reparation.x += dx
  reparation.y += dy
  const cssMatrix = `matrix(${currentScale}, 0, 0, ${currentScale}, ${reparation.x}, ${reparation.y})`;
  imgRef.value.style.transform = cssMatrix;
}

window.setScale = (scale) => {
  const cssMatrix = `matrix(${currentScale*scale}, 0, 0, ${currentScale*scale}, ${reparation.x}, ${reparation.y})`;
  imgRef.value.style.transform = cssMatrix;
  currentScale *= scale
}

// const mx = initMatrix(currentScale, currentX, currentY)
// function createScalingMatrix(scaleX, scaleY, centerX, centerY, offsetX, offsetY) {
//     /**
//      * 根据缩放比例、缩放中心、偏移值生成二维仿射变换矩阵。
//      *
//      * 参数:
//      *     scaleX (number): X轴缩放比例
//      *     scaleY (number): Y轴缩放比例
//      *     centerX (number): 缩放中心的X坐标
//      *     centerY (number): 缩放中心的Y坐标
//      *     offsetX (number): 缩放后的X轴偏移量
//      *     offsetY (number): 缩放后的Y轴偏移量
//      *
//      * 返回:
//      *     Array: 3x3变换矩阵，格式为：
//      *         [[sx, 0, tx],
//      *          [0, sy, ty],
//      *          [0,  0, 1]]
//      */

//     // 计算平移分量：缩放中心补偿 + 用户偏移
//     const translateX = centerX * (1-scaleX) + offsetX;
//     const translateY = centerY * (1-scaleY) + offsetY;

//     // 构造变换矩阵
//     return [
//         [scaleX, 0,        translateX],
//         [0,      scaleY,   translateY],
//         [0,      0,        1         ]
//     ];
// }

// console.log('matrix', createScalingMatrix(2, 2, 100, 100, 0, 0))

function onImgLoaded() {
  const rect = imgRef.value.getBoundingClientRect();
  w = imgRef.value.clientWidth;
  h = imgRef.value.clientHeight;
  left = rect.left;
  top = rect.top;
  const dh = imgRef.value.clientHeight - conRef.value.clientHeight
  if (dh > 0) {
    top = -dh *0.5
  }
  // matrix = createScalingMatrix(currentScale, currentScale, original.x, original.y, currentX, currentY)
  // matrix3 = mat3.fromValues(matrix[0][0], matrix[1][0], matrix[2][0], matrix[0][1], matrix[1][1], matrix[2][1], matrix[0][2], matrix[1][2], matrix[2][2]);
  updateTransform()
}

// 更新变换
function updateTransform() {
    // console.log(currentScale, original.x, original.y, currentX, currentY, '最终变换参数')
    // matrix = createScalingMatrix(currentScale, currentScale, original.x, original.y, currentX, currentY)
    // const cssMatrix = `matrix(${matrix[0][0]}, ${matrix[1][0]}, ${matrix[0][1]}, ${matrix[1][1]}, ${matrix[0][2]}, ${matrix[1][2]})`;

    // 提取相关值
    // const a = matrix3[0];
    // const b = matrix3[1];
    // const c = matrix3[3];
    // const e = matrix3[4];
    // const tx = matrix3[6];
    // const ty = matrix3[7];

    // 构造 CSS 的 matrix
    // const cssMatrix = `matrix(${a}, ${b}, ${c}, ${e}, ${tx}, ${ty})`;
    imgRef.value.style['transform-origin'] = `${original.x}px ${original.y}px`

    const cssMatrix = `matrix(${currentScale}, 0, 0, ${currentScale}, ${currentX+centerX }, ${currentY+centerY})`;
    imgRef.value.style.transform = cssMatrix;
    // 应用变换
    // imgRef.value.style.transform = `
    //     translate(${currentX}px, ${currentY}px)
    //     scale(${currentScale})
    // `;

}

/**
 * 更新变换参数
*/
function updateTransformParam(offsetX, offsetY, newScale) {
  const mouseMove = {
    x: (offsetX - centerX),
    y: (offsetY - centerY)
  }

  const deltaScale = newScale/currentScale
  centerX += (mouseMove.x - currentX) * (1 - deltaScale)
  centerY += (mouseMove.y - currentY) * (1 - deltaScale)
  currentScale = newScale;
}

/**
 * 限制移动的边界
 */
function limitMoveBound(deltaX, deltaY) {
  if (!conRef.value) {
    return {deltaX: 0, deltaY: 0}
  }
  // 计算最大边框
  const { clientWidth, clientHeight } = conRef.value
  const limit = {
    minX: 0 + 2,
    maxX: clientWidth -2,
    minY: 0 + 2,
    maxY: clientHeight -2
  }
  // 读取img的边界
  const imgPos = {
    x: Math.round(left + currentX + centerX),
    y: Math.round(top + currentY + centerY),
    right: Math.round(left + imgRef.value.clientWidth * currentScale + currentX + centerX),
    bottom: Math.round(top + imgRef.value.clientHeight * currentScale + currentY + centerY)
  }

  // 判断图片是否在最大边框内
  let finalDeltaX = deltaX
  let finalDeltaY = deltaY

  // 移动出去不可以，但是可以从外面移回, 移入的优先级更高
  // 判断下边框
  if (imgPos.bottom + deltaY >= limit.maxY) {
    finalDeltaY = Math.max( limit.maxY - imgPos.bottom, 0)
  }

  // 判断上边框
  if (imgPos.y + deltaY <= limit.minY) {
    finalDeltaY = Math.min(limit.minY - imgPos.y, 0)
  }

  // 上边框移入
  if (imgPos.y < limit.minY && deltaY > 0) {
    finalDeltaY = Math.min(deltaY, limit.minY - imgPos.y)
  }

  // 下边框移入
  if (imgPos.bottom > limit.maxY && deltaY < 0) {
    finalDeltaY = Math.max( deltaY, limit.maxY - imgPos.bottom )
  }


  // 判断右边框
  if (imgPos.right + deltaX >= limit.maxX) {
    finalDeltaX = Math.max( limit.maxX - imgPos.right, 0)
  }

  // 判断左边框
  if (imgPos.x + deltaX <= limit.minX) {
    finalDeltaX = Math.min( limit.minX - imgPos.x, 0)
  }

  // 判断左边框移入
  if (imgPos.x < limit.minX && deltaX > 0) {
    finalDeltaX = Math.min(deltaX, limit.minX - imgPos.x)
  }

  // 判断右边框移入
  if (imgPos.right > limit.maxX && deltaX < 0) {
    finalDeltaX = Math.max( deltaX, limit.maxX - imgPos.right )
  }

  return {
    deltaX: finalDeltaX,
    deltaY: finalDeltaY
  }
}
let hammer

onMounted(() => {
  // 初始化 Hammer 手势识别
  hammer = new Hammer.Manager(conRef.value, {
      recognizers: [
          // 同时识别平移和缩放手势
          [Hammer.Pan, { direction: Hammer.DIRECTION_ALL }],
          [Hammer.Pinch]
      ]
  });

  let startPos;
  let lastDeltaX = 0;
  let lastDeltaY = 0;
  hammer.on('panstart', (e) => {
    startPos = {
      x: currentX,
      y: currentY
    }
    lastDeltaX = 0;
    lastDeltaY = 0;
  });

  // 缩放手势处理
  hammer.on('pinchmove', (e) => {
      // 计算缩放比例（基于初始缩放值）
      const delta = e.scale > 1 ? 1.03 : 0.97
      let newScale = currentScale * delta;

      const pinX = e.center.x;
      const pinY = e.center.y;

      newScale = Math.min(Math.max(minScale, newScale), maxScale);

      if (newScale === currentScale) {
        return
      }

      const offsetX = pinX - left;
      const offsetY = pinY - top;

      updateTransformParam(offsetX, offsetY, newScale)

      updateTransform();
  });

  // 平移手势处理
  hammer.on('panmove', (e) => {
    if (!startPos) {
      return
    }
    const { deltaX, deltaY } = limitMoveBound(e.deltaX-lastDeltaX, e.deltaY-lastDeltaY)

    currentX += deltaX;
    currentY += deltaY;

    lastDeltaX = e.deltaX
    lastDeltaY = e.deltaY

    updateTransform();
    e.srcEvent.preventDefault();
  });

  // 鼠标滚轮处理（保持原逻辑）
  conRef.value.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      let newScale = currentScale * delta;

      console.log('offset', e.offsetX, e.offsetY)
      const {left, top} = imgRef.value.getBoundingClientRect();
      const offsetX = e.clientX - left;
      const offsetY = e.clientY - top;
      // const v3 = vec3.fromValues(offsetX, offsetY, 1);
      // let m3 = mat3.fromValues(matrix[0][0], matrix[1][0], matrix[2][0], matrix[0][1], matrix[1][1], matrix[2][1], matrix[0][2], matrix[1][2], matrix[2][2]);
      // mat3.invert(m3, m3)
      // const out = vec3.create()
      // vec3.transformMat3(out, v3, m3)
      // console.log(matrix, 'matrix')
      // console.log(offsetX, offsetY, 'to img coord')

      // original.x = out[0]
      // original.y = out[1]

      // console.log(original.x, original.y, 'original')
      // console.log(currentX, currentY, 'translate')
      newScale = Math.min(Math.max(minScale, newScale), maxScale);

      if (newScale === currentScale) {
        return
      }

      // console.log('scale', newScale)
      // 重置为初始值

      // 先缩放
      // mat3.scale(matrix3, matrix3, vec2.fromValues(delta, delta))

      // 中心位置偏移补偿
      // const dx = (offsetX - centerDx) * (currentScale - newScale)
      // const dy = (offsetY - centerDy) * (currentScale - newScale)
      // mat3.translate(matrix3, matrix3, vec2.fromValues(dx, dy))

      // console.log(moveCenter(mx, offsetX, offsetY, currentScale, newScale, delta, centerX, centerY), 'change')

      // updateTransformParam(offsetX, offsetY, newScale)


      // 设置原点方案
      // 第一步：更新原点
      // 更新原点偏移补偿
      const offsetAt1 = { x: offsetX/currentScale, y: offsetY/currentScale }
      const dx = -(offsetAt1.x - original.x)*(1-currentScale)
      const dy = -(offsetAt1.y - original.y)*(1-currentScale)
      original.x = offsetAt1.x
      original.y = offsetAt1.y
      centerX += dx
      centerY += dy

      // 缩放
      currentScale = newScale

      updateTransform();
  }, { passive: false });


});

onBeforeUnmount(
  () => {
    if (hammer) {
      hammer.destroy();
    }
  }
)
</script>

<style lang="scss" scoped>
.AMHS-img {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  img {
    display: block;
    max-width: 100%; /* 宽度不超过容器 */
    max-height: 100%; /* 高度不超过容器 */
    object-fit: contain; /* 保持宽高比，内容完整显示 */
    transform-origin: 0 0;
  }

  .close-button {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    font-size: 2.4rem;
  }

  .img-content {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .center {
    position: absolute;
    border-radius: 50%;
    display: block;
    width: 5px;
    height: 5px;
    background: #f00;
  }
}
</style>
