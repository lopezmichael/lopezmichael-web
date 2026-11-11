import * as THREE from 'three';
import { GRID_WIDTH, GRID_DEPTH, GRID_SEGMENTS, GRID_SEGMENTS_SMALL } from './config';
import { terrainVertexShader, terrainFragmentShader } from './shaders';
import { createPostProcessing, type PostProcessing } from './postprocessing';
import { getTerrainPalette } from './theme';
import { MODE_GROUND, TERRAIN_MODES, TINTS, paramsFor, type TerrainState } from './state';

export interface TerrainHandle {
  /** Morph to a new mode / seed / tint. Reuses the renderer; only uniforms and the camera change. */
  set(state: TerrainState): void;
  dispose(): void;
}

const BLEND_MS = 800;
const SMALL_SCREEN = 768;

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Starts the terrain in `container`. Returns a handle, or null when the browser has no WebGL
 *  (hardware acceleration off, blocklisted GPU); other failures throw as usual. */
export function createTerrain(container: HTMLElement, initial: TerrainState): TerrainHandle | null {
  if (!webglAvailable()) return null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || 1;
  let small = width < SMALL_SCREEN;

  const palette = getTerrainPalette();
  let { terrain: params, camera: cam } = paramsFor(initial.mode, initial.seed);

  const scene = new THREE.Scene();
  scene.background = palette.background; // rendered by Three.js (bloom destroys canvas alpha)

  const camera = new THREE.PerspectiveCamera(cam.fov, width / height, 0.1, 1000);
  camera.position.set(cam.x, cam.y, cam.z);
  camera.lookAt(0, cam.lookAtY, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  // Small screens get fewer pixels and frames: the slow drift doesn't need more, and phones pay for it.
  const pixelRatio = () => Math.min(window.devicePixelRatio, small ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio());
  container.appendChild(renderer.domElement);

  // Lighter mesh on small screens; swapped if the container crosses the breakpoint.
  const makeGeometry = () => {
    const n = small ? GRID_SEGMENTS_SMALL : GRID_SEGMENTS;
    return new THREE.PlaneGeometry(GRID_WIDTH, GRID_DEPTH, Math.round((n * GRID_WIDTH) / GRID_DEPTH), n);
  };

  const modeId = (state: TerrainState) => TERRAIN_MODES.indexOf(state.mode);
  const uniforms = {
    uTime: { value: 0 },
    uBlend: { value: 1 },
    uModeA: { value: modeId(initial) },
    uModeB: { value: modeId(initial) },
    uSeedA: { value: initial.seed },
    uSeedB: { value: initial.seed },
    uScaleA: { value: new THREE.Vector3(...params.scale) },
    uScaleB: { value: new THREE.Vector3(...params.scale) },
    uHeightA: { value: new THREE.Vector3(...params.height) },
    uHeightB: { value: new THREE.Vector3(...params.height) },
    uWavePhase: { value: 0 },
    uWaveIntensity: { value: params.waveIntensity },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uLift: { value: 0 },
    uTint: { value: new THREE.Vector3(...TINTS[initial.tint]) },
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

  const mesh = new THREE.Mesh(makeGeometry(), material);
  mesh.rotation.x = params.tilt;
  mesh.position.y = -10;
  scene.add(mesh);

  // Bloom is the glow, off on small screens. If the composer can't be built, render directly;
  // the shader encodes its own output color space, so both paths look the same.
  let post: PostProcessing | null = null;
  try {
    post = createPostProcessing(renderer, scene, camera);
    post.setBloom(!small);
  } catch {
    post = null;
  }
  const render = () => (post ? post.composer.render() : renderer.render(scene, camera));

  // ---- Targets the frame loop eases toward -------------------------------------------------
  let time = 0;
  let wavePhase = 0;
  let rollPhase = 0;
  let waveIntensityTarget = params.waveIntensity;
  let rollAmount = params.rotationAmount;
  let blendStart = -1; // performance.now() when a morph began; -1 when idle
  let pending: TerrainState | null = null; // a choice made mid-morph, applied when it finishes
  let groundA = MODE_GROUND[initial.mode];
  let groundB = groundA;
  let tilt = params.tilt;
  const camTarget = new THREE.Vector3(cam.x, cam.y, cam.z);
  let lookAtTarget = cam.lookAtY;
  let lookAtY = cam.lookAtY;
  let fovTarget = cam.fov;
  const tintTarget = new THREE.Vector3(...TINTS[initial.tint]);

  // ---- Pointer: lift the ground under the cursor or finger, and drift the camera -------------
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();
  const normal = new THREE.Vector3();
  let pointerOn = false;
  let liftTarget = 0;

  function onPointerMove(e: PointerEvent) {
    const r = container.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    pointerOn = true;
    liftTarget = 1;
    kick();
  }
  function onPointerLeave() {
    pointerOn = false;
    liftTarget = 0;
    kick();
  }
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerdown', onPointerMove);
  container.addEventListener('pointerleave', onPointerLeave);
  container.addEventListener('pointercancel', onPointerLeave);

  function updatePointer() {
    if (!pointerOn) return;
    // Intersect the ray with the plane at the terrain's ground level (not the flat base), then
    // express the hit in mesh space. Runs after the camera moves, so it uses this frame's view.
    camera.updateMatrixWorld();
    mesh.updateMatrixWorld();
    normal.set(0, 0, 1).transformDirection(mesh.matrixWorld);
    const ground = groundB + (groundA - groundB) * uniforms.uBlend.value;
    hit.set(0, 0, ground).applyMatrix4(mesh.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(normal, hit);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      mesh.worldToLocal(hit);
      uniforms.uPointer.value.set(hit.x, hit.y);
    }
  }

  // ---- Render loop: only while visible; with reduced motion, only while something moves ------
  let raf = 0;
  let visible = true;
  const ease = reduceMotion ? 1 : 0.06;
  const approach = (from: number, to: number, k: number) => (Math.abs(to - from) < 1e-3 ? to : from + (to - from) * k);

  let lastFrame = 0;
  function frame(now: number) {
    raf = 0;
    // 30 fps on small screens: a skipped frame reschedules through the same visibility gate.
    if (small && !reduceMotion && now - lastFrame < 1000 / 30 - 1) {
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      return;
    }
    lastFrame = now;

    // Phases accumulate, so a new speed changes the rate without jumping the wave or the roll.
    if (!reduceMotion) {
      time += params.timeScale;
      wavePhase += params.timeScale * params.waveSpeed;
      rollPhase += params.timeScale * params.rotationSpeed;
    }
    uniforms.uTime.value = time;
    uniforms.uWavePhase.value = wavePhase;
    uniforms.uWaveIntensity.value = approach(uniforms.uWaveIntensity.value, waveIntensityTarget, ease);
    rollAmount = approach(rollAmount, params.rotationAmount, ease);

    let moving = false;
    if (blendStart >= 0) {
      const t = reduceMotion ? 1 : Math.min(1, (now - blendStart) / BLEND_MS);
      uniforms.uBlend.value = t * t * (3 - 2 * t);
      if (t < 1) {
        moving = true;
      } else {
        blendStart = -1;
        if (pending) {
          const next = pending;
          pending = null;
          begin(next);
          moving = true;
        }
      }
    }

    uniforms.uLift.value = approach(uniforms.uLift.value, liftTarget, reduceMotion ? 1 : 0.08);

    // Camera eases toward this terrain's framing, nudged a little by the pointer.
    const follow = pointerOn && !reduceMotion ? 1 : 0;
    const tx = camTarget.x + ndc.x * 6 * follow;
    const ty = camTarget.y + ndc.y * 4 * follow;
    camera.position.set(
      approach(camera.position.x, tx, ease),
      approach(camera.position.y, ty, ease),
      approach(camera.position.z, camTarget.z, ease),
    );
    const fov = approach(camera.fov, fovTarget, ease);
    if (fov !== camera.fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    lookAtY = approach(lookAtY, lookAtTarget, ease);
    camera.lookAt(0, lookAtY, 0);

    mesh.rotation.x = approach(mesh.rotation.x, tilt, ease);
    mesh.rotation.z = reduceMotion ? 0 : Math.sin(rollPhase) * rollAmount;
    updatePointer();

    const tintNow = uniforms.uTint.value;
    tintNow.set(approach(tintNow.x, tintTarget.x, ease), approach(tintNow.y, tintTarget.y, ease), approach(tintNow.z, tintTarget.z, ease));

    moving ||=
      uniforms.uLift.value !== liftTarget ||
      camera.position.x !== tx || camera.position.y !== ty || camera.position.z !== camTarget.z ||
      camera.fov !== fovTarget || lookAtY !== lookAtTarget || mesh.rotation.x !== tilt ||
      !tintNow.equals(tintTarget);

    render();
    if (visible && !document.hidden && (!reduceMotion || moving)) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  // Start a morph from the terrain on screen (B) to `state` (A).
  function begin(state: TerrainState) {
    uniforms.uModeB.value = uniforms.uModeA.value;
    uniforms.uSeedB.value = uniforms.uSeedA.value;
    uniforms.uScaleB.value.copy(uniforms.uScaleA.value);
    uniforms.uHeightB.value.copy(uniforms.uHeightA.value);
    groundB = groundA;

    ({ terrain: params, camera: cam } = paramsFor(state.mode, state.seed));
    uniforms.uModeA.value = modeId(state);
    uniforms.uSeedA.value = state.seed;
    uniforms.uScaleA.value.set(...params.scale);
    uniforms.uHeightA.value.set(...params.height);
    groundA = MODE_GROUND[state.mode];
    waveIntensityTarget = params.waveIntensity;
    uniforms.uBlend.value = 0;
    blendStart = performance.now();

    tilt = params.tilt;
    camTarget.set(cam.x, cam.y, cam.z);
    lookAtTarget = cam.lookAtY;
    fovTarget = cam.fov;
    tintTarget.set(...TINTS[state.tint]);
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    kick();
  });
  io.observe(container);
  const onVisibility = () => kick();
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(() => {
    width = container.clientWidth || width;
    height = container.clientHeight || height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const nowSmall = width < SMALL_SCREEN;
    if (nowSmall !== small) {
      // Crossing the breakpoint: lighter or fuller mesh, bloom off or on, and the pixel ratio for
      // both the renderer and the composer (it keeps its own copy) before the single resize below.
      small = nowSmall;
      mesh.geometry.dispose();
      mesh.geometry = makeGeometry();
      post?.setBloom(!small);
      renderer.setPixelRatio(pixelRatio());
      post?.composer.setPixelRatio(pixelRatio());
    }
    renderer.setSize(width, height);
    post?.resize(width, height);
    kick();
  });
  ro.observe(container);

  kick();

  return {
    set(state) {
      // Mid-morph, remember only the latest choice and start it when the current morph ends,
      // so rapid clicks never jump the ground.
      if (blendStart >= 0) pending = state;
      else begin(state);
      kick();
    },

    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerLeave);
      post?.dispose();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
