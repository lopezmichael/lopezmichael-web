// Pure terrain state: modes, places, seeded parameters, time-of-day defaults and the shareable
// URL form. No Three.js here, so the band's UI can use it without pulling in the renderer.
// Principles: docs/design-principles.md → Terrain principles.

export const TERRAIN_MODES = ['canyon', 'city', 'prairie'] as const;
export type TerrainMode = (typeof TERRAIN_MODES)[number];

export type TerrainTint = 'dawn' | 'day' | 'dusk' | 'night';

export interface TerrainState {
  mode: TerrainMode;
  /** 0-9999. The same mode + seed always rebuilds the same terrain. */
  seed: number;
  tint: TerrainTint;
}

/** The band's label names the landform and seed, e.g. "Canyon · seed 0421". The modes are loosely
 *  inspired by Texas (Palo Duro, the Dallas skyline, the Blackland Prairie) but tuned to look good
 *  rather than to match a real place, so the label no longer names one. */
export const MODE_LABEL: Record<TerrainMode, string> = { canyon: 'Canyon', city: 'City', prairie: 'Prairie' };

/** Each mode's ground level in mesh units, used to place the pointer lift on the surface
 *  rather than on the flat base plane (matches the offsets in shaders.ts). */
export const MODE_GROUND: Record<TerrainMode, number> = { canyon: 0, city: -5, prairie: -1 };

export interface TerrainParams {
  /** Noise frequencies of the three octaves. */
  scale: [number, number, number];
  /** Amplitudes of the three octaves. */
  height: [number, number, number];
  waveSpeed: number;
  waveIntensity: number;
  timeScale: number;
  rotationSpeed: number;
  rotationAmount: number;
  /** Mesh tilt toward the camera (radians, negative). */
  tilt: number;
}

export interface CameraParams {
  x: number;
  y: number;
  z: number;
  lookAtY: number;
  fov: number;
}

/** mulberry32: small, fast, seedable PRNG returning [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Range = readonly [number, number];
interface ModeRanges {
  scale: readonly [Range, Range, Range];
  height: readonly [Range, Range, Range];
  waveIntensity: Range;
  cameraLift: number;
  /** Divisor of PI for the mesh tilt; nearer 2 is flatter ground with upright features. */
  tiltDivisor: Range;
}

// Canyon keeps the original hero's ranges; city and prairie are calmer underneath their features.
const RANGES: Record<TerrainMode, ModeRanges> = {
  canyon: {
    scale: [[0.02, 0.04], [0.04, 0.08], [0.08, 0.16]],
    height: [[6, 12], [3, 6], [1, 3]],
    waveIntensity: [1, 2.5],
    cameraLift: 0,
    tiltDivisor: [2.2, 2.8],
  },
  // City sits lower so the skyline reads as a silhouette on the horizon.
  city: {
    scale: [[0.02, 0.035], [0.05, 0.08], [0.1, 0.16]],
    height: [[2, 4], [1, 2], [0.3, 0.8]],
    waveIntensity: [0.3, 0.6],
    cameraLift: -14,
    // Towers rise along the mesh's up axis, so a steep tilt makes them lean away; keep it flat.
    tiltDivisor: [2.05, 2.2],
  },
  prairie: {
    scale: [[0.015, 0.03], [0.035, 0.06], [0.07, 0.12]],
    height: [[4, 7], [2, 3.5], [0.6, 1.2]],
    waveIntensity: [0.6, 1.2],
    cameraLift: 0,
    tiltDivisor: [2.2, 2.8],
  },
};

/** Deterministic parameters for a mode + seed (the old hero drew these from Math.random()). */
export function paramsFor(mode: TerrainMode, seed: number): { terrain: TerrainParams; camera: CameraParams } {
  const rng = mulberry32(seed * 3 + TERRAIN_MODES.indexOf(mode) + 1);
  const pick = ([lo, hi]: Range) => lo + rng() * (hi - lo);
  const r = RANGES[mode];
  return {
    terrain: {
      scale: [pick(r.scale[0]), pick(r.scale[1]), pick(r.scale[2])],
      height: [pick(r.height[0]), pick(r.height[1]), pick(r.height[2])],
      waveSpeed: pick([0.3, 0.7]),
      waveIntensity: pick(r.waveIntensity),
      timeScale: pick([0.003, 0.007]),
      rotationSpeed: pick([0.15, 0.3]),
      rotationAmount: pick([0.03, 0.07]),
      tilt: -Math.PI / pick(r.tiltDivisor),
    },
    camera: {
      x: pick([-10, 10]),
      y: pick([25, 40]) + r.cameraLift,
      z: pick([40, 60]),
      lookAtY: pick([-8, -2]),
      fov: pick([55, 70]),
    },
  };
}

export const randomSeed = (): number => Math.floor(Math.random() * 10000);

/** Every load (and every Regrow) draws a mode at random; there are no mode buttons. */
export const randomMode = (): TerrainMode => TERRAIN_MODES[Math.floor(Math.random() * TERRAIN_MODES.length)];

export const randomState = (tint: TerrainTint): TerrainState => ({ mode: randomMode(), seed: randomSeed(), tint });

/** Visitor's local time of day → tint. Read from the device clock; nothing leaves the browser. */
export function tintForHour(hour: number): TerrainTint {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

/** RGB multipliers applied to the terrain's height colors. */
export const TINTS: Record<TerrainTint, [number, number, number]> = {
  dawn: [1.06, 0.9, 0.96],
  day: [1, 1, 1],
  dusk: [1.12, 0.86, 0.72],
  night: [0.78, 0.84, 1.05],
};

/** Shareable form used in ?terrain=, e.g. "city-0421". */
export const formatTerrainParam = (mode: TerrainMode, seed: number): string =>
  `${mode}-${String(seed).padStart(4, '0')}`;

export const isTerrainMode = (v: unknown): v is TerrainMode =>
  typeof v === 'string' && (TERRAIN_MODES as readonly string[]).includes(v);

export function parseTerrainParam(value: string | null): { mode: TerrainMode; seed: number } | null {
  const m = value?.match(/^([a-z]+)-(\d{1,4})$/);
  return m && isTerrainMode(m[1]) ? { mode: m[1], seed: Number(m[2]) } : null;
}
