import { useState } from 'react';
import { Camera, ArrowLeft, MapPin, Sparkles, Check, ShoppingBag, Shirt, Layers } from 'lucide-react';
import { wardrobeCountries, type WardrobeCountry } from '@/data/wardrobe';
import { getOutfitSetsByCountry, type OutfitSet } from '@/data/wardrobeData';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import VirtualFittingRoomModal from './VirtualFittingRoomModal';

const accentGlow: Record<string, { border: string; shadow: string; text: string; bg: string; gradient: string }> = {
  turquoise: {
    border: 'border-turquoise-400/30',
    shadow: 'hover:shadow-glow-turquoise',
    text: 'text-turquoise-300',
    bg: 'bg-turquoise-500/10',
    gradient: 'from-turquoise-500/20 to-transparent',
  },
  coral: {
    border: 'border-coral-400/30',
    shadow: 'hover:shadow-glow-coral',
    text: 'text-coral-400',
    bg: 'bg-coral-500/10',
    gradient: 'from-coral-500/20 to-transparent',
  },
  gold: {
    border: 'border-gold-400/30',
    shadow: 'hover:shadow-glow-gold',
    text: 'text-gold-400',
    bg: 'bg-gold-500/10',
    gradient: 'from-gold-500/20 to-transparent',
  },
};

export default function DestinationWardrobe() {
  const [selectedCountry, setSelectedCountry] = useState<WardrobeCountry | null>(null);
  const [fittingOutfitId, setFittingOutfitId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { format } = useCurrency();

  if (selectedCountry) {
    const accent = accentGlow[selectedCountry.accent];
    const countryOutfits = getOutfitSetsByCountry(selectedCountry.id);

    // Build a merged display list: wardrobe items that have matching outfit sets get the set,
    // items without a matching set still show as individual cards.
    const displayItems = selectedCountry.items.map((item) => {
      const matchingSet = countryOutfits.find(
        (s) => s.setName === item.name || s.basePrice === item.price
      );
      return { item, outfitSet: matchingSet };
    });

    return (
      <>
        <section id="wardrobe" className="relative py-20 lg:py-28 bg-obsidian-900">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {/* Back button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="group inline-flex items-center gap-2 mb-8 text-sm font-semibold text-diamond-300 hover:text-turquoise-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to all destinations
            </button>

            {/* Country header */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 lg:mb-14">
              <div className="relative rounded-xl3 overflow-hidden h-64 lg:h-72 lg:w-2/5 border border-slate-700/40 shadow-soft-md">
                <img
                  src={selectedCountry.image}
                  alt={selectedCountry.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className={`w-4 h-4 ${accent.text}`} />
                    <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${accent.text}`}>{selectedCountry.tagline}</span>
                  </div>
                  <h3 className="font-serif text-3xl font-semibold text-diamond-100">{selectedCountry.name}</h3>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-lg text-diamond-300 leading-relaxed mb-4">{selectedCountry.description}</p>
                <div className="flex items-center gap-2 text-sm text-diamond-400">
                  <Camera className={`w-4 h-4 ${accent.text}`} />
                  <span>{selectedCountry.items.length} curated photo-ready fits</span>
                </div>
              </div>
            </div>

            {/* Clothing grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {displayItems.map(({ item, outfitSet }) => (
                <article
                  key={item.id}
                  className={`group relative flex flex-col rounded-xl3 overflow-hidden bg-slate-950 border ${accent.border} ${accent.shadow} transition-all duration-500 hover:-translate-y-1.5`}
                >
                  {/* Image */}
                  <div className="relative h-72 sm:h-80 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    {/* Photo-Ready badge */}
                    <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${accent.bg} ${accent.text} text-[10px] font-bold uppercase tracking-wide border ${accent.border} backdrop-blur-sm`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                      Photo-Ready Fit
                    </div>
                    {outfitSet && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-turquoise-500/15 text-turquoise-300 text-[9px] font-bold uppercase tracking-wide border border-turquoise-400/30 backdrop-blur-sm">
                        <Layers className="w-3 h-3" />
                        {outfitSet.garments.length} Pieces
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h4 className="font-serif text-lg font-semibold text-diamond-100 mb-2 leading-tight group-hover:text-turquoise-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm text-diamond-400 leading-relaxed mb-4 flex-1">{item.description}</p>

                    {/* Garment chips if outfit set exists */}
                    {outfitSet && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {outfitSet.garments.map((g) => (
                          <span
                            key={g.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-obsidian-800 border border-slate-700/40 text-[9px] font-semibold text-diamond-400"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: g.swatchColor }} />
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold block">Rent from</span>
                        <span className="text-xl font-bold text-diamond-100">{format(item.price)}<span className="text-xs text-diamond-500"> /trip</span></span>
                      </div>
                      <button
                        onClick={() => addToCart({
                          id: item.id,
                          name: item.name,
                          subtitle: `${selectedCountry.name} · ${selectedCountry.tagline}`,
                          price: item.price,
                          image: item.image,
                        })}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full ${accent.bg} ${accent.text} text-sm font-bold border ${accent.border} hover:bg-turquoise-500 hover:text-obsidian-950 hover:border-turquoise-400 transition-all duration-300`}
                      >
                        <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                        Add to Bag
                      </button>
                    </div>

                    {/* Try On Outfit button — only if outfit set exists */}
                    {outfitSet && (
                      <button
                        onClick={() => setFittingOutfitId(outfitSet.id)}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 text-turquoise-300 text-sm font-bold border border-turquoise-400/20 hover:bg-turquoise-500/10 hover:border-turquoise-400/40 transition-all duration-300"
                      >
                        <Shirt className="w-4 h-4" strokeWidth={2.5} />
                        Try On Outfit
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Virtual Fitting Room Modal */}
        {fittingOutfitId && (
          <VirtualFittingRoomModal
            outfitSetId={fittingOutfitId}
            onClose={() => setFittingOutfitId(null)}
          />
        )}
      </>
    );
  }

  return (
    <section id="wardrobe" className="relative py-20 lg:py-28 bg-obsidian-900">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gold-500/5 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-400">The Destination Wardrobe</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-diamond-100 leading-[1.1] text-balance max-w-3xl mx-auto">
            Rent the Vibe.
            <br />
            <span className="italic text-turquoise-400">Take Your Own Flawless Photos.</span>
          </h2>
          <p className="mt-5 text-diamond-400 max-w-xl mx-auto leading-relaxed">
            Pick a country, browse our photo-ready rental collection, and arrive with outfits designed to look stunning against that destination's iconic backdrops.
          </p>
        </div>

        {/* Country grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {wardrobeCountries.map((country) => {
            const accent = accentGlow[country.accent];
            return (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country)}
                className={`group relative flex flex-col rounded-xl3 overflow-hidden bg-slate-950 border ${accent.border} ${accent.shadow} transition-all duration-500 hover:-translate-y-2 text-left`}
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${accent.gradient} from-slate-950 via-slate-950/30 to-transparent`} />
                  {/* Sparkle accent */}
                  <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${accent.bg} ${accent.text} text-[10px] font-bold uppercase tracking-wide border ${accent.border} backdrop-blur-sm`}>
                    <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                    {country.items.length} Fits
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-4 h-4 ${accent.text}`} />
                    <span className={`text-xs uppercase tracking-[0.15em] font-semibold ${accent.text}`}>{country.tagline}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-diamond-100 mb-2 group-hover:text-turquoise-300 transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-sm text-diamond-400 leading-relaxed mb-4">{country.description}</p>
                  <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${accent.text} group-hover:gap-2.5 transition-all`}>
                    Explore Collection
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
