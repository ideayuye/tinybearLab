import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./Grid.module.scss";

// Single-file React component for a buttery-smooth "infinite" grid with orbit controls.
// Drop into a Vite + React project, then <InfiniteGridThree /> anywhere.

export default function InfiniteGridThree() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const gridMeshRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0f12);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights (optional – shader draws its own colors, but a little ambient helps other helpers)
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Axes Helper (toggle if you like)
    const axes = new THREE.AxesHelper(1.5);
    scene.add(axes);

    // Infinite Grid as a shader-driven plane that follows the camera in XZ.
    const gridMaterial = new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: true,
      uniforms: {
        uMajorColor: { value: new THREE.Color(0x126ecf) }, // major lines
        uMinorColor: { value: new THREE.Color(0xb5b7bb) }, // minor lines
        uBgColor: { value: new THREE.Color(0x0d0f12) },
        uMajorStep: { value: 10.0 }, // every 10 units
        uMinorStep: { value: 1.0 }, // every 1 unit
        uFadeStart: { value: 40.0 }, // start fading at this camera distance (in world units)
        uFadeEnd: { value: 120.0 }, // fully faded after this distance
        uCamPos: { value: new THREE.Vector3() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vWorldPos;
        uniform vec3 uMajorColor;
        uniform vec3 uMinorColor;
        uniform vec3 uBgColor;
        uniform float uMajorStep;
        uniform float uMinorStep;
        uniform float uFadeStart;
        uniform float uFadeEnd;
        uniform vec3 uCamPos;

        // Returns anti-aliased grid line intensity for the given step.
        float gridLine(vec2 coord, float step) {
          // Scale to grid cell space
          vec2 c = coord / step;
          // Distance to nearest grid line in each axis, normalized by derivative for AA
          vec2 w = fwidth(c);
          vec2 a = abs(fract(c - 0.5) - 0.5) / max(w, vec2(1e-6));
          float line = 1.0 - min(min(a.x, a.y), 1.0);
          return line;
        }

        void main() {
          vec2 worldXZ = vWorldPos.xz;

          // Two layers of grid: minor (1u) and major (10u)
          float minor = gridLine(worldXZ, uMinorStep);
          float major = gridLine(worldXZ, uMajorStep);

          // Blend colors: major lines override minor where present
          vec3 gridColor = mix(uMinorColor, uMajorColor, smoothstep(0.0, 1.0, major));
          float intensity = max(minor * 0.6, major); // make major more visible

          // Distance-based fade from camera to avoid moiré in the far field
          float dist = length(vec2(worldXZ - uCamPos.xz));
          float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, dist);

          vec3 color = mix(uBgColor, gridColor, intensity * fade);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000, 1, 1), // large, but we'll also re-center under the camera
      gridMaterial
    );
    plane.rotation.x = -Math.PI * 0.5; // lie flat on XZ
    plane.frustumCulled = false; // always render
    gridMeshRef.current = plane;
    scene.add(plane);

    // Keep the plane centered beneath camera in XZ, so it feels infinite.
    const updateGridFollow = () => {
      const gx = camera.position.x;
      const gz = camera.position.z;
      plane.position.set(gx, 0, gz);
      gridMaterial.uniforms.uCamPos.value.copy(camera.position);
    };

    // Resize handling
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    onResize();

    // Render loop
    stopRef.current = false;
    const tick = () => {
      if (stopRef.current) return;
      controls.update();
      updateGridFollow();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    // Cleanup
    return () => {
      stopRef.current = true;
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (
        renderer.domElement &&
        renderer.domElement.parentElement === container
      ) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometry/material
      plane.geometry.dispose();
      gridMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.can}
      // className="w-full h-[70vh] min-h-[420px] rounded-2xl overflow-hidden shadow-xl"
      style={{ background: "#0d0f12" }}
    />
  );
}
