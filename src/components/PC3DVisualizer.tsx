'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '@/context/StoreContext';
import { useTheme } from '@/hooks/useTheme';
import { PCBuild } from '@/types';
import { buildAssembly } from './pc3d/assembly';
import { CameraPreset } from './pc3d/caseLayout';
import { createInspectPart, INSPECT_PARTS, InspectPartId } from './pc3d/inspectParts';
import { RgbLighting } from './pc3d/rgbLighting';
import { PCStage } from './pc3d/stage';
import { Rotate3d, Layers, Eye, RefreshCw, Lightbulb, Sparkles, Focus, Box, TriangleAlert } from 'lucide-react';

type ViewTab = 'build' | 'inspect';

interface SceneContent {
  object: THREE.Object3D;
  rotors: THREE.Object3D[];
  dispose(): void;
  setXray?(enabled: boolean): void;
}

interface ContentRequest {
  build: PCBuild;
  tab: ViewTab;
  part: InspectPartId;
  failed?: boolean;
}

const RGB_COLORS = [
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Magenta Pink', hex: '#ec4899' },
  { name: 'Emerald Razer', hex: '#10b981' },
  { name: 'Cyber Gold', hex: '#f59e0b' },
  { name: 'Ice White', hex: '#e0f2fe' },
  { name: 'Deep Violet', hex: '#8b5cf6' },
];

const CAMERA_BUTTONS: { preset: CameraPreset; label: string }[] = [
  { preset: 'overview', label: '3D Обзор' },
  { preset: 'inside', label: 'Внутри платы' },
  { preset: 'gpu', label: 'Фокус на GPU' },
  { preset: 'front', label: 'Фронт' },
];

async function loadContent(
  { build, tab, part }: ContentRequest,
  stage: PCStage,
  rgb: RgbLighting
): Promise<SceneContent> {
  if (tab === 'build') {
    const assembly = await buildAssembly(build, stage.library, rgb);
    return { object: assembly.root, rotors: assembly.rotors, dispose: assembly.dispose, setXray: assembly.setXray };
  }
  const inspected = await createInspectPart(part, build, stage.library, rgb);
  return { object: inspected.object, rotors: inspected.rotors, dispose: () => inspected.dispose?.() };
}

function isSameRequest(a: ContentRequest | null, b: ContentRequest) {
  return a !== null && a.build === b.build && a.tab === b.tab && (b.tab === 'build' || a.part === b.part);
}

const tabClass = (active: boolean) =>
  `px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
    active ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md' : 'text-neutral-400 hover:text-white'
  }`;

const glassClass = (active: boolean) =>
  `px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
    active ? 'bg-cyan-500 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white'
  }`;

export default function PC3DVisualizer() {
  const { build, visualizerMode, setVisualizerMode, activeRgbColor, setActiveRgbColor, rgbEnabled, setRgbEnabled } =
    useStore();
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<PCStage | null>(null);
  const rgbRef = useRef<RgbLighting | null>(null);
  const contentRef = useRef<SceneContent | null>(null);
  const shownTabRef = useRef<ViewTab | null>(null);

  const [tab, setTab] = useState<ViewTab>('build');
  const [inspectedPart, setInspectedPart] = useState<InspectPartId>('gpu');
  const [autoRotate, setAutoRotate] = useState(false);
  const [loaded, setLoaded] = useState<ContentRequest | null>(null);

  const isLoading = !isSameRequest(loaded, { build, tab, part: inspectedPart });

  useEffect(() => {
    const stage = new PCStage(containerRef.current!);
    const rgb = new RgbLighting();
    stageRef.current = stage;
    rgbRef.current = rgb;
    return () => {
      contentRef.current?.dispose();
      contentRef.current = null;
      shownTabRef.current = null;
      stage.dispose();
      rgb.dispose();
      stageRef.current = null;
      rgbRef.current = null;
    };
  }, []);

  useEffect(() => {
    stageRef.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    stageRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    rgbRef.current?.set(activeRgbColor, rgbEnabled);
  }, [activeRgbColor, rgbEnabled]);

  useEffect(() => {
    contentRef.current?.setXray?.(visualizerMode === 'xray');
  }, [visualizerMode, loaded]);

  useEffect(() => {
    const stage = stageRef.current;
    const rgb = rgbRef.current;
    if (!stage || !rgb) return;

    const request: ContentRequest = { build, tab, part: inspectedPart };
    let cancelled = false;

    loadContent(request, stage, rgb)
      .then((content) => {
        if (cancelled) {
          content.dispose();
          return;
        }
        stage.setContent(content.object, content.rotors);
        contentRef.current?.dispose();
        contentRef.current = content;

        if (tab === 'inspect') stage.frameObject(content.object);
        else if (shownTabRef.current === 'inspect') stage.moveCamera('overview');
        shownTabRef.current = tab;
        setLoaded(request);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Failed to load 3D models', error);
        setLoaded({ ...request, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [build, tab, inspectedPart]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
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
                PBR · 1:1
              </span>
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Реальные размеры и посадочные места: корпус, плата ATX/mATX, процессор, кулер или СЖО, ОЗУ, видеокарта, БП и
            накопитель
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
            <button onClick={() => setTab('build')} className={tabClass(tab === 'build')}>
              <Box className="w-3.5 h-3.5" />
              Сборка в корпусе
            </button>
            <button onClick={() => setTab('inspect')} className={tabClass(tab === 'inspect')}>
              <Focus className="w-3.5 h-3.5" />
              Осмотр деталей в 3D
            </button>
          </div>

          {tab === 'build' && (
            <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
              <button
                onClick={() => setVisualizerMode('xray')}
                className={glassClass(visualizerMode === 'xray')}
                title="Снять стекло (вид внутри)"
              >
                <Layers className="w-3.5 h-3.5" />
                Без стекла
              </button>
              <button
                onClick={() => setVisualizerMode('finished')}
                className={glassClass(visualizerMode === 'finished')}
                title="Установить стекло"
              >
                <Eye className="w-3.5 h-3.5" />
                Со стеклом
              </button>
            </div>
          )}

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
                {RGB_COLORS.map((c) => (
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

      {tab === 'inspect' && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="w-full text-xs text-neutral-400 font-semibold">Деталь для 3D осмотра:</span>
          {INSPECT_PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => setInspectedPart(part.id)}
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

      {/* 3D Viewport */}
      <div className="relative w-full aspect-[4/3] max-h-[460px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-neutral-800">
          {tab === 'build' && (
            <>
              {CAMERA_BUTTONS.map(({ preset, label }) => (
                <button
                  key={preset}
                  onClick={() => stageRef.current?.moveCamera(preset)}
                  className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="h-4 w-px bg-neutral-700 mx-1" />
            </>
          )}
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

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Загрузка 3D-моделей...
          </div>
        )}
        {!isLoading && loaded?.failed && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 text-red-400 text-xs font-bold">
            <TriangleAlert className="w-4 h-4" />
            Не удалось загрузить 3D-модели
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-800 text-[10px] text-neutral-400 pointer-events-none">
          Вращение 360°: Зажмите ЛКМ • Приближение: Колесо мыши • Панорама: ПКМ
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Детали монтируются в реальном 3D при выборе в конструкторе справа</span>
        </div>
        <span className="font-mono text-neutral-500">Корпус: {build.case?.name || 'NZXT H5 Flow Matte Black'}</span>
      </div>
    </div>
  );
}
