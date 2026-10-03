import { useEffect, useState } from 'react';
import { X, ShoppingBag, Trash2, Tag, Sparkles, ArrowRight, Plane } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function ShoppingBagSidebar() {
  const { items, isSidebarOpen, removeFromCart, closeSidebar, itemCount } = useCart();
  const { openCheckout } = useCheckout();
  const { format } = useCurrency();
  const [bundleUnlocked, setBundleUnlocked] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    if (isSidebarOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSidebarOpen, closeSidebar]);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = bundleUnlocked ? Math.round(subtotal * 0.3) : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    closeSidebar();
    const firstItem = items[0];
    openCheckout({
      type: 'wardrobe',
      title: `${itemCount} wardrobe ${itemCount === 1 ? 'item' : 'items'}`,
      subtitle: `Shopping bag · ${items.map((i) => i.name).join(', ')}`,
      price: total,
      image: firstItem?.image ?? '',
      cartItems: [...items],
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-obsidian-950/70 backdrop-blur-sm animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[95] w-full sm:w-[420px] bg-slate-950 border-l border-turquoise-400/20 shadow-glow-lg transition-transform duration-500 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-turquoise-400" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-diamond-100">Shopping Bag</h3>
              <p className="text-[11px] text-diamond-500">{itemCount} {itemCount === 1 ? 'item' : 'items'} ready to rent</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="w-9 h-9 rounded-full bg-obsidian-800 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full bg-obsidian-800 border border-slate-700/40 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-diamond-600" />
              </div>
              <p className="text-sm font-semibold text-diamond-200 mb-1">Your bag is empty</p>
              <p className="text-xs text-diamond-500 max-w-[200px]">Browse the Destination Wardrobe and add photo-ready fits to your bag.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl2 bg-obsidian-800 border border-slate-700/40 hover:border-turquoise-400/30 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-diamond-100 leading-tight mb-0.5 truncate">{item.name}</h4>
                    <p className="text-[11px] text-diamond-500 mb-1.5 truncate">{item.subtitle}</p>
                    <span className="text-sm font-bold text-turquoise-300">{format(item.price)}</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start w-7 h-7 rounded-full bg-slate-700/40 flex items-center justify-center text-diamond-500 hover:text-coral-400 hover:bg-coral-500/10 transition-all duration-300"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculation area */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-700/40 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-diamond-400">Subtotal</span>
              <span className="text-diamond-200 font-medium">{format(subtotal)}</span>
            </div>

            {/* Bundle discount toggle */}
            <div
              className={`rounded-xl2 border p-3 transition-all duration-300 ${
                bundleUnlocked
                  ? 'bg-mint-500/8 border-mint-400/30'
                  : 'bg-obsidian-800 border-slate-700/40'
              }`}
            >
              <button
                onClick={() => setBundleUnlocked((v) => !v)}
                className="w-full flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  bundleUnlocked ? 'border-mint-400 bg-mint-400' : 'border-slate-600'
                }`}>
                  {bundleUnlocked && (
                    <svg className="w-3 h-3 text-obsidian-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <Tag className={`w-3 h-3 ${bundleUnlocked ? 'text-mint-400' : 'text-diamond-500'}`} />
                    <span className={`text-sm font-bold ${bundleUnlocked ? 'text-mint-400' : 'text-diamond-200'}`}>
                      30% Trip Bundling Discount
                    </span>
                  </div>
                  <p className="text-[11px] text-diamond-500 mt-0.5 leading-snug">
                    {bundleUnlocked
                      ? 'Unlocked! Book a travel ticket to activate this discount.'
                      : 'Book a travel ticket alongside your rental to unlock 30% off.'}
                  </p>
                </div>
                <span className={`text-sm font-bold ${bundleUnlocked ? 'text-mint-400' : 'text-diamond-600'}`}>
                  -{format(discount)}
                </span>
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
              <span className="text-sm font-bold text-diamond-100">Total Price</span>
              <span className="text-2xl font-bold text-turquoise-300 font-serif">{format(total)}</span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>

            {/* Hint */}
            {!bundleUnlocked && (
              <div className="flex items-center gap-1.5 text-[11px] text-diamond-500 justify-center">
                <Plane className="w-3 h-3 text-turquoise-400" />
                <span>Reserve a trip to unlock your 30% bundle discount</span>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
