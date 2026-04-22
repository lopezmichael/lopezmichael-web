import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface PostProcessing {
  composer: EffectComposer;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createPostProcessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): PostProcessing {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Bloom at half resolution for performance
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(Math.floor(size.x / 2), Math.floor(size.y / 2)),
    0.35, // strength
    0.4,  // radius
    0.6,  // threshold
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  function resize(width: number, height: number) {
    composer.setSize(width, height);
    bloomPass.resolution.set(Math.floor(width / 2), Math.floor(height / 2));
  }

  function dispose() {
    bloomPass.dispose();
    composer.dispose();
  }

  return { composer, resize, dispose };
}
