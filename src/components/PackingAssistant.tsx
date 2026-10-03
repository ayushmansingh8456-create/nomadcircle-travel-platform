import { useMemo, useState } from 'react';
import {
  Luggage, Cloud, Sun, Snowflake, CloudRain, Check, Plus, Sparkles,
  Shirt, Umbrella, Camera, Footprints, Wind, Hand, TrendingDown, Scale,
} from 'lucide-react';
import { destinations, rentalItems } from '@/data/packing';
import { useCurrency } from '@/context/CurrencyContext';

const weatherIcons: Record<string, typeof Cloud> = {
  cloud: Cloud,
  sun: Sun,
  snow: Snowflake,
  rain: CloudRain,
};

const itemIcons: Record<string, typeof Shirt> = {
  coat: Wind,
  boot: Footprints,
  shirt: Shirt,
  scarf: Hand,
  camera: Camera,
  rain: Umbrella,
};

const MAX_LUGGAGE_KG = 23;

export default function PackingAssistant() {
  const [selectedDestId, setSelectedDestId] = useState(destinations[0].id);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(['jacket', 'boots', 'knit']));
  const { format } = useCurrency();

  const destination = destinations.find((d) => d.id === selectedDestId)!;

  const { savedWeight, savedPercent, savedFee } = useMemo(() => {
    const weight = rentalItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.weight, 0);
    const percent = Math.min(Math.round((weight / MAX_LUGGAGE_KG) * 100), 100);
    const fee = Math.round(weight * 65);
    return { savedWeight: weight, savedPercent: percent, savedFee: fee };
  }, [selectedItems]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const WeatherIcon = weatherIcons[destination.weatherIcon] ?? Cloud;

  return (
    <section className="relative py-20 lg:py-28 bg-obsidian-950">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-turquoise-500/8 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-400">Pack Less, Wander More</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
            The AI Smart Packing Assistant
          </h2>
          <p className="mt-3 text-diamond-400 max-w-xl mx-auto">
            Pick a destination, choose what to rent from our Thrift Boutique, and watch your luggage shrink. Less weight, fewer fees, more freedom.
          </p>
        </div>

        {/* Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Destination + Weather */}
          <div className="lg:col-span-4 space-y-5">
            {/* Destination selector */}
            <div className="rounded-xl3 bg-slate-950 border border-turquoise-400/20 shadow-soft-md p-5">
              <h3 className="text-sm font-bold text-diamond-100 mb-1">Choose your trip</h3>
              <p className="text-[11px] text-diamond-500 mb-4">Select a destination and season</p>
              <div className="space-y-2">
                {destinations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDestId(d.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                      selectedDestId === d.id
                        ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                        : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selectedDestId === d.id ? 'text-turquoise-300' : 'text-diamond-200'}`}>
                      {d.label}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      selectedDestId === d.id ? 'bg-turquoise-500 text-obsidian-950' : 'bg-slate-700 text-diamond-400'
                    }`}>
                      {d.season}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather card */}
            <div className="rounded-xl3 bg-gradient-to-br from-slate-950 to-turquoise-500/5 border border-turquoise-400/20 shadow-soft-md p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-4 h-4 text-turquoise-400" />
                <h3 className="text-sm font-bold text-diamond-100">Weather Forecast</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-obsidian-800/80 flex items-center justify-center shadow-soft border border-turquoise-400/20">
                  <WeatherIcon className="w-8 h-8 text-turquoise-400" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-diamond-100 font-serif">{destination.weatherTemp}</p>
                  <p className="text-sm text-diamond-400">{destination.weatherCondition}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/40">
                <p className="text-[11px] text-diamond-400 leading-relaxed">
                  Based on the forecast, our AI recommends renting layered pieces. You'll stay comfortable without stuffing your suitcase.
                </p>
              </div>
            </div>
          </div>

          {/* Center: Rental checklist */}
          <div className="lg:col-span-4">
            <div className="rounded-xl3 bg-slate-950 border border-turquoise-400/20 shadow-soft-md p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Shirt className="w-4 h-4 text-turquoise-400" />
                <h3 className="text-sm font-bold text-diamond-100">Expert-Designed Rental Items</h3>
              </div>
              <p className="text-[11px] text-diamond-500 mb-4">Tap to select what you'd rent instead of pack</p>
              <div className="space-y-2 flex-1">
                {rentalItems.map((item) => {
                  const selected = selectedItems.has(item.id);
                  const Icon = itemIcons[item.icon] ?? Shirt;
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                        selected
                          ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                          : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        selected ? 'bg-turquoise-500' : 'bg-slate-700/50'
                      }`}>
                        <Icon className={`w-4 h-4 ${selected ? 'text-obsidian-950' : 'text-diamond-500'}`} strokeWidth={2} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${selected ? 'text-turquoise-300' : 'text-diamond-100'}`}>{item.name}</p>
                        <p className="text-[11px] text-diamond-500">Saves {item.weight} kg</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        selected ? 'bg-mint-500' : 'bg-slate-700/60 border border-slate-600'
                      }`}>
                        {selected && <Check className="w-3.5 h-3.5 text-obsidian-950" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Luggage visual */}
          <div className="lg:col-span-4">
            <div className="rounded-xl3 bg-slate-950 border border-turquoise-400/20 shadow-soft-md p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Luggage className="w-4 h-4 text-turquoise-400" />
                <h3 className="text-sm font-bold text-diamond-100">Your Luggage Impact</h3>
              </div>
              <p className="text-[11px] text-diamond-500 mb-5">See how much space you've saved</p>

              {/* Luggage graphic */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-40 mb-4">
                  {/* Suitcase body */}
                  <div className="absolute inset-x-0 bottom-0 h-32 rounded-xl2 bg-obsidian-800 border-2 border-slate-700/60 overflow-hidden">
                    {/* Fill level */}
                    <div
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-turquoise-500 to-turquoise-300 transition-all duration-700"
                      style={{ height: `${100 - savedPercent}%` }}
                    />
                    {/* Dashed line at saved level */}
                    <div
                      className="absolute inset-x-0 border-t-2 border-dashed border-coral-400/60 transition-all duration-700"
                      style={{ bottom: `${savedPercent}%` }}
                    />
                  </div>
                  {/* Handle */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-t-lg border-2 border-slate-600 border-b-0" />
                  {/* Label tag */}
                  <div className="absolute -right-2 top-10 px-2 py-0.5 rounded bg-coral-500 text-white text-[9px] font-bold shadow-glow-coral whitespace-nowrap">
                    -{savedPercent}%
                  </div>
                </div>

                {/* Saved meter */}
                <div className="w-full mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-diamond-100">Saved Luggage Space</span>
                    <span className="font-bold text-turquoise-400">{savedPercent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-obsidian-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-mint-400 to-turquoise-400 transition-all duration-700"
                      style={{ width: `${savedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-obsidian-800 border border-slate-700/40 p-3 text-center">
                    <Scale className="w-4 h-4 text-turquoise-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-diamond-100">{savedWeight.toFixed(1)} kg</p>
                    <p className="text-[10px] text-diamond-500 font-medium">Weight saved</p>
                  </div>
                  <div className="rounded-xl bg-obsidian-800 border border-slate-700/40 p-3 text-center">
                    <TrendingDown className="w-4 h-4 text-coral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-diamond-100">{format(savedFee)}</p>
                    <p className="text-[10px] text-diamond-500 font-medium">Fees avoided</p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-4 pt-4 border-t border-slate-700/40">
                <p className="text-[11px] text-diamond-400 leading-relaxed">
                  <span className="font-semibold text-turquoise-300">How it works:</span> Renting clothes from the Thrift Boutique at your destination means you pack lighter, skip airline overage fees, and still arrive in curated style.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl3 bg-gradient-to-r from-turquoise-600 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-obsidian-950/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-obsidian-950" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold">Ready to pack light?</p>
              <p className="text-xs text-obsidian-950/70">Browse the Thrift Boutique and reserve your rental wardrobe.</p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-obsidian-950 text-turquoise-300 text-sm font-bold hover:bg-obsidian-900 transition-colors whitespace-nowrap">
            Browse Rentals
          </button>
        </div>
      </div>
    </section>
  );
}
