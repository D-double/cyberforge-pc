'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Cpu, Send, MapPin, Phone, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const { t } = useStore();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-12 pb-8 mt-16 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-neutral-950 font-black" />
              </div>
              <span className="text-base font-black text-white tracking-wider">
                CYBER<span className="text-cyan-400">FORGE</span> PC
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://t.me/CyberForgeSupportBot"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram Bot
              </a>
              <span className="text-[11px] text-neutral-500">
                Официальный бот с оплатой Click / Payme
              </span>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
              Контакты в Ташкенте
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Гарантия до 36 месяцев</span>
              </li>
            </ul>
          </div>

          {/* Quick links & Hidden Admin entrance */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
              Разделы
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#builder-section" className="hover:text-cyan-400 transition-colors">
                  {t.nav.builder}
                </a>
              </li>
              <li>
                <a href="#fps-section" className="hover:text-cyan-400 transition-colors">
                  {t.nav.fpsCalc}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-cyan-400 transition-colors">
                  {t.nav.catalog}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/secret-admin-gate"
                  className="text-neutral-600 hover:text-neutral-400 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Lock className="w-3 h-3" />
                  {t.footer.secretAdminHint}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-500">
          <p>© 2026 CYBERFORGE PC. {t.footer.copyright}</p>
          <p className="font-mono text-[11px]">UZS • Tashkent, Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
}
