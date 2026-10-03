export interface Destination {
  id: string;
  label: string;
  season: string;
  weatherTemp: string;
  weatherCondition: string;
  weatherIcon: string;
}

export interface RentalItem {
  id: string;
  name: string;
  weight: number; // kg saved by renting
  icon: string;
}

export const destinations: Destination[] = [
  {
    id: 'london-autumn',
    label: 'London in Autumn',
    season: 'Autumn',
    weatherTemp: '12°C',
    weatherCondition: 'Crisp & Cloudy',
    weatherIcon: 'cloud',
  },
  {
    id: 'tokyo-spring',
    label: 'Tokyo in Spring',
    season: 'Spring',
    weatherTemp: '18°C',
    weatherCondition: 'Mild & Sunny',
    weatherIcon: 'sun',
  },
  {
    id: 'beijing-winter',
    label: 'Beijing in Winter',
    season: 'Winter',
    weatherTemp: '-2°C',
    weatherCondition: 'Cold & Dry',
    weatherIcon: 'snow',
  },
  {
    id: 'paris-summer',
    label: 'Paris in Summer',
    season: 'Summer',
    weatherTemp: '26°C',
    weatherCondition: 'Warm & Breezy',
    weatherIcon: 'sun',
  },
];

export const rentalItems: RentalItem[] = [
  { id: 'jacket', name: 'Wool Overcoat', weight: 2.4, icon: 'coat' },
  { id: 'boots', name: 'Leather Boots', weight: 1.8, icon: 'boot' },
  { id: 'knit', name: 'Cashmere Knitwear Set', weight: 0.9, icon: 'shirt' },
  { id: 'scarf', name: 'Merino Scarf & Gloves', weight: 0.5, icon: 'scarf' },
  { id: 'camera', name: 'Analog Film Camera', weight: 1.2, icon: 'camera' },
  { id: 'rain', name: 'Trench Rain Shell', weight: 1.1, icon: 'rain' },
];
