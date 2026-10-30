'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CartItem,
  CompatibilityReport,
  GameRequirement,
  Language,
  Order,
  PCBuild,
  Product,
} from '@/types';
import { INITIAL_PRODUCTS } from '@/data/initialProducts';
import { INITIAL_GAMES } from '@/data/initialGames';
import { checkCompatibility } from '@/utils/compatibility';
import { formatUZS, translations } from '@/i18n/translations';

interface StoreContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ru;
  formatPrice: (amount: number) => string;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  games: GameRequirement[];
  setGames: React.Dispatch<React.SetStateAction<GameRequirement[]>>;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  addBuildToCart: (customBuild: PCBuild) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  build: PCBuild;
  setBuildPart: (slot: keyof PCBuild, product: Product | undefined) => void;
  clearBuild: () => void;
  loadOptimalBuild: () => void;
  compatibility: CompatibilityReport;
  buildTotalUZS: number;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  visualizerMode: 'xray' | 'finished';
  setVisualizerMode: (mode: 'xray' | 'finished') => void;
  activeRgbColor: string;
  setActiveRgbColor: (color: string) => void;
  rgbEnabled: boolean;
  setRgbEnabled: (enabled: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [games, setGames] = useState<GameRequirement[]>(INITIAL_GAMES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Visualizer settings
  const [visualizerMode, setVisualizerMode] = useState<'xray' | 'finished'>('finished');
  const [rgbEnabled, setRgbEnabled] = useState(true);
  const [activeRgbColor, setActiveRgbColor] = useState('#06b6d4'); // Default cyan neon

  // PC Builder configuration
  const [build, setBuild] = useState<PCBuild>({
    cpu: INITIAL_PRODUCTS.find((p) => p.id === 'cpu-r7-7800x3d'),
    motherboard: INITIAL_PRODUCTS.find((p) => p.id === 'mb-gigabyte-b650'),
    gpu: INITIAL_PRODUCTS.find((p) => p.id === 'gpu-rtx-4070-super'),
    ram: INITIAL_PRODUCTS.find((p) => p.id === 'ram-ddr5-32gb-corsair'),
    storage: INITIAL_PRODUCTS.find((p) => p.id === 'ssd-samsung-990-pro-1tb'),
    psu: INITIAL_PRODUCTS.find((p) => p.id === 'psu-corsair-rm750e'),
    case: INITIAL_PRODUCTS.find((p) => p.id === 'case-nzxt-h5-flow'),
    cooler: INITIAL_PRODUCTS.find((p) => p.id === 'cooler-thermalright-pa120'),
  });

  // Sample initial orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1001',
      orderNumber: 'CF-84920',
      createdAt: '2026-10-22 18:40',
      customerName: 'Санжар Юсупов',
      customerPhone: '+998901234567',
      customerTelegram: '@sanzhar_dev',
      deliveryCity: 'Ташкент',
      deliveryAddress: 'Юнусабад 14, д. 22, кв. 15',
      paymentMethod: 'telegram',
      paymentStatus: 'paid',
      orderStatus: 'assembling',
      items: [
        {
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
        },
      ],
      totalUZS: 18450000,
      notes: 'Просьба собрать аккуратный кабель-менеджмент',
    },
  ]);

  // Load state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('cf_lang') as Language;
      if (savedLang && (savedLang === 'ru' || savedLang === 'uz')) {
        setLang(savedLang);
      }
      const savedCart = localStorage.getItem('cf_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {}
      }
      const savedProducts = localStorage.getItem('cf_products');
      if (savedProducts) {
        try {
          setProducts(JSON.parse(savedProducts));
        } catch {}
      }
      const savedGames = localStorage.getItem('cf_games');
      if (savedGames) {
        try {
          setGames(JSON.parse(savedGames));
        } catch {}
      }
      const savedOrders = localStorage.getItem('cf_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch {}
      }
      const savedBuild = localStorage.getItem('cf_build');
      if (savedBuild) {
        try {
          setBuild(JSON.parse(savedBuild));
        } catch {}
      }
      setIsMounted(true);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cf_lang', newLang);
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cf_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cf_orders', JSON.stringify(orders));
    }
  }, [orders, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cf_build', JSON.stringify(build));
    }
  }, [build, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cf_products', JSON.stringify(products));
    }
  }, [products, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cf_games', JSON.stringify(games));
    }
  }, [games, isMounted]);

  // Active translations
  const t = translations[lang] || translations.ru;

  const formatPrice = (amount: number) => {
    return formatUZS(amount, lang);
  };

  // Compatibility calculation
  const compatibility = useMemo(() => {
    return checkCompatibility(build);
  }, [build]);

  // Total price of current PC build
  const buildTotalUZS = useMemo(() => {
    let total = 0;
    Object.values(build).forEach((part) => {
      if (part) total += part.priceUZS;
    });
    return total;
  }, [build]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && !item.isCustomBuild);
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const addBuildToCart = (customBuild: PCBuild) => {
    // Package whole rig as a single configured package
    const partsCount = Object.values(customBuild).filter(Boolean).length;
    if (partsCount === 0) return;

    let totalBuildPrice = 0;
    const partsSummary: string[] = [];
    Object.entries(customBuild).forEach(([key, part]) => {
      if (part) {
        totalBuildPrice += part.priceUZS;
        partsSummary.push(`${key.toUpperCase()}: ${part.name}`);
      }
    });

    const rigProduct: Product = {
      id: `rig-${Date.now()}`,
      name: `Custom PC Rig (${customBuild.cpu?.name || 'PC'} + ${customBuild.gpu?.name || 'GPU'})`,
      category: 'accessory',
      brand: 'CyberForge Custom',
      priceUZS: totalBuildPrice,
      image: customBuild.case?.image || 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600&auto=format&fit=crop&q=80',
      inStock: true,
      description: {
        ru: `Фирменная кастомная сборка CyberForge. Включает детали: ${partsSummary.slice(0, 3).join(', ')}...`,
        uz: `CyberForge maxsus yig'ilgan kompyuteri. Tarkibi: ${partsSummary.slice(0, 3).join(', ')}...`,
      },
      specs: {},
    };

    setCart((prev) => [
      ...prev,
      {
        product: rigProduct,
        quantity: 1,
        isCustomBuild: true,
        buildDetails: { ...customBuild },
      },
    ]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.priceUZS * item.quantity, 0);
  }, [cart]);

  // Build operations
  const setBuildPart = (slot: keyof PCBuild, product: Product | undefined) => {
    setBuild((prev) => ({
      ...prev,
      [slot]: product,
    }));
  };

  const clearBuild = () => {
    setBuild({});
  };

  const loadOptimalBuild = () => {
    setBuild({
      cpu: products.find((p) => p.id === 'cpu-r7-7800x3d'),
      motherboard: products.find((p) => p.id === 'mb-gigabyte-b650'),
      gpu: products.find((p) => p.id === 'gpu-rtx-4070-super'),
      ram: products.find((p) => p.id === 'ram-ddr5-32gb-corsair'),
      storage: products.find((p) => p.id === 'ssd-samsung-990-pro-1tb'),
      psu: products.find((p) => p.id === 'psu-corsair-rm750e'),
      case: products.find((p) => p.id === 'case-nzxt-h5-flow'),
      cooler: products.find((p) => p.id === 'cooler-thermalright-pa120'),
    });
  };

  // Orders
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `CF-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toLocaleString('ru-RU'),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        t,
        formatPrice,
        products,
        setProducts,
        games,
        setGames,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        addBuildToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        build,
        setBuildPart,
        clearBuild,
        loadOptimalBuild,
        compatibility,
        buildTotalUZS,
        orders,
        addOrder,
        updateOrderStatus,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        visualizerMode,
        setVisualizerMode,
        activeRgbColor,
        setActiveRgbColor,
        rgbEnabled,
        setRgbEnabled,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
