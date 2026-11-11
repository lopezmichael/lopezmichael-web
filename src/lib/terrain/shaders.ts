// Simplex noise GLSL (Ashima webgl-noise, MIT License)
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
               dot(x12.zw,x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// Height per mode. Two terrains (A = target, B = previous) are evaluated and blended, so regrowing
// or switching modes morphs the ground instead of cutting. Mode ids: 0 canyon, 1 city, 2 prairie
// (order of TERRAIN_MODES in state.ts).
export const terrainVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uBlend;
uniform float uModeA;
uniform float uModeB;
uniform float uSeedA;
uniform float uSeedB;
uniform vec3 uScaleA;
uniform vec3 uScaleB;
uniform vec3 uHeightA;
uniform vec3 uHeightB;
uniform float uWavePhase;
uniform float uWaveIntensity;
uniform vec2 uPointer;
uniform float uLift;

varying float vHeight;
varying vec2 vUv;

// Sine-free hash (Dave Hoskins, "Hash without Sine"); stays well-distributed on mobile GPUs.
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float fbm(vec2 p, vec3 sc, vec3 ht, float seed) {
  float n1 = snoise(vec2(p.x * sc.x + uTime * 0.1 + seed, p.y * sc.x + seed)) * ht.x;
  float n2 = snoise(vec2(p.x * sc.y + seed * 1.3, p.y * sc.y + uTime * 0.05 + seed * 1.3)) * ht.y;
  float n3 = snoise(vec2(p.x * sc.z + seed * 2.1, p.y * sc.z + seed * 2.1)) * ht.z;
  return n1 + n2 + n3;
}

// Canyon: the original noise field, stepped into mesa terraces, with a meandering river cut through.
float canyonHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  float h = fbm(p, sc, ht, seed);
  float stepH = 3.2;
  float q = h / stepH;
  h = (floor(q) + smoothstep(0.3, 0.7, fract(q))) * stepH;
  float rx = sin(p.y * 0.06 + seed * 0.37) * 12.0 + sin(p.y * 0.15 + seed) * 4.0;
  float carve = smoothstep(2.5, 9.0, abs(p.x - rx));
  return mix(-9.0, h, carve);
}

// City, after Dallas, drawn as a soft density landscape rather than literal boxes, so it shares
// the canyon's flowing lines: tapered spires downtown, gentle swells for mid-rise and
// neighborhoods, streets and wider avenues as soft grooves, a freeway loop as a low ridge, and a
// river with levees west of downtown (the Trinity). Hard steps alias into jagged noise at this
// mesh density, so every edge here is a smoothstep.
float softBox(vec2 f, vec2 inset, float soft) {
  vec2 a = smoothstep(inset, inset + soft, f) * smoothstep(inset, inset + soft, 1.0 - f);
  return a.x * a.y;
}

float cityHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  float base = -8.0;
  vec2 downtown = vec2(sin(seed) * 10.0, cos(seed * 1.3) * 6.0);
  // Rolling ground under the city, like the land it was built on.
  float ground = fbm(p, sc, ht, seed) * 0.9;

  // Blocks; offsets stay small because large values lose float precision on mobile GPUs.
  float block = 8.0;
  vec2 offset = vec2(fract(seed * 0.618034), fract(seed * 0.414214)) * 160.0;
  vec2 q = (p + offset) / block;
  vec2 cell = floor(q);
  vec2 f = fract(q);
  // Streets as insets on each block; every fourth street is a wider avenue.
  vec2 inset = vec2(mod(cell.x, 4.0) < 0.5 ? 0.2 : 0.1, mod(cell.y, 4.0) < 0.5 ? 0.2 : 0.1);

  vec2 center = (cell + 0.5) * block - offset;
  float d = length(center - downtown);
  float core = exp(-(d * d) / (2.0 * 18.0 * 18.0));
  float r = hash21(cell + offset);
  float r2 = hash21(cell + offset + 17.0);

  // Downtown rises like a hill, and its blocks grow into tall rounded peaks toward the center;
  // farther out, blocks are low swells. Street grooves carry the grid across all of it.
  float lotShape = softBox(f, inset + 0.04, 0.34);
  float dome = core * 6.0;
  float blocks = lotShape * mix(1.0 + r * 1.4, 3.0 + r * r * 17.0, core);
  float park = step(r2, 0.12) * (1.0 - step(0.6, core)); // a few blocks stay open
  float h = base + ground + dome + blocks * (1.0 - park * 0.85);

  // Freeway loop around downtown: a low, soft ridge.
  float ring = abs(length(p - downtown) - 27.0);
  h = mix(h, base + ground * 0.6 + 1.2, 1.0 - smoothstep(0.6, 2.2, ring));

  // River, levees and floodplain west of downtown.
  float rx = downtown.x - 16.0 + sin(p.y * 0.05 + seed) * 5.0 + sin(p.y * 0.13 + seed * 2.0) * 2.0;
  float dr = abs(p.x - rx);
  float river = base + ground * 0.4 - 2.2 * (1.0 - smoothstep(1.5, 4.0, dr)) + exp(-pow((dr - 7.5) / 1.2, 2.0)) * 1.6;
  return mix(river, h, smoothstep(6.0, 10.0, dr));
}

// Prairie: gentle rolling plains, one escarpment ridge, and a creek line below it.
float prairieHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  float h = fbm(p, sc, ht, seed) * 0.35;
  float ex = -10.0 + sin(p.y * 0.05 + seed) * 8.0;
  h += 7.0 * smoothstep(-3.0, 3.0, p.x - ex);
  float cx = ex + 14.0 + sin(p.y * 0.12 + seed * 2.0) * 5.0;
  h -= 2.5 * (1.0 - smoothstep(0.8, 3.5, abs(p.x - cx)));
  return h - 4.0;
}

float modeHeight(float mode, vec2 p, vec3 sc, vec3 ht, float seed) {
  if (mode < 0.5) return canyonHeight(p, sc, ht, seed);
  if (mode < 1.5) return cityHeight(p, sc, ht, seed);
  return prairieHeight(p, sc, ht, seed);
}

// The ambient wave is gentler where the landform has crisp edges (city blocks).
float modeWave(float mode) {
  return mode > 0.5 && mode < 1.5 ? 0.25 : 1.0;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 p = pos.xy;

  float hA = modeHeight(uModeA, p, uScaleA, uHeightA, uSeedA);
  // Only evaluate the outgoing terrain while a morph is running.
  float hB = uBlend < 1.0 ? modeHeight(uModeB, p, uScaleB, uHeightB, uSeedB) : hA;
  float height = mix(hB, hA, uBlend);

  float wave = sin(p.x * 0.05 + uWavePhase) * cos(p.y * 0.05 + uWavePhase * 0.7);
  height += wave * uWaveIntensity * mix(modeWave(uModeB), modeWave(uModeA), uBlend);

  // The ground rises gently toward the visitor's pointer.
  vec2 dp = p - uPointer;
  height += uLift * 7.0 * exp(-dot(dp, dp) / (2.0 * 8.0 * 8.0));

  pos.z = height;
  vHeight = height;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const terrainFragmentShader = /* glsl */ `
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uTint;

varying float vHeight;
varying vec2 vUv;

void main() {
  // Normalize height to 0-1 range
  float h = clamp((vHeight + 15.0) / 30.0, 0.0, 1.0);

  // 5-stop gradient
  vec3 color;
  if (h < 0.25) {
    color = mix(uColor0, uColor1, h / 0.25);
  } else if (h < 0.5) {
    color = mix(uColor1, uColor2, (h - 0.25) / 0.25);
  } else if (h < 0.75) {
    color = mix(uColor2, uColor3, (h - 0.5) / 0.25);
  } else {
    color = mix(uColor3, uColor4, (h - 0.75) / 0.25);
  }

  // Time-of-day tint (the visitor's local clock; see state.ts).
  color *= uTint;

  // Edge fade-out based on UV distance to boundaries
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                   smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

  gl_FragColor = vec4(color, edgeFade);
  // Encode to the renderer's output color space when drawing straight to the screen, so the
  // plain render (no post-processing) matches the composer path.
  #include <colorspace_fragment>
}
`;
