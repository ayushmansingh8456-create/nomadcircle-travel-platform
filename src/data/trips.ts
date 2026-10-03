export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  dates: string;
  duration: string;
  filled: number;
  capacity: number;
  price: number;
  image: string;
  tags: string[];
}

export const trips: Trip[] = [
  {
    id: 'tokyo-anime',
    title: 'Tokyo Anime & Nightlife',
    destination: 'Tokyo',
    country: 'Japan',
    dates: 'Nov 14 — Nov 23, 2026',
    duration: '9 days',
    filled: 8,
    capacity: 12,
    price: 2490,
    image: 'https://images.pexels.com/photos/30780336/pexels-photo-30780336.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Anime', 'Nightlife', 'Food'],
  },
  {
    id: 'london-imperial',
    title: 'London Imperial Culture',
    destination: 'London',
    country: 'England',
    dates: 'Dec 2 — Dec 9, 2026',
    duration: '7 days',
    filled: 10,
    capacity: 14,
    price: 2190,
    image: 'https://images.pexels.com/photos/10872818/pexels-photo-10872818.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Culture', 'History', 'Theatre'],
  },
  {
    id: 'beijing-heritage',
    title: 'Beijing Historic Heritage',
    destination: 'Beijing',
    country: 'China',
    dates: 'Oct 18 — Oct 28, 2026',
    duration: '10 days',
    filled: 6,
    capacity: 12,
    price: 1990,
    image: 'https://images.pexels.com/photos/6054842/pexels-photo-6054842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Heritage', 'Architecture', 'Cuisine'],
  },
  {
    id: 'egypt-stargazing',
    title: 'Pyramids & Desert Stargazing',
    destination: 'Egypt',
    country: 'Egypt',
    dates: 'Dec 12 — Dec 20, 2026',
    duration: '8 days',
    filled: 5,
    capacity: 12,
    price: 2290,
    image: 'https://images.pexels.com/photos/262786/pexels-photo-262786.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['History', 'Adventure', 'Stargazing'],
  },
  {
    id: 'india-palaces',
    title: 'Majestic Palaces & Spice Trails',
    destination: 'India',
    country: 'India',
    dates: 'Jan 10 — Jan 21, 2027',
    duration: '11 days',
    filled: 9,
    capacity: 12,
    price: 1850,
    image: 'https://images.pexels.com/photos/19160099/pexels-photo-19160099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Culture', 'Cuisine', 'Architecture'],
  },
  {
    id: 'france-riviera',
    title: 'Parisian Art & Riviera Escape',
    destination: 'France',
    country: 'France',
    dates: 'May 05 — May 14, 2027',
    duration: '9 days',
    filled: 4,
    capacity: 10,
    price: 2690,
    image: 'https://images.pexels.com/photos/31401510/pexels-photo-31401510.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Art', 'Luxury', 'Seaside'],
  },
];
