export interface WardrobeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface WardrobeCountry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: 'turquoise' | 'coral' | 'gold';
  items: WardrobeItem[];
}

export const wardrobeCountries: WardrobeCountry[] = [
  {
    id: 'egypt',
    name: 'Egypt',
    tagline: 'Linen & Desert Neutrals',
    description: 'Lightweight linen sets and desert-toned neutrals that look incredible against the Pyramids.',
    image: 'https://images.pexels.com/photos/18291196/pexels-photo-18291196.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'gold',
    items: [
      {
        id: 'eg-1',
        name: 'Sahara Linen Set',
        description: 'Breathable two-piece linen suit in warm sand tones. Perfect for golden-hour pyramid shots.',
        price: 48,
        image: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'eg-2',
        name: 'Desert Drape Shirt',
        description: 'Flowing neutral shirt that catches the wind beautifully against ancient backdrops.',
        price: 32,
        image: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'eg-3',
        name: 'Nile Cotton Collection',
        description: 'A curated bundle of earth-toned linen pieces for a full desert capsule wardrobe.',
        price: 65,
        image: 'https://images.pexels.com/photos/6461477/pexels-photo-6461477.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    id: 'france',
    name: 'France',
    tagline: 'Parisian Chic Layers',
    description: 'Classic trench coats, chic berets, and elegant monochrome layering for Parisian streets.',
    image: 'https://images.pexels.com/photos/17501700/pexels-photo-17501700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'turquoise',
    items: [
      {
        id: 'fr-1',
        name: 'Parisian Trench & Beret',
        description: 'Timeless beige trench coat paired with a classic red beret. Made for cafe-side portraits.',
        price: 72,
        image: 'https://images.pexels.com/photos/13832945/pexels-photo-13832945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'fr-2',
        name: 'Monochrome Layered Look',
        description: 'Effortless black-and-cream layering combo that pops against Haussmann architecture.',
        price: 58,
        image: 'https://images.pexels.com/photos/5671029/pexels-photo-5671029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'fr-3',
        name: 'Rive Gauche Coat Dress',
        description: 'A structured brown coat and beret combo for that unmistakable Parisian silhouette.',
        price: 64,
        image: 'https://images.pexels.com/photos/7184262/pexels-photo-7184262.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    id: 'india',
    name: 'India',
    tagline: 'Vibrant Ethnic Fusion',
    description: 'Vibrant, colorful modern ethnic fusion wear that contrasts beautifully with majestic palaces.',
    image: 'https://images.pexels.com/photos/14702568/pexels-photo-14702568.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'coral',
    items: [
      {
        id: 'in-1',
        name: 'Saree & Denim Fusion',
        description: 'A bold modern saree paired with a denim jacket — heritage meets street style by palace doors.',
        price: 54,
        image: 'https://images.pexels.com/photos/34751178/pexels-photo-34751178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'in-2',
        name: 'Festival Color Set',
        description: 'Two vibrant traditional outfits in jewel tones that glow against marble architecture.',
        price: 46,
        image: 'https://images.pexels.com/photos/7685588/pexels-photo-7685588.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'in-3',
        name: 'Mandala Art Drape',
        description: 'A contemporary drape with projected mandala art — a living contrast of old and new.',
        price: 38,
        image: 'https://images.pexels.com/photos/7541545/pexels-photo-7541545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    id: 'brazil',
    name: 'Brazil',
    tagline: 'Sunlit Beach Vibrance',
    description: 'Bold, sun-drenched dresses and breezy resort wear made for golden beach portraits.',
    image: 'https://images.pexels.com/photos/6822721/pexels-photo-6822721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'coral',
    items: [
      {
        id: 'br-1',
        name: 'Sunset Yellow Dress',
        description: 'A flowing yellow dress that catches the Rio sunset — pure magic against Ipanema sands.',
        price: 42,
        image: 'https://images.pexels.com/photos/17464923/pexels-photo-17464923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'br-2',
        name: 'Tangerine Beach Gown',
        description: 'Vibrant orange gown made for golden-hour beach walks. Photogenic from every angle.',
        price: 44,
        image: 'https://images.pexels.com/photos/17464929/pexels-photo-17464929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'br-3',
        name: 'Coastal Red Sundress',
        description: 'A breezy red sundress that pops against turquoise waters and sandy shores.',
        price: 36,
        image: 'https://images.pexels.com/photos/27084085/pexels-photo-27084085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    tagline: 'Coastal Casual Cool',
    description: 'Effortless coastal-chic outfits and breezy adventure wear for harbor-side and outback shots.',
    image: 'https://images.pexels.com/photos/5707634/pexels-photo-5707634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'turquoise',
    items: [
      {
        id: 'au-1',
        name: 'Bondi Summer Set',
        description: 'Casual sandals and a breezy outfit for effortless beach-to-bar transitions.',
        price: 34,
        image: 'https://images.pexels.com/photos/2067123/pexels-photo-2067123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'au-2',
        name: 'Gold Coast Adventurer',
        description: 'A backpack-ready outfit for sunset coastal walks. Rugged, relaxed, camera-ready.',
        price: 40,
        image: 'https://images.pexels.com/photos/2404935/pexels-photo-2404935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'au-3',
        name: 'Harbor Summer Flatlay',
        description: 'A complete warm-weather capsule: espadrilles, light layers, and seaside accessories.',
        price: 52,
        image: 'https://images.pexels.com/photos/38570359/pexels-photo-38570359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    tagline: 'Alpine Luxury Puffers',
    description: 'Premium, high-end puffer jackets and alpine knitwear perfect for snowy mountain backdrops.',
    image: 'https://images.pexels.com/photos/38367977/pexels-photo-38367977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'turquoise',
    items: [
      {
        id: 'ch-1',
        name: 'Alpine Puffer & Knit Set',
        description: 'A premium white puffer jacket with knit accessories. Made for snowy mountain portraits.',
        price: 78,
        image: 'https://images.pexels.com/photos/33312366/pexels-photo-33312366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'ch-2',
        name: 'Jungfrau Winter Bundle',
        description: 'Warm layered outfit with mittens and coat — cozy and cinematic against alpine peaks.',
        price: 68,
        image: 'https://images.pexels.com/photos/20621669/pexels-photo-20621669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
      {
        id: 'ch-3',
        name: 'Snow Drift Puffer Duo',
        description: 'Two premium puffer jackets and knitted caps for matching travel-partner photos.',
        price: 84,
        image: 'https://images.pexels.com/photos/7026776/pexels-photo-7026776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      },
    ],
  },
];
