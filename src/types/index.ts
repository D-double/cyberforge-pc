export type Language = 'ru' | 'uz';

export type ComponentCategory =
  | 'cpu'
  | 'motherboard'
  | 'gpu'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'
  | 'monitor'
  | 'accessory';

export interface Product {
  id: string;
  name: string;
  category: ComponentCategory;
  brand: string;
  priceUZS: number;
  image: string;
  inStock: boolean;
  tdp?: number; // Power in Watts
  description: {
    ru: string;
    uz: string;
  };
  specs: {
    socket?: string; // e.g. 'LGA1700', 'AM5', 'AM4'
    chipset?: string; // e.g. 'B760', 'Z790', 'B650'
    formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
    ramType?: 'DDR4' | 'DDR5';
    ramSlots?: number;
    ramSpeed?: number; // MHz or MT/s
    ramCapacityGB?: number;
    ramModulesCount?: number; // e.g. 2 for 2x8GB
    gpuLengthMM?: number;
    caseMaxGpuMM?: number;
    caseMaxCoolerHeightMM?: number;
    caseSupportedFormFactors?: ('ATX' | 'Micro-ATX' | 'Mini-ITX')[];
    coolerHeightMM?: number;
    coolerMaxTdp?: number;
    coolerSockets?: string[];
    psuWattage?: number;
    psuRating?: string; // '80+ Bronze', '80+ Gold'
    storageType?: 'NVMe M.2' | 'SATA SSD' | 'HDD';
    storageCapacityGB?: number;
    vramGB?: number;
    gpuBenchmarkScore?: number; // Internal index for FPS
    cpuBenchmarkScore?: number; // Internal index for FPS
    [key: string]: unknown;
  };
}

export type GraphicsPreset = 'low' | 'medium' | 'high' | 'ultra';
export type Resolution = '1080p' | '1440p' | '4k';

export interface GameRequirement {
  id: string;
  title: string;
  poster: string;
  genre: string;
  year: number;
  heavyScore: number; // 1-100 base load scale
  minCpuScore: number;
  recCpuScore: number;
  minGpuScore: number;
  recGpuScore: number;
  description: {
    ru: string;
    uz: string;
  };
}

export interface FpsResult {
  gameId: string;
  gameTitle: string;
  fps: number;
  rating: 'unplayable' | 'playable' | 'good' | 'smooth' | 'esports'; // <30, 30-59, 60-89, 90-143, 144+
  bottleneck: 'cpu' | 'gpu' | 'balanced';
}

export interface PCBuild {
  cpu?: Product;
  motherboard?: Product;
  gpu?: Product;
  ram?: Product;
  storage?: Product;
  psu?: Product;
  case?: Product;
  cooler?: Product;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: {
    ru: string;
    uz: string;
  };
  field: string;
}

export interface CompatibilityReport {
  isCompatible: boolean;
  totalTdp: number;
  recommendedPsuWattage: number;
  issues: CompatibilityIssue[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  isCustomBuild?: boolean;
  buildDetails?: PCBuild;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerTelegram?: string;
  deliveryCity: string;
  deliveryAddress: string;
  paymentMethod: 'telegram' | 'click' | 'payme' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'new' | 'assembling' | 'sent' | 'delivered' | 'cancelled';
  items: CartItem[];
  totalUZS: number;
  notes?: string;
}
