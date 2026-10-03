import { useState } from 'react';
import { ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { boutiqueItems, type BoutiqueItem } from '@/data/boutique';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import ThriftVariantModal from './ThriftVariantModal';

const glowBorders = [
  'glow-border-turquoise',
  'glow-border-coral',
  'glow-border-gold',
];

export default function Boutique() {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [activeThriftCategory, setActiveThriftCategory] = useState<BoutiqueItem | null>(null);

  const handleAddToBag = (item: BoutiqueItem) => {
    if (item.variants && item.variants.length > 0) {
      setActiveThriftCategory(item);
    } else {
      addToCart({
        id: item.id,
        name: item.title,
        subtitle: item.category,
        price: item.price,
        image: item.image,
      });
    }
  };

  return (
    <section id="boutique" className="relative py-20 lg:py-28 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-400">Curated & Pre-Loved</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-diamond-100 leading-tight">
              The Thrift Boutique
            </h2>
            <p className="mt-3 text-diamond-400 max-w-lg">
              Hand-picked vintage gear and travel essentials. Every find funds a traveler's next journey.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-diamond-300">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>New drops every Thursday</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {boutiqueItems.map((item, idx) => (
            <article
              key={item.id}
              className={`group relative flex flex-col rounded-xl2 overflow-hidden bg-slate-950 ${glowBorders[idx % 3]} hover:shadow-glow-turquoise transition-all duration-500 hover:-translate-y-1`}
            >
              {/* Image */}
              <div className="relative h-40 sm:h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                {item.badge && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold uppercase tracking-wide shadow-glow-gold">
                    <Tag className="w-2.5 h-2.5" strokeWidth={3} />
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-4">
                <span className="text-[10px] uppercase tracking-wider text-turquoise-400 font-semibold mb-1">{item.category}</span>
                <h3 className="text-sm font-semibold text-diamond-100 leading-snug mb-2 group-hover:text-turquoise-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] text-diamond-500">{item.condition}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-diamond-100">{format(item.price)}</span>
                  <button
                    onClick={() => handleAddToBag(item)}
                    className="px-3 py-1.5 rounded-full bg-turquoise-500/10 text-turquoise-300 text-xs font-semibold border border-turquoise-400/30 hover:bg-turquoise-500 hover:text-obsidian-950 hover:border-turquoise-400 transition-all duration-300"
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ThriftVariantModal item={activeThriftCategory} onClose={() => setActiveThriftCategory(null)} />
    </section>
  );
}
