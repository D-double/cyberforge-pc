import * as THREE from 'three';

const OFF_COLOR = new THREE.Color('#2a2d33');
const EMISSIVE_INTENSITY = 2.4;

/** One shared ARGB material plus the interior lights it tints, so a colour change is a single update. */
export class RgbLighting {
  readonly material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0 });
  private readonly lights = new Set<THREE.PointLight>();
  private readonly color = new THREE.Color('#ffffff');
  private enabled = true;

  constructor() {
    this.refresh();
  }

  createLight(position: THREE.Vector3, intensity: number): THREE.PointLight {
    const light = new THREE.PointLight(this.color, 0, 0.45, 2);
    light.position.copy(position);
    light.userData.baseIntensity = intensity;
    this.lights.add(light);
    this.refresh();
    return light;
  }

  releaseLights(lights: THREE.PointLight[]) {
    lights.forEach((light) => this.lights.delete(light));
  }

  set(color: string, enabled: boolean) {
    this.color.set(color);
    this.enabled = enabled;
    this.refresh();
  }

  dispose() {
    this.material.dispose();
    this.lights.clear();
  }

  private refresh() {
    this.material.color.copy(this.enabled ? this.color : OFF_COLOR);
    this.material.emissive.copy(this.enabled ? this.color : OFF_COLOR);
    this.material.emissiveIntensity = this.enabled ? EMISSIVE_INTENSITY : 0;
    this.lights.forEach((light) => {
      light.color.copy(this.color);
      light.intensity = this.enabled ? (light.userData.baseIntensity as number) : 0;
    });
  }
}
