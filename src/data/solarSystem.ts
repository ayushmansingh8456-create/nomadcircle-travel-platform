export interface PlanetColors {
  light: string;
  mid: string;
  dark: string;
}

export interface SurfaceSpot {
  lat: number;
  lon: number;
  size: number;
  alpha: number;
  color: string;
}

export interface PlanetRing {
  inner: number;
  outer: number;
  color: string;
}

export interface Planet {
  id: string;
  name: string;
  orbit: number;
  radius: number;
  orbitalSpeed: number;
  spinSpeed: number;
  startAngle: number;
  colors: PlanetColors;
  atmosphere: string;
  spots: SurfaceSpot[];
  ring?: PlanetRing;
}

export const ORBIT_TILT = 0.45;

export const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    orbit: 0.2,
    radius: 4,
    orbitalSpeed: 0.9,
    spinSpeed: 0.2,
    startAngle: 0.4,
    colors: { light: '#f1ece4', mid: '#a39a8f', dark: '#2f2b27' },
    atmosphere: '200, 190, 175',
    spots: [
      { lat: 0.2, lon: 0.5, size: 0.25, alpha: 0.5, color: '#5c554d' },
      { lat: -0.4, lon: 2.2, size: 0.2, alpha: 0.4, color: '#5c554d' },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    orbit: 0.28,
    radius: 7,
    orbitalSpeed: 0.62,
    spinSpeed: 0.12,
    startAngle: 1.6,
    colors: { light: '#fff4d6', mid: '#e3b86b', dark: '#7a5526' },
    atmosphere: '255, 214, 140',
    spots: [
      { lat: 0.1, lon: 1, size: 0.35, alpha: 0.35, color: '#fff8e6' },
      { lat: -0.3, lon: 3.5, size: 0.3, alpha: 0.3, color: '#fff8e6' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    orbit: 0.36,
    radius: 7.5,
    orbitalSpeed: 0.5,
    spinSpeed: 0.6,
    startAngle: 2.7,
    colors: { light: '#a5f3fc', mid: '#1e6fa0', dark: '#062a40' },
    atmosphere: '96, 200, 255',
    spots: [
      { lat: 0.3, lon: 0.8, size: 0.3, alpha: 0.7, color: '#4ade80' },
      { lat: -0.4, lon: 3.2, size: 0.25, alpha: 0.7, color: '#4ade80' },
      { lat: 0.1, lon: 4.6, size: 0.4, alpha: 0.5, color: '#e8f4f8' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    orbit: 0.44,
    radius: 5.5,
    orbitalSpeed: 0.4,
    spinSpeed: 0.5,
    startAngle: 3.8,
    colors: { light: '#fdba74', mid: '#c2410c', dark: '#451a06' },
    atmosphere: '255, 140, 90',
    spots: [
      { lat: 0.4, lon: 1.5, size: 0.22, alpha: 0.5, color: '#7c2d12' },
      { lat: -0.2, lon: 4, size: 0.3, alpha: 0.4, color: '#f5e6d3' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    orbit: 0.56,
    radius: 16,
    orbitalSpeed: 0.22,
    spinSpeed: 0.9,
    startAngle: 0.9,
    colors: { light: '#f7e7c6', mid: '#c69a6b', dark: '#4d2f1c' },
    atmosphere: '240, 200, 160',
    spots: [
      { lat: 0.25, lon: 0, size: 0.5, alpha: 0.35, color: '#8a5a3a' },
      { lat: -0.2, lon: 2.5, size: 0.6, alpha: 0.3, color: '#8a5a3a' },
      { lat: -0.35, lon: 4.2, size: 0.25, alpha: 0.7, color: '#d9573b' },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    orbit: 0.68,
    radius: 13,
    orbitalSpeed: 0.16,
    spinSpeed: 0.7,
    startAngle: 5,
    colors: { light: '#fbf0cf', mid: '#d4af6a', dark: '#5a4320' },
    atmosphere: '250, 220, 160',
    spots: [
      { lat: 0.2, lon: 1, size: 0.45, alpha: 0.3, color: '#a07c3e' },
      { lat: -0.25, lon: 3.5, size: 0.4, alpha: 0.25, color: '#a07c3e' },
    ],
    ring: { inner: 1.35, outer: 2.2, color: '232, 205, 150' },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    orbit: 0.8,
    radius: 10,
    orbitalSpeed: 0.11,
    spinSpeed: 0.4,
    startAngle: 2.2,
    colors: { light: '#e0faff', mid: '#7fd3df', dark: '#1b5a66' },
    atmosphere: '140, 240, 250',
    spots: [{ lat: 0.3, lon: 2, size: 0.3, alpha: 0.25, color: '#c8f4fb' }],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    orbit: 0.92,
    radius: 9.5,
    orbitalSpeed: 0.09,
    spinSpeed: 0.45,
    startAngle: 4.4,
    colors: { light: '#a8c4ff', mid: '#2f5bd1', dark: '#0a1c4f' },
    atmosphere: '90, 140, 255',
    spots: [
      { lat: -0.3, lon: 1.2, size: 0.35, alpha: 0.5, color: '#0b2a7a' },
      { lat: 0.2, lon: 4, size: 0.2, alpha: 0.6, color: '#e8f0ff' },
    ],
  },
];
