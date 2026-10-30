import { FpsResult, GameRequirement, GraphicsPreset, PCBuild, Resolution } from '@/types';

export function calculateFpsForGame(
  game: GameRequirement,
  build: PCBuild,
  preset: GraphicsPreset,
  resolution: Resolution
): FpsResult {
  // Baseline scores (fallback to average midrange if not specified)
  const cpuScore = build.cpu?.specs?.cpuBenchmarkScore || 70;
  const gpuScore = build.gpu?.specs?.gpuBenchmarkScore || 75;
  const ramCap = build.ram?.specs?.ramCapacityGB || 16;

  // Resolution weight on CPU vs GPU
  let cpuWeight = 0.3;
  let gpuWeight = 0.7;
  let resMultiplier = 1.0;

  if (resolution === '1080p') {
    cpuWeight = 0.35;
    gpuWeight = 0.65;
    resMultiplier = 1.0;
  } else if (resolution === '1440p') {
    cpuWeight = 0.2;
    gpuWeight = 0.8;
    resMultiplier = 0.72;
  } else if (resolution === '4k') {
    cpuWeight = 0.1;
    gpuWeight = 0.9;
    resMultiplier = 0.44;
  }

  // Graphics preset multiplier
  const presetMultipliers: Record<GraphicsPreset, number> = {
    low: 1.75,
    medium: 1.35,
    high: 1.0,
    ultra: 0.74,
  };
  const presetMult = presetMultipliers[preset] || 1.0;

  // Combined power index (0 - 100)
  const combinedScore = (cpuScore * cpuWeight) + (gpuScore * gpuWeight);

  // RAM penalty/bonus
  let ramFactor = 1.0;
  if (ramCap < 16) ramFactor = 0.82;
  else if (ramCap >= 32) ramFactor = 1.05;

  // Game baseline difficulty (heavyScore: 80 - 100)
  // At combinedScore 85 on High 1080p, heavyScore 90 game yields ~75 FPS.
  const baselineDifficultyScale = (100 - game.heavyScore + 20) / 30; // ~1.0
  const baseFps = (combinedScore * 1.05) * baselineDifficultyScale;

  const rawFps = Math.round(baseFps * resMultiplier * presetMult * ramFactor);
  const finalFps = Math.max(15, rawFps);

  // Rating bracket
  let rating: FpsResult['rating'] = 'playable';
  if (finalFps < 30) rating = 'unplayable';
  else if (finalFps < 60) rating = 'playable';
  else if (finalFps < 90) rating = 'good';
  else if (finalFps < 144) rating = 'smooth';
  else rating = 'esports';

  // Bottleneck assessment
  let bottleneck: FpsResult['bottleneck'] = 'balanced';
  const scoreDiff = cpuScore - gpuScore;
  if (scoreDiff < -16) {
    bottleneck = 'cpu';
  } else if (scoreDiff > 20) {
    bottleneck = 'gpu';
  }

  return {
    gameId: game.id,
    gameTitle: game.title,
    fps: finalFps,
    rating,
    bottleneck,
  };
}
