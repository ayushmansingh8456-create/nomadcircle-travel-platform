import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TripGrid from '@/components/TripGrid';
import DestinationWardrobe from '@/components/DestinationWardrobe';
import Boutique from '@/components/Boutique';
import CohortLounge from '@/components/CohortLounge';
import CohortRadar from '@/components/CohortRadar';
import NomadCapsuleBuilder from '@/components/NomadCapsuleBuilder';
import StarfieldBackground from '@/components/StarfieldBackground';
import CheckoutModal from '@/components/CheckoutModal';
import ShoppingBagSidebar from '@/components/ShoppingBagSidebar';
import AuthModal from '@/components/AuthModal';
import VibeMatcher from '@/components/VibeMatcher';
import { type VibeSelection } from '@/data/vibes';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';

type TripType = 'crew' | 'stranger';

export default function App() {
  const [tripType, setTripType] = useState<TripType>('stranger');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [vibeSelection, setVibeSelection] = useState<VibeSelection | null>(null);
  const [vibeFilterOn, setVibeFilterOn] = useState(false);
  const activeVibe = vibeFilterOn && vibeSelection ? vibeSelection.vibe : null;

  return (
    <AuthProvider>
      <CurrencyProvider>
        <CheckoutProvider>
          <CartProvider>
            <div className="relative min-h-screen">
            <StarfieldBackground />
            <Navbar onAuthClick={() => setAuthModalOpen(true)} />
            <main>
              <Hero tripType={tripType} onTripTypeChange={setTripType} />
              <TripGrid vibeFilter={activeVibe} />
              <VibeMatcher
                selection={vibeSelection}
                filterOn={vibeFilterOn}
                onComplete={(selection) => {
                  setVibeSelection(selection);
                  setVibeFilterOn(true);
                }}
                onReset={() => {
                  setVibeSelection(null);
                  setVibeFilterOn(false);
                }}
                onFilterChange={setVibeFilterOn}
              />
              <DestinationWardrobe vibeFilter={activeVibe} />
              <Boutique />
              <CohortLounge />
              <CohortRadar />
              <NomadCapsuleBuilder />
            </main>
            <ShoppingBagSidebar />
            <CheckoutModal />
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            </div>
          </CartProvider>
        </CheckoutProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
