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

export const terrainVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uScale1;
uniform float uScale2;
uniform float uScale3;
uniform float uHeight1;
uniform float uHeight2;
uniform float uHeight3;
uniform float uWaveSpeed;
uniform float uWaveIntensity;
uniform float uSeed;

varying float vHeight;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Multi-octave noise on GPU
  float n1 = snoise(vec2(pos.x * uScale1 + uTime * 0.1 + uSeed, pos.y * uScale1 + uSeed)) * uHeight1;
  float n2 = snoise(vec2(pos.x * uScale2 + uSeed * 1.3, pos.y * uScale2 + uTime * 0.05 + uSeed * 1.3)) * uHeight2;
  float n3 = snoise(vec2(pos.x * uScale3 + uSeed * 2.1, pos.y * uScale3 + uSeed * 2.1)) * uHeight3;

  float height = n1 + n2 + n3;

  // Wave animation
  height += sin(pos.x * 0.05 + uTime * uWaveSpeed) *
            cos(pos.y * 0.05 + uTime * uWaveSpeed * 0.7) *
            uWaveIntensity;

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

  // Edge fade-out based on UV distance to boundaries
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                   smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

  gl_FragColor = vec4(color, edgeFade);
}
`;

