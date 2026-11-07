export interface Nebula {
  x: number;
  y: number;
  radius: number;
  squash: number;
  rgb: string;
  alpha: number;
}

export interface StarLayer {
  count: number;
  speed: number;
  minRadius: number;
  maxRadius: number;
  minAlpha: number;
  maxAlpha: number;
  rgb: string;
}

export const NEBULAE: Nebula[] = [
  { x: 0.18, y: 0.28, radius: 0.42, squash: 0.6, rgb: '124, 58, 237', alpha: 0.2 },
  { x: 0.82, y: 0.7, radius: 0.5, squash: 0.55, rgb: '67, 56, 202', alpha: 0.28 },
  { x: 0.55, y: 0.12, radius: 0.34, squash: 0.5, rgb: '45, 212, 191', alpha: 0.14 },
  { x: 0.3, y: 0.82, radius: 0.38, squash: 0.6, rgb: '34, 211, 238', alpha: 0.12 },
];

export const STAR_LAYERS: StarLayer[] = [
  { count: 260, speed: 0.002, minRadius: 0.25, maxRadius: 0.7, minAlpha: 0.15, maxAlpha: 0.4, rgb: '159, 180, 216' },
  { count: 150, speed: 0.006, minRadius: 0.4, maxRadius: 1.1, minAlpha: 0.3, maxAlpha: 0.6, rgb: '217, 251, 255' },
  { count: 70, speed: 0.014, minRadius: 0.9, maxRadius: 1.8, minAlpha: 0.5, maxAlpha: 0.95, rgb: '255, 255, 255' },
];
