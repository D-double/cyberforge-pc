// Downloads CC0 hardware models from the Innerscene 3D Parts Library
// (https://www.innerscene.com/tools/library) and compresses them for the web.
// Usage: npm run models:download
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const LIBRARY_URL = 'https://www.innerscene.com/api/library';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'models');

const MODELS = {
  case: 'closed-mid-tower-pc-case-1374583e',
  motherboard: 'atx-motherboard-7794769f',
  gpu: 'graphics-card-with-fans-6af50057',
  'cooler-tower': 'cpu-tower-air-cooler-a9515857',
  ram: 'ddr5-ram-stick-376e4682',
  psu: 'atx-power-supply-675d6448',
  'ssd-m2': 'm-2-ssd-b1fcbab1',
  'ssd-sata': '2-5-in-ssd-291995fb',
};

// Node names drive fan animation and RGB recolouring, so meshes must not be joined or flattened.
const OPTIMIZE_ARGS = [
  '--compress', 'draco',
  '--texture-compress', 'webp',
  '--texture-size', '1024',
  '--join', 'false',
  '--flatten', 'false',
  '--instance', 'false',
  '--simplify', 'false',
];

async function download(slug, destination) {
  const response = await fetch(`${LIBRARY_URL}/${slug}/download`);
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
}

const workDir = mkdtempSync(path.join(tmpdir(), 'pc-models-'));
try {
  for (const [name, slug] of Object.entries(MODELS)) {
    const rawFile = path.join(workDir, `${name}.glb`);
    const outFile = path.join(OUTPUT_DIR, `${name}.glb`);
    console.log(`↓ ${name} (${slug})`);
    await download(slug, rawFile);
    execFileSync('npx', ['-y', '@gltf-transform/cli@4', 'optimize', rawFile, outFile, ...OPTIMIZE_ARGS], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
  }
  console.log(`✓ Models saved to ${OUTPUT_DIR}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
