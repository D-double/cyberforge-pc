'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { PCBuild, Product, ComponentCategory } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  Trash2,
  ShoppingCart,
  Zap,
  Gauge,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface SlotConfig {
  key: keyof PCBuild;
  category: ComponentCategory;
  titleKey: keyof typeof import('@/i18n/translations').translations.ru.builder.stepTitles;
  icon: string;
}

const SLOTS: SlotConfig[] = [
  { key: 'cpu', category: 'cpu', titleKey: 'cpu', icon: '⚡' },
  { key: 'motherboard', category: 'motherboard', titleKey: 'motherboard', icon: '🎛️' },
  { key: 'cooler', category: 'cooler', titleKey: 'cooler', icon: '❄️' },
  { key: 'ram', category: 'ram', titleKey: 'ram', icon: '💾' },
  { key: 'gpu', category: 'gpu', titleKey: 'gpu', icon: '🎮' },
  { key: 'storage', category: 'storage', titleKey: 'storage', icon: '💿' },
  { key: 'psu', category: 'psu', titleKey: 'psu', icon: '🔌' },
  { key: 'case', category: 'case', titleKey: 'case', icon: '🖥️' },
];

export default function PCBuilder() {
  const {
    t,
    lang,
    formatPrice,
    products,
    build,
    setBuildPart,
    clearBuild,
    loadOptimalBuild,
    compatibility,
    buildTotalUZS,
    addBuildToCart,
  } = useStore();

  const [activeModalSlot, setActiveModalSlot] = useState<SlotConfig | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!activeModalSlot) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalSlot(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalSlot]);

  // Filter products for the active selection modal
  const modalProducts = activeModalSlot
    ? products.filter((p) => p.category === activeModalSlot.category)
    : [];

  const handleSelectProduct = (product: Product) => {
    if (activeModalSlot) {
      setBuildPart(activeModalSlot.key, product);
      setActiveModalSlot(null);
    }
  };

  const handleRemoveProduct = (slotKey: keyof PCBuild) => {
    setBuildPart(slotKey, undefined);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
            {t.builder.title}
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            {t.builder.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOptimalBuild}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1.5 border border-neutral-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            {t.builder.loadOptimalPreset}
          </button>
          <button
            onClick={clearBuild}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-850 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5 border border-neutral-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.builder.resetBuild}
          </button>
        </div>
      </div>

      {/* Compatibility Status Banner */}
      <div className="mb-6">
        {compatibility.isCompatible ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-emerald-300">
                {t.builder.compatibilityStatus}: 100% OK
              </h4>
              <p className="text-xs text-emerald-400/80">
                {t.builder.fullyCompatible}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-950/50 border border-red-500/40 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.builder.hasIssues}</span>
            </div>
            <ul className="space-y-1 pl-7 text-xs text-red-300">
              {compatibility.issues.map((issue, idx) => (
                <li key={idx} className="list-disc">
                  {issue.message[lang] || issue.message.ru}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Slots List */}
      <div className="space-y-3 mb-6">
        {SLOTS.map((slot) => {
          const selected = build[slot.key];
          const title = t.builder.stepTitles[slot.titleKey];

          return (
            <div
              key={slot.key}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selected
                  ? 'bg-neutral-950/80 border-neutral-700/80 hover:border-cyan-500/40'
                  : 'bg-neutral-950/40 border-dashed border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Left Slot Details */}
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                  {slot.icon}
                </span>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 block">
                    {title}
                  </span>
                  {selected ? (
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <h4 className="text-sm font-bold text-white">
                        {selected.name}
                      </h4>
                      {selected.specs?.socket && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                          {selected.specs.socket}
                        </span>
                      )}
                      {selected.specs?.ramType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
                          {selected.specs.ramType}
                        </span>
                      )}
                      {selected.specs?.vramGB && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {selected.specs.vramGB}GB VRAM
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 italic">
                      {t.builder.slotEmpty}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Slot Action & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {selected && (
                  <span className="text-xs md:text-sm font-bold text-cyan-400">
                    {formatPrice(selected.priceUZS)}
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveModalSlot(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      selected
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950'
                    }`}
                  >
                    {selected ? (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        {t.builder.changePart}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        {t.builder.choosePart}
                      </>
                    )}
                  </button>

                  {selected && (
                    <button
                      onClick={() => handleRemoveProduct(slot.key)}
                      title={t.builder.removePart}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Power Wattage & Summary Footnote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6">
        {/* Power meter */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {t.builder.powerTdp}:
            </span>
            <span className="font-bold text-white">
              ~{compatibility.totalTdp} W
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                compatibility.totalTdp > (build.psu?.specs?.psuWattage || 0) && build.psu
                  ? 'bg-red-500'
                  : 'bg-amber-400'
              }`}
              style={{
                width: `${Math.min(100, (compatibility.totalTdp / (build.psu?.specs?.psuWattage || 750)) * 100)}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
            <span>
              {t.builder.recommendedPsu}: {compatibility.recommendedPsuWattage}W+
            </span>
            {build.psu && (
              <span className="text-neutral-400">
                Установлен: {build.psu.specs?.psuWattage}W
              </span>
            )}
          </div>
        </div>

        {/* Total Cost & Add to Cart */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-neutral-400 font-medium">
              {t.builder.totalCost}:
            </span>
            <span className="text-xl md:text-2xl font-black text-cyan-400">
              {formatPrice(buildTotalUZS)}
            </span>
          </div>

          <button
            onClick={() => addBuildToCart(build)}
            disabled={buildTotalUZS === 0}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {t.builder.addRigToCart}
          </button>
        </div>
      </div>

      {/* Part Selection Modal */}
      {activeModalSlot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeModalSlot.icon}</span>
                  {t.builder.stepTitles[activeModalSlot.titleKey]}
                </h3>
                <p className="text-xs text-neutral-400">
                  Выберите компонент для добавления в сборку
                </p>
              </div>
              <button
                onClick={() => setActiveModalSlot(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Products List */}
            <div className="p-4 overflow-y-auto space-y-3">
              {modalProducts.map((product) => {
                const isCurrent = build[activeModalSlot.key]?.id === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {product.name}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                          {product.description[lang] || product.description.ru}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {product.specs?.socket && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              Socket: {product.specs.socket}
                            </span>
                          )}
                          {product.tdp && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400">
                              TDP: {product.tdp}W
                            </span>
                          )}
                          {product.specs?.vramGB && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400">
                              {product.specs.vramGB}GB GDDR6X
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-cyan-400 block">
                        {formatPrice(product.priceUZS)}
                      </span>
                      <button className="mt-1 px-3 py-1 text-xs font-semibold rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950">
                        {isCurrent ? t.builder.selected : t.builder.select}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
