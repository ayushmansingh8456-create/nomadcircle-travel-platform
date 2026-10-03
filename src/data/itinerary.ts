export type ActivityCategory = 'Food' | 'Culture' | 'Shopping' | 'Nightlife' | 'Sightseeing' | 'Adventure';

export interface ItineraryActivity {
  id: string;
  day: number;
  title: string;
  category: ActivityCategory;
  cost: number; // USD
  suggestedBy: string;
  votes: number;
}

export const categoryStyles: Record<ActivityCategory, { text: string; bg: string; border: string; dot: string }> = {
  Food: {
    text: 'text-coral-400',
    bg: 'bg-coral-500/10',
    border: 'border-coral-400/30',
    dot: 'bg-coral-500',
  },
  Culture: {
    text: 'text-turquoise-300',
    bg: 'bg-turquoise-500/10',
    border: 'border-turquoise-400/30',
    dot: 'bg-turquoise-400',
  },
  Shopping: {
    text: 'text-gold-400',
    bg: 'bg-gold-500/10',
    border: 'border-gold-400/30',
    dot: 'bg-gold-500',
  },
  Nightlife: {
    text: 'text-mint-400',
    bg: 'bg-mint-500/10',
    border: 'border-mint-400/30',
    dot: 'bg-mint-500',
  },
  Sightseeing: {
    text: 'text-turquoise-300',
    bg: 'bg-turquoise-500/10',
    border: 'border-turquoise-400/30',
    dot: 'bg-turquoise-400',
  },
  Adventure: {
    text: 'text-coral-400',
    bg: 'bg-coral-500/10',
    border: 'border-coral-400/30',
    dot: 'bg-coral-500',
  },
};

export const categoryList: ActivityCategory[] = ['Food', 'Culture', 'Shopping', 'Nightlife', 'Sightseeing', 'Adventure'];

export const seedActivities: ItineraryActivity[] = [
  { id: 'a1', day: 1, title: 'Arrival Pint at Hotel Bar', category: 'Nightlife', cost: 25, suggestedBy: 'Marcus Reed', votes: 5 },
  { id: 'a2', day: 1, title: 'Welcome Dinner in Soho', category: 'Food', cost: 60, suggestedBy: 'Marcus Reed', votes: 6 },
  { id: 'a3', day: 2, title: 'Camden Vintage Market', category: 'Shopping', cost: 40, suggestedBy: 'Priya Sharma', votes: 7 },
  { id: 'a4', day: 2, title: 'Sketch Afternoon Tea', category: 'Food', cost: 55, suggestedBy: 'Marcus Reed', votes: 8 },
  { id: 'a5', day: 2, title: 'Stroll through Westminster', category: 'Sightseeing', cost: 0, suggestedBy: 'Lena Brandt', votes: 4 },
  { id: 'a6', day: 3, title: 'Tower Bridge Golden Hour Photo Walk', category: 'Sightseeing', cost: 0, suggestedBy: 'David Okafor', votes: 6 },
  { id: 'a7', day: 3, title: 'Borough Market Food Crawl', category: 'Food', cost: 35, suggestedBy: 'Aiko Tanaka', votes: 5 },
  { id: 'a8', day: 4, title: 'British Museum Deep Dive', category: 'Culture', cost: 0, suggestedBy: 'Lena Brandt', votes: 3 },
  { id: 'a9', day: 4, title: 'Shoreditch Street Art Tour', category: 'Culture', cost: 20, suggestedBy: 'Sam Whitfield', votes: 4 },
  { id: 'a10', day: 5, title: 'Thames Sunset Cruise', category: 'Sightseeing', cost: 30, suggestedBy: 'Priya Sharma', votes: 6 },
  { id: 'a11', day: 5, title: 'Brick Lane Curry Night', category: 'Food', cost: 25, suggestedBy: 'Aiko Tanaka', votes: 5 },
  { id: 'a12', day: 6, title: 'Hyde Park Morning Run', category: 'Adventure', cost: 0, suggestedBy: 'David Okafor', votes: 2 },
  { id: 'a13', day: 6, title: 'Harrods Shopping Spree', category: 'Shopping', cost: 100, suggestedBy: 'Priya Sharma', votes: 3 },
  { id: 'a14', day: 7, title: 'Farewell Brunch at Dishoom', category: 'Food', cost: 30, suggestedBy: 'Marcus Reed', votes: 7 },
  { id: 'a15', day: 7, title: 'Departure & Goodbyes', category: 'Sightseeing', cost: 0, suggestedBy: 'Marcus Reed', votes: 4 },
];

export const dayLabels: string[] = [
  'Day 1 — Arrival',
  'Day 2 — Camden & Tea',
  'Day 3 — Tower Bridge',
  'Day 4 — Museums & Art',
  'Day 5 — Thames & Curry',
  'Day 6 — Parks & Shopping',
  'Day 7 — Farewell',
];
