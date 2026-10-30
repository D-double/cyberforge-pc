'use client';

import React, { useMemo, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { ComponentCategory } from '@/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Package, X } from 'lucide-react';

export default function ProductCatalog() {
  const { t, products } = useStore();

  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc'>('popular');

  // Categories list
  const categories: { key: ComponentCategory | 'all'; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'cpu', label: t.categories.cpu },
    { key: 'gpu', label: t.categories.gpu },
    { key: 'motherboard', label: t.categories.motherboard },
    { key: 'ram', label: t.categories.ram },
    { key: 'storage', label: t.categories.storage },
    { key: 'psu', label: t.categories.psu },
    { key: 'case', label: t.categories.case },
    { key: 'cooler', label: t.categories.cooler },
  ];

  // Distinct brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['all', ...list];
  }, [products]);

  // Filtering & sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCategory !== 'all' && p.category !== activeCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (
          searchQuery &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.priceUZS - b.priceUZS;
        if (sortBy === 'priceDesc') return b.priceUZS - a.priceUZS;
        return 0; // Default order
      });
  }, [products, activeCategory, selectedBrand, searchQuery, sortBy]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-400" />
            {t.nav.catalog}
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            {t.catalog.warrantySubtitle}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filters & Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.catalog.filterByBrand}:
          </span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? t.catalog.allBrands : b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            {t.catalog.sortBy}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="popular">{t.catalog.sortPopular}</option>
            <option value="priceAsc">{t.catalog.sortPriceAsc}</option>
            <option value="priceDesc">{t.catalog.sortPriceDesc}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-950 rounded-xl border border-neutral-800">
          <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm text-neutral-400 font-medium">
            {t.catalog.noProducts}
          </p>
        </div>
      )}
    </div>
  );
}
