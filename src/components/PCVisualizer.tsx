'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Layers, Lightbulb, Sparkles, Eye, ShieldCheck, Cpu } from 'lucide-react';

export default function PCVisualizer() {
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

  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const colors = [
    { name: 'Cyan Neon', hex: '#06b6d4' },
    { name: 'Magenta Pink', hex: '#ec4899' },
    { name: 'Emerald Razer', hex: '#10b981' },
    { name: 'Cyber Gold', hex: '#f59e0b' },
    { name: 'Ice White', hex: '#e0f2fe' },
    { name: 'Deep Violet', hex: '#8b5cf6' },
  ];

  const totalSlots = 8;
  const installedCount = Object.values(build).filter(Boolean).length;
  const progressPercent = Math.round((installedCount / totalSlots) * 100);

  const glowStyle = rgbEnabled
    ? {
        filter: `drop-shadow(0 0 12px ${activeRgbColor}) drop-shadow(0 0 25px ${activeRgbColor}66)`,
      }
    : {};

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
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {t.visualizer.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {t.visualizer.subtitle}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
            <button
              onClick={() => setVisualizerMode('xray')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                visualizerMode === 'xray'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {t.visualizer.modeXray}
            </button>
            <button
              onClick={() => setVisualizerMode('finished')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                visualizerMode === 'finished'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {t.visualizer.modeFinished}
            </button>
          </div>

          {/* RGB Switch & Palette */}
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setRgbEnabled(!rgbEnabled)}
              title={t.visualizer.rgbToggle}
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
                    className={`w-4 h-4 rounded-full transition-transform ${
                      activeRgbColor === c.hex ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-neutral-950' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assembly Progress Meter */}
      <div className="mb-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${progressPercent === 100 ? 'text-emerald-400' : 'text-cyan-400'}`} />
          <span className="text-xs text-neutral-300 font-medium">
            {t.visualizer.statusAssembled}: <strong className="text-white">{installedCount} / {totalSlots}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 md:w-44 bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-neutral-200">{progressPercent}%</span>
        </div>
      </div>

      {/* Interactive Rig Canvas / SVG Visualizer */}
      <div className="relative w-full aspect-[4/3] max-h-[460px] bg-neutral-950 rounded-xl border border-neutral-800/80 flex items-center justify-center p-2 select-none overflow-hidden group">
        <svg
          viewBox="0 0 600 480"
          className="w-full h-full max-w-full max-h-full drop-shadow-2xl transition-all duration-500"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="caseChassisGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="100%" stopColor="#141414" />
            </linearGradient>

            <linearGradient id="moboGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="gpuGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#171717" />
              <stop offset="50%" stopColor="#262626" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>

            <linearGradient id="psuShroudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f1f1f" />
              <stop offset="100%" stopColor="#121212" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. CHASSIS OUTER FRAME */}
          <rect
            x="40"
            y="25"
            width="520"
            height="430"
            rx="16"
            fill="url(#caseChassisGrad)"
            stroke="#404040"
            strokeWidth="3"
          />

          {/* Front Intake Mesh Panel */}
          <rect
            x="510"
            y="45"
            width="35"
            height="385"
            rx="6"
            fill="#121212"
            stroke="#2e2e2e"
            strokeWidth="1.5"
          />
          {/* Intake Fans */}
          {[100, 200, 300].map((fanY, i) => (
            <g key={`intake-fan-${i}`} className="cursor-pointer" style={glowStyle}>
              <circle cx="527" cy={fanY} r="24" fill="#0d0d0d" stroke="#262626" strokeWidth="2" />
              <circle
                cx="527"
                cy={fanY}
                r="20"
                fill="none"
                stroke={rgbEnabled ? activeRgbColor : '#334155'}
                strokeWidth="2.5"
                opacity={rgbEnabled ? 0.8 : 0.3}
              />
              <circle cx="527" cy={fanY} r="7" fill="#1e293b" />
            </g>
          ))}

          {/* Rear Exhaust Fan */}
          <g style={glowStyle}>
            <circle cx="95" cy="120" r="28" fill="#0d0d0d" stroke="#262626" strokeWidth="2" />
            <circle
              cx="95"
              cy="120"
              r="22"
              fill="none"
              stroke={rgbEnabled ? activeRgbColor : '#334155'}
              strokeWidth="2.5"
              opacity={rgbEnabled ? 0.9 : 0.3}
            />
            <circle cx="95" cy="120" r="8" fill="#1e293b" />
          </g>

          {/* PSU SHROUD (BOTTOM COMPARTMENT) */}
          <rect
            x="55"
            y="370"
            width="445"
            height="75"
            rx="4"
            fill="url(#psuShroudGrad)"
            stroke="#262626"
            strokeWidth="1.5"
          />
          {/* PSU Window cutout */}
          <rect
            x="80"
            y="385"
            width="140"
            height="45"
            rx="4"
            fill="#0a0a0a"
            stroke="#333"
            strokeWidth="1"
          />
          <text x="90" y="412" fill={build.psu ? '#22c55e' : '#525252'} fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            {build.psu ? `PSU: ${build.psu.specs?.psuWattage}W` : 'PSU BAY [EMPTY]'}
          </text>
          {build.psu && (
            <text x="90" y="424" fill="#9ca3af" fontSize="9" fontFamily="sans-serif">
              {build.psu.brand} ({build.psu.specs?.psuRating || 'Active PFC'})
            </text>
          )}

          {/* 2. MOTHERBOARD */}
          {build.motherboard ? (
            <g
              onMouseEnter={() => setHoveredComponent('motherboard')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer transition-opacity"
            >
              <rect
                x="140"
                y="50"
                width="345"
                height="305"
                rx="8"
                fill="url(#moboGrad)"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* VRM Heatsinks */}
              <rect x="155" y="60" width="110" height="24" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
              <rect x="145" y="86" width="22" height="100" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
              {/* Chipset Heatsink */}
              <rect x="385" y="270" width="85" height="70" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="395" y="308" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {build.motherboard.specs?.chipset || 'CHIPSET'}
              </text>

              {/* M.2 NVMe Slot with SSD */}
              <rect x="250" y="200" width="85" height="16" rx="2" fill="#020617" stroke="#475569" strokeWidth="1" />
              {build.storage ? (
                <g>
                  <rect x="252" y="202" width="81" height="12" rx="2" fill="#059669" />
                  <text x="256" y="211" fill="#ecfdf5" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    NVMe M.2 SSD
                  </text>
                </g>
              ) : (
                <text x="260" y="211" fill="#475569" fontSize="8" fontFamily="monospace">
                  M.2 SLOT
                </text>
              )}

              {/* PCIe x16 Slot */}
              <rect x="160" y="235" width="230" height="10" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            </g>
          ) : (
            /* Motherboard Area Empty Placeholder */
            <rect
              x="140"
              y="50"
              width="345"
              height="305"
              rx="8"
              fill="#171717"
              stroke="#333"
              strokeDasharray="6 6"
              strokeWidth="2"
            />
          )}

          {/* 3. CPU & SOCKET */}
          {build.motherboard && (
            <g
              onMouseEnter={() => setHoveredComponent('cpu')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer"
            >
              {/* Socket Frame */}
              <rect
                x="210"
                y="100"
                width="70"
                height="70"
                rx="4"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="2"
              />
              {build.cpu ? (
                <g>
                  {/* Heat Spreader IHS */}
                  <rect
                    x="215"
                    y="105"
                    width="60"
                    height="60"
                    rx="3"
                    fill="#94a3b8"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                  <text x="223" y="132" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {build.cpu.brand}
                  </text>
                  <text x="220" y="145" fill="#1e293b" fontSize="8" fontFamily="monospace">
                    {build.cpu.specs?.socket}
                  </text>
                </g>
              ) : (
                <text x="222" y="140" fill="#475569" fontSize="9" fontFamily="monospace">
                  SOCKET
                </text>
              )}
            </g>
          )}

          {/* 4. CPU COOLER / AIO WATER BLOCK */}
          {build.cooler && (
            <g
              onMouseEnter={() => setHoveredComponent('cooler')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer"
              style={glowStyle}
            >
              {build.cooler.specs?.isAio ? (
                /* Liquid AIO Pump Block */
                <g>
                  <circle cx="245" cy="135" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  <circle
                    cx="245"
                    cy="135"
                    r="24"
                    fill="#020617"
                    stroke={rgbEnabled ? activeRgbColor : '#0284c7'}
                    strokeWidth="4"
                  />
                  <text x="233" y="140" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    AIO
                  </text>
                  {/* Braided Tubes leading to top */}
                  <path d="M 230 110 Q 210 50 320 40" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 255 110 Q 240 55 350 40" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                </g>
              ) : (
                /* Tower Air Cooler */
                <g>
                  <rect x="200" y="85" width="90" height="95" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  {/* Aluminum Fins */}
                  {[95, 105, 115, 125, 135, 145, 155, 165].map((y) => (
                    <line key={y} x1="202" y1={y} x2="288" y2={y} stroke="#475569" strokeWidth="1" />
                  ))}
                  {/* Cooler Fan with RGB Ring */}
                  <circle
                    cx="245"
                    cy="132"
                    r="34"
                    fill="none"
                    stroke={rgbEnabled ? activeRgbColor : '#64748b'}
                    strokeWidth="3.5"
                    opacity={rgbEnabled ? 0.95 : 0.4}
                  />
                </g>
              )}
            </g>
          )}

          {/* 5. RAM SLOTS & MODULES */}
          {build.motherboard && (
            <g
              onMouseEnter={() => setHoveredComponent('ram')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer"
            >
              {[300, 312, 324, 336].map((x, index) => {
                const isPopulated = build.ram && (index === 1 || index === 3); // dual-channel slots
                return (
                  <g key={`dimm-${index}`}>
                    {/* DIMM slot line */}
                    <rect x={x} y="90" width="7" height="90" rx="1.5" fill="#090d16" stroke="#334155" strokeWidth="0.8" />
                    {isPopulated && (
                      <rect
                        x={x}
                        y="88"
                        width="7"
                        height="94"
                        rx="1.5"
                        fill={rgbEnabled ? activeRgbColor : '#94a3b8'}
                        stroke="#f8fafc"
                        strokeWidth="0.5"
                        style={glowStyle}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. GRAPHICS CARD (GPU) */}
          {build.gpu ? (
            <g
              onMouseEnter={() => setHoveredComponent('gpu')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer"
              style={glowStyle}
            >
              {/* GPU Backplate & Shroud */}
              <rect
                x="150"
                y="228"
                width="310"
                height="68"
                rx="6"
                fill="url(#gpuGrad)"
                stroke="#525252"
                strokeWidth="2"
              />
              {/* Dual / Triple Fans */}
              {[210, 290, 370].map((fanX, i) => (
                <g key={`gpu-fan-${i}`}>
                  <circle cx={fanX} cy="262" r="24" fill="#0a0a0a" stroke="#262626" strokeWidth="2" />
                  <circle
                    cx={fanX}
                    cy="262"
                    r="19"
                    fill="none"
                    stroke={rgbEnabled ? activeRgbColor : '#404040'}
                    strokeWidth="1.5"
                    opacity={rgbEnabled ? 0.7 : 0.3}
                  />
                  <circle cx={fanX} cy="262" r="6" fill="#171717" />
                </g>
              ))}
              {/* GPU Brand LED Logo */}
              <rect x="165" y="235" width="85" height="12" rx="2" fill="#000" />
              <text
                x="170"
                y="244"
                fill={rgbEnabled ? activeRgbColor : '#e5e5e5'}
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {build.gpu.brand.toUpperCase()} GEFORCE RTX
              </text>
              {/* PCIe Power Cable */}
              <path d="M 435 240 L 435 370" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" />
            </g>
          ) : (
            <rect
              x="160"
              y="235"
              width="240"
              height="35"
              rx="4"
              fill="#1c1917"
              stroke="#333"
              strokeDasharray="4 4"
            />
          )}

          {/* TOP EXHAUST FANS & RADIATOR */}
          <rect x="230" y="30" width="220" height="15" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          {[275, 340, 405].map((fanX, i) => (
            <line
              key={`top-fan-${i}`}
              x1={fanX - 18}
              y1="38"
              x2={fanX + 18}
              y2="38"
              stroke={rgbEnabled ? activeRgbColor : '#334155'}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={rgbEnabled ? 0.8 : 0.3}
            />
          ))}

          {/* 7. TEMPERED GLASS SIDE PANEL (In Finished Mode) */}
          {visualizerMode === 'finished' && (
            <g className="pointer-events-none transition-opacity duration-500">
              {/* Glass Reflection Gradient */}
              <rect
                x="45"
                y="30"
                width="460"
                height="420"
                rx="12"
                fill="#000000"
                fillOpacity="0.28"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Diagonal Light Glare */}
              <path
                d="M 60 450 L 320 30 L 390 30 L 130 450 Z"
                fill="#ffffff"
                fillOpacity="0.04"
              />
              <path
                d="M 200 450 L 460 30 L 490 30 L 230 450 Z"
                fill="#ffffff"
                fillOpacity="0.02"
              />
              {/* Thumbscrews on corners */}
              {[[55, 40], [495, 40], [55, 440], [495, 440]].map(([cx, cy], i) => (
                <circle key={`screw-${i}`} cx={cx} cy={cy} r="4.5" fill="#404040" stroke="#737373" strokeWidth="1" />
              ))}
            </g>
          )}
        </svg>

        {/* Hover Spec Tooltip */}
        {hoveredComponent && (
          <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/95 border border-cyan-500/50 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-white font-bold capitalize">
                {hoveredComponent === 'cpu' && (build.cpu ? build.cpu.name : 'CPU Slot')}
                {hoveredComponent === 'gpu' && (build.gpu ? build.gpu.name : 'GPU Slot')}
                {hoveredComponent === 'motherboard' && (build.motherboard ? build.motherboard.name : 'Motherboard')}
                {hoveredComponent === 'ram' && (build.ram ? build.ram.name : 'RAM Slot')}
                {hoveredComponent === 'cooler' && (build.cooler ? build.cooler.name : 'CPU Cooler')}
              </span>
            </div>
            <span className="text-cyan-400 font-mono font-medium">
              {hoveredComponent === 'cpu' && build.cpu && `${build.cpu.specs?.cores} Cores / TDP ${build.cpu.tdp}W`}
              {hoveredComponent === 'gpu' && build.gpu && `${build.gpu.specs?.vramGB}GB VRAM / TDP ${build.gpu.tdp}W`}
              {hoveredComponent === 'motherboard' && build.motherboard && `${build.motherboard.specs?.socket} / ${build.motherboard.specs?.ramType}`}
              {hoveredComponent === 'ram' && build.ram && `${build.ram.specs?.ramCapacityGB}GB ${build.ram.specs?.ramSpeed}MHz`}
              {hoveredComponent === 'cooler' && build.cooler && `Max TDP ${build.cooler.specs?.coolerMaxTdp}W`}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info / Hint */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.visualizer.emptyChassisNotice}</span>
        </div>
        <span className="hidden sm:inline font-mono text-neutral-500">
          Chassis: {build.case?.name || 'Standard ATX'}
        </span>
      </div>
    </div>
  );
}
