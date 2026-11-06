import { useState } from 'react';
import {
  Backpack, Check, Cloud, Plus, Shirt, Snowflake, Sparkles, Sun, Wind, X, Luggage, Scale, Tag, ArrowRight,
} from 'lucide-react';
import { boutiqueItems } from '@/data/boutique';
import {
  capsuleDestinations, capsuleRoles, capsulePieces, CAPSULE_SIZE, MAX_LUGGAGE_KG, type CapsuleRole,
} from '@/data/capsule';
import { useCheckout } from '@/context/CheckoutContext';
import { useCurrency } from '@/context/CurrencyContext';

const weatherIcons: Record<string, typeof Cloud> = {
  cloud: Cloud,
  sun: Sun,
  snow: Snowflake,
};

const roleIcons: Record<CapsuleRole, typeof Shirt> = {
  top: Shirt,
  outer: Wind,
  gear: Backpack,
};

const pieces = capsulePieces.flatMap((piece) => {
  const item = boutiqueItems.find((b) => b.id === piece.boutiqueId);
  return item ? [{ ...piece, item }] : [];
});

export default function NomadCapsuleBuilder() {
  const { format } = useCurrency();
  const { openCheckout } = useCheckout();
  const [destId, setDestId] = useState(capsuleDestinations[0].id);
  const [selectedIds, setSelectedIds] = useState<string[]>(capsuleDestinations[0].starterIds);
  const [notice, setNotice] = useState<string | null>(null);

  const destination = capsuleDestinations.find((d) => d.id === destId) ?? capsuleDestinations[0];
  const WeatherIcon = weatherIcons[destination.weatherIcon] ?? Cloud;

  const selectedPieces = pieces.filter((p) => selectedIds.includes(p.boutiqueId));
  const isComplete = selectedPieces.length === CAPSULE_SIZE;
  const weightSaved = selectedPieces.reduce((sum, p) => sum + p.weightKg, 0);
  const luggagePercent = Math.min(Math.round((weightSaved / MAX_LUGGAGE_KG) * 100), 100);
  const rentalTotal = selectedPieces.reduce((sum, p) => sum + p.item.price, 0);

  const selectDestination = (id: string) => {
    const next = capsuleDestinations.find((d) => d.id === id) ?? capsuleDestinations[0];
    setDestId(next.id);
    setSelectedIds(next.starterIds);
    setNotice(null);
  };

  const togglePiece = (id: string) => {
    setNotice(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= CAPSULE_SIZE) {
      setNotice(`Your capsule is full at ${CAPSULE_SIZE} pieces. Remove one to make room.`);
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  const handleRent = () => {
    if (!isComplete) return;
    openCheckout({
      type: 'wardrobe',
      title: `Nomad Capsule · ${destination.label}`,
      subtitle: selectedPieces.map((p) => p.item.title).join(', '),
      price: rentalTotal,
      image: selectedPieces[0]?.item.image ?? '',
    });
  };

  const slots = Array.from({ length: CAPSULE_SIZE }, (_, i) => selectedPieces[i] ?? null);

  return (
    <section className="relative py-20 lg:py-28 bg-obsidian-950 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-turquoise-500/8 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-400">Pack Less, Wander More</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
            The Nomad Capsule Wardrobe Builder
          </h2>
          <p className="mt-3 text-diamond-400 max-w-xl mx-auto">
            Build a five-piece wardrobe for your destination from the Thrift Boutique. Less weight, fewer fees, and outfits that already fit the trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Destination */}
          <div className="lg:col-span-3">
            <div className="rounded-xl3 bg-slate-950/70 backdrop-blur-xl border border-turquoise-400/20 shadow-soft-md p-5 h-full flex flex-col">
              <h3 className="text-sm font-bold text-diamond-100 mb-1">Choose your trip</h3>
              <p className="text-[11px] text-diamond-500 mb-4">Picking a destination loads its starter capsule</p>
              <div className="space-y-2">
                {capsuleDestinations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => selectDestination(d.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                      destId === d.id
                        ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                        : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold text-left ${destId === d.id ? 'text-turquoise-300' : 'text-diamond-200'}`}>
                      {d.label}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      destId === d.id ? 'bg-turquoise-500 text-obsidian-950' : 'bg-slate-700 text-diamond-400'
                    }`}>
                      {d.season}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-5 border-t border-slate-700/40 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-obsidian-800 border border-turquoise-400/20 flex items-center justify-center shrink-0">
                  <WeatherIcon className="w-5 h-5 text-turquoise-400" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-lg font-bold text-diamond-100 font-serif leading-none">{destination.weatherTemp}</p>
                  <p className="text-[11px] text-diamond-400 mt-1">{destination.weatherCondition}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-5">
            <div className="rounded-xl3 bg-slate-950/70 backdrop-blur-xl border border-turquoise-400/20 shadow-soft-md p-5 sm:p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-diamond-100">Your Capsule</h3>
                  <p className="text-[11px] text-diamond-500">{selectedPieces.length} of {CAPSULE_SIZE} pieces chosen</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                  isComplete ? 'bg-mint-500/15 text-mint-400' : 'bg-slate-700/60 text-diamond-400'
                }`}>
                  {isComplete ? 'Capsule complete' : 'In progress'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {slots.map((piece, i) =>
                  piece ? (
                    <div
                      key={piece.boutiqueId}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-turquoise-400/30 shadow-glow-turquoise animate-fade-in"
                    >
                      <img src={piece.item.image} alt={piece.item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <p className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-diamond-100 leading-tight line-clamp-2">
                        {piece.item.title}
                      </p>
                      <button
                        onClick={() => togglePiece(piece.boutiqueId)}
                        aria-label={`Remove ${piece.item.title}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-950/80 border border-slate-600 flex items-center justify-center text-diamond-300 hover:text-coral-400 hover:border-coral-400/50 transition-all duration-300"
                      >
                        <X className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={`empty-${i}`}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700/60 flex flex-col items-center justify-center text-diamond-600"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[9px] uppercase tracking-wider mt-1 font-semibold">Slot {i + 1}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-4 min-h-[16px] text-[11px] text-coral-400 font-semibold">{notice}</div>

              <div className="mt-auto pt-4 border-t border-slate-700/40 grid grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-obsidian-800 border border-slate-700/40 p-3 text-center">
                  <Scale className="w-4 h-4 text-turquoise-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-diamond-100">{weightSaved.toFixed(1)} kg</p>
                  <p className="text-[10px] text-diamond-500 font-medium">Weight saved</p>
                </div>
                <div className="rounded-xl bg-obsidian-800 border border-slate-700/40 p-3 text-center">
                  <Luggage className="w-4 h-4 text-turquoise-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-diamond-100">{luggagePercent}%</p>
                  <p className="text-[10px] text-diamond-500 font-medium">Luggage freed</p>
                </div>
                <div className="rounded-xl bg-obsidian-800 border border-slate-700/40 p-3 text-center">
                  <Tag className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-diamond-100">{format(rentalTotal)}</p>
                  <p className="text-[10px] text-diamond-500 font-medium">Rental total</p>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-obsidian-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mint-400 to-turquoise-400 transition-all duration-700"
                  style={{ width: `${luggagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Library */}
          <div className="lg:col-span-4">
            <div className="rounded-xl3 bg-slate-950/70 backdrop-blur-xl border border-turquoise-400/20 shadow-soft-md p-5 h-full">
              <h3 className="text-sm font-bold text-diamond-100 mb-1">Thrift Boutique Pieces</h3>
              <p className="text-[11px] text-diamond-500 mb-4">Tap a piece to add it to your capsule</p>
              <div className="space-y-5">
                {capsuleRoles.map((role) => {
                  const RoleIcon = roleIcons[role.id];
                  const rolePieces = pieces.filter((p) => p.role === role.id);
                  return (
                    <div key={role.id}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <RoleIcon className="w-3.5 h-3.5 text-turquoise-400" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-diamond-400">{role.label}</span>
                      </div>
                      <div className="space-y-2">
                        {rolePieces.map((p) => {
                          const selected = selectedIds.includes(p.boutiqueId);
                          return (
                            <button
                              key={p.boutiqueId}
                              onClick={() => togglePiece(p.boutiqueId)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 text-left ${
                                selected
                                  ? 'bg-turquoise-500/10 border-turquoise-400/40'
                                  : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                              }`}
                            >
                              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
                                <img src={p.item.image} alt={p.item.title} loading="lazy" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold truncate ${selected ? 'text-turquoise-300' : 'text-diamond-100'}`}>{p.item.title}</p>
                                <p className="text-[11px] text-diamond-500">{format(p.item.price)} · saves {p.weightKg} kg</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                selected ? 'bg-mint-500' : 'bg-slate-700/60 border border-slate-600'
                              }`}>
                                {selected && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Rent CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl3 bg-gradient-to-r from-turquoise-600 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise">
          <div>
            <p className="text-sm font-bold">{isComplete ? `${destination.label} capsule ready` : `Add ${CAPSULE_SIZE - selectedPieces.length} more ${CAPSULE_SIZE - selectedPieces.length === 1 ? 'piece' : 'pieces'} to finish`}</p>
            <p className="text-xs text-obsidian-950/70">{weightSaved.toFixed(1)} kg saved · {format(rentalTotal)} for the full set</p>
          </div>
          <button
            onClick={handleRent}
            disabled={!isComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian-950 text-turquoise-300 text-sm font-bold hover:bg-obsidian-900 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rent This Capsule
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
