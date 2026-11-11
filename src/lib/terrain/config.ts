// Per-mode, seeded parameters live in state.ts (paramsFor).

// Height ramp, low to high: deep canyon to sand (docs/design-principles.md → Tokens, "Terrain ramp").
// No teal or green at the top: it collides with the CPAL brand. Terrain always renders dark.
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
export const TERRAIN_RAMP = ['#4A2420', '#A04428', '#C4724D', '#D4956E', '#F2C685'].map(hex);
export const TERRAIN_BACKGROUND = hex('#020101'); // near-black

export const GRID_SIZE = 100;
export const GRID_SEGMENTS = 128;
/** Lighter mesh for small screens (with bloom off there too). */
export const GRID_SEGMENTS_SMALL = 96;
