import { useEffect, useState } from 'react';
import {
  X, CreditCard, Lock, Check, Sparkles, Users, Wallet, Tag,
  Hotel, UtensilsCrossed, MapPinned, Camera, ArrowRight, ArrowLeft,
  CalendarClock, Percent, Star, Plane, PartyPopper, Waves,
  ChevronRight, Image, Wifi, Coffee, Trees,
} from 'lucide-react';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/lib/supabase';
import {
  partnerHotels, diningInfo, addOnOptions,
  type PartnerHotel, type HotelRoom,
} from '@/data/checkoutAddons';

type PaymentOption = 'full' | 'split' | 'deposit';
type Step = 'inclusions' | 'payment';
type InclusionTab = 'overview' | 'stay' | 'dining' | 'addons';

const packageHighlights = [
  {
    icon: Hotel,
    title: 'Accommodation',
    desc: '4-Star Boutique Hotels & Eco-lodges (Double Occupancy)',
    accent: 'turquoise',
  },
  {
    icon: UtensilsCrossed,
    title: 'Culinary',
    desc: 'Daily curated breakfasts + 3 regional gourmet dinner experiences',
    accent: 'gold',
  },
  {
    icon: MapPinned,
    title: 'Guidance & Transit',
    desc: '24/7 dedicated local expert host, private group sprinter van transit, and all entry tickets/passes included',
    accent: 'turquoise',
  },
  {
    icon: Camera,
    title: 'Content Perk',
    desc: 'Free access to the Destination Wardrobe photo gear locker',
    accent: 'coral',
  },
];

const accentMap: Record<string, { text: string; bg: string; border: string; iconBg: string }> = {
  turquoise: {
    text: 'text-turquoise-300',
    bg: 'bg-turquoise-500/10',
    border: 'border-turquoise-400/30',
    iconBg: 'bg-turquoise-500/15',
  },
  gold: {
    text: 'text-gold-400',
    bg: 'bg-gold-500/10',
    border: 'border-gold-400/30',
    iconBg: 'bg-gold-500/15',
  },
  coral: {
    text: 'text-coral-400',
    bg: 'bg-coral-500/10',
    border: 'border-coral-400/30',
    iconBg: 'bg-coral-500/15',
  },
};

const amenityIcons: Record<string, typeof Wifi> = {
  'Free High-Speed Wi-Fi': Wifi,
  'Daily Breakfast Included': Coffee,
  'Solar-Powered Suites': Trees,
  'Organic Breakfast': Coffee,
  'Rooftop Pool': Waves,
};

const addOnIcons: Record<string, typeof Plane> = {
  'airport-vip': Plane,
  'pool-party': PartyPopper,
  'night-market': UtensilsCrossed,
  'boat-cruise': Waves,
};

export default function CheckoutModal() {
  const { isOpen, item, closeCheckout } = useCheckout();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('full');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState<Step>('inclusions');
  const [inclusionTab, setInclusionTab] = useState<InclusionTab>('overview');

  // Hotel selection state
  const [selectedHotelId, setSelectedHotelId] = useState(partnerHotels[0].id);
  const [selectedRoomId, setSelectedRoomId] = useState(partnerHotels[0].rooms[0].id);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Add-on state
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [flightNumber, setFlightNumber] = useState('');
  const [flightTime, setFlightTime] = useState('');

  const selectedHotel: PartnerHotel = partnerHotels.find((h) => h.id === selectedHotelId) ?? partnerHotels[0];
  const selectedRoom: HotelRoom = selectedHotel.rooms.find((r) => r.id === selectedRoomId) ?? selectedHotel.rooms[0];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setConfirmed(false);
      setPaymentOption('full');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setName('');
      setStep('inclusions');
      setInclusionTab('overview');
      setSelectedHotelId(partnerHotels[0].id);
      setSelectedRoomId(partnerHotels[0].rooms[0].id);
      setShowGallery(false);
      setGalleryIndex(0);
      setSelectedAddOns(new Set());
      setFlightNumber('');
      setFlightTime('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step === 'payment' && !confirmed) {
          setStep('inclusions');
        } else {
          closeCheckout();
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCheckout, step, confirmed]);

  if (!isOpen || !item) return null;

  const isTrip = item.type === 'trip';
  const showInclusions = isTrip && step === 'inclusions' && !confirmed;
  const basePrice = item.price;
  const discountRate = 0.3;
  const discountAmount = Math.round(basePrice * discountRate);
  const roomUpgrade = selectedRoom.priceModifier;
  const addOnsTotal = addOnOptions
    .filter((a) => selectedAddOns.has(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const totalPrice = basePrice - discountAmount + roomUpgrade + addOnsTotal;
  const depositRate = 0.2;
  const depositAmount = Math.round(totalPrice * depositRate);
  const balanceAmount = totalPrice - depositAmount;

  const dueToday = paymentOption === 'deposit' ? depositAmount : paymentOption === 'split' ? Math.round(totalPrice / 4) : totalPrice;

  const parseTripDate = (datesStr?: string): Date | null => {
    if (!datesStr) return null;
    const match = datesStr.match(/(\w+\s+\d+)\s+[—-]\s+/);
    if (!match) return null;
    const year = new Date().getFullYear();
    const d = new Date(`${match[1]}, ${year}`);
    return isNaN(d.getTime()) ? null : d;
  };

  const tripDate = parseTripDate(item.dates);
  const balanceDueDate = tripDate
    ? new Date(tripDate.getTime() - 14 * 24 * 60 * 60 * 1000)
    : null;
  const formatBalanceDate = balanceDueDate
    ? balanceDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '14 days before departure';

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const formatCvv = (val: string) => val.replace(/\D/g, '').slice(0, 4);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = async () => {
    if (user && item) {
      try {
        if (item.type === 'trip' && item.tripId) {
          await supabase.from('trip_bookings').insert({
            trip_id: item.tripId,
            trip_title: item.title,
            destination: item.destination ?? '',
            dates: item.dates ?? '',
            price: totalPrice,
            payment_option: paymentOption,
            status: 'confirmed',
          });
        }
        if (item.type === 'wardrobe' && item.cartItems && item.cartItems.length > 0) {
          await supabase.from('cart_items').delete().neq('item_id', '___never___');
          clearCart();
        }
      } catch (err) {
        console.warn('Failed to save booking to Supabase:', err);
      }
    }
    setConfirmed(true);
    setTimeout(() => {
      closeCheckout();
    }, 2200);
  };

  const inclusionTabs: { id: InclusionTab; label: string; icon: typeof Hotel }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'stay', label: 'Stay', icon: Hotel },
    { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
    { id: 'addons', label: 'Add-ons', icon: Tag },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={closeCheckout}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-xl3 bg-slate-950 border border-turquoise-400/30 shadow-glow-lg animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeCheckout}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian-800 border border-slate-700/60 flex items-center justify-center text-diamond-300 hover:text-turquoise-300 hover:border-turquoise-400/40 transition-all duration-300"
          aria-label="Close checkout"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Header strip */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            {showInclusions ? (
              <>
                <Sparkles className="w-4 h-4 text-turquoise-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Trip Inclusions</span>
              </>
            ) : confirmed ? (
              <>
                <Check className="w-4 h-4 text-mint-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-mint-400">Booking Complete</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-turquoise-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-turquoise-400">Secure Checkout</span>
              </>
            )}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-diamond-100">
            {confirmed
              ? 'Booking Confirmed!'
              : showInclusions
                ? "What's Covered in Your Trip"
                : 'Complete Your Reservation'}
          </h2>
        </div>

        {/* CONFIRMED state */}
        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-mint-500/15 border border-mint-400/40 flex items-center justify-center mb-6 shadow-glow-turquoise animate-glow-pulse">
              <Check className="w-10 h-10 text-mint-400" strokeWidth={3} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-diamond-100 mb-3">You're all set!</h3>
            <p className="text-diamond-400 max-w-md leading-relaxed mb-6">
              Your {isTrip ? 'trip reservation' : 'wardrobe rental'} for <span className="text-turquoise-300 font-semibold">{item.title}</span> has been confirmed. Check your email for details and next steps.
            </p>
            <div className="flex items-center gap-2 text-sm text-diamond-500">
              <Lock className="w-3.5 h-3.5 text-mint-400" />
              Payment secured · Confirmation sent
            </div>
          </div>
        ) : showInclusions ? (
          /* INCLUSIONS REVIEW SCREEN */
          <div className="animate-fade-in">
            {/* Trip summary banner */}
            <div className="flex gap-4 p-4 mx-6 sm:mx-8 mt-6 rounded-xl2 bg-obsidian-800 border border-turquoise-400/20">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mb-1.5 bg-turquoise-500/15 text-turquoise-300">
                  Trip Selected
                </span>
                <h4 className="text-sm font-bold text-diamond-100 leading-tight mb-1">{item.title}</h4>
                <p className="text-xs text-diamond-500">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-diamond-500 font-semibold block">From</span>
                <span className="text-xl font-bold text-turquoise-300">{format(basePrice)}</span>
                <span className="text-xs text-diamond-500"> /person</span>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 px-6 sm:px-8 mt-6 border-b border-slate-700/40">
              {inclusionTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = inclusionTab === tab.id;
                const hasBadge = tab.id === 'addons' && selectedAddOns.size > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInclusionTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs font-bold transition-all duration-300 border-b-2 ${
                      isActive
                        ? 'text-turquoise-300 border-turquoise-400'
                        : 'text-diamond-500 border-transparent hover:text-diamond-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {hasBadge && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-turquoise-500/20 text-turquoise-300 text-[9px] font-bold">
                        {selectedAddOns.size}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-6 sm:p-8">
              {/* OVERVIEW TAB */}
              {inclusionTab === 'overview' && (
                <div className="animate-fade-in">
                  <h3 className="text-sm font-bold text-diamond-100 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-turquoise-400" />
                    Your Package Highlights
                  </h3>
                  <div className="space-y-3 mb-6">
                    {packageHighlights.map((highlight) => {
                      const accent = accentMap[highlight.accent];
                      const Icon = highlight.icon;
                      return (
                        <div
                          key={highlight.title}
                          className={`flex items-start gap-4 p-4 rounded-xl2 bg-obsidian-800 border ${accent.border} transition-all duration-300 hover:border-turquoise-400/40 hover:bg-obsidian-700/60`}
                        >
                          <div className={`w-11 h-11 rounded-xl ${accent.iconBg} border ${accent.border} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-5 h-5 ${accent.text}`} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold ${accent.text} mb-1`}>{highlight.title}</h4>
                            <p className="text-[13px] text-diamond-400 leading-relaxed">{highlight.desc}</p>
                          </div>
                          <Check className={`w-4 h-4 ${accent.text} shrink-0 mt-1`} strokeWidth={3} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Live price preview */}
                  <div className="space-y-2 p-4 rounded-xl2 bg-slate-900/60 border border-slate-700/40 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-diamond-400">Base price</span>
                      <span className="text-diamond-200 font-medium">{format(basePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-mint-400">
                        <Tag className="w-3.5 h-3.5" />
                        Bundle discount (30%)
                      </span>
                      <span className="text-mint-400 font-semibold">-{format(discountAmount)}</span>
                    </div>
                    {roomUpgrade > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gold-400">
                          <Hotel className="w-3.5 h-3.5" />
                          Room upgrade: {selectedRoom.name}
                        </span>
                        <span className="text-gold-400 font-semibold">+{format(roomUpgrade)}</span>
                      </div>
                    )}
                    {addOnsTotal > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-turquoise-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Add-ons ({selectedAddOns.size})
                        </span>
                        <span className="text-turquoise-300 font-semibold">+{format(addOnsTotal)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-700/40 pt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-diamond-100">Total /person</span>
                      <span className="text-2xl font-bold text-turquoise-300 font-serif">{format(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* STAY TAB */}
              {inclusionTab === 'stay' && (
                <div className="animate-fade-in">
                  {/* Hotel selector — image cards */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {partnerHotels.map((hotel) => {
                      const isSelected = selectedHotelId === hotel.id;
                      return (
                        <button
                          key={hotel.id}
                          onClick={() => {
                            setSelectedHotelId(hotel.id);
                            setSelectedRoomId(hotel.rooms[0].id);
                            setShowGallery(false);
                          }}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'border-turquoise-400 shadow-glow-turquoise'
                              : 'border-slate-700/40 hover:border-turquoise-400/30'
                          }`}
                        >
                          {/* Hero image */}
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            {/* Rating badge */}
                            <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-gold-400/30">
                              {Array.from({ length: hotel.rating }).map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 text-gold-400 fill-gold-400" />
                              ))}
                            </div>
                            {/* Selected checkmark */}
                            {isSelected && (
                              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-turquoise-400 flex items-center justify-center">
                                <Check className="w-3 h-3 text-obsidian-950" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          {/* Text content */}
                          <div className="px-3 py-2.5 bg-obsidian-800/80">
                            <p className={`text-[11px] font-bold uppercase tracking-wide ${isSelected ? 'text-turquoise-300' : 'text-diamond-400'}`}>
                              {hotel.category}
                            </p>
                            <p className={`text-xs font-semibold truncate mt-0.5 ${isSelected ? 'text-turquoise-200' : 'text-diamond-200'}`}>
                              {hotel.name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Featured hotel photo */}
                  <div className="relative h-52 rounded-xl2 overflow-hidden mb-4 border border-slate-700/40">
                    <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-diamond-100">{selectedHotel.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: selectedHotel.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                          ))}
                          <span className="ml-1.5 text-[11px] text-diamond-400">{selectedHotel.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setShowGallery(!showGallery); setGalleryIndex(0); }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950/70 backdrop-blur-sm border border-turquoise-400/30 text-[11px] font-bold text-turquoise-300 hover:bg-turquoise-500/15 transition-all"
                      >
                        <Image className="w-3.5 h-3.5" />
                        {showGallery ? 'Hide Gallery' : 'View Gallery / Room Specs'}
                      </button>
                    </div>
                  </div>

                  {/* Gallery + Room Specs toggle */}
                  {showGallery && (
                    <div className="mb-5 animate-fade-in">
                      {/* Gallery strip */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {selectedHotel.gallery.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setGalleryIndex(i)}
                            className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              galleryIndex === i ? 'border-turquoise-400 shadow-glow-turquoise' : 'border-slate-700/40'
                            }`}
                          >
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      {/* Large gallery image */}
                      <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-slate-700/40">
                        <img src={selectedHotel.gallery[galleryIndex]} alt="Room view" className="w-full h-full object-cover" />
                      </div>

                      {/* Room specs selection */}
                      <h5 className="text-xs font-bold text-diamond-100 mb-3 uppercase tracking-wider">Room Options</h5>
                      <div className="space-y-2.5">
                        {selectedHotel.rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left ${
                              selectedRoomId === room.id
                                ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                                : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                            }`}
                          >
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${selectedRoomId === room.id ? 'text-turquoise-300' : 'text-diamond-200'}`}>{room.name}</p>
                              <p className="text-[11px] text-diamond-500">{room.specs}</p>
                            </div>
                            <div className="text-right shrink-0">
                              {room.priceModifier === 0 ? (
                                <span className="text-xs font-bold text-mint-400">Included</span>
                              ) : (
                                <span className="text-xs font-bold text-gold-400">+{format(room.priceModifier)}</span>
                              )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              selectedRoomId === room.id ? 'border-turquoise-400 bg-turquoise-400' : 'border-slate-600'
                            }`}>
                              {selectedRoomId === room.id && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={4} />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedHotel.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] ?? Check;
                      return (
                        <div
                          key={amenity}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-turquoise-500/8 border border-turquoise-400/20 text-[11px] font-semibold text-turquoise-300"
                        >
                          <Icon className="w-3 h-3" />
                          {amenity}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* DINING TAB */}
              {inclusionTab === 'dining' && (
                <div className="animate-fade-in">
                  {/* Dining summary card */}
                  <div className="p-4 rounded-xl2 bg-gold-500/8 border border-gold-400/25 mb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center shrink-0">
                        <UtensilsCrossed className="w-5 h-5 text-gold-400" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gold-400">Food & Dining Experience</h4>
                        <p className="text-[12px] text-diamond-400 mt-0.5">{diningInfo.mealsIncluded}</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-diamond-400 leading-relaxed pl-14">
                      {diningInfo.dinnerExperiences}
                    </p>
                  </div>

                  {/* Dietary preferences */}
                  <h5 className="text-xs font-bold text-diamond-100 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-mint-400" />
                    Dietary Preferences Available
                  </h5>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {diningInfo.dietaryOptions.map((diet) => (
                      <div
                        key={diet}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-mint-500/8 border border-mint-400/20 text-[11px] font-bold text-mint-400"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                        {diet}
                      </div>
                    ))}
                  </div>

                  {/* Sample dish photos */}
                  <h5 className="text-xs font-bold text-diamond-100 mb-3 uppercase tracking-wider">Sample Dining Experiences</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {diningInfo.dishPhotos.map((dish) => (
                      <div key={dish.id} className="group relative rounded-xl overflow-hidden border border-slate-700/40 hover:border-gold-400/30 transition-all duration-300">
                        <div className="relative h-20 overflow-hidden">
                          <img src={dish.image} alt={dish.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        </div>
                        <p className="text-[10px] font-semibold text-diamond-300 px-2 py-1.5 leading-tight">{dish.label}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* ADD-ONS TAB */}
              {inclusionTab === 'addons' && (
                <div className="animate-fade-in">
                  <h3 className="text-sm font-bold text-diamond-100 mb-1 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-turquoise-400" />
                    Add-ons & Special Perks
                  </h3>
                  <p className="text-[12px] text-diamond-500 mb-5">Enhance your trip with optional extras. Prices update live below.</p>

                  <div className="space-y-3 mb-6">
                    {addOnOptions.map((addon) => {
                      const isSelected = selectedAddOns.has(addon.id);
                      const Icon = addOnIcons[addon.id] ?? Sparkles;
                      return (
                        <div
                          key={addon.id}
                          className={`rounded-xl2 border transition-all duration-300 overflow-hidden ${
                            isSelected
                              ? 'bg-turquoise-500/8 border-turquoise-400/40 shadow-glow-turquoise'
                              : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                          }`}
                        >
                          <button
                            onClick={() => toggleAddOn(addon.id)}
                            className="w-full flex items-center gap-4 p-4 text-left"
                          >
                            {/* Photo badge */}
                            {addon.image ? (
                              <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                                <img src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                                {addon.badge && (
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-coral-500 text-[8px] font-bold text-white uppercase tracking-wide">
                                    {addon.badge}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-turquoise-500/15 border border-turquoise-400/30 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-turquoise-400" strokeWidth={2} />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-bold ${isSelected ? 'text-turquoise-300' : 'text-diamond-200'}`}>{addon.name}</h4>
                              <p className="text-[11px] text-diamond-500 leading-relaxed mt-0.5">{addon.description}</p>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="text-sm font-bold text-turquoise-300">+{format(addon.price)}</span>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-turquoise-400 bg-turquoise-400' : 'border-slate-600'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-obsidian-950" strokeWidth={4} />}
                              </div>
                            </div>
                          </button>

                          {/* Airport flight inputs */}
                          {addon.id === 'airport-vip' && isSelected && (
                            <div className="px-4 pb-4 animate-fade-in">
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/40">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">Flight Number</label>
                                  <input
                                    type="text"
                                    value={flightNumber}
                                    onChange={(e) => setFlightNumber(e.target.value)}
                                    placeholder="AA 1234"
                                    className="w-full bg-obsidian-900 rounded-lg px-3 py-2.5 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/50 transition-all uppercase"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">Arrival Time</label>
                                  <input
                                    type="text"
                                    value={flightTime}
                                    onChange={(e) => setFlightTime(e.target.value)}
                                    placeholder="2:30 PM"
                                    className="w-full bg-obsidian-900 rounded-lg px-3 py-2.5 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/50 transition-all"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Live add-on total */}
                  <div className="flex items-center justify-between p-4 rounded-xl2 bg-slate-900/60 border border-slate-700/40 mb-6">
                    <span className="text-sm font-bold text-diamond-100">
                      Add-ons Total {selectedAddOns.size > 0 && `(${selectedAddOns.size})`}
                    </span>
                    <span className="text-lg font-bold text-turquoise-300 font-serif">+{format(addOnsTotal)}</span>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PAYMENT VIEW */
          <div className="animate-fade-in">
            {/* Back to inclusions (trips only) */}
            {isTrip && (
              <button
                onClick={() => setStep('inclusions')}
                className="group inline-flex items-center gap-2 px-6 sm:px-8 pt-4 text-xs font-semibold text-diamond-400 hover:text-turquoise-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to inclusions
              </button>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* LEFT — Order Summary */}
              <div className="p-6 sm:p-8 lg:border-r border-slate-700/40">
                <h3 className="text-sm font-bold text-diamond-100 mb-5 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-turquoise-400" />
                  Order Summary
                </h3>

                {/* Item card */}
                <div className="flex gap-4 p-4 rounded-xl2 bg-obsidian-800 border border-slate-700/40 mb-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mb-1.5 ${
                      isTrip
                        ? 'bg-turquoise-500/15 text-turquoise-300'
                        : 'bg-gold-500/15 text-gold-400'
                    }`}>
                      {isTrip ? 'Trip Selected' : 'Wardrobe Selected'}
                    </span>
                    <h4 className="text-sm font-bold text-diamond-100 leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-diamond-500">{item.subtitle}</p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-diamond-400">{isTrip ? 'Trip reservation' : 'Rental fee'}</span>
                    <span className="text-diamond-200 font-medium">{format(basePrice)}</span>
                  </div>

                  {/* Combo discount */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-mint-400">
                      <Tag className="w-3.5 h-3.5" />
                      Bundle discount (30%)
                    </span>
                    <span className="text-mint-400 font-semibold">-{format(discountAmount)}</span>
                  </div>

                  {/* Room upgrade line */}
                  {roomUpgrade > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gold-400">
                        <Hotel className="w-3.5 h-3.5" />
                        {selectedRoom.name}
                      </span>
                      <span className="text-gold-400 font-semibold">+{format(roomUpgrade)}</span>
                    </div>
                  )}

                  {/* Add-ons line items */}
                  {addOnOptions.filter((a) => selectedAddOns.has(a.id)).map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-turquoise-300 truncate">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{addon.name}</span>
                      </span>
                      <span className="text-turquoise-300 font-semibold shrink-0">+{format(addon.price)}</span>
                    </div>
                  ))}

                  {/* Discount note */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-mint-500/8 border border-mint-400/20">
                    <Sparkles className="w-3.5 h-3.5 text-mint-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-mint-400 leading-relaxed">
                      30% combo discount auto-applied — you're saving big by combining a trip booking with a clothing rental.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-700/40 pt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-diamond-100">
                      {paymentOption === 'split'
                        ? 'Total (per person)'
                        : paymentOption === 'deposit'
                          ? 'Remaining balance'
                          : 'Total due'}
                    </span>
                    <span className="text-2xl font-bold text-turquoise-300 font-serif">
                      {paymentOption === 'deposit' ? format(balanceAmount) : format(dueToday)}
                    </span>
                  </div>

                  {paymentOption === 'split' && (
                    <div className="flex items-center gap-1.5 text-[11px] text-diamond-500">
                      <Users className="w-3 h-3 text-turquoise-400" />
                      Split across 4 crew members · {format(totalPrice)} total
                    </div>
                  )}

                  {paymentOption === 'deposit' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-diamond-500">
                        <CalendarClock className="w-3 h-3 text-gold-400" />
                        Balance of {format(balanceAmount)} due by {formatBalanceDate}
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gold-500/8 border border-gold-400/20">
                        <div className="flex items-center gap-1.5">
                          <Percent className="w-3.5 h-3.5 text-gold-400" />
                          <span className="text-[11px] font-semibold text-gold-400">20% deposit secures your spot</span>
                        </div>
                        <span className="text-sm font-bold text-gold-400">{format(depositAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Payment & Options */}
              <div className="p-6 sm:p-8 bg-obsidian-900/50">
                <h3 className="text-sm font-bold text-diamond-100 mb-5 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-turquoise-400" />
                  Payment & Options
                </h3>

                {/* Payment options */}
                <div className="space-y-2.5 mb-6">
                  <button
                    onClick={() => setPaymentOption('full')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                      paymentOption === 'full'
                        ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                        : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      paymentOption === 'full' ? 'border-turquoise-400 bg-turquoise-400' : 'border-slate-600'
                    }`}>
                      {paymentOption === 'full' && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={4} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-bold ${paymentOption === 'full' ? 'text-turquoise-300' : 'text-diamond-200'}`}>Pay in Full</p>
                      <p className="text-[11px] text-diamond-500">Complete payment now — {format(totalPrice)}</p>
                    </div>
                    <Wallet className={`w-4 h-4 ${paymentOption === 'full' ? 'text-turquoise-400' : 'text-diamond-600'}`} />
                  </button>

                  <button
                    onClick={() => setPaymentOption('split')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                      paymentOption === 'split'
                        ? 'bg-turquoise-500/10 border-turquoise-400/40 shadow-glow-turquoise'
                        : 'bg-obsidian-800 border-slate-700/40 hover:border-turquoise-400/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      paymentOption === 'split' ? 'border-turquoise-400 bg-turquoise-400' : 'border-slate-600'
                    }`}>
                      {paymentOption === 'split' && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={4} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-bold ${paymentOption === 'split' ? 'text-turquoise-300' : 'text-diamond-200'}`}>Split the Bill with the Crew</p>
                      <p className="text-[11px] text-diamond-500">4-way split — {format(Math.round(totalPrice / 4))} per person</p>
                    </div>
                    <Users className={`w-4 h-4 ${paymentOption === 'split' ? 'text-turquoise-400' : 'text-diamond-600'}`} />
                  </button>

                  <button
                    onClick={() => setPaymentOption('deposit')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                      paymentOption === 'deposit'
                        ? 'bg-gold-500/10 border-gold-400/40 shadow-glow-gold'
                        : 'bg-obsidian-800 border-slate-700/40 hover:border-gold-400/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      paymentOption === 'deposit' ? 'border-gold-400 bg-gold-400' : 'border-slate-600'
                    }`}>
                      {paymentOption === 'deposit' && <Check className="w-3 h-3 text-obsidian-950" strokeWidth={4} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-bold ${paymentOption === 'deposit' ? 'text-gold-400' : 'text-diamond-200'}`}>Lock In Spot with 20% Deposit</p>
                      <p className="text-[11px] text-diamond-500">Pay {format(depositAmount)} now, rest due 14 days before trip</p>
                    </div>
                    <CalendarClock className={`w-4 h-4 ${paymentOption === 'deposit' ? 'text-gold-400' : 'text-diamond-600'}`} />
                  </button>
                </div>

                {/* Credit card form */}
                <div className="space-y-3">
                  {/* Cardholder name */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="JANE TRAVELER"
                      className="w-full bg-obsidian-800 rounded-xl px-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all uppercase tracking-wide"
                    />
                  </div>

                  {/* Card number */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-obsidian-800 rounded-xl px-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all tabular-nums tracking-wider pr-12"
                      />
                      <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-diamond-600" />
                    </div>
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">Expiry</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full bg-obsidian-800 rounded-xl px-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all tabular-nums tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-diamond-500 font-semibold mb-1.5">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(formatCvv(e.target.value))}
                        placeholder="123"
                        className="w-full bg-obsidian-800 rounded-xl px-4 py-3 text-sm text-diamond-100 placeholder:text-diamond-600 outline-none border border-slate-700/40 focus:border-turquoise-400/60 focus:shadow-glow-turquoise transition-all tabular-nums tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 mt-4 mb-5 text-[11px] text-diamond-500">
                  <Lock className="w-3.5 h-3.5 text-mint-400 shrink-0" />
                  <span>256-bit encrypted · Your payment is secure</span>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleConfirm}
                  className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-obsidian-950 text-base font-bold shadow-glow-turquoise hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {paymentOption === 'deposit'
                    ? `Pay ${format(depositAmount)} Deposit`
                    : paymentOption === 'split'
                      ? `Pay ${format(Math.round(totalPrice / 4))} Now`
                      : `Pay ${format(totalPrice)}`}
                  <Check className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
