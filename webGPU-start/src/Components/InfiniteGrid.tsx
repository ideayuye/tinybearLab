import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./Grid.module.scss";

// InfiniteScreenGrid.jsx
// Renders a true "infinite" XZ grid by drawing a fullscreen quad and
// computing the ray-plane intersection in the fragment shader.
// Drop into any Vite + React + three project.

export default function InfiniteScreenGrid() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const materialRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Scene + camera (we'll use a normal perspective camera for the 3D view)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Helpers (optional)
    const axes = new THREE.AxesHelper(1.5);
    scene.add(axes);

    // Fullscreen quad geometry: a single triangle that covers the screen is common,
    // but PlaneGeometry(2,2) is simpler here.
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      depthTest: true, // allow other 3D objects to depth occlude if present
      depthWrite: false,
      transparent: false,
      uniforms: {
        uInvProj: { value: new THREE.Matrix4() },
        uInvView: { value: new THREE.Matrix4() },
        uCamPos: { value: new THREE.Vector3() },
        uMinorStep: { value: 1.0 },
        uMajorStep: { value: 10.0 },
        uMinorColor: { value: new THREE.Vector3(0.18, 0.22, 0.28) },
        uMajorColor: { value: new THREE.Vector3(0.14, 0.45, 0.75) },
        uBgColor: { value: new THREE.Vector3(0.05, 0.06, 0.07) },
        uFadeStart: { value: 60.0 },
        uFadeEnd: { value: 180.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform mat4 uInvProj;
        uniform mat4 uInvView;
        uniform vec3 uCamPos;
        uniform float uMinorStep;
        uniform float uMajorStep;
        uniform vec3 uMinorColor;
        uniform vec3 uMajorColor;
        uniform vec3 uBgColor;
        uniform float uFadeStart;
        uniform float uFadeEnd;

        // compute world-space ray from camera through this fragment
        vec3 getRayDir(vec2 uv) {
          // convert uv (0..1) to NDC (-1..1)
          vec2 ndc = uv * 2.0 - 1.0;
          // clip space positions at near plane
          vec4 clip = vec4(ndc, -1.0, 1.0);
          // view space
          vec4 view = uInvProj * clip;
          view /= view.w;
          // world space
          vec4 world = uInvView * view;
          vec3 dir = normalize(world.xyz - uCamPos);
          return dir;
        }

        // anti-aliased grid line using fwidth trick in world units
        float gridLine(float coord, float step) {
          float c = coord / step;
          float fw = fwidth(c);
          float distToLine = abs(fract(c - 0.5) - 0.5);
          return 1.0 - smoothstep(0.0, 0.5 * fw, distToLine);
        }

        void main() {
          // reconstruct ray
          vec3 dir = getRayDir(vUv);

          // if dir is nearly parallel to plane, discard (render bg)
          if (abs(dir.y) < 1e-5) {
            gl_FragColor = vec4(uBgColor, 1.0);
            return;
          }

          // intersect ray with XZ plane at y=0
          float t = - (uCamPos.y) / dir.y;
          if (t <= 0.0) {
            // camera is below plane or ray points away -> show background
            gl_FragColor = vec4(uBgColor, 1.0);
            return;
          }

          vec3 pos = uCamPos + t * dir; // world-space intersection point

          // compute grid intensity
          float minor = max(gridLine(pos.x, uMinorStep), gridLine(pos.z, uMinorStep));
          float major = max(gridLine(pos.x, uMajorStep), gridLine(pos.z, uMajorStep));
          float intensity = max(minor * 0.7, major);

          // distance fade to avoid moiré at far distances
          float dist = length(pos.xz - uCamPos.xz);
          float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, dist);

          vec3 gridColor = mix(uMinorColor, uMajorColor, smoothstep(0.0, 1.0, major));
          vec3 color = mix(uBgColor, gridColor, intensity * fade);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const quad = new THREE.Mesh(quadGeo, material);
    // render the quad with a small offset so other objects can still be depth-tested
    quad.frustumCulled = false;
    scene.add(quad);
    materialRef.current = material;

    const cube = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      wireframe: false,
    });
    const cubeMesh = new THREE.Mesh(cube, cubeMaterial);
    scene.add(cubeMesh);
    cubeMesh.position.set(0, 0, 0);

    // Update uniform helper
    const updateCameraUniforms = () => {
      // inverse projection
      const invProj = new THREE.Matrix4()
        .copy(camera.projectionMatrix)
        .invert();
      // inverse view (camera.matrixWorld is the world transform; view = inverse(matrixWorld))
      const invView = new THREE.Matrix4().copy(camera.matrixWorld);

      material.uniforms.uInvProj.value.copy(invProj);
      material.uniforms.uInvView.value.copy(invView);
      material.uniforms.uCamPos.value.copy(camera.position);
    };

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);
    onResize();

    stopRef.current = false;
    const tick = () => {
      if (stopRef.current) return;
      controls.update();
      updateCameraUniforms();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    // cleanup
    return () => {
      stopRef.current = true;
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
      quad.geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.can}
      // style={{
      //   width: "100%",
      //   height: "70vh",
      //   minHeight: 420,
      //   background: "#050607",
      //   borderRadius: 12,
      //   overflow: "hidden",
      // }}
    />
  );
}
