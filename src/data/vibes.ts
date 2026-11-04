export type VibeId = 'neon' | 'imperial' | 'desert' | 'coastal';
export type Pace = 'relaxed' | 'fast';

export interface VibeSelection {
  vibe: VibeId;
  pace: Pace;
}

export interface Vibe {
  id: VibeId;
  label: string;
  destination: string;
  image: string;
  moods: string[];
  tripIds: string[];
  wardrobeCountryIds: string[];
  thriftIds: string[];
}

export interface Archetype {
  name: string;
  description: string;
}

export const vibeOrder: VibeId[] = ['neon', 'imperial', 'desert', 'coastal'];

export const vibes: Record<VibeId, Vibe> = {
  neon: {
    id: 'neon',
    label: 'Neon & Cyberpunk',
    destination: 'Tokyo, Japan',
    image: 'https://images.pexels.com/photos/30780336/pexels-photo-30780336.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    moods: ['Nightlife', 'Electric', 'Anime'],
    tripIds: ['tokyo-anime'],
    wardrobeCountryIds: [],
    thriftIds: ['retro-camera', 'vinyl-browse'],
  },
  imperial: {
    id: 'imperial',
    label: 'Imperial Gold',
    destination: 'London, England',
    image: 'https://images.pexels.com/photos/10872818/pexels-photo-10872818.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    moods: ['Culture', 'History', 'Theatre'],
    tripIds: ['london-imperial'],
    wardrobeCountryIds: ['france'],
    thriftIds: ['vintage-jacket', 'leather-pack'],
  },
  desert: {
    id: 'desert',
    label: 'Desert Dune Luxury',
    destination: 'Cairo, Egypt',
    image: 'https://images.pexels.com/photos/18291196/pexels-photo-18291196.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    moods: ['Linen', 'Stargazing', 'Ancient'],
    tripIds: ['egypt-stargazing', 'india-palaces'],
    wardrobeCountryIds: ['egypt'],
    thriftIds: ['canvas-backpack', 'leather-pack'],
  },
  coastal: {
    id: 'coastal',
    label: 'Coastal Sunset',
    destination: 'Rio de Janeiro, Brazil',
    image: 'https://images.pexels.com/photos/585758/pexels-photo-585758.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    moods: ['Beach', 'Golden Hour', 'Sunlit'],
    tripIds: ['france-riviera'],
    wardrobeCountryIds: ['brazil', 'australia'],
    thriftIds: ['thrift-rack', 'vintage-jacket'],
  },
};

export const paceOptions: { id: Pace; label: string; description: string }[] = [
  {
    id: 'relaxed',
    label: 'Relaxed',
    description: 'Slow mornings, long lunches, and room to wander without a plan.',
  },
  {
    id: 'fast',
    label: 'Fast-paced explorer',
    description: 'Dawn to midnight with a full itinerary and every corner covered.',
  },
];

export const archetypes: Record<VibeId, Record<Pace, Archetype>> = {
  neon: {
    relaxed: {
      name: 'Neon Dreamer',
      description: 'You chase glowing streets at a gentle pace, soaking up the vibe one neon alley at a time.',
    },
    fast: {
      name: 'Night Owl',
      description: 'You are built for the after-dark scene, hopping between arcades, izakayas, and rooftop bars till sunrise.',
    },
  },
  imperial: {
    relaxed: {
      name: 'Culture Collector',
      description: 'You linger in galleries and theatres, adding a new story to your collection with every visit.',
    },
    fast: {
      name: 'Heritage Hunter',
      description: 'You cover every landmark, museum, and hidden history corner in a single, unstoppable day.',
    },
  },
  desert: {
    relaxed: {
      name: 'Dune Romantic',
      description: 'You favor candlelit terraces, linen comfort, and starry nights over a crowded checklist.',
    },
    fast: {
      name: 'Desert Trailblazer',
      description: 'You want the pyramids at dawn, the bazaars at noon, and the dunes under the stars by night.',
    },
  },
  coastal: {
    relaxed: {
      name: 'Golden Hour Drifter',
      description: 'You trade schedules for sunsets, sand between your toes, and long afternoons by the water.',
    },
    fast: {
      name: 'Surf Chaser',
      description: 'You are always in motion, riding waves, exploring beaches, and chasing the next coastline.',
    },
  },
};
