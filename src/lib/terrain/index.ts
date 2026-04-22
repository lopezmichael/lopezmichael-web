import * as THREE from 'three';
import {
  randomizeTerrainParams,
  randomizeCameraParams,
  GRID_SIZE,
  GRID_SEGMENTS,
} from './config';
import { terrainVertexShader, terrainFragmentShader } from './shaders';
import { createPostProcessing } from './postprocessing';
import { getPaletteForTheme } from './theme';

let disposed = false;
let animationId: number | null = null;

export function disposeTerrain() {
  disposed = true;
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function initTerrain(container: HTMLElement) {
  disposed = false;

  // Guard against zero-size container
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const seed = Math.random() * 10000;
  const terrainParams = randomizeTerrainParams();
  const cameraParams = randomizeCameraParams();

  // Terrain always uses dark palette regardless of site theme
  const palette = getPaletteForTheme('dark');

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // Scene — background rendered by Three.js (bloom destroys canvas alpha)
  const scene = new THREE.Scene();
  scene.background = palette.background;

  // Camera
  const camera = new THREE.PerspectiveCamera(
    cameraParams.fov,
    width / height,
    0.1,
    1000,
  );
  camera.position.set(
    cameraParams.startX,
    cameraParams.startY,
    cameraParams.startZ,
  );
  camera.lookAt(0, cameraParams.lookAtY, 0);

  // Renderer — scene.background handles bg color (bloom destroys alpha)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Terrain geometry with ShaderMaterial (wireframe)
  const geometry = new THREE.PlaneGeometry(
    GRID_SIZE,
    GRID_SIZE,
    GRID_SEGMENTS,
    GRID_SEGMENTS,
  );

  const uniforms = {
    uTime: { value: 0 },
    uScale1: { value: terrainParams.scale1 },
    uScale2: { value: terrainParams.scale2 },
    uScale3: { value: terrainParams.scale3 },
    uHeight1: { value: terrainParams.height1 },
    uHeight2: { value: terrainParams.height2 },
    uHeight3: { value: terrainParams.height3 },
    uWaveSpeed: { value: terrainParams.waveSpeed },
    uWaveIntensity: { value: terrainParams.waveIntensity },
    uSeed: { value: seed },
    uColor0: { value: palette.colors[0] },
    uColor1: { value: palette.colors[1] },
    uColor2: { value: palette.colors[2] },
    uColor3: { value: palette.colors[3] },
    uColor4: { value: palette.colors[4] },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms,
    wireframe: true,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / (2.2 + Math.random() * 0.6);
  terrain.position.y = -10;
  scene.add(terrain);

  // Post-processing (bloom)
  let postProcessing: ReturnType<typeof createPostProcessing> | null = null;
  try {
    postProcessing = createPostProcessing(renderer, scene, camera);
  } catch {
    // Fallback: render without bloom on low-end devices
  }

  // Terrain always renders in dark mode — no theme switching needed

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(event: MouseEvent) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  }
  document.addEventListener('mousemove', onMouseMove);

  // Resize
  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    postProcessing?.resize(w, h);
  }
  window.addEventListener('resize', onResize);

  // For reduced motion: render one static frame and stop
  if (prefersReducedMotion) {
    if (postProcessing) {
      postProcessing.composer.render();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      disposeTerrain();
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      postProcessing?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }

  // Animation loop
  let time = 0;
  const baseY = cameraParams.startY;
  const baseX = cameraParams.startX;

  function animate() {
    if (disposed) return;
    animationId = requestAnimationFrame(animate);

    time += terrainParams.timeScale;
    uniforms.uTime.value = time;

    // Camera follow mouse
    const targetCameraX = baseX + mouseX * 15;
    const targetCameraY = baseY + mouseY * 10;
    camera.position.x += (targetCameraX - camera.position.x) * 0.02;
    camera.position.y += (targetCameraY - camera.position.y) * 0.02;
    camera.lookAt(0, cameraParams.lookAtY, 0);

    // Subtle terrain rotation
    terrain.rotation.z =
      Math.sin(time * terrainParams.rotationSpeed) *
      terrainParams.rotationAmount;

    // Render
    if (postProcessing) {
      postProcessing.composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  animate();

  // Return cleanup function
  return () => {
    disposeTerrain();
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    postProcessing?.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };
}
