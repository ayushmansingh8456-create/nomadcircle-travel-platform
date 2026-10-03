export interface CohortMember {
  name: string;
  avatar: string;
  archetype: string;
  archetypeColor: string;
}

export interface ItineraryPreview {
  day: number;
  title: string;
  category: string;
}

export interface CohortPin {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  cohortName: string;
  travelersLive: number;
  activity: string;
  members: CohortMember[];
  itinerary: ItineraryPreview[];
}

const avatarPool = [
  'https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/14566062/pexels-photo-14566062.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/1820559/pexels-photo-1820559.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/16869744/pexels-photo-16869744.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/5387923/pexels-photo-5387923.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
];

const archetypePool = [
  { name: 'Foodie', color: 'ember' },
  { name: 'Photographer', color: 'gold' },
  { name: 'Night Owl', color: 'teal' },
  { name: 'History Buff', color: 'teal' },
  { name: 'Adventurer', color: 'ember' },
  { name: 'Music Lover', color: 'gold' },
];

const namePool = [
  'Marcus Reed', 'Aiko Tanaka', 'David Okafor', 'Lena Brandt',
  'Priya Sharma', 'Sam Whitfield', 'Yuki Sato', 'Omar Farouk',
  'Clara Dubois', 'Ravi Patel', 'Sofia Rossi', 'James Chen',
];

function makeMembers(count: number, offset: number): CohortMember[] {
  return Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const idx = (offset + i) % namePool.length;
    const arch = archetypePool[idx % archetypePool.length];
    return {
      name: namePool[idx],
      avatar: avatarPool[idx % avatarPool.length],
      archetype: arch.name,
      archetypeColor: arch.color,
    };
  });
}

export const cohortPins: CohortPin[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    cohortName: 'Tokyo Anime & Nightlife Crew',
    travelersLive: 8,
    activity: 'Exploring Shibuya Crossing',
    members: makeMembers(8, 0),
    itinerary: [
      { day: 1, title: 'Shibuya Crossing Photo Walk', category: 'Sightseeing' },
      { day: 2, title: 'Akihabara Anime District', category: 'Shopping' },
      { day: 3, title: 'Shinjuku Golden GaI Night', category: 'Nightlife' },
    ],
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    cohortName: 'Kyoto Foodie Crew',
    travelersLive: 9,
    activity: 'Nishiki Market food crawl',
    members: makeMembers(9, 2),
    itinerary: [
      { day: 1, title: 'Nishiki Market Food Crawl', category: 'Food' },
      { day: 2, title: 'Fushimi Inari Shrine Hike', category: 'Sightseeing' },
      { day: 3, title: 'Gion Tea Ceremony', category: 'Culture' },
    ],
  },
  {
    id: 'london',
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    cohortName: 'London Imperial Culture Crew',
    travelersLive: 10,
    activity: 'Afternoon tea at Sketch',
    members: makeMembers(10, 0),
    itinerary: [
      { day: 1, title: 'Arrival Pint at Hotel Bar', category: 'Nightlife' },
      { day: 2, title: 'Camden Vintage Market', category: 'Shopping' },
      { day: 2, title: 'Sketch Afternoon Tea', category: 'Food' },
      { day: 3, title: 'Tower Bridge Golden Hour', category: 'Sightseeing' },
    ],
  },
  {
    id: 'beijing',
    city: 'Beijing',
    country: 'China',
    lat: 39.9042,
    lng: 116.4074,
    cohortName: 'Beijing Historic Heritage Crew',
    travelersLive: 6,
    activity: 'Great Wall hike',
    members: makeMembers(6, 4),
    itinerary: [
      { day: 1, title: 'Forbidden City Tour', category: 'Culture' },
      { day: 2, title: 'Great Wall Hike at Mutianyu', category: 'Adventure' },
      { day: 3, title: 'Hutong Food Crawl', category: 'Food' },
    ],
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    cohortName: 'Paris Art & Cafe Crew',
    travelersLive: 7,
    activity: 'Louvre evening tour',
    members: makeMembers(7, 1),
    itinerary: [
      { day: 1, title: 'Louvre Evening Tour', category: 'Culture' },
      { day: 2, title: 'Montmartre Sketch Walk', category: 'Sightseeing' },
      { day: 3, title: 'Le Marais Vintage Shopping', category: 'Shopping' },
    ],
  },
  {
    id: 'cairo',
    city: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    cohortName: 'Cairo Pyramids & Desert Crew',
    travelersLive: 5,
    activity: 'Pyramids of Giza sunset',
    members: makeMembers(5, 3),
    itinerary: [
      { day: 1, title: 'Pyramids of Giza at Sunset', category: 'Sightseeing' },
      { day: 2, title: 'Egyptian Museum Deep Dive', category: 'Culture' },
      { day: 3, title: 'Khan el-Khalili Bazaar', category: 'Shopping' },
    ],
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.006,
    cohortName: 'NYC Street Style Crew',
    travelersLive: 12,
    activity: 'Brooklyn vintage shopping',
    members: makeMembers(12, 5),
    itinerary: [
      { day: 1, title: 'Brooklyn Vintage Shopping', category: 'Shopping' },
      { day: 2, title: 'Central Park Photo Walk', category: 'Sightseeing' },
      { day: 3, title: 'Williamsburg Night Crawl', category: 'Nightlife' },
    ],
  },
];
