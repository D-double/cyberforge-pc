import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- PROCESSORS (CPU) ---
  {
    id: 'cpu-i5-13400f',
    name: 'Intel Core i5-13400F',
    category: 'cpu',
    brand: 'Intel',
    priceUZS: 2450000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 65,
    description: {
      ru: '10 ядер (6P + 4E), 16 потоков, тактовая частота до 4.6 ГГц. Идеальный баланс для игр и работы.',
      uz: '10 ta yadro (6P + 4E), 16 ta oqim, 4.6 GGts gacha chastota. O\'yinlar va ish uchun ajoyib muvozanat.'
    },
    specs: {
      socket: 'LGA1700',
      cpuBenchmarkScore: 68,
      cores: 10,
      threads: 16,
      baseClock: '2.5 GHz',
      boostClock: '4.6 GHz'
    }
  },
  {
    id: 'cpu-i5-14600k',
    name: 'Intel Core i5-14600K',
    category: 'cpu',
    brand: 'Intel',
    priceUZS: 3950000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 125,
    description: {
      ru: '14 ядер (6P + 8E), 20 потоков, частота до 5.3 ГГц. Разблокированный множитель для разгона.',
      uz: '14 ta yadro (6P + 8E), 20 ta oqim, 5.3 GGts gacha. Tezlashtirish imkoniyati mavjud.'
    },
    specs: {
      socket: 'LGA1700',
      cpuBenchmarkScore: 84,
      cores: 14,
      threads: 20,
      baseClock: '3.5 GHz',
      boostClock: '5.3 GHz'
    }
  },
  {
    id: 'cpu-i7-14700k',
    name: 'Intel Core i7-14700K',
    category: 'cpu',
    brand: 'Intel',
    priceUZS: 5400000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 125,
    description: {
      ru: '20 ядер (8P + 12E), 28 потоков, частота до 5.6 ГГц. Топовая мощность для стриминга и тяжелых игр.',
      uz: '20 ta yadro (8P + 12E), 28 ta oqim, 5.6 GGts gacha. Strim va og\'ir o\'yinlar uchun yuqori quvvat.'
    },
    specs: {
      socket: 'LGA1700',
      cpuBenchmarkScore: 94,
      cores: 20,
      threads: 28,
      baseClock: '3.4 GHz',
      boostClock: '5.6 GHz'
    }
  },
  {
    id: 'cpu-r5-5600',
    name: 'AMD Ryzen 5 5600',
    category: 'cpu',
    brand: 'AMD',
    priceUZS: 1650000,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 65,
    description: {
      ru: '6 ядер, 12 потоков, сокет AM4. Лучший народный процессор по соотношению цена/качество.',
      uz: '6 ta yadro, 12 ta oqim, AM4 soketi. Narx va sifat mutanosibligi bo\'yicha eng yaxshi xalq protsessori.'
    },
    specs: {
      socket: 'AM4',
      cpuBenchmarkScore: 62,
      cores: 6,
      threads: 12,
      baseClock: '3.5 GHz',
      boostClock: '4.4 GHz'
    }
  },
  {
    id: 'cpu-r5-7600',
    name: 'AMD Ryzen 5 7600',
    category: 'cpu',
    brand: 'AMD',
    priceUZS: 2750000,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 65,
    description: {
      ru: '6 ядер, 12 потоков Zen 4, сокет AM5, DDR5. Перспективная платформа с высокой производительностью.',
      uz: '6 ta yadro, 12 ta oqim Zen 4, AM5 soket, DDR5. Kelajagi bor yuqori unumdor platforma.'
    },
    specs: {
      socket: 'AM5',
      cpuBenchmarkScore: 78,
      cores: 6,
      threads: 12,
      baseClock: '3.8 GHz',
      boostClock: '5.1 GHz'
    }
  },
  {
    id: 'cpu-r7-7800x3d',
    name: 'AMD Ryzen 7 7800X3D',
    category: 'cpu',
    brand: 'AMD',
    priceUZS: 5800000,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 120,
    description: {
      ru: '8 ядер, 16 потоков с технологией 3D V-Cache (96MB L3). Король игрового сегмента с максимальным FPS.',
      uz: '8 ta yadro, 16 ta oqim 3D V-Cache (96MB L3) texnologiyasi bilan. O\'yinlar qiroli va eng yuqori FPS.'
    },
    specs: {
      socket: 'AM5',
      cpuBenchmarkScore: 98,
      cores: 8,
      threads: 16,
      baseClock: '4.2 GHz',
      boostClock: '5.0 GHz'
    }
  },

  // --- MOTHERBOARDS ---
  {
    id: 'mb-asus-b760m',
    name: 'ASUS TUF GAMING B760M-PLUS WIFI',
    category: 'motherboard',
    brand: 'ASUS',
    priceUZS: 2350000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Надежная плата с мощной подсистемой питания, WiFi 6, 2x M.2 NVMe и поддержкой памяти DDR5.',
      uz: 'Kuchli quvvat tizimi, WiFi 6, 2x M.2 NVMe va DDR5 xotirasini qo\'llab-quvvatlaydigan ishonchli ona plata.'
    },
    specs: {
      socket: 'LGA1700',
      chipset: 'B760',
      formFactor: 'Micro-ATX',
      ramType: 'DDR5',
      ramSlots: 4,
      ramMaxCapacityGB: 192,
      m2Slots: 2
    }
  },
  {
    id: 'mb-msi-z790',
    name: 'MSI MAG Z790 TOMAHAWK WIFI',
    category: 'motherboard',
    brand: 'MSI',
    priceUZS: 3900000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Премиум плата для оверклокинга, 4 слота M.2 PCIe 4.0, охлаждение радиаторами Shield Frozr, DDR5.',
      uz: 'Tezlashtirish uchun premium plata, 4 ta M.2 PCIe 4.0 sloti, Shield Frozr radiatorlari, DDR5.'
    },
    specs: {
      socket: 'LGA1700',
      chipset: 'Z790',
      formFactor: 'ATX',
      ramType: 'DDR5',
      ramSlots: 4,
      ramMaxCapacityGB: 192,
      m2Slots: 4
    }
  },
  {
    id: 'mb-gigabyte-b650',
    name: 'GIGABYTE B650 AORUS ELITE AX',
    category: 'motherboard',
    brand: 'GIGABYTE',
    priceUZS: 3100000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Полноразмерная ATX плата для платформы AM5 с поддержкой PCIe 5.0 M.2, Wi-Fi 6E и DDR5.',
      uz: 'AM5 platformasi uchun to\'liq o\'lchamli ATX plata, PCIe 5.0 M.2, Wi-Fi 6E va DDR5 qo\'llab-quvvatlaydi.'
    },
    specs: {
      socket: 'AM5',
      chipset: 'B650',
      formFactor: 'ATX',
      ramType: 'DDR5',
      ramSlots: 4,
      ramMaxCapacityGB: 192,
      m2Slots: 3
    }
  },
  {
    id: 'mb-asrock-b550m',
    name: 'ASRock B550M Pro4',
    category: 'motherboard',
    brand: 'ASRock',
    priceUZS: 1400000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Доступная плата AM4 с 4 слотами DDR4, радиаторами на VRM и двумя разъёмами M.2.',
      uz: '4 ta DDR4 slotiga ega hamyonbop AM4 platasi, VRM radiatorlari va ikkita M.2 uyasi.'
    },
    specs: {
      socket: 'AM4',
      chipset: 'B550',
      formFactor: 'Micro-ATX',
      ramType: 'DDR4',
      ramSlots: 4,
      ramMaxCapacityGB: 128,
      m2Slots: 2
    }
  },

  // --- GRAPHICS CARDS (GPU) ---
  {
    id: 'gpu-rtx-4060',
    name: 'NVIDIA GeForce RTX 4060 8GB Palit Dual',
    category: 'gpu',
    brand: 'Palit',
    priceUZS: 4100000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 115,
    description: {
      ru: 'Архитектура Ada Lovelace, поддержка DLSS 3 Frame Generation, энергоэффективная и тихая.',
      uz: 'Ada Lovelace arxitekturasi, DLSS 3 Frame Generation ko\'magi, energiya tejamkor va shovqinsiz.'
    },
    specs: {
      vramGB: 8,
      gpuBenchmarkScore: 65,
      gpuLengthMM: 249,
      recommendedPsuW: 550,
      pcieGen: '4.0 x8'
    }
  },
  {
    id: 'gpu-rtx-4070-super',
    name: 'NVIDIA GeForce RTX 4070 SUPER 12GB ASUS Dual',
    category: 'gpu',
    brand: 'ASUS',
    priceUZS: 8200000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 220,
    description: {
      ru: 'Золотой стандарт для разрешения 1440p (2K) на ультра настройках с трассировкой лучей и DLSS 3.',
      uz: 'Nurlarni kuzatish va DLSS 3 bilan ultra sozlamalarda 1440p (2K) ruxsati uchun oltin standart.'
    },
    specs: {
      vramGB: 12,
      gpuBenchmarkScore: 86,
      gpuLengthMM: 267,
      recommendedPsuW: 650,
      pcieGen: '4.0 x16'
    }
  },
  {
    id: 'gpu-rtx-4080-super',
    name: 'NVIDIA GeForce RTX 4080 SUPER 16GB Gigabyte Gaming OC',
    category: 'gpu',
    brand: 'GIGABYTE',
    priceUZS: 14500000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 320,
    description: {
      ru: 'Флагманский зверь для комфортного гейминга в 4K разрешении с максимальным качеством графики.',
      uz: 'Maksimal grafik sifati bilan 4K ruxsatda qulay o\'yin o\'ynash uchun flagman kuch.'
    },
    specs: {
      vramGB: 16,
      gpuBenchmarkScore: 97,
      gpuLengthMM: 342,
      recommendedPsuW: 750,
      pcieGen: '4.0 x16'
    }
  },
  {
    id: 'gpu-rx-7800-xt',
    name: 'AMD Radeon RX 7800 XT 16GB Sapphire Pure',
    category: 'gpu',
    brand: 'Sapphire',
    priceUZS: 7100000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    tdp: 263,
    description: {
      ru: '16GB быстрой видеопамяти GDDR6, архитектура RDNA 3, высокий чистый фреймрейт в 1440p.',
      uz: '16GB tezkor GDDR6 video xotira, RDNA 3 arxitekturasi, 1440p o\'yinlarida yuqori sof freymreyt.'
    },
    specs: {
      vramGB: 16,
      gpuBenchmarkScore: 82,
      gpuLengthMM: 320,
      recommendedPsuW: 700,
      pcieGen: '4.0 x16'
    }
  },

  // --- RAM ---
  {
    id: 'ram-ddr4-16gb',
    name: 'Kingston FURY Beast DDR4 16GB (2x8GB) 3200MHz',
    category: 'ram',
    brand: 'Kingston',
    priceUZS: 540000,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Двухканальный комплект DDR4 с низкопрофильными радиаторами и поддержкой профилей Intel XMP.',
      uz: 'Past profilli radiatorlar va Intel XMP qo\'llab-quvvatlovchi ikki kanalli DDR4 to\'plami.'
    },
    specs: {
      ramType: 'DDR4',
      ramCapacityGB: 16,
      ramModulesCount: 2,
      ramSpeed: 3200
    }
  },
  {
    id: 'ram-ddr5-32gb-corsair',
    name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz CL30',
    category: 'ram',
    brand: 'Corsair',
    priceUZS: 1550000,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Скоростной комплект DDR5 с отборными чипами и таймингами CL30. Идеально для Ryzen 7000/Intel 14th.',
      uz: 'Tanlangan chiplar va past CL30 tayminglariga ega tezkor DDR5 to\'plami.'
    },
    specs: {
      ramType: 'DDR5',
      ramCapacityGB: 32,
      ramModulesCount: 2,
      ramSpeed: 6000
    }
  },
  {
    id: 'ram-ddr5-32gb-trident-rgb',
    name: 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz',
    category: 'ram',
    brand: 'G.Skill',
    priceUZS: 1850000,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Премиальная память с яркой настраиваемой RGB подсветкой и экстремальной частотой 6400 МГц.',
      uz: 'Yorqin sozlanuvchi RGB yoritgich va ekstremal 6400 MGts chastotaga ega premium xotira.'
    },
    specs: {
      ramType: 'DDR5',
      ramCapacityGB: 32,
      ramModulesCount: 2,
      ramSpeed: 6400
    }
  },

  // --- STORAGE ---
  {
    id: 'ssd-samsung-990-pro-1tb',
    name: 'Samsung 990 PRO 1TB NVMe M.2 SSD',
    category: 'storage',
    brand: 'Samsung',
    priceUZS: 1650000,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Скорость чтения до 7450 МБ/с, записи до 6900 МБ/с. Мгновенная загрузка любых игр и системы.',
      uz: 'O\'qish tezligi 7450 MB/s gacha, yozish 6900 MB/s gacha. O\'yinlar va tizimning bir zumda yuklanishi.'
    },
    specs: {
      storageType: 'NVMe M.2',
      storageCapacityGB: 1000,
      readSpeedMB: 7450,
      writeSpeedMB: 6900
    }
  },
  {
    id: 'ssd-kingston-kc3000-2tb',
    name: 'Kingston KC3000 2TB PCIe 4.0 NVMe M.2 SSD',
    category: 'storage',
    brand: 'Kingston',
    priceUZS: 2450000,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Большой объем 2 терабайта со скоростью 7000 МБ/с. Достаточно для всей коллекции тяжелых игр.',
      uz: '7000 MB/s tezlikka ega 2 terabayt katta hajm. Barcha og\'ir o\'yinlar to\'plami uchun yetarli.'
    },
    specs: {
      storageType: 'NVMe M.2',
      storageCapacityGB: 2000,
      readSpeedMB: 7000,
      writeSpeedMB: 7000
    }
  },

  // --- POWER SUPPLIES (PSU) ---
  {
    id: 'psu-deepcool-pk650d',
    name: 'DeepCool PK650D 650W 80+ Bronze',
    category: 'psu',
    brand: 'DeepCool',
    priceUZS: 720000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Надежный блок питания с сертификатом 80 PLUS Bronze, японские конденсаторы, тихий 120мм вентилятор.',
      uz: '80 PLUS Bronze sertifikatli ishonchli quvvat bloki, sokin 120mm ventilyator.'
    },
    specs: {
      psuWattage: 650,
      psuRating: '80+ Bronze',
      modular: false
    }
  },
  {
    id: 'psu-corsair-rm750e',
    name: 'Corsair RM750e 750W 80+ Gold ATX 3.0',
    category: 'psu',
    brand: 'Corsair',
    priceUZS: 1550000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Полностью модульный блок стандарта ATX 3.0 с кабелем 12VHPWR для современных карт RTX 40 серии.',
      uz: 'Zamonaviy RTX 40 seriyali kartalar uchun 12VHPWR kabeliga ega to\'liq modulli ATX 3.0 bloki.'
    },
    specs: {
      psuWattage: 750,
      psuRating: '80+ Gold',
      modular: true
    }
  },
  {
    id: 'psu-seasonic-gx850',
    name: 'Seasonic FOCUS GX-850 850W 80+ Gold',
    category: 'psu',
    brand: 'Seasonic',
    priceUZS: 2200000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Эталон надежности. 10 лет гарантии, тишайший гибридный режим работы, японские компоненты.',
      uz: 'Ishonchlilik etaloni. 10 yillik kafolat, sokin gibrid rejim, yapon komponentlari.'
    },
    specs: {
      psuWattage: 850,
      psuRating: '80+ Gold',
      modular: true
    }
  },

  // --- CASES ---
  {
    id: 'case-deepcool-cc560',
    name: 'DeepCool CC560 V2 Black (4x LED fans)',
    category: 'case',
    brand: 'DeepCool',
    priceUZS: 650000,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Отличный продуваемый корпус с сетчатой передней панелью, закаленным стеклом и 4 кулерами в комплекте.',
      uz: 'To\'rli old panel, toblangan shisha va to\'plamda 4 ta ventilyatorga ega ajoyib korpus.'
    },
    specs: {
      caseSupportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      caseMaxGpuMM: 370,
      caseMaxCoolerHeightMM: 163,
      sidePanel: 'Tempered Glass'
    }
  },
  {
    id: 'case-nzxt-h5-flow',
    name: 'NZXT H5 Flow RGB Matte Black',
    category: 'case',
    brand: 'NZXT',
    priceUZS: 1350000,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Премиум дизайн с направленным обдувом видеокарты снизу, прозрачным стеклом и ARGB подсветкой.',
      uz: 'Videokartani pastdan to\'g\'ridan-to\'g\'ri sovutish, shaffof shisha va ARGB yoritgichli premium dizayn.'
    },
    specs: {
      caseSupportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      caseMaxGpuMM: 365,
      caseMaxCoolerHeightMM: 165,
      sidePanel: 'Tempered Glass'
    }
  },
  {
    id: 'case-lianli-o11-dynamic',
    name: 'Lian Li O11 Dynamic EVO Black',
    category: 'case',
    brand: 'Lian Li',
    priceUZS: 2400000,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Легендарный панорамный корпус-аквариум для эффектных сборок с жидкостным охлаждением.',
      uz: 'Suyuqlik bilan sovutiladigan ta\'sirchan yig\'malar uchun afsonaviy panoramali akvarium-korpus.'
    },
    specs: {
      caseSupportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      caseMaxGpuMM: 422,
      caseMaxCoolerHeightMM: 167,
      sidePanel: 'Dual Tempered Glass'
    }
  },

  // --- CPU COOLERS ---
  {
    id: 'cooler-deepcool-ak400',
    name: 'DeepCool AK400 Zero Dark',
    category: 'cooler',
    brand: 'DeepCool',
    priceUZS: 420000,
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Стильный черный башенный кулер с 4 тепловыми трубками. Эффективно рассеивает до 220 Вт тепла.',
      uz: '4 ta issiqlik trubkasiga ega zamonaviy qora minora kuleri. 220 Vt gacha issiqlikni samarali tarqatadi.'
    },
    specs: {
      coolerHeightMM: 155,
      coolerMaxTdp: 220,
      coolerSockets: ['LGA1700', 'AM4', 'AM5']
    }
  },
  {
    id: 'cooler-thermalright-pa120',
    name: 'Thermalright Peerless Assassin 120 SE ARGB',
    category: 'cooler',
    brand: 'Thermalright',
    priceUZS: 650000,
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Двухбашенный суперкулер с 6 тепловыми трубками и двумя 120мм вентиляторами с ARGB подсветкой.',
      uz: '6 ta issiqlik trubkasi va ARGB yoritgichli ikkita 120mm ventilyatorli ikki minorali superkuler.'
    },
    specs: {
      coolerHeightMM: 155,
      coolerMaxTdp: 265,
      coolerSockets: ['LGA1700', 'AM4', 'AM5']
    }
  },
  {
    id: 'cooler-nzxt-kraken-360',
    name: 'NZXT Kraken 360 RGB Liquid Cooler',
    category: 'cooler',
    brand: 'NZXT',
    priceUZS: 3100000,
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    description: {
      ru: 'Система жидкостного охлаждения с 360-мм радиатором, ярким LCD дисплеем на помпе и RGB кулерами.',
      uz: '360 mm radiatorli, nasosida yorqin LCD displey va RGB ventilyatorlarga ega suyuqlik sovutish tizimi.'
    },
    specs: {
      coolerHeightMM: 55, // Pump height
      coolerMaxTdp: 350,
      coolerSockets: ['LGA1700', 'AM4', 'AM5'],
      isAio: true
    }
  }
];
