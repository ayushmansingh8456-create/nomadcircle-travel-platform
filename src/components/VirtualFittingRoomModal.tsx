import { useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  X, Shirt, Check, ShoppingBag, Layers, MapPin, Sparkles,
  User, RotateCw, Maximize2, Box,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  avatarModels, layerOrder, layerLabels,
  environments3D, getEnvironment3DById,
  getOutfitSetById,
  type WardrobeGarment,
} from '@/data/wardrobeData';
import FittingScene from './fitting/FittingScene';

interface Props {
  outfitSetId: string;
  onClose: () => void;
}

type Gender = 'male' | 'female';
type SkinTone = 'light' | 'dark';
type LayerKey = 'top' | 'bottom' | 'outerwear';

export default function VirtualFittingRoomModal({ outfitSetId, onClose }: Props) {
  const { addToCart, openSidebar } = useCart();
  const { format } = useCurrency();

  const outfit = getOutfitSetById(outfitSetId);

  const [selectedGender, setSelectedGender] = useState<Gender>('female');
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinTone>('light');
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<Set<string>>(new Set());
  const [selectedEnvId, setSelectedEnvId] = useState<string>('studio');
  const [activeCategory, setActiveCategory] = useState<LayerKey>('top');
  const [added, setAdded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (!outfit) return;
    setSelectedGarmentIds(new Set(outfit.garments.map((g) => g.id)));
    // Auto-select matching environment
    const envMap: Record<string, string> = {
      egypt: 'studio', france: 'luxury-resort', india: 'tokyo-street',
      brazil: 'beach-sunset', australia: 'beach-sunset', switzerland: 'studio',
    };
    setSelectedEnvId(envMap[outfit.countryId] ?? 'studio');
  }, [outfit]);

  if (!outfit) return null;

  const currentAvatar = avatarModels.find((a) => a.gender === selectedGender && a.skinTone === selectedSkinTone) ?? avatarModels[0];
  const environment = getEnvironment3DById(selectedEnvId);

  const toggleGarment = useCallback((garment: WardrobeGarment) => {
    setSelectedGarmentIds((prev) => {
      const next = new Set(prev);
      if (next.has(garment.id)) next.delete(garment.id);
      else next.add(garment.id);
      return next;
    });
  }, []);

  const selectedGarments = outfit.garments.filter((g) => selectedGarmentIds.has(g.id));
  const totalPrice = selectedGarments.reduce((sum, g) => sum + g.price, 0);
  const selectedCount = selectedGarments.length;

  const handleAddToBag = () => {
    if (selectedCount === 0) return;
    selectedGarments.forEach((g) => {
      addToCart({
        id: g.id,
        name: g.name,
        subtitle: `${outfit.countryName} · ${outfit.setName}`,
        price: g.price,
        image: g.image,
      });
    });
    setAdded(true);
    setTimeout(() => {
      onClose();
      openSidebar();
    }, 900);
  };

  const categoryGarments = outfit.garments.filter((g) => g.category === activeCategory);

  return (
    <div className="fixed inset-0 z-[2000] flex items-stretch bg-obsidian-950">
      {/* Full-screen 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <FittingScene
              gender={selectedGender}
              skinTone={selectedSkinTone}
              selectedGarments={selectedGarments}
              environment={environment}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Top bar — header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-obsidian-950/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-turquoise-500/10 border border-turquoise-400/30 flex items-center justify-center backdrop-blur-md">
            <Box className="w-5 h-5 text-turquoise-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-diamond-100 leading-tight">3D Virtual Fitting Room</h3>
            <p className="text-[11px] text-diamond-500">{outfit.countryName} — {outfit.setName} · Drag to rotate</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950/70 backdrop-blur-md border border-slate-700/40 text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 text-xs font-bold transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {drawerOpen ? 'Hide Panel' : 'Show Panel'}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/40 flex items-center justify-center text-diamond-300 hover:text-coral-400 hover:border-coral-400/40 transition-all duration-300"
            aria-label="Close fitting room"
          >
            <X className="w-4.5 h-4.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Avatar info badge — bottom left */}
      <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
        <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-turquoise-400/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-turquoise-500/10 border border-turquoise-400/30 flex items-center justify-center">
              <User className="w-4 h-4 text-turquoise-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-diamond-100">{currentAvatar.name}</p>
              <p className="text-[10px] text-diamond-500 capitalize">{selectedGender} · {selectedSkinTone} skin · {environment.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gender + skin tone controls — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <div className="flex gap-1 p-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/40">
          <button
            onClick={() => setSelectedGender('female')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedGender === 'female' ? 'bg-coral-500/20 text-coral-400 shadow-glow-coral' : 'text-diamond-500 hover:text-diamond-300'
            }`}
          >
            Female
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedGender === 'male' ? 'bg-turquoise-500/20 text-turquoise-300 shadow-glow-turquoise' : 'text-diamond-500 hover:text-diamond-300'
            }`}
          >
            Male
          </button>
        </div>

        <div className="flex gap-2 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/40">
          <button
            onClick={() => setSelectedSkinTone('light')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedSkinTone === 'light' ? 'border-turquoise-400 scale-110 shadow-glow-turquoise' : 'border-slate-600'
            }`}
            style={{ background: '#F0D0B0' }}
            aria-label="Light skin tone"
          />
          <button
            onClick={() => setSelectedSkinTone('dark')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedSkinTone === 'dark' ? 'border-turquoise-400 scale-110 shadow-glow-turquoise' : 'border-slate-600'
            }`}
            style={{ background: '#8D6B52' }}
            aria-label="Dark skin tone"
          />
        </div>
      </div>

      {/* Right drawer — glassmorphism control panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 z-20 w-full sm:w-[400px] transition-transform duration-500 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-slate-950/80 backdrop-blur-xl border-l border-turquoise-400/15">
          {/* Drawer header */}
          <div className="px-5 pt-20 pb-4 border-b border-slate-700/40 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-turquoise-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Wardrobe Studio</span>
            </div>
            <p className="text-sm text-diamond-300">{outfit.setName}</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Environment selector */}
            <div className="px-5 pt-4 pb-4 border-b border-slate-700/40">
              <h4 className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-turquoise-400" />
                3D Environment
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {environments3D.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvId(env.id)}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all duration-300 ${
                      selectedEnvId === env.id
                        ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                        : 'bg-obsidian-800/60 border-slate-700/30 hover:border-turquoise-400/25'
                    }`}
                  >
                    <p className={`text-xs font-bold ${selectedEnvId === env.id ? 'text-turquoise-300' : 'text-diamond-200'}`}>{env.label}</p>
                    <p className="text-[10px] text-diamond-500 mt-0.5 leading-tight">{env.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div className="px-5 pt-4 pb-2 flex gap-2 border-b border-slate-700/40">
              {layerOrder.map((cat) => {
                const catGarments = outfit.garments.filter((g) => g.category === cat);
                const hasSelected = catGarments.some((g) => selectedGarmentIds.has(g.id));
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-turquoise-500/15 text-turquoise-300 border border-turquoise-400/30'
                        : 'bg-obsidian-800/60 text-diamond-400 border border-slate-700/30 hover:border-turquoise-400/20'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    {layerLabels[cat]}
                    {hasSelected && <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>

            {/* Garment grid */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                {categoryGarments.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-12 text-diamond-600">
                    <Shirt className="w-8 h-8 mb-2" />
                    <p className="text-xs">No {layerLabels[activeCategory].toLowerCase()} in this outfit</p>
                  </div>
                ) : (
                  categoryGarments.map((garment) => {
                    const isSel = selectedGarmentIds.has(garment.id);
                    return (
                      <button
                        key={garment.id}
                        onClick={() => toggleGarment(garment)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left ${
                          isSel
                            ? 'border-turquoise-400 shadow-glow-turquoise scale-[1.02]'
                            : 'border-slate-700/30 hover:border-turquoise-400/30'
                        }`}
                      >
                        <div className="relative h-24 overflow-hidden">
                          <img
                            src={garment.image}
                            alt={garment.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          {isSel && (
                            <>
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-turquoise-400 flex items-center justify-center">
                                <Check className="w-3 h-3 text-obsidian-950" strokeWidth={3} />
                              </div>
                              <div className="absolute inset-0 border-2 border-turquoise-400/40 rounded-xl pointer-events-none animate-pulse" />
                            </>
                          )}
                          <div
                            className="absolute top-2 left-2 w-4 h-4 rounded-full border-2 border-slate-950 shadow-md"
                            style={{ background: garment.swatchColor }}
                          />
                        </div>
                        <div className="px-3 py-2">
                          <p className={`text-xs font-semibold truncate ${isSel ? 'text-turquoise-300' : 'text-diamond-100'}`}>{garment.name}</p>
                          <p className="text-[11px] text-turquoise-300 font-bold mt-0.5">{format(garment.price)}</p>
                        </div>
                        {/* Worn indicator */}
                        {isSel && (
                          <div className="px-3 pb-2">
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-mint-400 uppercase tracking-wide">
                              <Box className="w-2.5 h-2.5" />
                              On Avatar
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer — price breakdown + add to bag */}
          <div className="px-5 py-4 border-t border-slate-700/40 bg-obsidian-900/60 shrink-0">
            {selectedCount > 0 && (
              <div className="mb-3 space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                {selectedGarments.map((g) => (
                  <div key={g.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-diamond-400 truncate flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.swatchColor }} />
                      <span className="truncate">{g.name}</span>
                    </span>
                    <span className="text-diamond-200 font-medium shrink-0 ml-2">{format(g.price)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700/40 pt-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold">
                    Total ({selectedCount} {selectedCount === 1 ? 'piece' : 'pieces'})
                  </span>
                  <span className="text-lg font-bold text-turquoise-300 tabular-nums">{format(totalPrice)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold block">
                  3D Look Total ({selectedCount} {selectedCount === 1 ? 'piece' : 'pieces'})
                </span>
                <span className="text-2xl font-bold text-diamond-100 tabular-nums">{format(totalPrice)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-diamond-500">
                <RotateCw className="w-3 h-3" />
                <span>Rental / trip</span>
              </div>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={selectedCount === 0 || added}
              className={`group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                added
                  ? 'bg-mint-500 text-obsidian-950'
                  : selectedCount === 0
                    ? 'bg-obsidian-800 text-diamond-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 shadow-glow-turquoise hover:shadow-glow-lg hover:-translate-y-0.5'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                  Add 3D Look to Bag
                  {selectedCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-obsidian-950/20 text-[10px]">
                      {format(totalPrice)}
                    </span>
                  )}
                </>
              )}
            </button>
            {selectedCount === 0 && (
              <p className="text-[10px] text-diamond-600 text-center mt-2">
                Select at least one piece to dress your avatar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer toggle */}
      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden absolute top-1/2 right-4 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/80 backdrop-blur-md border border-turquoise-400/30 flex items-center justify-center text-turquoise-400 shadow-glow-turquoise"
        >
          <Layers className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
