// Per-mode, seeded parameters live in state.ts (paramsFor).

// Height ramp, low to high: deep canyon to sand (docs/design-principles.md → Tokens, "Terrain ramp").
// No teal or green at the top: it collides with the CPAL brand. Terrain always renders dark.
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
export const TERRAIN_RAMP = ['#4A2420', '#A04428', '#C4724D', '#D4956E', '#F2C685'].map(hex);
export const TERRAIN_BACKGROUND = hex('#020101'); // near-black

// The band is ~3x wider than tall, so the ground is a wide strip that runs past both sides of the
// frame instead of a square sitting in the middle. Segments are per GRID_DEPTH units; the width
// gets proportionally more, keeping vertices square (~0.78 units apart on large screens).
export const GRID_WIDTH = 280;
export const GRID_DEPTH = 100;
export const GRID_SEGMENTS = 128;
/** Lighter mesh for small screens (with bloom off there too). */
export const GRID_SEGMENTS_SMALL = 96;
