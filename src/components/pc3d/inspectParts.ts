import * as THREE from 'three';
import { PCBuild } from '@/types';
import { connectAioTubes } from './aioCooler';
import { ModelLibrary } from './modelLibrary';
import {
  createCase,
  createCooler,
  createCpu,
  createGpu,
  createMotherboard,
  createPsu,
  createRamStick,
  createStorage,
  hasRgb,
  PartObject,
} from './parts';
import { RgbLighting } from './rgbLighting';
import { ResourceBag } from './sceneUtils';

export type InspectPartId = 'gpu' | 'motherboard' | 'cpu' | 'cooler' | 'ram' | 'psu' | 'storage' | 'case';

export const INSPECT_PARTS: { id: InspectPartId; label: string }[] = [
  { id: 'gpu', label: '🎮 Видеокарта' },
  { id: 'motherboard', label: '🎛️ Материнская плата' },
  { id: 'cpu', label: '⚡ Процессор' },
  { id: 'cooler', label: '❄️ Охлаждение CPU' },
  { id: 'ram', label: '💾 Оперативная память' },
  { id: 'psu', label: '🔌 Блок питания' },
  { id: 'storage', label: '💿 Накопитель' },
  { id: 'case', label: '🖥️ Корпус' },
];

const AIO_RADIATOR_DISTANCE = 0.2;
const AIO_TUBE_BOW = new THREE.Vector3(0, 0.07, 0);

async function createCoolerShowcase(build: PCBuild, library: ModelLibrary, rgb: RgbLighting): Promise<PartObject> {
  const cooler = await createCooler(library, build.cooler, rgb);
  if (!cooler.aio) return cooler;

  const group = new THREE.Group();
  const { pump, radiator } = cooler.aio;
  const radiatorLength = new THREE.Box3().setFromObject(radiator).getSize(new THREE.Vector3()).y;
  radiator.position.set(0, radiatorLength / 2, AIO_RADIATOR_DISTANCE);
  group.add(pump, radiator);

  const bag = new ResourceBag();
  connectAioTubes(group, cooler.aio, AIO_TUBE_BOW, bag);
  return {
    object: group,
    rotors: [],
    dispose: () => {
      cooler.dispose?.();
      bag.dispose();
    },
  };
}

async function createPart(
  id: InspectPartId,
  build: PCBuild,
  library: ModelLibrary,
  rgb: RgbLighting
): Promise<PartObject> {
  switch (id) {
    case 'gpu':
      return createGpu(library, build.gpu, rgb);
    case 'motherboard':
      return createMotherboard(library, build.motherboard?.specs.formFactor ?? 'ATX');
    case 'cpu': {
      const cpu = await createCpu(library);
      cpu.object.rotation.x = -Math.PI / 2;
      return cpu;
    }
    case 'cooler':
      return createCoolerShowcase(build, library, rgb);
    case 'ram': {
      const stick = await createRamStick(library, !build.ram || hasRgb(build.ram), rgb);
      stick.object.rotation.x = Math.PI / 2;
      return stick;
    }
    case 'psu':
      return createPsu(library);
    case 'storage':
      return createStorage(library, build.storage?.specs.storageType ?? 'NVMe M.2');
    case 'case':
      return createCase(library, rgb);
  }
}

/** Builds the part chosen in the current build (or a default variant) standing on the ground at the origin. */
export async function createInspectPart(
  id: InspectPartId,
  build: PCBuild,
  library: ModelLibrary,
  rgb: RgbLighting
): Promise<PartObject> {
  const part = await createPart(id, build, library, rgb);
  const stand = new THREE.Group();
  stand.add(part.object);
  const box = new THREE.Box3().setFromObject(stand);
  const center = box.getCenter(new THREE.Vector3());
  part.object.position.sub(new THREE.Vector3(center.x, box.min.y, center.z));
  return { ...part, object: stand };
}
