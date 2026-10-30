'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { useStore } from '@/context/StoreContext';
import {
  Rotate3d,
  Layers,
  Eye,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Focus,
  Box,
} from 'lucide-react';

const MODEL_CACHE: Record<string, THREE.Group> = {};

export default function PC3DVisualizer() {
  const {
    t,
    build,
    visualizerMode,
    setVisualizerMode,
    activeRgbColor,
    setActiveRgbColor,
    rgbEnabled,
    setRgbEnabled,
  } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'inspect'>('build');
  const [inspectedPart, setInspectedPart] = useState<'gpu' | 'motherboard' | 'cooler' | 'cpu' | 'ram' | 'power' | 'nvme'>('gpu');
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  // References to dynamic 3D elements
  const chassisGroupRef = useRef<THREE.Group | null>(null);
  const assembledPartsGroupRef = useRef<THREE.Group | null>(null);
  const soloGroupRef = useRef<THREE.Group | null>(null);
  const glassPanelRef = useRef<THREE.Mesh | null>(null);
  const rgbLightsRef = useRef<THREE.PointLight[]>([]);
  const spinningFansRef = useRef<THREE.Group[]>([]);
  const rgbMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const colors = [
    { name: 'Cyan Neon', hex: '#06b6d4' },
    { name: 'Magenta Pink', hex: '#ec4899' },
    { name: 'Emerald Razer', hex: '#10b981' },
    { name: 'Cyber Gold', hex: '#f59e0b' },
    { name: 'Ice White', hex: '#e0f2fe' },
    { name: 'Deep Violet', hex: '#8b5cf6' },
  ];

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    sceneRef.current = scene;

    // Subtle dark floor grid
    const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -4.5;
    scene.add(grid);

    // 2. Camera: Positioned at 3/4 view looking slightly down into the case
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(11, 4.2, 13);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controls.minDistance = 3.2;
    controls.maxDistance = 28;
    controls.target.set(-0.2, 0.5, 0); // Focus slightly towards motherboard
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Key Light from front-right
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(12, 16, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light from back-left
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.0);
    fillLight.position.set(-10, 8, -6);
    scene.add(fillLight);

    // Interior Top Light
    const topInteriorLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topInteriorLight.position.set(0, 8, 0);
    scene.add(topInteriorLight);

    // Dynamic ARGB Interior PointLights (illumination from RAM/Cooler/GPU)
    const rgbLight1 = new THREE.PointLight(activeRgbColor, 3.5, 12);
    rgbLight1.position.set(-0.5, 2.0, -0.2); // Near RAM & Cooler
    scene.add(rgbLight1);

    const rgbLight2 = new THREE.PointLight(activeRgbColor, 2.8, 10);
    rgbLight2.position.set(-0.2, 0.2, 0.5); // Near GPU
    scene.add(rgbLight2);

    rgbLightsRef.current = [rgbLight1, rgbLight2];

    // Groups
    const chassisGroup = new THREE.Group();
    scene.add(chassisGroup);
    chassisGroupRef.current = chassisGroup;

    const assembledPartsGroup = new THREE.Group();
    scene.add(assembledPartsGroup);
    assembledPartsGroupRef.current = assembledPartsGroup;

    const soloGroup = new THREE.Group();
    soloGroup.visible = false;
    scene.add(soloGroup);
    soloGroupRef.current = soloGroup;

    // Build the realistic chassis
    buildChassis();

    // Assemble all hardware into their anatomically correct positions
    buildHardwareAssembly();

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      // Spin front/rear fans
      spinningFansRef.current.forEach((fan) => {
        fan.rotation.z += 0.08;
      });

      if (autoRotate && controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
      } else if (controls) {
        controls.autoRotate = false;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 460;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Create configured GLTF Loader
  const createGLTFLoader = (renderer: THREE.WebGLRenderer) => {
    const gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/libs/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/libs/basis/');
    ktx2Loader.detectSupport(renderer);
    gltfLoader.setKTX2Loader(ktx2Loader);

    return gltfLoader;
  };

  // Helper to load GLTF model with cache
  const loadModelPromise = (loader: GLTFLoader, url: string): Promise<THREE.Group> => {
    if (MODEL_CACHE[url]) {
      return Promise.resolve(MODEL_CACHE[url].clone(true));
    }
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          MODEL_CACHE[url] = gltf.scene;
          resolve(gltf.scene.clone(true));
        },
        undefined,
        (err) => reject(err)
      );
    });
  };

  // Build sleek matte black Chassis
  const buildChassis = () => {
    if (!chassisGroupRef.current) return;
    const group = chassisGroupRef.current;
    group.clear();
    spinningFansRef.current = [];
    rgbMaterialsRef.current = [];

    // Dark Gunmetal / Matte Black Chassis Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x16171b,
      roughness: 0.45,
      metalness: 0.85,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f1013,
      roughness: 0.6,
      metalness: 0.5,
    });
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x080809,
      roughness: 0.95,
    });

    // 1. Top Plate
    const topPlateGeo = new THREE.BoxGeometry(4.6, 0.2, 8.6);
    const topPlate = new THREE.Mesh(topPlateGeo, metalMat);
    topPlate.position.set(0, 4.4, 0);
    group.add(topPlate);

    // 2. Bottom Plate
    const bottomPlateGeo = new THREE.BoxGeometry(4.6, 0.2, 8.6);
    const bottomPlate = new THREE.Mesh(bottomPlateGeo, metalMat);
    bottomPlate.position.set(0, -4.4, 0);
    group.add(bottomPlate);

    // Rubber case feet
    [[-1.8, -4.6, -3.6], [1.8, -4.6, -3.6], [-1.8, -4.6, 3.6], [1.8, -4.6, 3.6]].forEach(([x, y, z]) => {
      const footGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
      const foot = new THREE.Mesh(footGeo, rubberMat);
      foot.position.set(x, y, z);
      group.add(foot);
    });

    // 3. Motherboard Tray Back Wall
    const trayGeo = new THREE.BoxGeometry(0.18, 6.2, 8.4);
    const tray = new THREE.Mesh(trayGeo, metalMat);
    tray.position.set(-2.2, 1.2, 0);
    group.add(tray);

    // Motherboard Brass Standoffs (9 standard ATX standoff screws)
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    [-2.6, -0.6, 1.4].forEach((z) => {
      [-1.2, 1.0, 3.2].forEach((y) => {
        const standoffGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
        standoffGeo.rotateZ(Math.PI / 2);
        const standoff = new THREE.Mesh(standoffGeo, standoffMat);
        standoff.position.set(-2.0, y, z);
        group.add(standoff);
      });
    });

    // Cable grommets
    for (let i = 0; i < 3; i++) {
      const grommetGeo = new THREE.BoxGeometry(0.2, 1.0, 0.4);
      const grommet = new THREE.Mesh(grommetGeo, rubberMat);
      grommet.position.set(-2.15, 2.5 - i * 1.5, 2.8);
      group.add(grommet);
    }

    // 4. PSU Shroud (Lower Basement)
    const psuShroudGeo = new THREE.BoxGeometry(4.4, 2.2, 8.4);
    const psuShroud = new THREE.Mesh(psuShroudGeo, darkMat);
    psuShroud.position.set(0, -3.2, 0);
    psuShroud.castShadow = true;
    psuShroud.receiveShadow = true;
    group.add(psuShroud);

    // Cutout window showing PSU badge
    const shroudWindowGeo = new THREE.BoxGeometry(0.2, 1.1, 2.6);
    const shroudWindow = new THREE.Mesh(shroudWindowGeo, rubberMat);
    shroudWindow.position.set(2.15, -3.2, -1.8);
    group.add(shroudWindow);

    // 5. Front Honeycomb Mesh Panel
    const frontFrameGeo = new THREE.BoxGeometry(4.6, 8.8, 0.25);
    const frontFrame = new THREE.Mesh(frontFrameGeo, metalMat);
    frontFrame.position.set(0, 0, 4.3);
    group.add(frontFrame);

    // 3x 120mm Front ARGB Intake Fans
    for (let i = 0; i < 3; i++) {
      const fanGroup = new THREE.Group();
      fanGroup.position.set(0, 2.4 - i * 2.2, 3.9);

      const ringGeo = new THREE.TorusGeometry(0.9, 0.08, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x334155),
        emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x000000),
        emissiveIntensity: rgbEnabled ? 0.9 : 0,
        roughness: 0.2,
      });
      rgbMaterialsRef.current.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      fanGroup.add(ring);

      const rotor = new THREE.Group();
      const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 16);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, darkMat);
      rotor.add(hub);

      for (let b = 0; b < 9; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.08, 0.6, 0.02);
        bladeGeo.translate(0, 0.45, 0);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x1f2024, roughness: 0.5 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.z = (b * Math.PI * 2) / 9;
        blade.rotation.x = 0.35;
        rotor.add(blade);
      }

      fanGroup.add(rotor);
      spinningFansRef.current.push(rotor);
      group.add(fanGroup);
    }

    // 1x 120mm Rear Exhaust Fan (aligned right behind the CPU cooler)
    const rearFanGroup = new THREE.Group();
    rearFanGroup.position.set(0, 1.9, -4.1);
    const rearRingGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 32);
    const rearRingMat = new THREE.MeshStandardMaterial({
      color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x334155),
      emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x000000),
      emissiveIntensity: rgbEnabled ? 0.9 : 0,
    });
    rgbMaterialsRef.current.push(rearRingMat);
    const rearRing = new THREE.Mesh(rearRingGeo, rearRingMat);
    rearFanGroup.add(rearRing);

    const rearRotor = new THREE.Group();
    const rearHubGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16);
    rearHubGeo.rotateX(Math.PI / 2);
    const rearHub = new THREE.Mesh(rearHubGeo, darkMat);
    rearRotor.add(rearHub);
    rearFanGroup.add(rearRotor);
    spinningFansRef.current.push(rearRotor);
    group.add(rearFanGroup);

    // Tempered Glass Side Panel
    const glassGeo = new THREE.BoxGeometry(0.08, 8.6, 8.4);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      reflectivity: 0.9,
    });
    const glassPanel = new THREE.Mesh(glassGeo, glassMat);
    glassPanel.position.set(2.3, 0, 0);
    glassPanel.visible = visualizerMode === 'finished';
    glassPanelRef.current = glassPanel;
    group.add(glassPanel);

    // 4 Corner Metal Thumbscrews
    [[-3.8, 3.8], [3.8, 3.8], [-3.8, -3.8], [3.8, -3.8]].forEach(([z, y]) => {
      const screwGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
      screwGeo.rotateZ(Math.PI / 2);
      const screw = new THREE.Mesh(screwGeo, metalMat);
      screw.position.set(2.34, y, z);
      glassPanel.add(screw);
    });
  };

  // Build the complete anatomically-accurate hardware assembly
  const buildHardwareAssembly = () => {
    if (!assembledPartsGroupRef.current) return;
    const group = assembledPartsGroupRef.current;
    group.clear();

    // 1. MOTHERBOARD (ATX Form-Factor, flat against left tray at X = -1.95)
    if (build.motherboard) {
      const moboGroup = new THREE.Group();
      moboGroup.position.set(-1.85, 1.0, -0.6);

      // Matte Black PCB (305mm tall x 244mm wide => Height = 5.0, Depth = 4.4, Thickness = 0.12)
      const pcbGeo = new THREE.BoxGeometry(0.12, 5.0, 4.4);
      const pcbMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.5, metalness: 0.6 });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.receiveShadow = true;
      moboGroup.add(pcb);

      // Rear I/O Shield & VRM Heatsink (Top-Rear: Y=1.7, Z=-1.6)
      const vrmGeo = new THREE.BoxGeometry(0.45, 1.4, 1.2);
      const vrmMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.3, metalness: 0.9 });
      const vrm = new THREE.Mesh(vrmGeo, vrmMat);
      vrm.position.set(0.25, 1.6, -1.4);
      vrm.castShadow = true;
      moboGroup.add(vrm);

      // Top VRM Heatsink
      const topVrmGeo = new THREE.BoxGeometry(0.45, 0.5, 1.6);
      const topVrm = new THREE.Mesh(topVrmGeo, vrmMat);
      topVrm.position.set(0.25, 2.2, -0.4);
      moboGroup.add(topVrm);

      // Chipset Heatsink (Bottom-Front: Y=-1.4, Z=1.2)
      const chipsetGeo = new THREE.BoxGeometry(0.35, 1.2, 1.4);
      const chipsetMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.3, metalness: 0.85 });
      const chipset = new THREE.Mesh(chipsetGeo, chipsetMat);
      chipset.position.set(0.2, -1.3, 1.1);
      chipset.castShadow = true;
      moboGroup.add(chipset);

      // PCIe x16 Slot 1 (reinforced steel armor) at Y = -0.7
      const pcieSlotGeo = new THREE.BoxGeometry(0.2, 0.15, 2.6);
      const pcieSlotMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 });
      const pcieSlot = new THREE.Mesh(pcieSlotGeo, pcieSlotMat);
      pcieSlot.position.set(0.12, -0.7, -0.6);
      moboGroup.add(pcieSlot);

      // M.2 NVMe Slot with Aluminum Thermal Armor Heatsink
      const m2ArmorGeo = new THREE.BoxGeometry(0.18, 0.2, 1.6);
      const m2ArmorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 });
      const m2Armor = new THREE.Mesh(m2ArmorGeo, m2ArmorMat);
      m2Armor.position.set(0.14, 0.1, -0.6);
      moboGroup.add(m2Armor);

      group.add(moboGroup);
    }

    // 2. CPU (Socket at X = -1.75, Y = 1.9, Z = -1.0)
    if (build.cpu && build.motherboard) {
      const cpuGroup = new THREE.Group();
      cpuGroup.position.set(-1.72, 1.9, -1.0);

      // Nickel-plated Copper IHS
      const ihsGeo = new THREE.BoxGeometry(0.08, 1.1, 1.1);
      const ihsMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.2 });
      const ihs = new THREE.Mesh(ihsGeo, ihsMat);
      cpuGroup.add(ihs);

      // Metal socket retention bracket
      const socketFrameGeo = new THREE.BoxGeometry(0.06, 1.3, 1.3);
      const socketFrameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.3 });
      const socketFrame = new THREE.Mesh(socketFrameGeo, socketFrameMat);
      socketFrame.position.set(-0.02, 0, 0);
      cpuGroup.add(socketFrame);

      group.add(cpuGroup);
    }

    // 3. CPU COOLER (Mounted directly on top of CPU socket at Y = 1.9, Z = -1.0)
    if (build.cooler && build.cpu) {
      const coolerGroup = new THREE.Group();
      coolerGroup.position.set(-1.0, 1.9, -1.0);

      const isAio = build.cooler.specs?.isAio;

      if (isAio) {
        // Liquid AIO Waterblock Pump
        const pumpGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 32);
        pumpGeo.rotateZ(Math.PI / 2);
        const pumpMat = new THREE.MeshStandardMaterial({
          color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x0284c7),
          emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x0284c7),
          emissiveIntensity: rgbEnabled ? 0.9 : 0.2,
          roughness: 0.2,
          metalness: 0.8,
        });
        rgbMaterialsRef.current.push(pumpMat);
        const pump = new THREE.Mesh(pumpGeo, pumpMat);
        coolerGroup.add(pump);

        // Flexible braided black coolant tubes curving towards front radiator
        const tubeCurve1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.4, 0.2, 0),
          new THREE.Vector3(-0.2, 1.0, 1.2),
          new THREE.Vector3(0.0, 2.2, 3.5),
        ]);
        const tubeGeo1 = new THREE.TubeGeometry(tubeCurve1, 24, 0.1, 12, false);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
        const tube1 = new THREE.Mesh(tubeGeo1, tubeMat);
        coolerGroup.add(tube1);
      } else {
        // Twin-Tower High Performance Air Cooler (Thermalright / AK620 style)
        // Copper Base Plate
        const baseGeo = new THREE.BoxGeometry(0.12, 1.0, 1.0);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.set(-0.7, 0, 0);
        coolerGroup.add(base);

        // 6x Sintered Copper Heatpipes
        for (let hp = -2; hp <= 2; hp++) {
          const hpGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 12);
          hpGeo.rotateZ(Math.PI / 2);
          const hpMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.95, roughness: 0.2 });
          const heatpipe = new THREE.Mesh(hpGeo, hpMat);
          heatpipe.position.set(0, 0, hp * 0.2);
          coolerGroup.add(heatpipe);
        }

        // Dual Aluminum Fin Stack
        [-0.4, 0.2].forEach((stackX) => {
          const stackGeo = new THREE.BoxGeometry(0.5, 2.0, 1.8);
          const stackMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });
          const finStack = new THREE.Mesh(stackGeo, stackMat);
          finStack.position.set(stackX, 0, 0);
          finStack.castShadow = true;
          coolerGroup.add(finStack);
        });

        // 120mm ARGB Center Cooler Fan
        const fanFrameGeo = new THREE.BoxGeometry(0.25, 1.9, 1.9);
        const fanFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
        const fanFrame = new THREE.Mesh(fanFrameGeo, fanFrameMat);
        fanFrame.position.set(-0.1, 0, 0);
        coolerGroup.add(fanFrame);

        // ARGB Glowing Ring on Fan
        const coolerRingGeo = new THREE.TorusGeometry(0.75, 0.06, 16, 32);
        coolerRingGeo.rotateY(Math.PI / 2);
        const coolerRingMat = new THREE.MeshStandardMaterial({
          color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x38bdf8),
          emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x000000),
          emissiveIntensity: rgbEnabled ? 1.0 : 0,
        });
        rgbMaterialsRef.current.push(coolerRingMat);
        const coolerRing = new THREE.Mesh(coolerRingGeo, coolerRingMat);
        coolerRing.position.set(0.05, 0, 0);
        coolerGroup.add(coolerRing);
      }

      group.add(coolerGroup);
    }

    // 4. RAM (2 sticks in DIMM slots to the right of CPU socket)
    if (build.ram && build.motherboard) {
      [-0.15, 0.2].forEach((dimmZ, idx) => {
        const ramGroup = new THREE.Group();
        ramGroup.position.set(-1.68, 1.9, dimmZ);

        // RAM Heat Spreader (Aluminum Corsair / Kingston style)
        const spreaderGeo = new THREE.BoxGeometry(0.1, 1.6, 0.14);
        const spreaderMat = new THREE.MeshStandardMaterial({ color: 0x18191f, metalness: 0.8, roughness: 0.3 });
        const spreader = new THREE.Mesh(spreaderGeo, spreaderMat);
        ramGroup.add(spreader);

        // Top ARGB Glowing Lightbar
        const lightbarGeo = new THREE.BoxGeometry(0.12, 0.15, 0.14);
        const lightbarMat = new THREE.MeshStandardMaterial({
          color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0xe0f2fe),
          emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x000000),
          emissiveIntensity: rgbEnabled ? 1.0 : 0,
        });
        rgbMaterialsRef.current.push(lightbarMat);
        const lightbar = new THREE.Mesh(lightbarGeo, lightbarMat);
        lightbar.position.set(0.02, 0.85, 0);
        ramGroup.add(lightbar);

        group.add(ramGroup);
      });
    }

    // 5. GRAPHICS CARD (Mounted horizontally in PCIe slot at Y = 0.3, extending forward)
    if (build.gpu && build.motherboard) {
      const gpuGroup = new THREE.Group();
      // Position: plugged into PCIe slot (X = -1.6), extending forward (Z from -3.2 to +1.2)
      gpuGroup.position.set(-0.7, 0.3, -0.9);

      // Card Dimensions: Length = 4.4, Width = 1.8, Thickness = 0.7
      // 1. Metal Backplate on TOP (faces upward towards CPU cooler)
      const backplateGeo = new THREE.BoxGeometry(1.7, 0.08, 4.2);
      const backplateMat = new THREE.MeshStandardMaterial({
        color: 0x23252c,
        metalness: 0.85,
        roughness: 0.3,
      });
      const backplate = new THREE.Mesh(backplateGeo, backplateMat);
      backplate.position.set(0, 0.28, 0);
      backplate.castShadow = true;
      gpuGroup.add(backplate);

      // 2. Main Heatsink Fin Array (aluminum fins and heatpipes)
      const finsGeo = new THREE.BoxGeometry(1.6, 0.4, 4.0);
      const finsMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9, roughness: 0.35 });
      const fins = new THREE.Mesh(finsGeo, finsMat);
      fins.position.set(0, 0.04, 0);
      gpuGroup.add(fins);

      // 3. Cooling Shroud & Dual Fans (facing DOWNWARD towards PSU shroud)
      const shroudGeo = new THREE.BoxGeometry(1.7, 0.15, 4.2);
      const shroudMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.7 });
      const shroud = new THREE.Mesh(shroudGeo, shroudMat);
      shroud.position.set(0, -0.22, 0);
      gpuGroup.add(shroud);

      // Dual Fan Rings facing down
      [-1.0, 1.0].forEach((fanZ) => {
        const fanRingGeo = new THREE.TorusGeometry(0.65, 0.06, 16, 24);
        fanRingGeo.rotateX(Math.PI / 2);
        const fanRingMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 });
        const fanRing = new THREE.Mesh(fanRingGeo, fanRingMat);
        fanRing.position.set(0, -0.3, fanZ);
        gpuGroup.add(fanRing);
      });

      // 4. Rear Metal PCIe Bracket (secured to rear of case at Z = -2.15 relative to GPU center)
      const bracketGeo = new THREE.BoxGeometry(0.1, 0.8, 0.08);
      const bracketMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.95, roughness: 0.2 });
      const bracket = new THREE.Mesh(bracketGeo, bracketMat);
      bracket.position.set(-0.85, 0, -2.12);
      gpuGroup.add(bracket);

      // 5. Glowing Side Logo (GEFORCE RTX / CyberForge logo strip facing the glass panel at +X)
      const logoStripGeo = new THREE.BoxGeometry(0.06, 0.22, 1.8);
      const logoStripMat = new THREE.MeshStandardMaterial({
        color: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x38bdf8),
        emissive: rgbEnabled ? new THREE.Color(activeRgbColor) : new THREE.Color(0x0284c7),
        emissiveIntensity: rgbEnabled ? 1.0 : 0.3,
      });
      rgbMaterialsRef.current.push(logoStripMat);
      const logoStrip = new THREE.Mesh(logoStripGeo, logoStripMat);
      logoStrip.position.set(0.86, 0.1, 0);
      gpuGroup.add(logoStrip);

      // 6. Sleeved 12VHPWR Power Cable (curves from GPU side edge down to PSU shroud)
      const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.85, 0.1, 0.6),
        new THREE.Vector3(1.1, -0.4, 0.6),
        new THREE.Vector3(0.9, -1.8, 0.6),
      ]);
      const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.08, 8, false);
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x111216, roughness: 0.95 });
      const cable = new THREE.Mesh(cableGeo, cableMat);
      gpuGroup.add(cable);

      group.add(gpuGroup);
    }

    // 6. POWER SUPPLY (Inside bottom chamber at X = 0, Y = -3.2, Z = -1.8)
    if (build.psu) {
      const psuGroup = new THREE.Group();
      psuGroup.position.set(0, -3.2, -1.8);

      // ATX Power Supply Casing (150mm wide x 86mm tall x 160mm deep)
      const psuBoxGeo = new THREE.BoxGeometry(3.2, 1.8, 3.4);
      const psuBoxMat = new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.5, metalness: 0.7 });
      const psuBox = new THREE.Mesh(psuBoxGeo, psuBoxMat);
      psuGroup.add(psuBox);

      // Rear Honeycomb Fan & Power Switch Grill (faces -Z rear of case)
      const psuGrillGeo = new THREE.BoxGeometry(3.0, 1.6, 0.1);
      const psuGrillMat = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.9 });
      const psuGrill = new THREE.Mesh(psuGrillGeo, psuGrillMat);
      psuGrill.position.set(0, 0, -1.72);
      psuGroup.add(psuGrill);

      // Power Rocker Switch (Red/White LED)
      const psuSwitchGeo = new THREE.BoxGeometry(0.3, 0.2, 0.12);
      const psuSwitchMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const psuSwitch = new THREE.Mesh(psuSwitchGeo, psuSwitchMat);
      psuSwitch.position.set(0.8, 0.3, -1.74);
      psuGroup.add(psuSwitch);

      // Modular Cable Bundle coming out of the front of PSU
      const psuCableGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.4, 8);
      psuCableGeo.rotateX(Math.PI / 2);
      const psuCableMat = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.95 });
      const psuCables = new THREE.Mesh(psuCableGeo, psuCableMat);
      psuCables.position.set(0, 0, 1.9);
      psuGroup.add(psuCables);

      group.add(psuGroup);
    }
  };

  // Re-build 3D assembly whenever user changes components
  useEffect(() => {
    buildHardwareAssembly();
  }, [build]);

  // Update RGB light colors
  useEffect(() => {
    rgbLightsRef.current.forEach((light) => {
      light.color.set(activeRgbColor);
      light.intensity = rgbEnabled ? 3.5 : 0;
    });

    // Update all ARGB materials
    rgbMaterialsRef.current.forEach((mat) => {
      mat.color.set(rgbEnabled ? activeRgbColor : '#334155');
      mat.emissive.set(rgbEnabled ? activeRgbColor : '#000000');
      mat.emissiveIntensity = rgbEnabled ? 0.95 : 0;
    });
  }, [activeRgbColor, rgbEnabled]);

  // Update Glass panel visibility
  useEffect(() => {
    if (glassPanelRef.current) {
      glassPanelRef.current.visible = visualizerMode === 'finished';
    }
  }, [visualizerMode]);

  // Solo Part Inspection Mode
  useEffect(() => {
    if (activeTab !== 'inspect' || !soloGroupRef.current || !rendererRef.current) return;

    if (chassisGroupRef.current) chassisGroupRef.current.visible = false;
    if (assembledPartsGroupRef.current) assembledPartsGroupRef.current.visible = false;
    soloGroupRef.current.visible = true;
    soloGroupRef.current.clear();

    setLoadingStatus(`Загрузка 3D модели ${inspectedPart.toUpperCase()}...`);
    const loader = createGLTFLoader(rendererRef.current);
    const modelUrl = `/models/${inspectedPart}.glb`;

    loadModelPromise(loader, modelUrl)
      .then((model) => {
        if (!soloGroupRef.current) return;
        soloGroupRef.current.clear();

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        model.position.sub(center);
        const targetScale = 6.2 / (maxDim || 1);
        model.scale.setScalar(targetScale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        soloGroupRef.current.add(model);
        setLoadingStatus(null);
      })
      .catch((err) => {
        console.warn('Inspect load error:', err);
        setLoadingStatus(null);
      });
  }, [activeTab, inspectedPart]);

  // Camera presets
  const setCameraPreset = (preset: 'iso' | 'inside' | 'gpu' | 'front') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (preset === 'iso') {
      cam.position.set(11, 4.2, 13);
      ctrl.target.set(-0.2, 0.5, 0);
    } else if (preset === 'inside') {
      cam.position.set(5.5, 1.6, 1.2);
      ctrl.target.set(-0.8, 1.6, -0.6); // Direct look at CPU & RAM
    } else if (preset === 'gpu') {
      cam.position.set(4.0, 0.4, 0.8);
      ctrl.target.set(-0.7, 0.3, -0.8); // Direct look at GPU
    } else if (preset === 'front') {
      cam.position.set(0, 0, 15);
      ctrl.target.set(0, 0, 0);
    }
    ctrl.update();
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      {rgbEnabled && (
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: activeRgbColor }}
        />
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Rotate3d className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Реалистичный 3D Конструктор ПК
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                3D GLTF 360°
              </span>
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Точное расположение деталей: материнская плата, процессор, кулер, ОЗУ, видеокарта и БП
          </p>
        </div>

        {/* View Mode & Model Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main 3D Rig vs Solo Models Tab */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('build');
                if (chassisGroupRef.current) chassisGroupRef.current.visible = true;
                if (assembledPartsGroupRef.current) assembledPartsGroupRef.current.visible = true;
                if (soloGroupRef.current) soloGroupRef.current.visible = false;
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'build'
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Сборка в корпусе
            </button>
            <button
              onClick={() => {
                setActiveTab('inspect');
                if (chassisGroupRef.current) chassisGroupRef.current.visible = false;
                if (assembledPartsGroupRef.current) assembledPartsGroupRef.current.visible = false;
                if (soloGroupRef.current) soloGroupRef.current.visible = true;
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'inspect'
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Focus className="w-3.5 h-3.5" />
              Осмотр деталей в 3D
            </button>
          </div>

          {/* Glass Panel Toggle (Only in build mode) */}
          {activeTab === 'build' && (
            <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
              <button
                onClick={() => setVisualizerMode('xray')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  visualizerMode === 'xray'
                    ? 'bg-cyan-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Снять стекло (вид внутри)"
              >
                <Layers className="w-3.5 h-3.5" />
                Без стекла
              </button>
              <button
                onClick={() => setVisualizerMode('finished')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  visualizerMode === 'finished'
                    ? 'bg-cyan-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Установить стекло"
              >
                <Eye className="w-3.5 h-3.5" />
                Со стеклом
              </button>
            </div>
          )}

          {/* RGB Palette */}
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setRgbEnabled(!rgbEnabled)}
              title="Вкл/Выкл подсветку"
              className={`p-1.5 rounded-lg transition-all ${
                rgbEnabled ? 'text-amber-400 bg-amber-400/10' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            {rgbEnabled && (
              <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveRgbColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-3.5 h-3.5 rounded-full transition-transform ${
                      activeRgbColor === c.hex
                        ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-neutral-950'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Part Selector Bar (When in Inspect Mode) */}
      {activeTab === 'inspect' && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-400 font-semibold shrink-0">
            Деталь для 3D осмотра:
          </span>
          {[
            { id: 'gpu', label: '🎮 Видеокарта (GPU)' },
            { id: 'motherboard', label: '🎛️ Материнская плата' },
            { id: 'cooler', label: '❄️ Башенный кулер' },
            { id: 'cpu', label: '⚡ Процессор (CPU)' },
            { id: 'ram', label: '💾 Оперативная память (RAM)' },
            { id: 'power', label: '🔌 Блок питания (PSU)' },
            { id: 'nvme', label: '💿 M.2 NVMe SSD' },
          ].map((part) => (
            <button
              key={part.id}
              onClick={() => setInspectedPart(part.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                inspectedPart === part.id
                  ? 'bg-cyan-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {part.label}
            </button>
          ))}
        </div>
      )}

      {/* 3D Viewport Canvas Container */}
      <div className="relative w-full aspect-[4/3] max-h-[460px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden group">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Camera Angles Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={() => setCameraPreset('iso')}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            3D Обзор
          </button>
          <button
            onClick={() => setCameraPreset('inside')}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            Внутри платы
          </button>
          <button
            onClick={() => setCameraPreset('gpu')}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            Фокус на GPU
          </button>
          <button
            onClick={() => setCameraPreset('front')}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            Фронт
          </button>
          <div className="h-4 w-px bg-neutral-700 mx-1" />
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Автоповорот 360°"
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
              autoRotate ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading Indicator */}
        {loadingStatus && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {loadingStatus}
          </div>
        )}

        {/* 3D Navigation Hint */}
        <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-800 text-[10px] text-neutral-400 pointer-events-none">
          Вращение 360°: Зажмите ЛКМ • Приближение: Колесо мыши • Панорама: ПКМ
        </div>
      </div>

      {/* Footer Info / Real-time status */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Детали монтируются в реальном 3D при выборе в конструкторе справа</span>
        </div>
        <span className="font-mono text-neutral-500">
          Корпус: {build.case?.name || 'NZXT H5 Flow Matte Black'}
        </span>
      </div>
    </div>
  );
}
