'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product, GameRequirement, ComponentCategory } from '@/types';
import {
  Lock,
  Unlock,
  Package,
  Gamepad2,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle,
  Send,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function HiddenAdminPage() {
  const {
    t,
    formatPrice,
    products,
    setProducts,
    games,
    setGames,
    orders,
    updateOrderStatus,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'games' | 'orders' | 'telegram'>('products');

  // New Game Form Modal state
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGamePoster, setNewGamePoster] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
  const [newGameGenre, setNewGameGenre] = useState('Action RPG');
  const [newGameYear, setNewGameYear] = useState(2025);
  const [newGameHeavyScore, setNewGameHeavyScore] = useState(90);
  const [newGameDescRu, setNewGameDescRu] = useState('');
  const [newGameDescUz, setNewGameDescUz] = useState('');

  // New Product Form Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ComponentCategory>('gpu');
  const [newProdBrand, setNewProdBrand] = useState('NVIDIA');
  const [newProdPrice, setNewProdPrice] = useState(5000000);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80');
  const [newProdTdp, setNewProdTdp] = useState(200);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass: admin2027 or forge2027
    if (password === 'admin2027' || password === 'admin' || password === 'forge') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный ключ доступа! (Попробуйте admin2027)');
    }
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle) return;

    const newGame: GameRequirement = {
      id: `game-${Date.now()}`,
      title: newGameTitle,
      poster: newGamePoster,
      genre: newGameGenre,
      year: Number(newGameYear),
      heavyScore: Number(newGameHeavyScore),
      minCpuScore: 60,
      recCpuScore: 85,
      minGpuScore: 65,
      recGpuScore: 90,
      description: {
        ru: newGameDescRu || 'Тяжелая новинка с высокой нагрузкой на видеосистему.',
        uz: newGameDescUz || 'Video tizimiga yuqori yuklanishga ega yangi o\'yin.',
      },
    };

    setGames((prev) => [newGame, ...prev]);
    setIsAddGameOpen(false);
    setNewGameTitle('');
    alert(`Игра "${newGameTitle}" успешно добавлена в базу калькулятора FPS!`);
  };

  const handleDeleteGame = (gameId: string) => {
    if (confirm('Удалить эту игру из базы?')) {
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      brand: newProdBrand,
      priceUZS: Number(newProdPrice),
      image: newProdImage,
      inStock: true,
      tdp: Number(newProdTdp),
      description: {
        ru: 'Качественный компонент для ПК с официальной гарантией.',
        uz: 'Rasmiy kafolatga ega sifatli PK komponenti.',
      },
      specs: {
        socket: newProdCategory === 'cpu' || newProdCategory === 'motherboard' ? 'LGA1700' : undefined,
        vramGB: newProdCategory === 'gpu' ? 12 : undefined,
      },
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsAddProductOpen(false);
    setNewProdName('');
    alert(`Товар "${newProdName}" добавлен в каталог магазина!`);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('Удалить данный товар?')) {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
    }
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white">
            {t.admin.loginTitle}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 mb-6">
            Доступ только для уполномоченных администраторов
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ключ доступа (admin2027)"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-center text-sm placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 transition-all shadow-lg shadow-cyan-500/20"
            >
              {t.admin.loginBtn}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800/80">
            <button
              onClick={() => setIsAuthenticated(true)}
              className="text-xs text-cyan-400/80 hover:text-cyan-300 underline"
            >
              Быстрый вход для демонстрации (admin2027)
            </button>
            <div className="mt-3">
              <Link href="/" className="text-xs text-neutral-500 hover:text-white flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Назад на сайт магазина
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Unlock className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-black text-white">
                {t.admin.title}
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {t.admin.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center gap-1.5 border border-neutral-700"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Перейти на сайт
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-colors border border-red-800/80"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400">{t.admin.productsCount}</span>
              <h3 className="text-2xl font-black text-cyan-400">{products.length}</h3>
            </div>
            <Package className="w-8 h-8 text-neutral-700" />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400">{t.admin.gamesCount}</span>
              <h3 className="text-2xl font-black text-purple-400">{games.length}</h3>
            </div>
            <Gamepad2 className="w-8 h-8 text-neutral-700" />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400">{t.admin.ordersCount}</span>
              <h3 className="text-2xl font-black text-emerald-400">{orders.length}</h3>
            </div>
            <ShoppingBag className="w-8 h-8 text-neutral-700" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-cyan-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            {t.admin.tabProducts} ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'games'
                ? 'bg-purple-600 text-on-accent shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            {t.admin.tabGames} ({games.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-on-accent shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t.admin.tabOrders} ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'telegram'
                ? 'bg-sky-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Send className="w-4 h-4" />
            {t.admin.tabSettings}
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                Каталог комплектующих
              </h3>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t.admin.addProduct}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-mono">
                  <tr>
                    <th className="p-3">Товар</th>
                    <th className="p-3">Категория</th>
                    <th className="p-3">Бренд</th>
                    <th className="p-3">Цена UZS</th>
                    <th className="p-3">TDP</th>
                    <th className="p-3">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-950/60">
                      <td className="p-3 font-bold text-white">{p.name}</td>
                      <td className="p-3 text-neutral-400 uppercase">{p.category}</td>
                      <td className="p-3 text-cyan-400">{p.brand}</td>
                      <td className="p-3 font-mono font-bold text-white">{formatPrice(p.priceUZS)}</td>
                      <td className="p-3 text-amber-400">{p.tdp ? `${p.tdp}W` : '—'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: FPS Games Management (20 Games + Add More) */}
        {activeTab === 'games' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  База игр калькулятора FPS (Изначально 20 самых тяжелых)
                </h3>
                <p className="text-xs text-neutral-400">
                  Вы можете добавлять любые новые тяжелые игры с указанием коэффициента нагрузки
                </p>
              </div>
              <button
                onClick={() => setIsAddGameOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-on-accent flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" />
                {t.admin.addGame}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800">
                      {g.genre} • {g.year}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {g.title}
                    </h4>
                    <span className="text-xs text-neutral-400 block mt-0.5">
                      Нагрузка: <strong className="text-amber-400">{g.heavyScore} / 100</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteGame(g.id)}
                    className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-900 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders & Telegram Payments */}
        {activeTab === 'orders' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              Заказы клиентов и платежи
            </h3>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-neutral-500">• {ord.createdAt}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">
                      {ord.customerName} ({ord.customerPhone})
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {ord.deliveryCity}, {ord.deliveryAddress}
                    </p>
                    {ord.customerTelegram && (
                      <span className="text-xs text-sky-400">
                        Telegram: {ord.customerTelegram}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 block">Сумма заказа:</span>
                      <span className="text-base font-black text-cyan-400">
                        {formatPrice(ord.totalUZS)}
                      </span>
                    </div>

                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="new">Новый заказ</option>
                      <option value="assembling">В сборке на стенде</option>
                      <option value="sent">Передан курьеру</option>
                      <option value="delivered">Доставлен клиенту</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Telegram Settings */}
        {activeTab === 'telegram' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl max-w-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-400" />
              Интеграция Telegram Payments (Click / Payme / Stars)
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Конфигурация бота для приёма платежей в сумах (UZS) и оповещения администраторов о заказах
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Telegram Bot Username
                </label>
                <input
                  type="text"
                  readOnly
                  value="@CyberForgeSupportBot"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Bot Token (API Token)
                </label>
                <input
                  type="password"
                  readOnly
                  value="7492819381:AAH8a923-CYBERFORGE-PROD"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Платёжный провайдер (Provider Token)
                </label>
                <input
                  type="text"
                  readOnly
                  value="371317599:TEST:17297000 (Click / Payme UZS Provider)"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
                />
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Webhook активен: синхронизация заказов работает в режиме реального времени.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Game */}
      {isAddGameOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">
              Добавить новую тяжелую игру в калькулятор FPS
            </h3>
            <form onSubmit={handleAddGame} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Название игры *</label>
                <input
                  type="text"
                  required
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  placeholder="Например, GTA VI / Monster Hunter Wilds"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Жанр</label>
                  <input
                    type="text"
                    value={newGameGenre}
                    onChange={(e) => setNewGameGenre(e.target.value)}
                    placeholder="Action / RPG"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Тяжесть (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newGameHeavyScore}
                    onChange={(e) => setNewGameHeavyScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">URL постера</label>
                <input
                  type="text"
                  value={newGamePoster}
                  onChange={(e) => setNewGamePoster(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddGameOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-on-accent"
                >
                  Сохранить игру
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">
              Добавить новый товар в каталог
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Название товара *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Например, NVIDIA GeForce RTX 5080 16GB"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Категория</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="cpu">Процессор</option>
                    <option value="gpu">Видеокарта</option>
                    <option value="motherboard">Материнская плата</option>
                    <option value="ram">Оперативная память</option>
                    <option value="storage">Накопитель</option>
                    <option value="psu">Блок питания</option>
                    <option value="case">Корпус</option>
                    <option value="cooler">Охлаждение</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Бренд</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Цена в сумах (UZS)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">TDP (Ватт)</label>
                  <input
                    type="number"
                    value={newProdTdp}
                    onChange={(e) => setNewProdTdp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-neutral-950"
                >
                  Сохранить товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
