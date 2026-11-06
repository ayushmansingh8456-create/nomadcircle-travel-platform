export type CapsuleRole = 'top' | 'outer' | 'gear';

export interface CapsulePiece {
  boutiqueId: string;
  role: CapsuleRole;
  weightKg: number;
}

export interface CapsuleDestination {
  id: string;
  label: string;
  season: string;
  weatherTemp: string;
  weatherCondition: string;
  weatherIcon: string;
  starterIds: string[];
}

export const capsuleRoles: { id: CapsuleRole; label: string }[] = [
  { id: 'top', label: 'Tops' },
  { id: 'outer', label: 'Outer Layers' },
  { id: 'gear', label: 'Gear' },
];

export const CAPSULE_SIZE = 5;
export const MAX_LUGGAGE_KG = 23;

export const capsulePieces: CapsulePiece[] = [
  { boutiqueId: 'thrift-rack', role: 'top', weightKg: 0.6 },
  { boutiqueId: 'denim-overshirt', role: 'top', weightKg: 0.7 },
  { boutiqueId: 'vintage-jacket', role: 'outer', weightKg: 2.4 },
  { boutiqueId: 'nomad-wool-blanket', role: 'outer', weightKg: 1.8 },
  { boutiqueId: 'canvas-backpack', role: 'gear', weightKg: 1.6 },
  { boutiqueId: 'leather-pack', role: 'gear', weightKg: 1.9 },
  { boutiqueId: 'retro-camera', role: 'gear', weightKg: 1.2 },
  { boutiqueId: 'brass-compass', role: 'gear', weightKg: 0.1 },
  { boutiqueId: 'vinyl-browse', role: 'gear', weightKg: 1.0 },
];

export const capsuleDestinations: CapsuleDestination[] = [
  {
    id: 'london-autumn',
    label: 'London in Autumn',
    season: 'Autumn',
    weatherTemp: '12°C',
    weatherCondition: 'Crisp & Cloudy',
    weatherIcon: 'cloud',
    starterIds: ['vintage-jacket', 'denim-overshirt', 'thrift-rack', 'nomad-wool-blanket', 'canvas-backpack'],
  },
  {
    id: 'tokyo-spring',
    label: 'Tokyo in Spring',
    season: 'Spring',
    weatherTemp: '18°C',
    weatherCondition: 'Mild & Sunny',
    weatherIcon: 'sun',
    starterIds: ['denim-overshirt', 'thrift-rack', 'canvas-backpack', 'retro-camera', 'brass-compass'],
  },
  {
    id: 'beijing-winter',
    label: 'Beijing in Winter',
    season: 'Winter',
    weatherTemp: '-2°C',
    weatherCondition: 'Cold & Dry',
    weatherIcon: 'snow',
    starterIds: ['vintage-jacket', 'nomad-wool-blanket', 'thrift-rack', 'leather-pack', 'brass-compass'],
  },
  {
    id: 'paris-summer',
    label: 'Paris in Summer',
    season: 'Summer',
    weatherTemp: '26°C',
    weatherCondition: 'Warm & Breezy',
    weatherIcon: 'sun',
    starterIds: ['denim-overshirt', 'thrift-rack', 'canvas-backpack', 'retro-camera', 'vinyl-browse'],
  },
];
