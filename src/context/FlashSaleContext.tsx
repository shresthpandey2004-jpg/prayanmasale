import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FlashSale {
  id: string;
  productId: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  stockLimit: number;
  soldCount: number;
  isActive: boolean;
  title: string;
  description: string;
}

interface FlashSaleContextType {
  activeFlashSales: FlashSale[];
  getProductFlashSale: (productId: string) => FlashSale | null;
  isProductOnSale: (productId: string) => boolean;
  getTimeRemaining: (endTime: string) => { hours: number; minutes: number; seconds: number } | null;
  purchaseFlashSaleItem: (saleId: string) => boolean;
}

const FlashSaleContext = createContext<FlashSaleContextType | undefined>(undefined);

// Sample flash sales data
const SAMPLE_FLASH_SALES: FlashSale[] = [
  {
    id: 'flash-1',
    productId: 'garam-masala-100g',
    originalPrice: 120,
    salePrice: 89,
    discountPercentage: 26,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    stockLimit: 50,
    soldCount: 23,
    isActive: true,
    title: 'Flash Sale: Premium Garam Masala',
    description: 'Limited time offer - Only today!'
  },
  {
    id: 'flash-2',
    productId: 'turmeric-powder-200g',
    originalPrice: 80,
    salePrice: 59,
    discountPercentage: 26,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    stockLimit: 30,
    soldCount: 18,
    isActive: true,
    title: 'Flash Sale: Pure Turmeric',
    description: 'Hurry! Limited stock available'
  },
  {
    id: 'flash-3',
    productId: 'red-chili-powder-250g',
    originalPrice: 150,
    salePrice: 99,
    discountPercentage: 34,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    stockLimit: 25,
    soldCount: 12,
    isActive: true,
    title: 'Flash Sale: Spicy Red Chili',
    description: 'Best quality at lowest price!'
  }
];

export const FlashSaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>(() => {
    const saved = localStorage.getItem('prayan-flash-sales');
    return saved ? JSON.parse(saved) : SAMPLE_FLASH_SALES;
  });

  useEffect(() => {
    localStorage.setItem('prayan-flash-sales', JSON.stringify(flashSales));
  }, [flashSales]);

  // Update active status based on current time
  useEffect(() => {
    const updateActiveStatus = () => {
      const now = new Date().getTime();
      setFlashSales(prev => prev.map(sale => ({
        ...sale,
        isActive: now >= new Date(sale.startTime).getTime() && 
                 now <= new Date(sale.endTime).getTime() &&
                 sale.soldCount < sale.stockLimit
      })));
    };

    updateActiveStatus();
    const interval = setInterval(updateActiveStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const activeFlashSales = flashSales.filter(sale => sale.isActive);

  const getProductFlashSale = (productId: string): FlashSale | null => {
    return activeFlashSales.find(sale => sale.productId === productId) || null;
  };

  const isProductOnSale = (productId: string): boolean => {
    return activeFlashSales.some(sale => sale.productId === productId);
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) return null;

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const purchaseFlashSaleItem = (saleId: string): boolean => {
    const sale = flashSales.find(s => s.id === saleId);
    if (!sale || !sale.isActive || sale.soldCount >= sale.stockLimit) {
      return false;
    }

    setFlashSales(prev => prev.map(s => 
      s.id === saleId ? { ...s, soldCount: s.soldCount + 1 } : s
    ));

    return true;
  };

  return (
    <FlashSaleContext.Provider
      value={{
        activeFlashSales,
        getProductFlashSale,
        isProductOnSale,
        getTimeRemaining,
        purchaseFlashSaleItem,
      }}
    >
      {children}
    </FlashSaleContext.Provider>
  );
};

export const useFlashSales = () => {
  const context = useContext(FlashSaleContext);
  if (!context) {
    throw new Error('useFlashSales must be used within a FlashSaleProvider');
  }
  return context;
};