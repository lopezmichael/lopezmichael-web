// Canyon Terrain - Three.js Generative Visualization
// Randomized on each page load with dark/light mode support

(function() {
  // Random seed for this session
  const seed = Math.random() * 10000;

  // Color Palettes for Light and Dark modes
  const palettes = {
    light: {
      primary: { h: 15, s: 0.42, l: 0.39 },
      secondary: { h: 18, s: 0.48, l: 0.54 },
      accent: { h: 35, s: 0.65, l: 0.75 },
      cool: { h: 150, s: 0.18, l: 0.42 },
      neutral: { h: 20, s: 0.15, l: 0.31 },
      background: { h: 20, s: 0.15, l: 0.31 }
    },
    dark: {
      primary: { h: 18, s: 0.48, l: 0.54 },
      secondary: { h: 25, s: 0.45, l: 0.63 },
      accent: { h: 35, s: 0.65, l: 0.75 },
      cool: { h: 150, s: 0.25, l: 0.35 },
      neutral: { h: 20, s: 0.20, l: 0.12 },
      background: { h: 20, s: 0.20, l: 0.08 }
    }
  };

  // Get current theme
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  // Randomize color palette with subtle variations
  const hueShift = (Math.random() - 0.5) * 20;
  const satShift = (Math.random() - 0.5) * 0.1;

  function hslToHex(h, s, l) {
    h = ((h + hueShift) % 360 + 360) % 360;
    s = Math.max(0, Math.min(1, s + satShift));
    l = Math.max(0, Math.min(1, l));

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (v) => Math.round((v + m) * 255);
    return (toHex(r) << 16) + (toHex(g) << 8) + toHex(b);
  }

  function getColors(theme) {
    const palette = palettes[theme];
    return {
      primary: hslToHex(palette.primary.h, palette.primary.s, palette.primary.l),
      secondary: hslToHex(palette.secondary.h, palette.secondary.s, palette.secondary.l),
      accent: hslToHex(palette.accent.h, palette.accent.s, palette.accent.l),
      cool: hslToHex(palette.cool.h, palette.cool.s, palette.cool.l),
      neutral: hslToHex(palette.neutral.h, palette.neutral.s, palette.neutral.l),
      background: hslToHex(palette.background.h, palette.background.s, palette.background.l)
    };
  }

  // Randomized terrain parameters
  const terrainParams = {
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
    rotationAmount: 0.03 + Math.random() * 0.04
  };

  // Randomized camera starting position
  const cameraParams = {
    startX: (Math.random() - 0.5) * 20,
    startY: 25 + Math.random() * 15,
    startZ: 40 + Math.random() * 20,
    lookAtY: -8 + Math.random() * 6
  };

  // Simplex Noise implementation
  class SimplexNoise {
    constructor(seed = Math.random()) {
      this.p = new Uint8Array(256);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);

      for (let i = 0; i < 256; i++) {
        this.p[i] = i;
      }

      let n = seed * 256;
      for (let i = 255; i > 0; i--) {
        n = (n * 16807) % 2147483647;
        const j = n % (i + 1);
        [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
      }

      for (let i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
      }
    }

    noise2D(x, y) {
      const F2 = 0.5 * (Math.sqrt(3) - 1);
      const G2 = (3 - Math.sqrt(3)) / 6;

      const s = (x + y) * F2;
      const i = Math.floor(x + s);
      const j = Math.floor(y + s);

      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = x - X0;
      const y0 = y - Y0;

      let i1, j1;
      if (x0 > y0) { i1 = 1; j1 = 0; }
      else { i1 = 0; j1 = 1; }

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;

      const ii = i & 255;
      const jj = j & 255;

      const grad3 = [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, 1], [1, -1], [-1, -1]
      ];

      const gi0 = this.permMod12[ii + this.perm[jj]];
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

      let n0, n1, n2;

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 < 0) { n0 = 0; }
      else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0); }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 < 0) { n1 = 0; }
      else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1); }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 < 0) { n2 = 0; }
      else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2); }

      return 70 * (n0 + n1 + n2);
    }
  }

  function init() {
    const container = document.getElementById('terrain-canvas');
    if (!container) {
      console.error('Terrain canvas container not found');
      return;
    }

    // Get initial colors based on current theme
    let currentTheme = getCurrentTheme();
    let colors = getColors(currentTheme);
    let targetColors = { ...colors };

    // Color transition state
    let colorTransition = 0;
    let isTransitioning = false;
    let fromColors = { ...colors };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    scene.fog = new THREE.FogExp2(colors.background, 0.012 + Math.random() * 0.006);

    // Camera with randomized starting position
    const camera = new THREE.PerspectiveCamera(
      55 + Math.random() * 15,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(cameraParams.startX, cameraParams.startY, cameraParams.startZ);
    camera.lookAt(0, cameraParams.lookAtY, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Terrain geometry with randomized seed
    const noise = new SimplexNoise(seed);
    const geometry = new THREE.PlaneGeometry(100, 100, 128, 128);
    const positionAttribute = geometry.attributes.position;
    const colorAttribute = new THREE.BufferAttribute(
      new Float32Array(positionAttribute.count * 3),
      3
    );

    // Color helpers
    function hexToRgb(hex) {
      return {
        r: ((hex >> 16) & 255) / 255,
        g: ((hex >> 8) & 255) / 255,
        b: (hex & 255) / 255
      };
    }

    function lerpColor(color1, color2, t) {
      return {
        r: color1.r + (color2.r - color1.r) * t,
        g: color1.g + (color2.g - color1.g) * t,
        b: color1.b + (color2.b - color1.b) * t
      };
    }

    function lerpHex(hex1, hex2, t) {
      const c1 = hexToRgb(hex1);
      const c2 = hexToRgb(hex2);
      const result = lerpColor(c1, c2, t);
      return (Math.round(result.r * 255) << 16) + (Math.round(result.g * 255) << 8) + Math.round(result.b * 255);
    }

    // Randomize color order for variety
    const colorOrder = Math.floor(Math.random() * 3);

    function getTerrainColors(cols) {
      let colorLow, colorMid, colorHigh, colorPeak, colorTop;

      if (colorOrder === 0) {
        colorLow = hexToRgb(cols.neutral);
        colorMid = hexToRgb(cols.primary);
        colorHigh = hexToRgb(cols.secondary);
        colorPeak = hexToRgb(cols.accent);
        colorTop = hexToRgb(cols.cool);
      } else if (colorOrder === 1) {
        colorLow = hexToRgb(cols.neutral);
        colorMid = hexToRgb(cols.cool);
        colorHigh = hexToRgb(cols.primary);
        colorPeak = hexToRgb(cols.secondary);
        colorTop = hexToRgb(cols.accent);
      } else {
        colorLow = hexToRgb(cols.primary);
        colorMid = hexToRgb(cols.secondary);
        colorHigh = hexToRgb(cols.accent);
        colorPeak = hexToRgb(cols.cool);
        colorTop = hexToRgb(cols.neutral);
      }

      return { colorLow, colorMid, colorHigh, colorPeak, colorTop };
    }

    let terrainColors = getTerrainColors(colors);

    // Generate terrain with current colors
    function generateTerrain(time = 0) {
      // Get current terrain colors (interpolated during transition)
      let activeColors;
      if (isTransitioning) {
        const interpolatedColors = {
          primary: lerpHex(fromColors.primary, targetColors.primary, colorTransition),
          secondary: lerpHex(fromColors.secondary, targetColors.secondary, colorTransition),
          accent: lerpHex(fromColors.accent, targetColors.accent, colorTransition),
          cool: lerpHex(fromColors.cool, targetColors.cool, colorTransition),
          neutral: lerpHex(fromColors.neutral, targetColors.neutral, colorTransition),
          background: lerpHex(fromColors.background, targetColors.background, colorTransition)
        };
        activeColors = getTerrainColors(interpolatedColors);

        // Update scene background during transition
        const bgColor = lerpHex(fromColors.background, targetColors.background, colorTransition);
        scene.background.setHex(bgColor);
        scene.fog.color.setHex(bgColor);
      } else {
        activeColors = terrainColors;
      }

      const { colorLow, colorMid, colorHigh, colorPeak, colorTop } = activeColors;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);

        // Multi-octave noise with randomized scales
        let height = 0;
        height += noise.noise2D(x * terrainParams.scale1 + time * 0.1, y * terrainParams.scale1) * terrainParams.height1;
        height += noise.noise2D(x * terrainParams.scale2, y * terrainParams.scale2 + time * 0.05) * terrainParams.height2;
        height += noise.noise2D(x * terrainParams.scale3, y * terrainParams.scale3) * terrainParams.height3;

        // Randomized wave animation
        height += Math.sin(x * 0.05 + time * terrainParams.waveSpeed) *
                  Math.cos(y * 0.05 + time * terrainParams.waveSpeed * 0.7) *
                  terrainParams.waveIntensity;

        positionAttribute.setZ(i, height);

        // Color based on height
        const normalizedHeight = (height + 15) / 30;
        let color;

        if (normalizedHeight < 0.25) {
          color = lerpColor(colorLow, colorMid, normalizedHeight / 0.25);
        } else if (normalizedHeight < 0.5) {
          color = lerpColor(colorMid, colorHigh, (normalizedHeight - 0.25) / 0.25);
        } else if (normalizedHeight < 0.75) {
          color = lerpColor(colorHigh, colorPeak, (normalizedHeight - 0.5) / 0.25);
        } else {
          color = lerpColor(colorPeak, colorTop, (normalizedHeight - 0.75) / 0.25);
        }

        colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
    }

    geometry.setAttribute('color', colorAttribute);
    generateTerrain(0);
    geometry.computeVertexNormals();

    // Material
    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      flatShading: true,
      shininess: 0,
      side: THREE.DoubleSide
    });

    // Mesh with randomized rotation
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / (2.2 + Math.random() * 0.6);
    terrain.position.y = -10;
    scene.add(terrain);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35 + Math.random() * 0.15);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7 + Math.random() * 0.3);
    directionalLight.position.set(
      30 + Math.random() * 40,
      80 + Math.random() * 40,
      30 + Math.random() * 40
    );
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(colors.accent, 0.2 + Math.random() * 0.2);
    directionalLight2.position.set(-50, 50, -50);
    scene.add(directionalLight2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    // Handle window resize
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Listen for theme changes
    window.addEventListener('themechange', (event) => {
      const newTheme = event.detail.theme;
      if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        fromColors = { ...colors };
        targetColors = getColors(newTheme);
        colorTransition = 0;
        isTransitioning = true;
      }
    });

    // Animation loop
    let time = 0;
    const baseY = cameraParams.startY;
    const baseX = cameraParams.startX;

    function animate() {
      requestAnimationFrame(animate);
      time += terrainParams.timeScale;

      // Handle color transition
      if (isTransitioning) {
        colorTransition += 0.02; // Transition speed
        if (colorTransition >= 1) {
          colorTransition = 1;
          isTransitioning = false;
          colors = { ...targetColors };
          terrainColors = getTerrainColors(colors);
          scene.background.setHex(colors.background);
          scene.fog.color.setHex(colors.background);
        }
      }

      // Update terrain
      generateTerrain(time);
      geometry.computeVertexNormals();

      // Smooth camera movement based on mouse
      const targetCameraX = baseX + mouseX * 15;
      const targetCameraY = baseY + mouseY * 10;

      camera.position.x += (targetCameraX - camera.position.x) * 0.02;
      camera.position.y += (targetCameraY - camera.position.y) * 0.02;
      camera.lookAt(0, cameraParams.lookAtY, 0);

      // Subtle terrain rotation
      terrain.rotation.z = Math.sin(time * terrainParams.rotationSpeed) * terrainParams.rotationAmount;

      renderer.render(scene, camera);
    }

    animate();

    // Log the seed for debugging/sharing
    console.log('Terrain seed:', seed.toFixed(4), '| Theme:', currentTheme);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
