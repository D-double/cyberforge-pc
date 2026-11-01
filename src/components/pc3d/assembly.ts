import * as THREE from 'three';
import { PCBuild } from '@/types';
import { connectAioTubes } from './aioCooler';
import {
  AXIS,
  BOARD,
  BOARD_BASIS,
  BOARD_ORIGIN,
  boardToCase,
  FRONT_RADIATOR,
  PSU_SLOT,
  RGB_LIGHT_SPOTS,
  SHROUD_TOP_Y,
} from './caseLayout';
import { ModelLibrary } from './modelLibrary';
import {
  CoolerPart,
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
import { placeWithBasis, ResourceBag, setNodesVisible } from './sceneUtils';

export interface Assembly {
  root: THREE.Group;
  rotors: THREE.Object3D[];
  setXray(enabled: boolean): void;
  dispose(): void;
}

/* Native-model features used to seat parts (metres, in each model's own frame). */
const CPU_HEIGHT = 0.0048;
const GPU = { fingerEdgeZ: -0.1106, fingerStartX: 0.0454, pcbCenterY: 0.0041, slotInsertion: 0.008 };
const RAM = { halfLength: 0.0667, halfThickness: 0.00305 };
const M2_HALF_WIDTH = 0.011;
const PSU_INLET_Z = 0.073;
const AIO_TUBE_BOW = new THREE.Vector3(-0.03, 0.02, 0);
const SATA_DRIVE_SPOT = new THREE.Vector3(-0.07, SHROUD_TOP_Y, 0.16);

const DIMM_LAYOUT: Record<number, (keyof typeof BOARD.dimmSlotsZ)[]> = {
  1: ['A2'],
  2: ['A2', 'B2'],
  4: ['A1', 'A2', 'B1', 'B2'],
};

function mountOnSocket(object: THREE.Object3D, heightAboveBoard: number) {
  placeWithBasis(object, BOARD_BASIS, boardToCase(BOARD.socket.x, heightAboveBoard, BOARD.socket.z));
}

function mountGpu(card: THREE.Object3D) {
  const s = card.scale.x;
  const { pcieSlot1 } = BOARD;
  // Mirrored so the fans face down onto the PSU shroud, as in a real tower.
  placeWithBasis(
    card,
    [AXIS.pz, AXIS.ny, AXIS.nx],
    new THREE.Vector3(
      BOARD_ORIGIN.x - pcieSlot1.topY + GPU.slotInsertion + GPU.fingerEdgeZ * s,
      BOARD_ORIGIN.y + pcieSlot1.x + GPU.pcbCenterY * s,
      BOARD_ORIGIN.z + pcieSlot1.rearZ + 0.001 - GPU.fingerStartX * s
    )
  );
}

function mountRam(stick: THREE.Object3D, slotZ: number) {
  placeWithBasis(
    stick,
    [AXIS.py, AXIS.pz, AXIS.px],
    boardToCase(BOARD.dimmCenterX - RAM.halfLength, BOARD.dimmSeatY, slotZ - RAM.halfThickness)
  );
}

function mountM2(ssd: THREE.Object3D) {
  const { m2Slot1 } = BOARD;
  placeWithBasis(
    ssd,
    [AXIS.nz, AXIS.nx, AXIS.py],
    boardToCase(m2Slot1.x + M2_HALF_WIDTH, m2Slot1.seatY, m2Slot1.connectorZ)
  );
}

function mountPsu(psu: THREE.Object3D) {
  placeWithBasis(
    psu,
    [AXIS.px, AXIS.ny, AXIS.nz],
    new THREE.Vector3(PSU_SLOT.centerX, PSU_SLOT.topY, PSU_SLOT.rearZ + PSU_INLET_Z)
  );
}

function mountRadiator(radiator: THREE.Object3D, radiatorMM: number) {
  const length = radiatorMM / 1000 + 0.012;
  radiator.position.set(FRONT_RADIATOR.centerX, FRONT_RADIATOR.topY - length / 2, FRONT_RADIATOR.centerZ);
}

export async function buildAssembly(build: PCBuild, library: ModelLibrary, rgb: RgbLighting): Promise<Assembly> {
  const hasBoard = Boolean(build.motherboard);
  const hasCpu = hasBoard && Boolean(build.cpu);
  const storageKind = build.storage?.specs.storageType ?? 'NVMe M.2';
  const hasStorage = Boolean(build.storage) && (storageKind !== 'NVMe M.2' || hasBoard);
  const dimmSlots = DIMM_LAYOUT[build.ram?.specs.ramModulesCount ?? 2] ?? DIMM_LAYOUT[2];

  const [casePart, board, cpu, cooler, ramSticks, gpu, psu, storage] = await Promise.all([
    createCase(library, rgb),
    hasBoard ? createMotherboard(library, build.motherboard!.specs.formFactor ?? 'ATX') : undefined,
    hasCpu ? createCpu(library) : undefined,
    hasCpu && build.cooler ? createCooler(library, build.cooler, rgb) : undefined,
    hasBoard && build.ram
      ? Promise.all(dimmSlots.map(() => createRamStick(library, hasRgb(build.ram), rgb)))
      : undefined,
    hasBoard && build.gpu ? createGpu(library, build.gpu, rgb) : undefined,
    build.psu ? createPsu(library) : undefined,
    hasStorage ? createStorage(library, storageKind) : undefined,
  ]);

  const root = new THREE.Group();
  root.name = 'PC_assembly';
  const parts: PartObject[] = [];
  const add = <T extends PartObject>(part: T | undefined, mount?: (object: THREE.Object3D) => void) => {
    if (!part) return undefined;
    mount?.(part.object);
    root.add(part.object);
    parts.push(part);
    return part;
  };

  add(casePart);
  add(board, (object) => {
    placeWithBasis(object, BOARD_BASIS, BOARD_ORIGIN.clone());
    setNodesVisible(object, /socket_protective_cap/i, !cpu);
    setNodesVisible(object, /M2_heatsink_cover/i, storageKind !== 'NVMe M.2' || !storage);
  });
  add(cpu, (object) =>
    placeWithBasis(object, [AXIS.pz, AXIS.py, AXIS.nx], boardToCase(BOARD.socket.x, BOARD.cpuSeatY, BOARD.socket.z))
  );
  add(cooler, (object) => mountOnSocket(object, BOARD.cpuSeatY + CPU_HEIGHT));
  ramSticks?.forEach((stick, i) => add(stick, (object) => mountRam(object, BOARD.dimmSlotsZ[dimmSlots[i]])));
  add(gpu, mountGpu);
  add(psu, mountPsu);
  add(storage, (object) => {
    if (storageKind === 'NVMe M.2') mountM2(object);
    else object.position.copy(SATA_DRIVE_SPOT);
  });

  const bag = new ResourceBag();
  mountAio(root, cooler, bag, build.cooler?.specs.radiatorMM ?? 360);

  const lights = RGB_LIGHT_SPOTS.map(({ position, intensity }) => rgb.createLight(position, intensity));
  root.add(...lights);

  return {
    root,
    rotors: parts.flatMap((part) => part.rotors),
    setXray: (enabled) => casePart.setXray(enabled),
    dispose() {
      parts.forEach((part) => part.dispose?.());
      bag.dispose();
      rgb.releaseLights(lights);
    },
  };
}

function mountAio(root: THREE.Group, cooler: CoolerPart | undefined, bag: ResourceBag, radiatorMM: number) {
  if (!cooler?.aio) return;
  mountRadiator(cooler.aio.radiator, radiatorMM);
  root.add(cooler.aio.radiator);
  connectAioTubes(root, cooler.aio, AIO_TUBE_BOW, bag);
}
