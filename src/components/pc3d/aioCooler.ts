import * as THREE from 'three';
import { RgbLighting } from './rgbLighting';
import { ResourceBag } from './sceneUtils';

/*
 * Procedural all-in-one liquid cooler. The pump uses the same native frame as the tower
 * cooler model: base on y = 0, height along +Y, tubes leaving towards +Z.
 */

const PUMP_RADIUS = 0.039;
const PUMP_HEIGHT = 0.046;
const TUBE_RADIUS = 0.0055;
const FITTING_SPREAD = 0.011;

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export interface AioUnit {
  pump: THREE.Object3D;
  radiator: THREE.Object3D;
}

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  position: THREE.Vector3
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createLcdTexture(bag: ResourceBag): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  ctx.fillStyle = '#05060a';
  ctx.fillRect(0, 0, size, size);

  const ring = ctx.createLinearGradient(0, 0, size, size);
  ring.addColorStop(0, '#22d3ee');
  ring.addColorStop(1, '#a855f7');
  ctx.strokeStyle = ring;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(c, c, c - 26, Math.PI * 0.75, Math.PI * 2.05);
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText('42°', c, c + 22);
  ctx.font = '600 24px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('CPU', c, c + 60);

  const texture = bag.track(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPump(rgb: RgbLighting, bag: ResourceBag): THREE.Group {
  const pump = new THREE.Group();
  pump.name = 'AIO_pump';

  const shell = bag.track(new THREE.MeshStandardMaterial({ color: '#15171b', metalness: 0.35, roughness: 0.4 }));
  const copper = bag.track(new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 1, roughness: 0.3 }));
  const bracket = bag.track(new THREE.MeshStandardMaterial({ color: '#2b2e34', metalness: 0.9, roughness: 0.35 }));
  const lcd = bag.track(
    new THREE.MeshStandardMaterial({
      color: '#000000',
      emissive: '#ffffff',
      emissiveMap: createLcdTexture(bag),
      emissiveIntensity: 1.1,
      roughness: 0.12,
      metalness: 0,
    })
  );

  addMesh(pump, bag.track(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 48)), copper, v(0, 0.002, 0));
  addMesh(pump, bag.track(new THREE.BoxGeometry(0.096, 0.004, 0.016)), bracket, v(0, 0.007, 0));
  addMesh(
    pump,
    bag.track(new THREE.CylinderGeometry(PUMP_RADIUS - 0.0012, PUMP_RADIUS, PUMP_HEIGHT - 0.006, 64)),
    shell,
    v(0, 0.004 + (PUMP_HEIGHT - 0.006) / 2, 0)
  );

  const ring = bag.track(new THREE.TorusGeometry(PUMP_RADIUS - 0.0012, 0.0022, 16, 96));
  ring.rotateX(Math.PI / 2);
  addMesh(pump, ring, rgb.material, v(0, PUMP_HEIGHT - 0.002, 0));

  addMesh(
    pump,
    bag.track(new THREE.CylinderGeometry(PUMP_RADIUS - 0.004, PUMP_RADIUS - 0.004, 0.002, 64)),
    [shell, lcd, shell],
    v(0, PUMP_HEIGHT - 0.001, 0)
  );

  const fitting = bag.track(new THREE.CylinderGeometry(0.0068, 0.0068, 0.014, 24));
  fitting.rotateX(Math.PI / 2);
  pumpFittings().forEach((point) => addMesh(pump, fitting, bracket, point.clone().setZ(PUMP_RADIUS - 0.002)));

  return pump;
}

function pumpFittings(): THREE.Vector3[] {
  return [v(-FITTING_SPREAD, 0.034, PUMP_RADIUS + 0.004), v(FITTING_SPREAD, 0.034, PUMP_RADIUS + 0.004)];
}

function createFinTexture(bag: ResourceBag, length: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#5a616b';
  ctx.fillRect(0, 0, 4, 4);
  ctx.fillStyle = '#121418';
  ctx.fillRect(0, 2, 4, 2);

  const texture = bag.track(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.anisotropy = 8;
  texture.repeat.set(1, length / 0.0016);
  return texture;
}

/** Radiator in its native frame: centred on the origin, long side along Y, fittings facing −Z. */
function createRadiator(radiatorMM: number, bag: ResourceBag): THREE.Group {
  const radiator = new THREE.Group();
  radiator.name = 'AIO_radiator';
  const length = radiatorMM / 1000 + 0.012;
  const tankHeight = 0.015;

  const fins = bag.track(
    new THREE.MeshStandardMaterial({ map: createFinTexture(bag, length), metalness: 0.7, roughness: 0.55 })
  );
  const frame = bag.track(new THREE.MeshStandardMaterial({ color: '#17191d', metalness: 0.6, roughness: 0.4 }));

  addMesh(radiator, bag.track(new THREE.BoxGeometry(0.118, length - 2 * tankHeight, 0.027)), fins, v(0, 0, 0));
  const tank = bag.track(new THREE.BoxGeometry(0.124, tankHeight, 0.032));
  addMesh(radiator, tank, frame, v(0, length / 2 - tankHeight / 2, 0));
  addMesh(radiator, tank, frame, v(0, -length / 2 + tankHeight / 2, 0));
  const rail = bag.track(new THREE.BoxGeometry(0.004, length - 2 * tankHeight, 0.03));
  addMesh(radiator, rail, frame, v(0.061, 0, 0));
  addMesh(radiator, rail, frame, v(-0.061, 0, 0));

  const fitting = bag.track(new THREE.CylinderGeometry(0.0068, 0.0068, 0.012, 24));
  fitting.rotateX(Math.PI / 2);
  radiatorFittings(length).forEach((point) => addMesh(radiator, fitting, frame, point.clone().setZ(-0.021)));

  radiator.userData.fittings = radiatorFittings(length);
  return radiator;
}

function radiatorFittings(length: number): THREE.Vector3[] {
  const y = length / 2 - 0.0075;
  return [v(-0.022, y, -0.027), v(0.022, y, -0.027)];
}

export function createAioUnit(radiatorMM: number, rgb: RgbLighting, bag: ResourceBag): AioUnit {
  return { pump: createPump(rgb, bag), radiator: createRadiator(radiatorMM, bag) };
}

/**
 * Runs two coolant tubes from the pump to the radiator once both are placed under `root`.
 * `bow` pushes the middle of the run, e.g. towards the glass to clear the RAM.
 */
export function connectAioTubes(
  root: THREE.Object3D,
  unit: AioUnit,
  bow: THREE.Vector3,
  bag: ResourceBag
): THREE.Group {
  root.updateMatrixWorld(true);
  const toRoot = (object: THREE.Object3D, point: THREE.Vector3) =>
    root.worldToLocal(object.localToWorld(point.clone()));
  const direction = (object: THREE.Object3D, local: THREE.Vector3) =>
    toRoot(object, local).sub(toRoot(object, v(0, 0, 0))).normalize();

  const pumpOut = direction(unit.pump, v(0, 0, 1));
  const radiatorOut = direction(unit.radiator, v(0, 0, -1));
  const radiatorPoints = unit.radiator.userData.fittings as THREE.Vector3[];
  const material = bag.track(new THREE.MeshStandardMaterial({ color: '#101114', roughness: 0.85, metalness: 0.05 }));

  const tubes = new THREE.Group();
  tubes.name = 'AIO_tubes';
  pumpFittings().forEach((pumpPoint, i) => {
    const start = toRoot(unit.pump, pumpPoint);
    const end = toRoot(unit.radiator, radiatorPoints[i]);
    const curve = new THREE.CatmullRomCurve3([
      start,
      start.clone().addScaledVector(pumpOut, 0.035).addScaledVector(bow, 0.4),
      start.clone().lerp(end, 0.5).add(bow),
      end.clone().addScaledVector(radiatorOut, 0.06),
      end,
    ]);
    addMesh(tubes, bag.track(new THREE.TubeGeometry(curve, 96, TUBE_RADIUS, 16)), material, v(0, 0, 0));
  });
  root.add(tubes);
  return tubes;
}
