'use client';

import React from 'react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, Wrench, Check } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, lang, formatPrice, addToCart, setBuildPart, build } = useStore();

  const isSelectedInBuild = Object.values(build).some((p) => p?.id === product.id);

  const handleAddToBuild = () => {
    const slotMap: Record<string, keyof typeof build> = {
      cpu: 'cpu',
      motherboard: 'motherboard',
      gpu: 'gpu',
      ram: 'ram',
      storage: 'storage',
      psu: 'psu',
      case: 'case',
      cooler: 'cooler',
    };
    const slot = slotMap[product.category];
    if (slot) {
      setBuildPart(slot, product);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 hover:shadow-xl group">
      <div>
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900/90 text-cyan-400 border border-neutral-700 backdrop-blur-xs">
              {product.brand}
            </span>
          </div>
          {product.inStock && (
            <div className="absolute top-2 right-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800 backdrop-blur-xs">
                {t.catalog.inStock}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
          {t.categories[product.category] || product.category}
        </span>
        <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Specs Badges */}
        <div className="flex flex-wrap gap-1.5 my-2.5">
          {product.specs?.socket && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
              {product.specs.socket}
            </span>
          )}
          {product.specs?.ramType && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-purple-400 border border-neutral-800">
              {product.specs.ramType}
            </span>
          )}
          {product.specs?.vramGB && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-emerald-400 border border-neutral-800">
              {product.specs.vramGB}GB VRAM
            </span>
          )}
          {product.tdp && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 border border-neutral-800">
              TDP {product.tdp}W
            </span>
          )}
          {product.specs?.psuWattage && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-cyan-400 border border-neutral-800">
              {product.specs.psuWattage}W
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
          {product.description[lang] || product.description.ru}
        </p>
      </div>

      <div>
        {/* Price */}
        <div className="border-t border-neutral-800/80 pt-3 mb-3 flex items-baseline justify-between">
          <span className="text-xs text-neutral-400">Цена:</span>
          <span className="text-base font-black text-cyan-400">
            {formatPrice(product.priceUZS)}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product)}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center justify-center gap-1.5 border border-neutral-700"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
            {t.catalog.addToCart}
          </button>

          <button
            onClick={handleAddToBuild}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isSelectedInBuild
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/10'
            }`}
          >
            {isSelectedInBuild ? (
              <>
                <Check className="w-3.5 h-3.5" />
                В сборке
              </>
            ) : (
              <>
                <Wrench className="w-3.5 h-3.5" />
                {t.catalog.addToBuild}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
