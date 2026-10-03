import { createContext, useContext, useState, type ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // multiply USD price by this
}

export const currencies: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', label: 'USD', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP', rate: 0.79 },
  INR: { code: 'INR', symbol: '₹', label: 'INR', rate: 83.5 },
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  symbol: string;
  convert: (usdPrice: number) => number;
  format: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const symbol = currencies[currency].symbol;

  const convert = (usdPrice: number) => {
    return Math.round(usdPrice * currencies[currency].rate);
  };

  const format = (usdPrice: number) => {
    const converted = convert(usdPrice);
    return `${symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
