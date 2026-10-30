'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import {
  Cpu,
  Layers,
  Gamepad2,
  Package,
  ShoppingCart,
  Globe,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { lang, setLang, t, cartCount, setIsCartOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-neutral-950 font-black" />
          </div>
          <div>
            <span className="text-base font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1">
              CYBER<span className="text-cyan-400">FORGE</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-medium block -mt-1 tracking-tight">
              TASHKENT • UZS
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800">
          <a
            href="#builder-section"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {t.nav.builder}
          </a>
          <a
            href="#fps-section"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            {t.nav.fpsCalc}
          </a>
          <a
            href="#catalog-section"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            {t.nav.catalog}
          </a>
        </nav>

        {/* Actions (Language Switcher, Cart, Admin) */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher RU / UZ */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 flex items-center">
            <button
              onClick={() => setLang('ru')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'ru'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLang('uz')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'uz'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              UZ
            </button>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-neutral-950 font-black text-[11px] flex items-center justify-center shadow-md shadow-cyan-500/50 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hidden Admin Shortcut */}
          <Link
            href="/secret-admin-gate"
            title="Скрытая панель управления"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-cyan-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
