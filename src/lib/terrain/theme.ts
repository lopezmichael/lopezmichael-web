import * as THREE from 'three';
import { DARK_PALETTE } from './config';

function toVec3(rgb: readonly number[]): THREE.Color {
  return new THREE.Color(rgb[0], rgb[1], rgb[2]);
}

export function getPaletteForTheme(_theme: string): {
  colors: THREE.Color[];
  background: THREE.Color;
} {
  // Terrain always renders dark regardless of site theme
  const p = DARK_PALETTE;

  const colors = [
    toVec3(p.neutral),
    toVec3(p.primary),
    toVec3(p.secondary),
    toVec3(p.accent),
    toVec3(p.cool),
  ];

  return { colors, background: toVec3(p.background) };
}
