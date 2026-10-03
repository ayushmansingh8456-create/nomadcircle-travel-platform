export interface HotelRoom {
  id: string;
  name: string;
  image: string;
  specs: string;
  priceModifier: number;
}

export interface PartnerHotel {
  id: string;
  name: string;
  rating: number;
  category: string;
  image: string;
  gallery: string[];
  amenities: string[];
  rooms: HotelRoom[];
}

export interface DishPhoto {
  id: string;
  label: string;
  image: string;
}

export interface DiningInfo {
  mealsIncluded: string;
  dinnerExperiences: string;
  dietaryOptions: string[];
  dishPhotos: DishPhoto[];
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  badge?: string;
}

export const partnerHotels: PartnerHotel[] = [
  {
    id: 'hotel-boutique',
    name: 'Maison Lumière Boutique',
    rating: 4,
    category: '4-Star Boutique Hotel',
    image: 'https://images.pexels.com/photos/10039662/pexels-photo-10039662.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    gallery: [
      'https://images.pexels.com/photos/10039662/pexels-photo-10039662.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/15793217/pexels-photo-15793217.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/15797359/pexels-photo-15797359.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/20508608/pexels-photo-20508608.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    ],
    amenities: ['Free High-Speed Wi-Fi', 'Rooftop Pool', 'Daily Breakfast Included', '24/7 Concierge', 'Spa Access'],
    rooms: [
      { id: 'room-standard', name: 'Standard Double', image: 'https://images.pexels.com/photos/15793217/pexels-photo-15793217.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'Queen bed · 28m² · City view', priceModifier: 0 },
      { id: 'room-deluxe', name: 'Deluxe King Suite', image: 'https://images.pexels.com/photos/15797359/pexels-photo-15797359.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'King bed · 42m² · Pool view', priceModifier: 120 },
      { id: 'room-penthouse', name: 'Rooftop Penthouse', image: 'https://images.pexels.com/photos/20508608/pexels-photo-20508608.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'King bed · 65m² · Panoramic terrace', priceModifier: 280 },
    ],
  },
  {
    id: 'hotel-ecolodge',
    name: 'Selva Verde Eco-Lodge',
    rating: 5,
    category: '5-Star Eco-Lodge',
    image: 'https://images.pexels.com/photos/1571003163979-3192998pexels-photo-1571003163979.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    gallery: [
      'https://images.pexels.com/photos/1571003163979-3192998pexels-photo-1571003163979.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/3223541/pexels-photo-3223541.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
      'https://images.pexels.com/photos/3073614/pexels-photo-3073614.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    ],
    amenities: ['Solar-Powered Suites', 'Organic Breakfast', 'Rainforest Deck', 'Yoga Pavilion', 'Private Waterfall Access'],
    rooms: [
      { id: 'eco-standard', name: 'Garden Casita', image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'Double bed · 30m² · Garden view', priceModifier: 0 },
      { id: 'eco-deluxe', name: 'Canopy Suite', image: 'https://images.pexels.com/photos/3223541/pexels-photo-3223541.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'King bed · 48m² · Treetop balcony', priceModifier: 150 },
      { id: 'eco-villa', name: 'River Villa', image: 'https://images.pexels.com/photos/3073614/pexels-photo-3073614.jpeg?auto=compress&cs=tinysrgb&h=300&w=400', specs: 'King + sofa · 70m² · Private plunge pool', priceModifier: 320 },
    ],
  },
];

export const diningInfo: DiningInfo = {
  mealsIncluded: 'Daily Breakfast & 3 Curated Dinner Experiences',
  dinnerExperiences: 'Farm-to-table tasting menu · Waterfront sunset dinner · Traditional home-cooked feast',
  dietaryOptions: ['Vegan', 'Vegetarian', 'Halal', 'Gluten-Free'],
  dishPhotos: [
    { id: 'dish-1', label: 'Farm-to-Table Tasting', image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&h=300&w=400' },
    { id: 'dish-2', label: 'Sunset Seafood Grill', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&h=300&w=400' },
    { id: 'dish-3', label: 'Local Street Feast', image: 'https://images.pexels.com/photos/739449/pexels-photo-739449.jpeg?auto=compress&cs=tinysrgb&h=300&w=400' },
    { id: 'dish-4', label: 'Artisan Dessert', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&h=300&w=400' },
  ],
};

export const addOnOptions: AddOnOption[] = [
  {
    id: 'airport-vip',
    name: 'VIP Airport Pick-up & Drop-off',
    description: 'Complimentary luxury sprinter transfer with flight tracking. Enter your flight details below.',
    price: 45,
  },
  {
    id: 'pool-party',
    name: 'Pool Party & Sunset Social Pass',
    description: 'Exclusive rooftop pool party with DJ set, sunset cocktails, and crew networking.',
    price: 65,
    image: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&h=300&w=400',
    badge: 'Most Popular',
  },
  {
    id: 'night-market',
    name: 'Night Market Food Crawl',
    description: 'Guided after-hours street food tour through the city\'s most vibrant night markets.',
    price: 35,
    image: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&h=300&w=400',
  },
  {
    id: 'boat-cruise',
    name: 'Private Boat Cruise',
    description: 'Half-day private charter with snorkeling stops, lunch on deck, and unlimited refreshments.',
    price: 120,
    image: 'https://images.pexels.com/photos/1010656/pexels-photo-1010656.jpeg?auto=compress&cs=tinysrgb&h=300&w=400',
  },
];
