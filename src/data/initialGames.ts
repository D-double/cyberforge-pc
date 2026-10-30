import { GameRequirement } from '@/types';

export const INITIAL_GAMES: GameRequirement[] = [
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG / Sci-Fi',
    year: 2023,
    heavyScore: 95,
    minCpuScore: 60,
    recCpuScore: 85,
    minGpuScore: 65,
    recGpuScore: 90,
    description: {
      ru: 'Один из самых визуально тяжелых проектов с трассировкой пути (Path Tracing) и плотным открытым миром Найт-Сити.',
      uz: 'Path Tracing va Night City shahrining zich ochiq dunyosiga ega eng og\'ir loyihalardan biri.'
    }
  },
  {
    id: 'black-myth-wukong',
    title: 'Black Myth: Wukong',
    poster: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    genre: 'Action / Soulslike',
    year: 2024,
    heavyScore: 98,
    minCpuScore: 65,
    recCpuScore: 88,
    minGpuScore: 70,
    recGpuScore: 95,
    description: {
      ru: 'Разработан на Unreal Engine 5 с технологиями Nanite и Lumen. Максимальная нагрузка на видеокарту.',
      uz: 'Nanite va Lumen texnologiyalari bilan Unreal Engine 5 da yaratilgan. Videokartaga eng yuqori yuklanish.'
    }
  },
  {
    id: 'alan-wake-2',
    title: 'Alan Wake 2',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    genre: 'Survival Horror',
    year: 2023,
    heavyScore: 97,
    minCpuScore: 62,
    recCpuScore: 86,
    minGpuScore: 72,
    recGpuScore: 94,
    description: {
      ru: 'Использует Mesh Shaders и полноценную трассировку лучей нового поколения от Remedy.',
      uz: 'Remedy kompaniyasining Mesh Shaders va yangi avlod nurlarni kuzatish texnologiyalaridan foydalanadi.'
    }
  },
  {
    id: 'stalker-2',
    title: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    genre: 'FPS / Survival',
    year: 2024,
    heavyScore: 94,
    minCpuScore: 70,
    recCpuScore: 90,
    minGpuScore: 68,
    recGpuScore: 92,
    description: {
      ru: 'Огромная бесшовная зона на движке Unreal Engine 5 с продвинутой физикой A-Life 2.0.',
      uz: 'Unreal Engine 5 dvigatelida ilg\'or A-Life 2.0 fizikasi bilan yaratilgan ulkan hudud.'
    }
  },
  {
    id: 'starfield',
    title: 'Starfield',
    poster: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    genre: 'Space RPG',
    year: 2023,
    heavyScore: 90,
    minCpuScore: 68,
    recCpuScore: 88,
    minGpuScore: 65,
    recGpuScore: 88,
    description: {
      ru: 'Высокие требования к процессору и скорости оперативной памяти в крупных космических городах.',
      uz: 'Katta kosmik shaharlarda protsessor va tezkor xotira tezligiga yuqori talablar.'
    }
  },
  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    poster: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&auto=format&fit=crop&q=80',
    genre: 'Open World Western',
    year: 2019,
    heavyScore: 85,
    minCpuScore: 55,
    recCpuScore: 75,
    minGpuScore: 58,
    recGpuScore: 80,
    description: {
      ru: 'Невероятная детализация природы, динамическое освещение, физика воды и объемный туман.',
      uz: 'Tabiatning hayratlanarli tafsilotlari, dinamik yoritish, suv fizikasi va hajmli tuman.'
    }
  },
  {
    id: 'hogwarts-legacy',
    title: 'Hogwarts Legacy',
    poster: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG / Fantasy',
    year: 2023,
    heavyScore: 88,
    minCpuScore: 60,
    recCpuScore: 80,
    minGpuScore: 62,
    recGpuScore: 85,
    description: {
      ru: 'Масштабный замок Хогвартс и окрестности, требовательна к объему видеопамяти VRAM (12GB+).',
      uz: 'Keng ko\'lamli Xogvarts qal\'asi, video xotira (12GB+) hajmiga yuqori talabchan.'
    }
  },
  {
    id: 'the-witcher-3-next-gen',
    title: 'The Witcher 3: Wild Hunt (Next-Gen)',
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    genre: 'RPG',
    year: 2022,
    heavyScore: 87,
    minCpuScore: 58,
    recCpuScore: 78,
    minGpuScore: 64,
    recGpuScore: 86,
    description: {
      ru: 'Обновленная версия с трассировкой лучей глобального освещения (RTXGI) и ультра-текстурами 4K.',
      uz: 'Global yoritishni nurlar orqali kuzatish (RTXGI) va 4K ultra-teksturalar bilan yangilangan versiya.'
    }
  },
  {
    id: 'the-last-of-us-part-1',
    title: 'The Last of Us Part I',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    genre: 'Action / Adventure',
    year: 2023,
    heavyScore: 92,
    minCpuScore: 66,
    recCpuScore: 85,
    minGpuScore: 68,
    recGpuScore: 89,
    description: {
      ru: 'Высокодетализированная геометрия, фотореалистичная анимация лиц и интенсивная декомпрессия шейдеров.',
      uz: 'Yuqori aniqlikdagi geometriya, yuzlarning fotorealistik animatsiyasi va og\'ir sheyderlar.'
    }
  },
  {
    id: 'microsoft-flight-simulator',
    title: 'Microsoft Flight Simulator',
    poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e604?w=800&auto=format&fit=crop&q=80',
    genre: 'Simulation',
    year: 2020,
    heavyScore: 96,
    minCpuScore: 72,
    recCpuScore: 95,
    minGpuScore: 65,
    recGpuScore: 90,
    description: {
      ru: 'Самый процессорозависимый симулятор в мире с фотограмметрией всей планеты Земля в реальном масштабе.',
      uz: 'Butun Yer sayyorasining fotogrammetriyasiga ega dunyodagi eng protsessorga talabchan simulyator.'
    }
  },
  {
    id: 'avatar-frontiers-of-pandora',
    title: 'Avatar: Frontiers of Pandora',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    genre: 'Action / Sci-Fi',
    year: 2023,
    heavyScore: 93,
    minCpuScore: 64,
    recCpuScore: 84,
    minGpuScore: 70,
    recGpuScore: 92,
    description: {
      ru: 'Движок Snowdrop со встроенной трассировкой лучей по умолчанию, густейшая флора Пандоры.',
      uz: 'Boshlang\'ich sozlamada nurlarni kuzatishga ega Snowdrop dvigateli, Pandoraning qalin o\'rmonlari.'
    }
  },
  {
    id: 'warhammer-space-marine-2',
    title: 'Warhammer 40,000: Space Marine 2',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Third-Person Shooter',
    year: 2024,
    heavyScore: 91,
    minCpuScore: 68,
    recCpuScore: 88,
    minGpuScore: 66,
    recGpuScore: 88,
    description: {
      ru: 'Движок Swarm Engine отображает сотни и тысячи тиранидов на экране одновременно.',
      uz: 'Swarm Engine dvigateli bir vaqtning o\'zida ekranda yuzlab va minglab dushmanlarni aks ettiradi.'
    }
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    poster: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG',
    year: 2022,
    heavyScore: 82,
    minCpuScore: 55,
    recCpuScore: 74,
    minGpuScore: 56,
    recGpuScore: 78,
    description: {
      ru: 'Огромный мир Междуземья, эпические боссы и поддержка эффектов Ray Tracing.',
      uz: 'Keng Orol dunyosi, epik janglar va Ray Tracing effektlarini qo\'llab-quvvatlash.'
    }
  },
  {
    id: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    poster: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&auto=format&fit=crop&q=80',
    genre: 'CRPG',
    year: 2023,
    heavyScore: 84,
    minCpuScore: 65,
    recCpuScore: 85,
    minGpuScore: 58,
    recGpuScore: 78,
    description: {
      ru: 'Игра года 2023. Третий акт в городе Врата Балдура создает колоссальную нагрузку на процессор.',
      uz: '2023 yilning eng yaxshi o\'yini. Uchinchi akt shahrida protsessorga ulkan yuklama tushadi.'
    }
  },
  {
    id: 'cod-warzone',
    title: 'Call of Duty: Warzone',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Battle Royale FPS',
    year: 2024,
    heavyScore: 86,
    minCpuScore: 62,
    recCpuScore: 82,
    minGpuScore: 60,
    recGpuScore: 84,
    description: {
      ru: 'Соревновательный шутер на 120+ игроков, требует высокого и стабильного FPS без просадок.',
      uz: '120+ o\'yinchi uchun musobaqa shuteri, tushib ketmaydigan yuqori va barqaror FPS talab qiladi.'
    }
  },
  {
    id: 'forza-horizon-5',
    title: 'Forza Horizon 5',
    poster: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80',
    genre: 'Racing',
    year: 2021,
    heavyScore: 80,
    minCpuScore: 52,
    recCpuScore: 70,
    minGpuScore: 55,
    recGpuScore: 76,
    description: {
      ru: 'Мексиканские пейзажи, фотореалистичные автомобили, трассировка лучей в Forzavista и гонках.',
      uz: 'Meksika manzaralari, fotorealistik avtomobillar, Forzavista va poygalarda nurlar kuzatuvi.'
    }
  },
  {
    id: 'dying-light-2',
    title: 'Dying Light 2 Stay Human',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    genre: 'Action / Zombie Survival',
    year: 2022,
    heavyScore: 85,
    minCpuScore: 58,
    recCpuScore: 76,
    minGpuScore: 62,
    recGpuScore: 82,
    description: {
      ru: 'Паркур в открытом городе постапокалипсиса с динамической сменой дня и ночи и RTX тенями.',
      uz: 'Post-apokalipsis shahrida parkur, kecha va kunduz almashinuvi hamda RTX soyalari.'
    }
  },
  {
    id: 'returnal',
    title: 'Returnal',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    genre: 'Roguelike / TPS',
    year: 2023,
    heavyScore: 89,
    minCpuScore: 64,
    recCpuScore: 82,
    minGpuScore: 66,
    recGpuScore: 86,
    description: {
      ru: 'Быстрый bullet-hell геймплей с миллионами частиц на экране и трассировкой лучей отражений.',
      uz: 'Ekranda millionlab zarralar va aks ettirish nurlari bilan tezkor bullet-hell o\'yin jarayoni.'
    }
  },
  {
    id: 'metro-exodus-enhanced',
    title: 'Metro Exodus Enhanced Edition',
    poster: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&auto=format&fit=crop&q=80',
    genre: 'Story FPS',
    year: 2021,
    heavyScore: 87,
    minCpuScore: 58,
    recCpuScore: 78,
    minGpuScore: 65,
    recGpuScore: 85,
    description: {
      ru: 'Работает исключительно на видеокартах с аппаратным ускорением трассировки лучей.',
      uz: 'Faqatgina apparat darajasida nurlarni tezlashtirishga ega videokartalarda ishlaydi.'
    }
  },
  {
    id: 'assassins-creed-mirage',
    title: "Assassin's Creed Mirage",
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    genre: 'Action / Adventure',
    year: 2023,
    heavyScore: 83,
    minCpuScore: 56,
    recCpuScore: 75,
    minGpuScore: 60,
    recGpuScore: 80,
    description: {
      ru: 'Воссозданный Багдад девятого века с густой плотностью толпы жителей и высокой детализацией.',
      uz: 'Aholining yuqori zichligi va chuqur tafsilotlari bilan tiklangan to\'qqizinchi asr Bag\'dodi.'
    }
  }
];
