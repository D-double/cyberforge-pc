import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DEFAULT_THEME, Theme } from '@/lib/theme';
import { CAMERA_PRESETS, CameraPreset } from './caseLayout';
import { ModelLibrary } from './modelLibrary';
import { spinRotors } from './sceneUtils';

const THEME_COLORS: Record<Theme, { background: string; ground: string; environment: number }> = {
  dark: { background: '#0b0d12', ground: '#16191f', environment: 0.55 },
  light: { background: '#e6eaf0', ground: '#d3d9e1', environment: 0.85 },
};

const FAN_SPEED = 9; // rad/s
const CAMERA_TWEEN_SECONDS = 0.7;
const FRAME_DIRECTION = new THREE.Vector3(-1, 0.6, 0.95).normalize();

interface CameraTween {
  fromPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toPosition: THREE.Vector3;
  toTarget: THREE.Vector3;
  elapsed: number;
}

/** Owns the WebGL renderer, lighting, camera and render loop of the 3D PC viewer. */
export class PCStage {
  readonly library: ModelLibrary;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.01, 30);
  private readonly controls: OrbitControls;
  private readonly timer = new THREE.Timer();
  private readonly groundMaterial = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
  private readonly ground: THREE.Mesh;
  private readonly environment: THREE.Texture;
  private readonly resizeObserver: ResizeObserver;
  private content: THREE.Object3D | null = null;
  private rotors: THREE.Object3D[] = [];
  private tween: CameraTween | null = null;

  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.localClippingEnabled = true;
    container.replaceChildren(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.environment;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.08;
    this.controls.maxDistance = 3;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.autoRotateSpeed = 1.6;
    this.controls.addEventListener('start', () => {
      this.tween = null;
    });

    this.ground = new THREE.Mesh(new THREE.CircleGeometry(5, 64), this.groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    this.addLights();
    this.setTheme(DEFAULT_THEME);

    this.library = new ModelLibrary(this.renderer);
    this.moveCamera('overview', false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.timer.connect(document);
    this.renderer.setAnimationLoop((time) => this.render(time));
  }

  setContent(object: THREE.Object3D | null, rotors: THREE.Object3D[] = []) {
    if (this.content) this.scene.remove(this.content);
    this.content = object;
    this.rotors = rotors;
    if (object) this.scene.add(object);
  }

  setTheme(theme: Theme) {
    const colors = THEME_COLORS[theme];
    const background = new THREE.Color(colors.background);
    this.scene.background = background;
    this.scene.fog = new THREE.Fog(background, 2.5, 6);
    this.scene.environmentIntensity = colors.environment;
    this.groundMaterial.color.set(colors.ground);
  }

  setAutoRotate(enabled: boolean) {
    this.controls.autoRotate = enabled;
  }

  moveCamera(preset: CameraPreset, animate = true) {
    const { position, target } = CAMERA_PRESETS[preset];
    this.flyTo(position, target, animate);
  }

  /** Points the camera at an object so that it fills the view. */
  frameObject(object: THREE.Object3D, animate = true) {
    const sphere = new THREE.Box3().setFromObject(object).getBoundingSphere(new THREE.Sphere());
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const distance = (sphere.radius / Math.sin(fov / 2)) * 1.15;
    this.flyTo(sphere.center.clone().addScaledVector(FRAME_DIRECTION, distance), sphere.center, animate);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.timer.dispose();
    this.controls.dispose();
    this.library.dispose();
    this.environment.dispose();
    this.ground.geometry.dispose();
    this.groundMaterial.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private addLights() {
    const key = new THREE.DirectionalLight('#ffffff', 2.4);
    key.position.set(-1.3, 2.1, 1.1);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.01;
    Object.assign(key.shadow.camera, { left: -0.6, right: 0.6, top: 0.6, bottom: -0.6, near: 0.5, far: 5 });
    key.target.position.set(0, 0.25, 0);

    const fill = new THREE.DirectionalLight('#a8bcff', 0.6);
    fill.position.set(1.2, 0.9, -1.4);

    const rim = new THREE.DirectionalLight('#ffffff', 0.8);
    rim.position.set(0.4, 1.6, -2);

    this.scene.add(key, key.target, fill, rim);
  }

  private flyTo(position: THREE.Vector3, target: THREE.Vector3, animate: boolean) {
    if (!animate) {
      this.tween = null;
      this.camera.position.copy(position);
      this.controls.target.copy(target);
      this.controls.update();
      return;
    }
    this.tween = {
      fromPosition: this.camera.position.clone(),
      fromTarget: this.controls.target.clone(),
      toPosition: position.clone(),
      toTarget: target.clone(),
      elapsed: 0,
    };
  }

  private resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private render(time: number) {
    this.timer.update(time);
    const delta = Math.min(this.timer.getDelta(), 0.1);

    if (this.tween) {
      this.tween.elapsed += delta;
      const t = Math.min(this.tween.elapsed / CAMERA_TWEEN_SECONDS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(this.tween.fromPosition, this.tween.toPosition, eased);
      this.controls.target.lerpVectors(this.tween.fromTarget, this.tween.toTarget, eased);
      if (t === 1) this.tween = null;
    }

    spinRotors(this.rotors, FAN_SPEED * delta);
    this.controls.update(delta);
    this.renderer.render(this.scene, this.camera);
  }
}
