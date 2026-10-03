export interface BoutiqueVariant {
  name: string;
  price: number;
}

export interface BoutiqueItem {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: string;
  image: string;
  badge?: string;
  variants?: BoutiqueVariant[];
}

export const boutiqueItems: BoutiqueItem[] = [
  {
    id: 'vintage-jacket',
    title: 'Retro Explorer Field Jacket',
    category: 'Outerwear',
    price: 89,
    condition: 'Excellent',
    image: 'https://images.pexels.com/photos/6068971/pexels-photo-6068971.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Staff Pick',
    variants: [
      { name: '90s Olive Military Canvas Jacket', price: 89 },
      { name: 'Tan Mountain Khaki Parka', price: 75 },
      { name: 'Distressed Heavy Utility Chore Coat', price: 110 },
    ],
  },
  {
    id: 'canvas-backpack',
    title: 'Worn Canvas Travel Backpack',
    category: 'Carry',
    price: 64,
    condition: 'Good',
    image: 'https://images.pexels.com/photos/9630186/pexels-photo-9630186.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Bestseller',
  },
  {
    id: 'leather-pack',
    title: 'Vintage Leather Daypack',
    category: 'Carry',
    price: 112,
    condition: 'Excellent',
    image: 'https://images.pexels.com/photos/15749010/pexels-photo-15749010.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    variants: [
      { name: 'Italian Tanned Leather Rucksack', price: 112 },
      { name: 'Distressed Saddle-Brown Daypack', price: 95 },
      { name: 'Minimalist Black Leather Satchel', price: 145 },
    ],
  },
  {
    id: 'thrift-rack',
    title: 'Curated Thrift Bundle',
    category: 'Apparel',
    price: 48,
    condition: 'Good',
    image: 'https://images.pexels.com/photos/6068952/pexels-photo-6068952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'retro-camera',
    title: 'Analog Film Camera Set',
    category: 'Gear',
    price: 156,
    condition: 'Excellent',
    image: 'https://images.pexels.com/photos/33156934/pexels-photo-33156934.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Rare Find',
    variants: [
      { name: 'Canon AE-1 Program (Excellent condition)', price: 156 },
      { name: 'Olympus OM-1 Mechanical Classic', price: 130 },
      { name: 'Leica M3 Premium Vintage', price: 290 },
    ],
  },
  {
    id: 'vinyl-browse',
    title: 'Travel Vinyl Record Bundle',
    category: 'Music',
    price: 72,
    condition: 'Good',
    image: 'https://images.pexels.com/photos/6068974/pexels-photo-6068974.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];
