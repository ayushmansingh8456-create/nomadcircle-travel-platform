import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TripGrid from '@/components/TripGrid';
import DestinationWardrobe from '@/components/DestinationWardrobe';
import Boutique from '@/components/Boutique';
import CohortLounge from '@/components/CohortLounge';
import CohortRadar from '@/components/CohortRadar';
import PackingAssistant from '@/components/PackingAssistant';
import CheckoutModal from '@/components/CheckoutModal';
import ShoppingBagSidebar from '@/components/ShoppingBagSidebar';
import AuthModal from '@/components/AuthModal';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';

type TripType = 'crew' | 'stranger';

export default function App() {
  const [tripType, setTripType] = useState<TripType>('stranger');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CurrencyProvider>
        <CheckoutProvider>
          <CartProvider>
            <div className="min-h-screen bg-obsidian-950">
            <Navbar onAuthClick={() => setAuthModalOpen(true)} />
            <main>
              <Hero tripType={tripType} onTripTypeChange={setTripType} />
              <TripGrid />
              <DestinationWardrobe />
              <Boutique />
              <CohortLounge />
              <CohortRadar />
              <PackingAssistant />
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
