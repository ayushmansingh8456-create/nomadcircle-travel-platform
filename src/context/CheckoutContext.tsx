import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem } from '@/context/CartContext';

export interface CheckoutItem {
  type: 'trip' | 'wardrobe';
  title: string;
  subtitle: string;
  price: number;
  image: string;
  tripId?: string;
  dates?: string;
  destination?: string;
  cartItems?: CartItem[];
  paymentOption?: 'full' | 'split';
}

interface CheckoutContextValue {
  isOpen: boolean;
  item: CheckoutItem | null;
  openCheckout: (item: CheckoutItem) => void;
  closeCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<CheckoutItem | null>(null);

  const openCheckout = (checkoutItem: CheckoutItem) => {
    setItem(checkoutItem);
    setIsOpen(true);
  };

  const closeCheckout = () => {
    setIsOpen(false);
    setItem(null);
  };

  return (
    <CheckoutContext.Provider value={{ isOpen, item, openCheckout, closeCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
