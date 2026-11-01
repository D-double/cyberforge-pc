import * as THREE from 'three';

/*
 * Real-world layout of the mid-tower case in metres, measured from the GLB models.
 * Case frame: +Y up, +Z towards the front panel, −X towards the glass side panel,
 * the motherboard tray sits on the +X wall.
 */

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const AXIS = {
  px: v(1, 0, 0),
  nx: v(-1, 0, 0),
  py: v(0, 1, 0),
  ny: v(0, -1, 0),
  pz: v(0, 0, 1),
  nz: v(0, 0, -1),
} as const;

/** Board origin on the standoffs; board-local X runs up, component side (+Y) faces the glass. */
export const BOARD_ORIGIN = v(0.0793, 0.172, 0.0165);
export const BOARD_BASIS = [AXIS.py, AXIS.nx, AXIS.pz] as const;

/** Points on the ATX motherboard model, in its local frame (metres). */
export const BOARD = {
  socket: { x: 0.236, z: -0.15 },
  cpuSeatY: 0.0045,
  pcieSlot1: { x: 0.1283, rearZ: -0.2, topY: 0.0135 },
  dimmCenterX: 0.2182,
  dimmSlotsZ: { A1: -0.1015, A2: -0.093, B1: -0.0825, B2: -0.074 },
  dimmSeatY: 0.004,
  m2Slot1: { x: 0.172, connectorZ: -0.1155, seatY: 0.0045 },
  microAtxCutX: 0.061,
} as const;

export function boardToCase(x: number, y: number, z: number): THREE.Vector3 {
  return v(BOARD_ORIGIN.x - y, BOARD_ORIGIN.y + x, BOARD_ORIGIN.z + z);
}

export const PSU_SLOT = { centerX: -0.005, topY: 0.1055, rearZ: -0.233 } as const;

export const SHROUD_TOP_Y = 0.106;

/** Front intake fans column; an AIO radiator mounts directly behind them. */
export const FRONT_RADIATOR = { centerX: -0.015, topY: 0.478, centerZ: 0.1875 } as const;

export const RGB_LIGHT_SPOTS = [
  { position: v(-0.035, 0.42, -0.07), intensity: 0.035 },
  { position: v(-0.06, 0.21, -0.05), intensity: 0.03 },
  { position: v(-0.03, 0.29, 0.165), intensity: 0.03 },
] as const;

export type CameraPreset = 'overview' | 'inside' | 'gpu' | 'front';

export const CAMERA_PRESETS: Record<CameraPreset, { position: THREE.Vector3; target: THREE.Vector3 }> = {
  overview: { position: v(-0.95, 0.56, 0.78), target: v(0, 0.25, 0) },
  inside: { position: v(-0.38, 0.45, 0.04), target: v(0.04, 0.38, -0.11) },
  gpu: { position: v(-0.42, 0.15, 0.2), target: v(0, 0.27, -0.07) },
  front: { position: v(0, 0.27, 1.3), target: v(0, 0.25, 0) },
};
