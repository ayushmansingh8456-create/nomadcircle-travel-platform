export interface AvatarModel {
  id: string;
  name: string;
  gender: 'male' | 'female';
  skinTone: 'light' | 'dark';
  imageUrl: string;
}

export interface WardrobeGarment {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'outerwear';
  price: number;
  image: string;
  swatchColor: string;
}

export interface OutfitSet {
  id: string;
  countryId: string;
  countryName: string;
  setName: string;
  description: string;
  basePrice: number;
  image: string;
  garments: WardrobeGarment[];
}

export interface FittingBackdrop {
  id: string;
  label: string;
  location: string;
  image: string;
}

// ============================================================
// Avatar models — male/female, light/dark skin tones
// ============================================================

export const avatarModels: AvatarModel[] = [
  {
    id: 'avatar-f-light',
    name: 'Sofia',
    gender: 'female',
    skinTone: 'light',
    imageUrl: 'https://images.pexels.com/photos/22223042/pexels-photo-22223042.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  },
  {
    id: 'avatar-f-dark',
    name: 'Amani',
    gender: 'female',
    skinTone: 'dark',
    imageUrl: 'https://images.pexels.com/photos/27542890/pexels-photo-27542890.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  },
  {
    id: 'avatar-m-light',
    name: 'Lucas',
    gender: 'male',
    skinTone: 'light',
    imageUrl: 'https://images.pexels.com/photos/6211660/pexels-photo-6211660.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  },
  {
    id: 'avatar-m-dark',
    name: 'Marcus',
    gender: 'male',
    skinTone: 'dark',
    imageUrl: 'https://images.pexels.com/photos/16711103/pexels-photo-16711103.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  },
];

// ============================================================
// Destination backdrops
// ============================================================

export const fittingBackdrops: FittingBackdrop[] = [
  { id: 'pyramids', label: 'Pyramids of Giza', location: 'Cairo, Egypt', image: 'https://images.pexels.com/photos/17742559/pexels-photo-17742559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 'eiffel', label: 'Eiffel Tower', location: 'Paris, France', image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-eiffel-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 'shibuya', label: 'Shibuya Crossing', location: 'Tokyo, Japan', image: 'https://images.pexels.com/photos/16105947/pexels-photo-16105947.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 'santorini', label: 'Santorini Coast', location: 'Cyclades, Greece', image: 'https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 'bondi', label: 'Bondi Beach', location: 'Sydney, Australia', image: 'https://images.pexels.com/photos/173980/pexels-photo-173980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 'alps', label: 'Swiss Alps', location: 'Lauterbrunnen, Switzerland', image: 'https://images.pexels.com/photos/12763653/pexels-photo-12763653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

// ============================================================
// Outfit sets with individual garments per category
// ============================================================

export const outfitSets: OutfitSet[] = [
  {
    id: 'eg-sahara-linen',
    countryId: 'egypt',
    countryName: 'Egypt',
    setName: 'Sahara Linen Set',
    description: 'Breathable two-piece linen suit in warm sand tones. Perfect for golden-hour pyramid shots.',
    basePrice: 48,
    image: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'eg-linen-shirt-1', name: 'Sahara Linen Shirt', category: 'top', price: 22, image: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#D4B896' },
      { id: 'eg-linen-pants-1', name: 'Desert Linen Trousers', category: 'bottom', price: 18, image: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8D5B7' },
      { id: 'eg-dune-vest-1', name: 'Dune Linen Vest', category: 'outerwear', price: 12, image: 'https://images.pexels.com/photos/6461477/pexels-photo-6461477.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#C9A96E' },
    ],
  },
  {
    id: 'eg-desert-drape',
    countryId: 'egypt',
    countryName: 'Egypt',
    setName: 'Desert Drape Shirt',
    description: 'Flowing neutral shirt that catches the wind beautifully against ancient backdrops.',
    basePrice: 32,
    image: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'eg-drape-shirt-1', name: 'Desert Drape Shirt', category: 'top', price: 20, image: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8D5B7' },
      { id: 'eg-cotton-pants-1', name: 'Nile Cotton Pants', category: 'bottom', price: 12, image: 'https://images.pexels.com/photos/6461477/pexels-photo-6461477.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#D4B896' },
    ],
  },
  {
    id: 'fr-trench-beret',
    countryId: 'france',
    countryName: 'France',
    setName: 'Parisian Trench & Beret',
    description: 'Timeless beige trench coat paired with a classic red beret. Made for cafe-side portraits.',
    basePrice: 72,
    image: 'https://images.pexels.com/photos/13832945/pexels-photo-13832945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'fr-silk-blouse-1', name: 'Rive Gauche Silk Blouse', category: 'top', price: 24, image: 'https://images.pexels.com/photos/13832945/pexels-photo-13832945.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#C9A96E' },
      { id: 'fr-pleated-skirt-1', name: 'Parisian Pleated Skirt', category: 'bottom', price: 22, image: 'https://images.pexels.com/photos/7184262/pexels-photo-7184262.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#6B5D4F' },
      { id: 'fr-trench-coat-1', name: 'Classic Beige Trench', category: 'outerwear', price: 26, image: 'https://images.pexels.com/photos/13832945/pexels-photo-13832945.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#C9A96E' },
    ],
  },
  {
    id: 'fr-mono-layered',
    countryId: 'france',
    countryName: 'France',
    setName: 'Monochrome Layered Look',
    description: 'Effortless black-and-cream layering combo that pops against Haussmann architecture.',
    basePrice: 58,
    image: 'https://images.pexels.com/photos/5671029/pexels-photo-5671029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'fr-knit-sweater-1', name: 'Cream Knit Sweater', category: 'top', price: 22, image: 'https://images.pexels.com/photos/5671029/pexels-photo-5671029.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#F5F0E8' },
      { id: 'fr-black-trousers-1', name: 'Tailored Black Trousers', category: 'bottom', price: 20, image: 'https://images.pexels.com/photos/7184262/pexels-photo-7184262.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#2A2A2E' },
      { id: 'fr-wool-overcoat-1', name: 'Wool Overcoat', category: 'outerwear', price: 16, image: 'https://images.pexels.com/photos/7184262/pexels-photo-7184262.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#5C4A3A' },
    ],
  },
  {
    id: 'in-saree-denim',
    countryId: 'india',
    countryName: 'India',
    setName: 'Saree & Denim Fusion',
    description: 'A bold modern saree paired with a denim jacket — heritage meets street style by palace doors.',
    basePrice: 54,
    image: 'https://images.pexels.com/photos/34751178/pexels-photo-34751178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'in-saree-blouse-1', name: 'Festival Saree Blouse', category: 'top', price: 24, image: 'https://images.pexels.com/photos/7685588/pexels-photo-7685588.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#C73E5A' },
      { id: 'in-saree-drape-1', name: 'Jewel-Tone Saree Drape', category: 'bottom', price: 18, image: 'https://images.pexels.com/photos/7685588/pexels-photo-7685588.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#7B3F8C' },
      { id: 'in-denim-jacket-1', name: 'Indigo Denim Jacket', category: 'outerwear', price: 12, image: 'https://images.pexels.com/photos/34751178/pexels-photo-34751178.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#4A6FA5' },
    ],
  },
  {
    id: 'in-festival-color',
    countryId: 'india',
    countryName: 'India',
    setName: 'Festival Color Set',
    description: 'Two vibrant traditional outfits in jewel tones that glow against marble architecture.',
    basePrice: 46,
    image: 'https://images.pexels.com/photos/7685588/pexels-photo-7685588.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'in-festival-top-1', name: 'Mandala Print Top', category: 'top', price: 20, image: 'https://images.pexels.com/photos/7541545/pexels-photo-7541545.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8552D' },
      { id: 'in-festival-pants-1', name: 'Marble White Palazzo', category: 'bottom', price: 16, image: 'https://images.pexels.com/photos/7541545/pexels-photo-7541545.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#F0EDE5' },
      { id: 'in-festival-shawl-1', name: 'Embroidered Shawl', category: 'outerwear', price: 10, image: 'https://images.pexels.com/photos/34751178/pexels-photo-34751178.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#C73E5A' },
    ],
  },
  {
    id: 'br-sunset-dress',
    countryId: 'brazil',
    countryName: 'Brazil',
    setName: 'Sunset Yellow Dress',
    description: 'A flowing yellow dress that catches the Rio sunset — pure magic against Ipanema sands.',
    basePrice: 42,
    image: 'https://images.pexels.com/photos/17464923/pexels-photo-17464923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'br-yellow-dress-1', name: 'Sunset Yellow Dress', category: 'top', price: 28, image: 'https://images.pexels.com/photos/17464923/pexels-photo-17464923.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8C547' },
      { id: 'br-sandals-1', name: 'Beach Sandals Set', category: 'bottom', price: 14, image: 'https://images.pexels.com/photos/2067123/pexels-photo-2067123.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#D4A04C' },
    ],
  },
  {
    id: 'br-tangerine-gown',
    countryId: 'brazil',
    countryName: 'Brazil',
    setName: 'Tangerine Beach Gown',
    description: 'Vibrant orange gown made for golden-hour beach walks. Photogenic from every angle.',
    basePrice: 44,
    image: 'https://images.pexels.com/photos/17464929/pexels-photo-17464929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'br-tangerine-gown-1', name: 'Tangerine Beach Gown', category: 'top', price: 30, image: 'https://images.pexels.com/photos/17464929/pexels-photo-17464929.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#FF6B4A' },
      { id: 'br-coastal-sarong-1', name: 'Coastal Sarong Wrap', category: 'bottom', price: 14, image: 'https://images.pexels.com/photos/27084085/pexels-photo-27084085.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8552D' },
    ],
  },
  {
    id: 'au-bondi-set',
    countryId: 'australia',
    countryName: 'Australia',
    setName: 'Bondi Summer Set',
    description: 'Casual sandals and a breezy outfit for effortless beach-to-bar transitions.',
    basePrice: 34,
    image: 'https://images.pexels.com/photos/2067123/pexels-photo-2067123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'au-bondi-top-1', name: 'Bondi Breezy Tee', category: 'top', price: 14, image: 'https://images.pexels.com/photos/2067123/pexels-photo-2067123.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#5EEAD4' },
      { id: 'au-bondi-shorts-1', name: 'Coastal Linen Shorts', category: 'bottom', price: 12, image: 'https://images.pexels.com/photos/2404935/pexels-photo-2404935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#B5A695' },
      { id: 'au-bondi-shirt-1', name: 'Open Linen Overshirt', category: 'outerwear', price: 8, image: 'https://images.pexels.com/photos/2404935/pexels-photo-2404935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#7BA098' },
    ],
  },
  {
    id: 'au-gold-coast',
    countryId: 'australia',
    countryName: 'Australia',
    setName: 'Gold Coast Adventurer',
    description: 'A backpack-ready outfit for sunset coastal walks. Rugged, relaxed, camera-ready.',
    basePrice: 40,
    image: 'https://images.pexels.com/photos/2404935/pexels-photo-2404935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'au-adventure-top-1', name: 'Adventure Cargo Top', category: 'top', price: 16, image: 'https://images.pexels.com/photos/2404935/pexels-photo-2404935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#6B7B5A' },
      { id: 'au-adventure-pants-1', name: 'Trail Cargo Pants', category: 'bottom', price: 16, image: 'https://images.pexels.com/photos/2067123/pexels-photo-2067123.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#4A5D3A' },
      { id: 'au-adventure-jacket-1', name: 'Windbreaker Shell', category: 'outerwear', price: 8, image: 'https://images.pexels.com/photos/38570359/pexels-photo-38570359.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#3D6B8C' },
    ],
  },
  {
    id: 'ch-alpine-puffer',
    countryId: 'switzerland',
    countryName: 'Switzerland',
    setName: 'Alpine Puffer & Knit Set',
    description: 'A premium white puffer jacket with knit accessories. Made for snowy mountain portraits.',
    basePrice: 78,
    image: 'https://images.pexels.com/photos/33312366/pexels-photo-33312366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'ch-knit-base-1', name: 'Merino Knit Base Layer', category: 'top', price: 24, image: 'https://images.pexels.com/photos/20621669/pexels-photo-20621669.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#E8D5B7' },
      { id: 'ch-ski-pants-1', name: 'Insulated Ski Pants', category: 'bottom', price: 22, image: 'https://images.pexels.com/photos/20621669/pexels-photo-20621669.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#2A2A2E' },
      { id: 'ch-puffer-jacket-1', name: 'Alpine White Puffer', category: 'outerwear', price: 32, image: 'https://images.pexels.com/photos/33312366/pexels-photo-33312366.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#F5F5F7' },
    ],
  },
  {
    id: 'ch-jungfrau-bundle',
    countryId: 'switzerland',
    countryName: 'Switzerland',
    setName: 'Jungfrau Winter Bundle',
    description: 'Warm layered outfit with mittens and coat — cozy and cinematic against alpine peaks.',
    basePrice: 68,
    image: 'https://images.pexels.com/photos/20621669/pexels-photo-20621669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    garments: [
      { id: 'ch-jungfrau-top-1', name: 'Thermal Long-Sleeve', category: 'top', price: 20, image: 'https://images.pexels.com/photos/20621669/pexels-photo-20621669.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#5C6B7A' },
      { id: 'ch-jungfrau-pants-1', name: 'Fleece-Lined Pants', category: 'bottom', price: 22, image: 'https://images.pexels.com/photos/7026776/pexels-photo-7026776.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#3D3D42' },
      { id: 'ch-jungfrau-coat-1', name: 'Quilted Winter Coat', category: 'outerwear', price: 26, image: 'https://images.pexels.com/photos/7026776/pexels-photo-7026776.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', swatchColor: '#1A3A5C' },
    ],
  },
];

export const layerOrder: Array<'outerwear' | 'top' | 'bottom'> = ['outerwear', 'top', 'bottom'];

export const layerLabels: Record<'top' | 'bottom' | 'outerwear', string> = {
  top: 'Tops',
  bottom: 'Bottoms',
  outerwear: 'Outerwear',
};

// ============================================================
// 3D Environment presets — studio + destination backdrops
// ============================================================

export interface Environment3D {
  id: string;
  label: string;
  description: string;
  // Background color (top hemisphere)
  bgColor: string;
  // Floor color
  floorColor: string;
  // Accent light color
  accentLight: string;
  // Ambient light intensity
  ambientIntensity: number;
  // Fog color + density
  fogColor: string;
  fogNear: number;
  fogFar: number;
  // Whether to show a sun/moon disc
  sunColor: string;
  sunPosition: [number, number, number];
}

export const environments3D: Environment3D[] = [
  {
    id: 'studio',
    label: 'Studio',
    description: 'Glowing studio with soft key + rim lighting',
    bgColor: '#0B0C10',
    floorColor: '#14161E',
    accentLight: '#00D9D0',
    ambientIntensity: 0.45,
    fogColor: '#0B0C10',
    fogNear: 8,
    fogFar: 22,
    sunColor: '#5EEAD4',
    sunPosition: [3, 5, 2],
  },
  {
    id: 'beach-sunset',
    label: 'Beach Sunset',
    description: 'Warm golden-hour beach with orange rim light',
    bgColor: '#1A0F0A',
    floorColor: '#2D1F14',
    accentLight: '#FF6B4A',
    ambientIntensity: 0.5,
    fogColor: '#1A0F0A',
    fogNear: 10,
    fogFar: 28,
    sunColor: '#FFB347',
    sunPosition: [5, 3, -2],
  },
  {
    id: 'tokyo-street',
    label: 'Tokyo Street',
    description: 'Neon-lit night street with turquoise glow',
    bgColor: '#0A0A14',
    floorColor: '#16162A',
    accentLight: '#00D9D0',
    ambientIntensity: 0.35,
    fogColor: '#0A0A14',
    fogNear: 7,
    fogFar: 20,
    sunColor: '#5EEAD4',
    sunPosition: [0, 4, 3],
  },
  {
    id: 'luxury-resort',
    label: 'Luxury Resort',
    description: 'Elegant warm-toned resort ambiance',
    bgColor: '#0F0E12',
    floorColor: '#1E1C24',
    accentLight: '#F5B820',
    ambientIntensity: 0.55,
    fogColor: '#0F0E12',
    fogNear: 9,
    fogFar: 25,
    sunColor: '#F5D674',
    sunPosition: [2, 6, 1],
  },
];

export function getEnvironment3DById(id: string): Environment3D {
  return environments3D.find((e) => e.id === id) ?? environments3D[0];
}

// ============================================================
// 3D Avatar body dimensions per gender
// ============================================================

export interface BodyProportions {
  shoulderWidth: number;
  shoulderRadius: number;
  torsoHeight: number;
  torsoRadiusTop: number;
  torsoRadiusBottom: number;
  hipWidth: number;
  hipHeight: number;
  legLength: number;
  legRadius: number;
  armLength: number;
  armRadius: number;
  neckHeight: number;
  neckRadius: number;
  headRadius: number;
}

export const bodyProportions: Record<'male' | 'female', BodyProportions> = {
  male: {
    shoulderWidth: 1.4,
    shoulderRadius: 0.28,
    torsoHeight: 1.3,
    torsoRadiusTop: 0.42,
    torsoRadiusBottom: 0.36,
    hipWidth: 1.2,
    hipHeight: 0.35,
    legLength: 1.6,
    legRadius: 0.22,
    armLength: 1.5,
    armRadius: 0.14,
    neckHeight: 0.22,
    neckRadius: 0.14,
    headRadius: 0.32,
  },
  female: {
    shoulderWidth: 1.15,
    shoulderRadius: 0.24,
    torsoHeight: 1.15,
    torsoRadiusTop: 0.32,
    torsoRadiusBottom: 0.38,
    hipWidth: 1.1,
    hipHeight: 0.32,
    legLength: 1.65,
    legRadius: 0.19,
    armLength: 1.4,
    armRadius: 0.11,
    neckHeight: 0.2,
    neckRadius: 0.12,
    headRadius: 0.29,
  },
};

// Skin tone materials
export const skinToneColors: Record<'light' | 'dark', { skin: string; skinEmissive: string }> = {
  light: { skin: '#F0D0B0', skinEmissive: '#3A2A1A' },
  dark: { skin: '#8D6B52', skinEmissive: '#2A1A0F' },
};

export function getOutfitSetById(id: string): OutfitSet | undefined {
  return outfitSets.find((s) => s.id === id);
}

export function getOutfitSetsByCountry(countryId: string): OutfitSet[] {
  return outfitSets.filter((s) => s.countryId === countryId);
}
