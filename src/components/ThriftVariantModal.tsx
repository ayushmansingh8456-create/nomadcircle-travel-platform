import { useEffect, useState } from 'react';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import type { BoutiqueItem, BoutiqueVariant } from '@/data/boutique';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

interface Props {
  item: BoutiqueItem | null;
  onClose: () => void;
}

export default function ThriftVariantModal({ item, onClose }: Props) {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (item) {
      setSelectedIdx(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item || !item.variants) return null;

  const variants: BoutiqueVariant[] = item.variants;
  const selected = variants[selectedIdx];

  const handleConfirm = () => {
    addToCart({
      id: `${item.id}-variant-${selectedIdx}`,
      name: selected.name,
      subtitle: item.title,
      price: selected.price,
      image: item.image,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-xl3 bg-slate-950 border border-turquoise-400/30 shadow-glow-lg animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian-800 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          aria-label="Close variant selection"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-turquoise-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Choose Your Variant</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-diamond-100">{item.title}</h2>
          <p className="mt-1 text-sm text-diamond-400">Select a specific model to add to your bag</p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {/* Thumbnail */}
          <div className="flex gap-4 p-4 rounded-xl2 bg-obsidian-800 border border-slate-700/40 mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-wider text-turquoise-400 font-semibold mb-1">{item.category}</span>
              <h4 className="text-sm font-bold text-diamond-100 leading-tight">{item.title}</h4>
              <p className="text-xs text-diamond-500 mt-0.5">{item.condition} condition</p>
            </div>
          </div>

          {/* Variant radio options */}
          <div className="space-y-3 mb-6">
            {variants.map((variant, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                      : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-turquoise-400 bg-turquoise-400' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={4} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${isSelected ? 'text-turquoise-300' : 'text-diamond-200'}`}>
                      {variant.name}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-turquoise-300' : 'text-diamond-300'}`}>
                    {format(variant.price)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Confirm & Add Selected to Bag
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
