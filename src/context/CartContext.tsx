import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  isSidebarOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load saved cart from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    supabase
      .from('cart_items')
      .select('id, item_id, item_name, item_subtitle, price, image')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) return;
        const loaded: CartItem[] = data.map((row) => ({
          id: row.item_id,
          name: row.item_name,
          subtitle: row.item_subtitle,
          price: row.price,
          image: row.image,
        }));
        setItems(loaded);
      });
  }, [user]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsSidebarOpen(true);
    if (user) {
      supabase.from('cart_items').insert({
        item_id: item.id,
        item_name: item.name,
        item_subtitle: item.subtitle,
        price: item.price,
        image: item.image,
      }).then(({ error }) => {
        if (error) console.warn('Failed to sync cart item:', error.message);
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (user) {
      supabase.from('cart_items').delete().eq('item_id', id).then(({ error }) => {
        if (error) console.warn('Failed to remove cart item:', error.message);
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      supabase.from('cart_items').delete().neq('item_id', '___never___').then(({ error }) => {
        if (error) console.warn('Failed to clear cart:', error.message);
      });
    }
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <CartContext.Provider
      value={{ items, isSidebarOpen, addToCart, removeFromCart, clearCart, openSidebar, closeSidebar, itemCount: items.length }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
