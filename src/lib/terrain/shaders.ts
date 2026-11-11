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

varying float vTone;
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
// Light seeded variety so reloads differ: terrace step height and edge sharpness, and the river runs
// through the middle (half the seeds), off to one side (a quarter), or not at all (a quarter).
float canyonHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  float pickStep = fract(seed * 0.618034);
  float pickEdge = fract(seed * 0.414214);
  float pickRiver = fract(seed * 0.324718);

  float h = fbm(p, sc, ht, seed);
  float stepH = 2.4 + pickStep * 2.0;
  float e = 0.25 + pickEdge * 0.15; // nearer 0.5 is crisper; past ~0.4 the edges alias
  float q = h / stepH;
  h = (floor(q) + smoothstep(e, 1.0 - e, fract(q))) * stepH;

  if (pickRiver >= 0.75) return h;
  float base = pickRiver < 0.5 ? 0.0 : (pickRiver < 0.625 ? -28.0 : 28.0);
  float rx = base + sin(p.y * 0.06 + seed * 0.37) * 12.0 + sin(p.y * 0.15 + seed) * 4.0;
  float carve = smoothstep(2.5, 9.0, abs(p.x - rx));
  return mix(-9.0, h, carve);
}

// City: built from seeded ingredients so seeds look like different kinds of city, not one picture.
//   Built form (one per seed): a tall downtown cluster (with a smaller second cluster on some
//     seeds) or a mid-rise band along the horizon. (A low dense grid was tried and dropped: busy.)
//   River (about half the seeds): a flat strip of water; seen this low, a trench hides itself.
//   Highways (about half the seeds): straight, flat-bottomed cuts through the ground and blocks.
//     Nothing else in any mode is a straight line, so they read as made.
// Every edge is a smoothstep: hard steps alias into jagged noise at this mesh density.
float softBox(vec2 f, vec2 inset, float soft) {
  vec2 a = smoothstep(inset, inset + soft, f) * smoothstep(inset, inset + soft, 1.0 - f);
  return a.x * a.y;
}

// Distance from p to the line through o at angle a.
float lineDist(vec2 p, vec2 o, float a) {
  vec2 d = vec2(cos(a), sin(a));
  vec2 v = p - o;
  return abs(v.x * d.y - v.y * d.x);
}

float cityHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  // Independent seeded picks, each in [0, 1).
  float pickForm = fract(seed * 0.618034);
  float pickRiver = fract(seed * 0.414214);
  float pickRoads = fract(seed * 0.324718);
  float pickSecond = fract(seed * 0.754877);
  float pickSide = fract(seed * 0.569840);

  // Calmer ground than the other modes, so the built form carries the view.
  float h = fbm(p, sc, ht, seed) * 0.55 - 5.0;

  vec2 core = vec2(sin(seed) * 10.0, 19.0);

  // Highways: two straight cuts crossing near downtown, flattened to one level so their even grid
  // lines read against the noisy ground (like the river). road is 0 on the roadway, 1 off it, and
  // also clears buildings off the road.
  float road = 1.0;
  if (pickRoads < 0.5) {
    float a1 = 0.35 + pickRoads * 1.2;
    float a2 = a1 + 1.2 + pickSide * 0.6;
    float d = min(lineDist(p, core + vec2(-6.0, -4.0), a1), lineDist(p, core + vec2(5.0, -2.0), a2));
    road = smoothstep(1.2, 2.8, d);
  }

  // Built form: how strongly each spot is built up (0-1), and how tall its tallest towers get.
  float built;
  float peak;
  float low;
  if (pickForm < 0.55) {
    vec2 rel = (p - core) / vec2(34.0, 9.0);
    built = exp(-dot(rel, rel) * 1.6);
    float side = pickSide < 0.5 ? -1.0 : 1.0;
    vec2 rel2 = (p - vec2(core.x + side * 48.0, 21.0)) / vec2(16.0, 6.5);
    built = max(built, step(0.5, pickSecond) * 0.85 * exp(-dot(rel2, rel2) * 1.6));
    peak = 36.0;
    low = 0.3;
  } else {
    // A long mid-rise band along the horizon, thinning toward the sides.
    built = exp(-pow((p.y - 18.0) / 9.0, 2.0)) * (1.0 - smoothstep(40.0, 90.0, abs(p.x - core.x)));
    peak = 14.0;
    low = 0.25;
  }

  // River: flatten to a water level, and keep buildings out of it.
  float water = 0.0;
  if (pickRiver < 0.5) {
    float ry = 5.0 + sin(p.x * 0.05 + seed) * 4.0 + sin(p.x * 0.13 + seed * 2.0) * 1.5;
    water = 1.0 - smoothstep(2.5, 5.0, abs(p.y - ry));
  }
  built *= road * (1.0 - water);

  // Lots are ~6 vertices wide so each tower gets a flat top and sloped sides; narrower lots
  // collapse into needles. A cubic height curve leaves a few tall landmarks among lower blocks.
  if (built > 0.02) {
    float lot = 5.0;
    // Small offsets: large values lose float precision on mobile GPUs.
    vec2 off = vec2(fract(seed * 0.618034), fract(seed * 0.414214)) * 40.0;
    vec2 q = (p + off) / lot;
    vec2 cell = floor(q);
    float r = hash21(cell + off);
    float tower = step(low, r) * softBox(fract(q), vec2(0.1), 0.2);
    h += built * (1.5 + tower * (3.0 + r * r * r * peak));
  }
  h = mix(-6.6, h, road);
  return mix(h, -7.5, water);
}

// Prairie: long rolling swells that rise toward the horizon, a shallow creek, and wind moving
// across the grass in gusts. The wind rides uTime, so reduced motion (one frame) shows it still.
float prairieHeight(vec2 p, vec3 sc, vec3 ht, float seed) {
  // Small offset: large values lose float precision on mobile GPUs.
  float so = fract(seed * 0.618034) * 100.0;

  // Swells: low-frequency noise, domain-warped so the hills run in long irregular ridges.
  vec2 warp = vec2(snoise(p * 0.012 + so), snoise(p * 0.012 - so * 1.7)) * 12.0;
  vec2 q = p + warp;
  float h = snoise(q * sc.x * 0.8 + so * 0.5) * ht.x * 0.9;
  h += snoise(q * sc.y + so * 1.3) * ht.y * 0.35;

  // A gentle rise toward the far edge, so the horizon reads as a line of hills.
  h += smoothstep(-10.0, 45.0, p.y) * 4.0;

  // A shallow creek winding toward the viewer.
  float cx = sin(p.y * 0.05 + so) * 18.0 + sin(p.y * 0.13 + so * 2.0) * 5.0;
  h -= 2.2 * (1.0 - smoothstep(0.5, 4.0, abs(p.x - cx)));

  // Wind: a ripple travelling mostly across the view, strongest where a gust passes. The gust mask
  // and the ripple move at about the same ground speed, so gusts carry their waves with them.
  vec2 wind = normalize(vec2(1.0, 0.4 * sin(so)));
  float along = dot(p, wind);
  float across = dot(p, vec2(-wind.y, wind.x));
  float gust = smoothstep(-0.2, 0.6, snoise(vec2(along * 0.02 - uTime * 0.6, across * 0.03 + so)));
  float ripple = sin(along * 0.9 - uTime * 30.0) * 0.25 + sin(along * 0.35 - uTime * 12.0) * 0.6;
  h += gust * ripple;

  return h - 3.0;
}

float modeHeight(float mode, vec2 p, vec3 sc, vec3 ht, float seed) {
  if (mode < 0.5) return canyonHeight(p, sc, ht, seed);
  if (mode < 1.5) return cityHeight(p, sc, ht, seed);
  return prairieHeight(p, sc, ht, seed);
}

// Height span mapped onto the full color ramp, per mode. Canyon keeps the original -15..15; City and
// Prairie are flatter, so a shared span left them in one mid-tone. City's top is the tall towers.
vec2 modeRange(float mode) {
  if (mode < 0.5) return vec2(-15.0, 15.0);
  if (mode < 1.5) return vec2(-10.0, 14.0);
  return vec2(-10.0, 11.0);
}

float tone(float mode, float h) {
  vec2 r = modeRange(mode);
  return (h - r.x) / (r.y - r.x);
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
  vTone = clamp(mix(tone(uModeB, height), tone(uModeA, height), uBlend), 0.0, 1.0);

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

varying float vTone;
varying vec2 vUv;

void main() {
  // Height already mapped to 0-1 per mode in the vertex shader (modeRange).
  float h = vTone;

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

  // Edge fade-out based on UV distance to boundaries. The strip is wide (GRID_WIDTH in config.ts),
  // so the side fade is a smaller fraction of it; the sides mostly sit past the frame anyway.
  float edgeFade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) *
                   smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

  gl_FragColor = vec4(color, edgeFade);
  // Encode to the renderer's output color space when drawing straight to the screen, so the
  // plain render (no post-processing) matches the composer path.
  #include <colorspace_fragment>
}
`;
