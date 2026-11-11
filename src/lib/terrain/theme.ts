import * as THREE from 'three';
import { TERRAIN_RAMP, TERRAIN_BACKGROUND } from './config';

const toColor = ([r, g, b]: readonly number[]) => new THREE.Color(r, g, b);

/** The terrain's colors. It always renders dark, whatever the site theme. */
export function getTerrainPalette(): { colors: THREE.Color[]; background: THREE.Color } {
  return { colors: TERRAIN_RAMP.map(toColor), background: toColor(TERRAIN_BACKGROUND) };
}
