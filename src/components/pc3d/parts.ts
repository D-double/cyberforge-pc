import * as THREE from 'three';
import { Product } from '@/types';
import { BOARD } from './caseLayout';
import { AioUnit, createAioUnit } from './aioCooler';
import { ModelLibrary } from './modelLibrary';
import { RgbLighting } from './rgbLighting';
import { extractFanRotors, findNodes, forEachMesh, ResourceBag, setNodesMaterial } from './sceneUtils';

/*
 * Part factories. Every part is returned in the native frame of its model, so the same
 * object can be mounted into the case (assembly.ts) or shown on its own (inspect mode).
 */

export interface PartObject {
  object: THREE.Object3D;
  rotors: THREE.Object3D[];
  dispose?: () => void;
}

interface CasePart extends PartObject {
  setXray(enabled: boolean): void;
}

export interface CoolerPart extends PartObject {
  aio?: AioUnit;
}

type FormFactor = NonNullable<Product['specs']['formFactor']>;
type StorageKind = NonNullable<Product['specs']['storageType']>;
type CoolerVariant = 'tower' | 'twin' | 'aio';

const GPU_MODEL_LENGTH_MM = 305.9;
const CPU_WIDTH = 0.04;
const TWIN_TOWER_OFFSET = 0.0369;
const HDD_SCALE = new THREE.Vector3(1.47, 3.66, 1.455);

function getCoolerVariant(cooler?: Product): CoolerVariant {
  if (!cooler) return 'tower';
  if (cooler.specs.isAio) return 'aio';
  // Products saved before `coolerTowers` existed lack it; high-TDP air coolers are twin-tower designs.
  const towers = cooler.specs.coolerTowers ?? ((cooler.specs.coolerMaxTdp ?? 0) >= 250 ? 2 : 1);
  return towers === 2 ? 'twin' : 'tower';
}

function getGpuScale(gpu?: Product): number {
  const length = gpu?.specs.gpuLengthMM ?? GPU_MODEL_LENGTH_MM;
  return THREE.MathUtils.clamp(length / GPU_MODEL_LENGTH_MM, 0.78, 1.2);
}

export function hasRgb(product?: Product): boolean {
  return /rgb/i.test(product?.name ?? '');
}

export async function createCase(library: ModelLibrary, rgb: RgbLighting): Promise<CasePart> {
  const model = await library.load('case');
  setNodesMaterial(model, /RGB_ring/i, rgb.material);
  const rotors = extractFanRotors(model);
  const glass = findNodes(model, /tempered_glass|glass_frit/i);

  const bag = new ResourceBag();
  const shroudMaterials: THREE.Material[] = [];
  findNodes(model, /PSU_shroud/i).forEach((node) =>
    forEachMesh(node, (mesh) => {
      const material = bag.track((mesh.material as THREE.Material).clone());
      mesh.material = material;
      shroudMaterials.push(material);
    })
  );

  return {
    object: model,
    rotors,
    dispose: () => bag.dispose(),
    setXray(enabled) {
      glass.forEach((node) => {
        node.visible = !enabled;
      });
      shroudMaterials.forEach((material) => {
        material.transparent = enabled;
        material.opacity = enabled ? 0.18 : 1;
        material.depthWrite = !enabled;
        material.needsUpdate = true;
      });
    },
  };
}

export async function createMotherboard(library: ModelLibrary, formFactor: FormFactor): Promise<PartObject> {
  const model = await library.load('motherboard');
  if (formFactor === 'ATX') return { object: model, rotors: [] };

  // Smaller boards share the ATX top edge and mounting holes, so the lower part of the board is clipped off.
  const localPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -BOARD.microAtxCutX);
  const worldPlane = localPlane.clone();
  const syncPlane = () => {
    worldPlane.copy(localPlane).applyMatrix4(model.matrixWorld);
  };
  const bag = new ResourceBag();
  forEachMesh(model, (mesh) => {
    const material = bag.track((mesh.material as THREE.Material).clone());
    material.clippingPlanes = [worldPlane];
    material.clipShadows = true;
    mesh.material = material;
    mesh.onBeforeRender = syncPlane;
  });
  return { object: model, rotors: [], dispose: () => bag.dispose() };
}

/** CPU scaled to real size, centred on the origin with its heat spreader facing +Z. */
export async function createCpu(library: ModelLibrary): Promise<PartObject> {
  const model = await library.load('cpu');
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = CPU_WIDTH / Math.max(size.x, size.y);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -box.min.z * scale);

  const cpu = new THREE.Group();
  cpu.add(model);
  return { object: cpu, rotors: [] };
}

export async function createCooler(
  library: ModelLibrary,
  cooler: Product | undefined,
  rgb: RgbLighting
): Promise<CoolerPart> {
  const variant = getCoolerVariant(cooler);

  if (variant === 'aio') {
    const bag = new ResourceBag();
    const aio = createAioUnit(cooler?.specs.radiatorMM ?? 360, rgb, bag);
    return { object: aio.pump, rotors: [], aio, dispose: () => bag.dispose() };
  }

  if (variant === 'tower') {
    const model = await library.load('coolerTower');
    return { object: model, rotors: extractFanRotors(model) };
  }

  const [rear, front] = await Promise.all([library.load('coolerTower'), library.load('coolerTower')]);
  const rotors = [...extractFanRotors(rear), ...extractFanRotors(front)];
  rear.position.z = -TWIN_TOWER_OFFSET;
  front.position.z = TWIN_TOWER_OFFSET;
  findNodes(rear, /base_and_mounting_bar/i).forEach((base) => {
    base.position.z += TWIN_TOWER_OFFSET;
  });
  findNodes(front, /base_and_mounting_bar/i).forEach((base) => {
    base.visible = false;
  });

  const twin = new THREE.Group();
  twin.add(rear, front);
  return { object: twin, rotors };
}

export async function createRamStick(library: ModelLibrary, rgbLit: boolean, rgb: RgbLighting): Promise<PartObject> {
  const model = await library.load('ram');
  if (rgbLit) {
    setNodesMaterial(model, /RGB/i, rgb.material);
  } else {
    const spreader = findNodes(model, /heat_spreaders/i)[0];
    let spreaderMaterial: THREE.Material | undefined;
    if (spreader) forEachMesh(spreader, (mesh) => (spreaderMaterial ??= mesh.material as THREE.Material));
    if (spreaderMaterial) setNodesMaterial(model, /RGB/i, spreaderMaterial);
  }
  return { object: model, rotors: [] };
}

/** Graphics card wrapped in a group scaled to the product length. */
export async function createGpu(library: ModelLibrary, gpu: Product | undefined, rgb: RgbLighting): Promise<PartObject> {
  const model = await library.load('gpu');
  setNodesMaterial(model, /RGB/i, rgb.material);
  const rotors = extractFanRotors(model);

  const card = new THREE.Group();
  card.add(model);
  card.scale.setScalar(getGpuScale(gpu));
  return { object: card, rotors };
}

export async function createPsu(library: ModelLibrary): Promise<PartObject> {
  const model = await library.load('psu');
  return { object: model, rotors: extractFanRotors(model) };
}

export async function createStorage(library: ModelLibrary, kind: StorageKind): Promise<PartObject> {
  if (kind === 'NVMe M.2') return { object: await library.load('ssdM2'), rotors: [] };

  const model = await library.load('ssdSata');
  if (kind === 'HDD') model.scale.copy(HDD_SCALE);
  return { object: model, rotors: [] };
}
