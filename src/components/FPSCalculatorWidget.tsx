'use client';

import React, { useMemo, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { GraphicsPreset, Resolution } from '@/types';
import { calculateFpsForGame } from '@/utils/fpsCalculator';
import {
  Gamepad2,
  Tv,
  Gauge,
  Flame,
  Search,
  CheckCircle,
  HelpCircle,
  Info,
  Sliders,
} from 'lucide-react';
import Image from 'next/image';

export default function FPSCalculatorWidget() {
  const { t, lang, build, games } = useStore();

  const [preset, setPreset] = useState<GraphicsPreset>('high');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || 'cyberpunk-2077');

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [games, searchQuery]);

  // Compute FPS results for all games with current preset & resolution
  const results = useMemo(() => {
    return games.map((g) => ({
      game: g,
      result: calculateFpsForGame(g, build, preset, resolution),
    }));
  }, [games, build, preset, resolution]);

  const activeResult = results.find((r) => r.game.id === selectedGameId) || results[0];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'unplayable':
        return 'text-red-500 bg-red-950/60 border-red-800';
      case 'playable':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'good':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'smooth':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800';
      case 'esports':
        return 'text-purple-400 bg-purple-950/60 border-purple-800';
      default:
        return 'text-white bg-neutral-800 border-neutral-700';
    }
  };

  const getRatingBarColor = (rating: string) => {
    switch (rating) {
      case 'unplayable':
        return 'bg-red-500';
      case 'playable':
        return 'bg-amber-400';
      case 'good':
        return 'bg-emerald-400';
      case 'smooth':
        return 'bg-cyan-400';
      case 'esports':
        return 'bg-purple-400';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
      {/* Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {t.fps.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            {t.fps.subtitle}
          </p>
        </div>

        {/* Current Config Specs Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-300">
          <span className="font-semibold text-neutral-400">{t.fps.testYourRig}:</span>
          <span className="font-mono text-cyan-400 font-bold">
            {build.cpu ? build.cpu.name.split(' ')[0] + ' ' + (build.cpu.name.split(' ')[2] || '') : 'Core i5'}
          </span>
          <span className="text-neutral-600">/</span>
          <span className="font-mono text-emerald-400 font-bold">
            {build.gpu ? build.gpu.name.replace('NVIDIA GeForce ', '') : 'RTX 4070'}
          </span>
          <span className="text-neutral-600">/</span>
          <span className="font-mono text-purple-400">
            {build.ram ? `${build.ram.specs?.ramCapacityGB}GB` : '32GB'}
          </span>
        </div>
      </div>

      {/* Control Presets & Resolution Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Preset Selector */}
        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold block mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {t.fps.preset}
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {(['low', 'medium', 'high', 'ultra'] as GraphicsPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                  preset === p
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {t.fps.presets[p].split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Selector */}
        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold block mb-2 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            {t.fps.resolution}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['1080p', '1440p', '4k'] as Resolution[]).map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`py-2 text-xs font-bold rounded-lg transition-all uppercase ${
                  resolution === res
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {res === '1080p' ? 'Full HD (1080p)' : res === '1440p' ? '2K QHD (1440p)' : '4K UHD (2160p)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured / Active Game Showcase Banner */}
      {activeResult && (
        <div className="mb-6 relative rounded-2xl overflow-hidden border border-neutral-700/80 bg-neutral-950 p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
              <Image
                src={activeResult.game.poster}
                alt={activeResult.game.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                {activeResult.game.genre} • {activeResult.game.year}
              </span>
              <h3 className="text-lg md:text-xl font-black text-white mt-1">
                {activeResult.game.title}
              </h3>
              <p className="text-xs text-neutral-400 max-w-md line-clamp-2 mt-1">
                {activeResult.game.description[lang] || activeResult.game.description.ru}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-neutral-400">
                  {t.fps.bottleneckInfo}:
                </span>
                <span className="text-xs font-semibold text-cyan-400">
                  {activeResult.result.bottleneck === 'cpu'
                    ? t.fps.bottleneckCpu
                    : activeResult.result.bottleneck === 'gpu'
                    ? t.fps.bottleneckGpu
                    : t.fps.bottleneckBalanced}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic FPS Gauge Display */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 w-full md:w-56 text-center">
            <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              {preset.toUpperCase()} • {resolution}
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {activeResult.result.fps}
              </span>
              <span className="text-sm font-bold text-neutral-400">FPS</span>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getRatingColor(
                activeResult.result.rating
              )}`}
            >
              {t.fps.ratingLabels[activeResult.result.rating]}
            </span>
          </div>
        </div>
      )}

      {/* Search & 20 Games Grid */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
          База из 20 самых тяжелых игр ({filteredGames.length})
        </span>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.fps.searchGame}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredGames.map((game) => {
          const fpsRes = calculateFpsForGame(game, build, preset, resolution);
          const isSelected = game.id === selectedGameId;

          return (
            <div
              key={game.id}
              onClick={() => setSelectedGameId(game.id)}
              className={`group p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-2 bg-neutral-900">
                <Image
                  src={game.poster}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-neutral-300 font-mono backdrop-blur-xs">
                    {game.genre.split('/')[0]}
                  </span>
                  <span className="text-xs font-black text-white px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 backdrop-blur-xs">
                    {fpsRes.fps} FPS
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {game.title}
                </h4>
                {/* Visual mini bar */}
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full ${getRatingBarColor(fpsRes.rating)}`}
                    style={{ width: `${Math.min(100, (fpsRes.fps / 144) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
