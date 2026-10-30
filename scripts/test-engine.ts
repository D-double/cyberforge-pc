import { INITIAL_PRODUCTS } from '../src/data/initialProducts';
import { INITIAL_GAMES } from '../src/data/initialGames';
import { checkCompatibility } from '../src/utils/compatibility';
import { calculateFpsForGame } from '../src/utils/fpsCalculator';
import { translations, formatUZS } from '../src/i18n/translations';
import { PCBuild } from '../src/types';

function runTests() {
  console.log('🚀 Running CYBERFORGE PC Engine Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // TEST 1: Games Database Count
  console.log('--- TEST 1: Games Database & Requirements ---');
  assert(INITIAL_GAMES.length === 20, `Initial games count must be exactly 20 (got ${INITIAL_GAMES.length})`);
  assert(INITIAL_GAMES.some((g) => g.title.includes('Cyberpunk 2077')), 'Cyberpunk 2077 present');
  assert(INITIAL_GAMES.some((g) => g.title.includes('Black Myth: Wukong')), 'Black Myth: Wukong present');
  assert(INITIAL_GAMES.some((g) => g.title.includes('Alan Wake 2')), 'Alan Wake 2 present');
  assert(INITIAL_GAMES.some((g) => g.title.includes('S.T.A.L.K.E.R. 2')), 'S.T.A.L.K.E.R. 2 present');

  // TEST 2: FPS Calculator Logic
  console.log('\n--- TEST 2: FPS Calculation Algorithm ---');
  const sampleBuild: PCBuild = {
    cpu: INITIAL_PRODUCTS.find((p) => p.id === 'cpu-r7-7800x3d'),
    gpu: INITIAL_PRODUCTS.find((p) => p.id === 'gpu-rtx-4070-super'),
    ram: INITIAL_PRODUCTS.find((p) => p.id === 'ram-ddr5-32gb-corsair'),
  };

  const cyberpunk = INITIAL_GAMES.find((g) => g.id === 'cyberpunk-2077')!;
  const fpsLow = calculateFpsForGame(cyberpunk, sampleBuild, 'low', '1080p');
  const fpsMed = calculateFpsForGame(cyberpunk, sampleBuild, 'medium', '1080p');
  const fpsHigh = calculateFpsForGame(cyberpunk, sampleBuild, 'high', '1080p');
  const fpsUltra = calculateFpsForGame(cyberpunk, sampleBuild, 'ultra', '1080p');

  assert(fpsLow.fps > fpsMed.fps, `Low FPS (${fpsLow.fps}) > Medium FPS (${fpsMed.fps})`);
  assert(fpsMed.fps > fpsHigh.fps, `Medium FPS (${fpsMed.fps}) > High FPS (${fpsHigh.fps})`);
  assert(fpsHigh.fps > fpsUltra.fps, `High FPS (${fpsHigh.fps}) > Ultra FPS (${fpsUltra.fps})`);

  const fps1080p = calculateFpsForGame(cyberpunk, sampleBuild, 'high', '1080p');
  const fps1440p = calculateFpsForGame(cyberpunk, sampleBuild, 'high', '1440p');
  const fps4k = calculateFpsForGame(cyberpunk, sampleBuild, 'high', '4k');

  assert(fps1080p.fps > fps1440p.fps, `1080p FPS (${fps1080p.fps}) > 1440p FPS (${fps1440p.fps})`);
  assert(fps1440p.fps > fps4k.fps, `1440p FPS (${fps1440p.fps}) > 4K FPS (${fps4k.fps})`);
  assert(fps4k.fps >= 15, `4K FPS is playable/within bounds (${fps4k.fps})`);

  // TEST 3: Compatibility Engine
  console.log('\n--- TEST 3: PC Builder Compatibility Engine ---');
  // Matching AM5 build
  const validBuild: PCBuild = {
    cpu: INITIAL_PRODUCTS.find((p) => p.id === 'cpu-r7-7800x3d'), // AM5
    motherboard: INITIAL_PRODUCTS.find((p) => p.id === 'mb-gigabyte-b650'), // AM5, DDR5
    ram: INITIAL_PRODUCTS.find((p) => p.id === 'ram-ddr5-32gb-corsair'), // DDR5
    gpu: INITIAL_PRODUCTS.find((p) => p.id === 'gpu-rtx-4070-super'),
    psu: INITIAL_PRODUCTS.find((p) => p.id === 'psu-corsair-rm750e'), // 750W
    case: INITIAL_PRODUCTS.find((p) => p.id === 'case-nzxt-h5-flow'),
    cooler: INITIAL_PRODUCTS.find((p) => p.id === 'cooler-thermalright-pa120'),
  };

  const validReport = checkCompatibility(validBuild);
  assert(validReport.isCompatible, 'Valid AM5 build is compatible');
  assert(validReport.issues.length === 0, 'No issues reported for valid build');

  // Incompatible Socket (Intel CPU + AMD Board)
  const socketMismatchBuild: PCBuild = {
    cpu: INITIAL_PRODUCTS.find((p) => p.id === 'cpu-i7-14700k'), // LGA1700
    motherboard: INITIAL_PRODUCTS.find((p) => p.id === 'mb-gigabyte-b650'), // AM5
  };
  const socketReport = checkCompatibility(socketMismatchBuild);
  assert(!socketReport.isCompatible, 'Socket mismatch is detected');
  assert(socketReport.issues.some((i) => i.field === 'socket'), 'Socket error flagged');

  // Incompatible RAM (DDR4 RAM + DDR5 Board)
  const ramMismatchBuild: PCBuild = {
    motherboard: INITIAL_PRODUCTS.find((p) => p.id === 'mb-msi-z790'), // DDR5
    ram: INITIAL_PRODUCTS.find((p) => p.id === 'ram-ddr4-16gb'), // DDR4
  };
  const ramReport = checkCompatibility(ramMismatchBuild);
  assert(!ramReport.isCompatible, 'RAM type mismatch is detected');
  assert(ramReport.issues.some((i) => i.field === 'ramType'), 'ramType error flagged');

  // Inadequate PSU power
  const lowPsuBuild: PCBuild = {
    cpu: INITIAL_PRODUCTS.find((p) => p.id === 'cpu-i7-14700k'), // TDP 125W
    gpu: INITIAL_PRODUCTS.find((p) => p.id === 'gpu-rtx-4080-super'), // TDP 320W
    // Total system TDP > 515W
    psu: {
      ...INITIAL_PRODUCTS.find((p) => p.category === 'psu')!,
      specs: { psuWattage: 400 }, // Only 400W!
    },
  };
  const psuReport = checkCompatibility(lowPsuBuild);
  assert(!psuReport.isCompatible, 'Inadequate PSU is flagged as error');
  assert(psuReport.issues.some((i) => i.field === 'psuPower'), 'psuPower error flagged');

  // TEST 4: Translations and Currency
  console.log('\n--- TEST 4: Translations (RU / UZ) & Currency Formatting ---');
  assert(translations.ru.siteName === 'CYBERFORGE PC', 'RU siteName is correct');
  assert(translations.uz.siteName === 'CYBERFORGE PC', 'UZ siteName is correct');
  assert(translations.ru.currency === 'сум', 'RU currency is сум');
  assert(translations.uz.currency === "so'm", "UZ currency is so'm");

  const formattedRU = formatUZS(14500000, 'ru');
  const formattedUZ = formatUZS(14500000, 'uz');
  assert(formattedRU.includes('сум'), `RU format contains сум: ${formattedRU}`);
  assert(formattedUZ.includes("so'm"), `UZ format contains so'm: ${formattedUZ}`);

  console.log(`\n========================================`);
  console.log(`Tests finished: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
