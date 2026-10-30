'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PCVisualizer from '@/components/PCVisualizer';
import PC3DVisualizer from '@/components/PC3DVisualizer';
import PCBuilder from '@/components/PCBuilder';
import FPSCalculatorWidget from '@/components/FPSCalculatorWidget';
import ProductCatalog from '@/components/ProductCatalog';
import CartDrawer from '@/components/CartDrawer';
import TelegramCheckoutModal from '@/components/TelegramCheckoutModal';
import { useStore } from '@/context/StoreContext';
import {
  Sparkles,
  Zap,
  Gamepad2,
  ShieldCheck,
  Send,
  Sliders,
  Flame,
  ArrowRight,
  Cpu,
  Rotate3d,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const { t, lang, formatPrice } = useStore();
  const [visualizerDimension, setVisualizerDimension] = useState<'3d' | '2d'>('3d');

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-neutral-950 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900/80 via-neutral-950 to-black p-8 sm:p-12 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Официальные комплектующие в Ташкенте • Валюта UZS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Собери ПК мечты с <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">живой визуализацией</span> и тестом FPS
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              Интерактивный конструктор системных блоков с контролем совместимости 100%, расчётом FPS в 20 самых тяжелых играх и быстрой оплатой через Telegram в сумах.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#builder-section"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Sliders className="w-4 h-4" />
                {t.nav.builder}
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#fps-section"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-neutral-800 text-white transition-all flex items-center gap-2 border border-neutral-700"
              >
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                {t.nav.fpsCalc}
              </a>

              <a
                href="#catalog-section"
                className="px-5 py-3 rounded-xl font-semibold text-xs text-neutral-400 hover:text-white transition-colors"
              >
                {t.nav.catalog}
              </a>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Контроль совместимости</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>20 тяжелых игр</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Telegram / Click / Payme</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Гарантия до 3 лет</span>
              </div>
            </div>
          </div>
        </section>

        {/* BUILDER & VISUALIZER WORKBENCH SECTION */}
        <section id="builder-section" className="scroll-mt-20">
          <div className="mb-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              Интерактивная сборка
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Конструктор ПК с визуализатором в реальном времени
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Устанавливайте компоненты пошагово: наблюдайте за их появлением в корпусе, проверяйте тепловыделение TDP и совместимость
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visualizer sticky panel on left / top */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-3">
              {/* 3D vs 2D Switcher Pill */}
              <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 pl-2">
                  Режим визуализации:
                </span>
                <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  <button
                    onClick={() => setVisualizerDimension('3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      visualizerDimension === '3d'
                        ? 'bg-cyan-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    3D Модели (360°)
                  </button>
                  <button
                    onClick={() => setVisualizerDimension('2d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      visualizerDimension === '2d'
                        ? 'bg-cyan-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    2D Схема монтажа
                  </button>
                </div>
              </div>

              {visualizerDimension === '3d' ? <PC3DVisualizer /> : <PCVisualizer />}
            </div>

            {/* Slots and Part Selector on right */}
            <div className="lg:col-span-7">
              <PCBuilder />
            </div>
          </div>
        </section>

        {/* FPS BENCHMARK CALCULATOR SECTION */}
        <section id="fps-section" className="scroll-mt-20">
          <div className="mb-6">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">
              Бенчмарк производительности
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Расчёт FPS в 20 самых тяжелых современных играх
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Тестируйте выбранную сборку на пресетах Low, Medium, High, Ultra в разрешениях 1080p, 2K и 4K
            </p>
          </div>

          <FPSCalculatorWidget />
        </section>

        {/* PRODUCT CATALOG SECTION */}
        <section id="catalog-section" className="scroll-mt-20">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Оригинальные комплектующие
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Каталог товаров в Ташкенте
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Процессоры Intel/AMD, видеокарты NVIDIA RTX/Radeon, скоростная ОЗУ DDR5 и быстрые NVMe SSD
            </p>
          </div>

          <ProductCatalog />
        </section>
      </main>

      <Footer />

      {/* Slide-over Cart & Checkout Modal */}
      <CartDrawer />
      <TelegramCheckoutModal />
    </div>
  );
}
