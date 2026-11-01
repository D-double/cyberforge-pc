import * as THREE from 'three';

/** Collects GPU resources created at runtime (cached GLB resources are owned by ModelLibrary). */
export class ResourceBag {
  private readonly items: { dispose(): void }[] = [];

  track<T extends { dispose(): void }>(item: T): T {
    this.items.push(item);
    return item;
  }

  dispose() {
    this.items.forEach((item) => item.dispose());
    this.items.length = 0;
  }
}

/** Top-most descendants whose name matches (GLTFLoader turns spaces into underscores and drops dots). */
export function findNodes(root: THREE.Object3D, pattern: RegExp): THREE.Object3D[] {
  const found: THREE.Object3D[] = [];
  const visit = (node: THREE.Object3D) => {
    if (node !== root && pattern.test(node.name)) {
      found.push(node);
      return;
    }
    node.children.forEach(visit);
  };
  visit(root);
  return found;
}

export function forEachMesh(root: THREE.Object3D, callback: (mesh: THREE.Mesh) => void) {
  root.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) callback(node as THREE.Mesh);
  });
}

export function setNodesMaterial(root: THREE.Object3D, pattern: RegExp, material: THREE.Material) {
  findNodes(root, pattern).forEach((node) =>
    forEachMesh(node, (mesh) => {
      mesh.material = material;
    })
  );
}

export function setNodesVisible(root: THREE.Object3D, pattern: RegExp, visible: boolean) {
  findNodes(root, pattern).forEach((node) => {
    node.visible = visible;
  });
}

/**
 * Wraps every fan-blade node in a pivot centred on the blades so it can spin in place.
 * Must run while the model is still in its native, axis-aligned frame.
 */
export function extractFanRotors(root: THREE.Object3D): THREE.Object3D[] {
  root.updateMatrixWorld(true);
  return findNodes(root, /blades/i).map((blades) => {
    const parent = blades.parent ?? root;
    const box = new THREE.Box3().setFromObject(blades);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const pivot = new THREE.Object3D();
    pivot.name = `${blades.name}_rotor`;
    parent.add(pivot);
    pivot.position.copy(parent.worldToLocal(center));
    pivot.updateMatrixWorld(true);
    pivot.attach(blades);

    const thinnest = Math.min(size.x, size.y, size.z);
    const worldAxis =
      thinnest === size.x
        ? new THREE.Vector3(1, 0, 0)
        : thinnest === size.y
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);
    const toLocal = pivot.getWorldQuaternion(new THREE.Quaternion()).invert();
    pivot.userData.spinAxis = worldAxis.applyQuaternion(toLocal).normalize();
    return pivot;
  });
}

export function spinRotors(rotors: THREE.Object3D[], angle: number) {
  rotors.forEach((rotor) => rotor.rotateOnAxis(rotor.userData.spinAxis as THREE.Vector3, angle));
}

/**
 * Places an object by mapping its local X/Y/Z axes onto the given world directions.
 * A left-handed basis is allowed and becomes a mirror (negative scale).
 */
export function placeWithBasis(
  object: THREE.Object3D,
  axes: readonly [THREE.Vector3, THREE.Vector3, THREE.Vector3],
  position: THREE.Vector3
) {
  new THREE.Matrix4()
    .makeBasis(...axes)
    .setPosition(position)
    .decompose(object.position, object.quaternion, object.scale);
}
