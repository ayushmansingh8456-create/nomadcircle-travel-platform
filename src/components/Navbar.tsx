import { useEffect, useRef, useState } from 'react';
import { Compass, Menu, X, ShoppingBag, LogOut, User as UserIcon, ChevronDown, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, currencies, type CurrencyCode } from '@/context/CurrencyContext';

const navLinks = [
  { label: 'Tours', href: '#tours' },
  { label: 'Thrift Boutique', href: '#boutique' },
  { label: 'Community', href: '#community' },
  { label: 'Music', href: '#music' },
];

interface NavbarProps {
  onAuthClick: () => void;
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openSidebar } = useCart();
  const { user, signOut } = useAuth();
  const { currency, setCurrency, symbol } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const currencyList = Object.values(currencies);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      signOut();
    } else {
      onAuthClick();
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian-950/80 backdrop-blur-xl border-b border-turquoise-400/15 shadow-soft-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-turquoise-400 to-turquoise-600 flex items-center justify-center shadow-glow-turquoise transition-transform group-hover:scale-110">
                <Compass className="w-5 h-5 text-obsidian-950" strokeWidth={2.5} />
              </div>
              <span className="absolute -inset-1 rounded-full border border-turquoise-300/40 animate-pulse-ring" />
            </div>
            <span className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-diamond-100">
              Nomad<span className="text-turquoise-400">Circle</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-diamond-300 hover:text-turquoise-300 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-turquoise-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Cart + Account + CTA */}
          <div className="flex items-center gap-3">
            {/* Currency selector */}
            <div ref={currencyRef} className="relative">
              <button
                onClick={() => setCurrencyOpen((v) => !v)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-full text-sm font-semibold text-diamond-200 hover:text-turquoise-300 border border-transparent hover:border-turquoise-400/30 transition-all"
                aria-label="Select currency"
              >
                <span className="text-turquoise-400 font-bold">{symbol}</span>
                <span className="hidden sm:inline text-xs font-medium text-diamond-300">{currency}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-diamond-500 transition-transform duration-300 ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-slate-950 border border-turquoise-400/20 shadow-soft-lg overflow-hidden z-50 animate-fade-in">
                  {currencyList.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        currency === c.code
                          ? 'bg-turquoise-500/10 text-turquoise-300 font-semibold'
                          : 'text-diamond-200 hover:bg-obsidian-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-base w-5 text-center">{c.symbol}</span>
                        {c.label}
                      </span>
                      {currency === c.code && <Check className="w-4 h-4 text-turquoise-400" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={openSidebar}
              className="relative p-2 text-diamond-200 hover:text-turquoise-300 transition-colors"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center shadow-glow-coral animate-fade-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account / Auth */}
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-1.5 p-2 text-diamond-200 hover:text-turquoise-300 transition-colors"
              aria-label={user ? 'Sign out' : 'Sign in'}
            >
              {user ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-turquoise-500/15 border border-turquoise-400/30 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-turquoise-300" />
                  </div>
                  <span className="hidden sm:inline text-sm text-diamond-200 max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <LogOut className="w-4 h-4 text-diamond-500 hover:text-coral-400" />
                </>
              ) : (
                <UserIcon className="w-5 h-5" strokeWidth={2} />
              )}
            </button>

            <div className="hidden lg:block">
              {user ? (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/80 border border-turquoise-400/20 text-sm font-medium text-diamond-200">
                  Member
                </span>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-sm font-bold hover:shadow-glow-turquoise transition-all duration-300 hover:-translate-y-0.5"
                >
                  Join the Circle
                  <span className="w-1.5 h-1.5 rounded-full bg-obsidian-950/40 group-hover:scale-150 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-diamond-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden animate-slide-down pb-6">
            <ul className="flex flex-col gap-1 pt-2 border-t border-turquoise-400/15">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-diamond-200 hover:text-turquoise-300 hover:bg-slate-950 rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* Currency selector in mobile menu */}
              <li className="px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-2">Currency</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {currencyList.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code as CurrencyCode)}
                      className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        currency === c.code
                          ? 'bg-turquoise-500/15 text-turquoise-300 border border-turquoise-400/30'
                          : 'bg-obsidian-800 text-diamond-300 border border-slate-700/40'
                      }`}
                    >
                      <span className="font-bold text-sm">{c.symbol}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </li>
              <li className="pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-center px-5 py-3 rounded-full bg-slate-950/80 border border-turquoise-400/20 text-obsidian-950 text-sm font-bold text-diamond-200"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAuthClick();
                    }}
                    className="block w-full text-center px-5 py-3 rounded-full bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-sm font-bold"
                  >
                    Join the Circle
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
