export interface TerrainParams {
  scale1: number;
  scale2: number;
  scale3: number;
  height1: number;
  height2: number;
  height3: number;
  waveSpeed: number;
  waveIntensity: number;
  timeScale: number;
  rotationSpeed: number;
  rotationAmount: number;
}

export interface CameraParams {
  startX: number;
  startY: number;
  startZ: number;
  lookAtY: number;
  fov: number;
}

export function randomizeTerrainParams(): TerrainParams {
  return {
    scale1: 0.02 + Math.random() * 0.02,
    scale2: 0.04 + Math.random() * 0.04,
    scale3: 0.08 + Math.random() * 0.08,
    height1: 6 + Math.random() * 6,
    height2: 3 + Math.random() * 3,
    height3: 1 + Math.random() * 2,
    waveSpeed: 0.3 + Math.random() * 0.4,
    waveIntensity: 1 + Math.random() * 1.5,
    timeScale: 0.003 + Math.random() * 0.004,
    rotationSpeed: 0.15 + Math.random() * 0.15,
    rotationAmount: 0.03 + Math.random() * 0.04,
  };
}

export function randomizeCameraParams(): CameraParams {
  return {
    startX: (Math.random() - 0.5) * 20,
    startY: 25 + Math.random() * 15,
    startZ: 40 + Math.random() * 20,
    lookAtY: -8 + Math.random() * 6,
    fov: 55 + Math.random() * 15,
  };
}

// Canyon palette: bright wireframe on near-black background
// Terrain always renders dark regardless of site theme
export const DARK_PALETTE = {
  primary: [0.769, 0.447, 0.302],   // #C4724D
  secondary: [0.831, 0.584, 0.431], // #D4956E
  accent: [0.910, 0.769, 0.588],    // #E8C496
  cool: [0.353, 0.490, 0.420],      // #5A7D6B
  neutral: [0.165, 0.141, 0.125],   // #2a2420
  background: [0.008, 0.006, 0.005], // Near-black
} as const;

export const GRID_SIZE = 100;
export const GRID_SEGMENTS = 128;
