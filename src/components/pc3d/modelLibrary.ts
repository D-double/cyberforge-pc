import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const MODEL_URLS = {
  case: '/models/case.glb',
  motherboard: '/models/motherboard.glb',
  cpu: '/models/cpu.glb',
  coolerTower: '/models/cooler-tower.glb',
  ram: '/models/ram.glb',
  gpu: '/models/gpu.glb',
  psu: '/models/psu.glb',
  ssdM2: '/models/ssd-m2.glb',
  ssdSata: '/models/ssd-sata.glb',
} as const;

type ModelKey = keyof typeof MODEL_URLS;

/** Loads GLB models once and hands out clones that share geometry, materials and textures. */
export class ModelLibrary {
  private readonly loader = new GLTFLoader();
  private readonly dracoLoader = new DRACOLoader();
  private readonly ktx2Loader = new KTX2Loader();
  private readonly cache = new Map<ModelKey, Promise<THREE.Group>>();

  constructor(renderer: THREE.WebGLRenderer) {
    this.dracoLoader.setDecoderPath('/libs/draco/');
    this.ktx2Loader.setTranscoderPath('/libs/basis/').detectSupport(renderer);
    this.loader.setDRACOLoader(this.dracoLoader).setKTX2Loader(this.ktx2Loader);
  }

  async load(key: ModelKey): Promise<THREE.Group> {
    let source = this.cache.get(key);
    if (!source) {
      source = this.loader.loadAsync(MODEL_URLS[key]).then(({ scene }) => {
        scene.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        return scene;
      });
      source.catch(() => this.cache.delete(key));
      this.cache.set(key, source);
    }
    return (await source).clone(true);
  }

  dispose() {
    this.cache.forEach((source) => source.then(disposeObject, () => undefined));
    this.cache.clear();
    this.dracoLoader.dispose();
    this.ktx2Loader.dispose();
  }
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
