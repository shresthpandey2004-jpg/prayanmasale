import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // percentage (10 = 10%) or fixed amount (100 = ₹100)
  minOrderAmount: number;
  maxDiscount?: number; // for percentage coupons
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  firstTimeOnly?: boolean;
}

interface CouponContextType {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, orderAmount: number, isFirstTime?: boolean) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
  calculateDiscount: (coupon: Coupon, orderAmount: number) => number;
  getAvailableCoupons: (orderAmount: number, isFirstTime?: boolean) => Coupon[];
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

// Default coupons
const defaultCoupons: Coupon[] = [
  {
    id: 'welcome10',
    code: 'WELCOME10',
    description: 'Welcome offer - 10% off on first order',
    type: 'percentage',
    value: 10,
    minOrderAmount: 299,
    maxDiscount: 200,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 1000,
    usedCount: 0,
    isActive: true,
    firstTimeOnly: true
  },
  {
    id: 'prayan10',
    code: 'PRAYAN10',
    description: '10% off on orders above ₹499',
    type: 'percentage',
    value: 10,
    minOrderAmount: 499,
    maxDiscount: 150,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 500,
    usedCount: 0,
    isActive: true
  },
  {
    id: 'flat50',
    code: 'FLAT50',
    description: 'Flat ₹50 off on orders above ₹399',
    type: 'fixed',
    value: 50,
    minOrderAmount: 399,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 200,
    usedCount: 0,
    isActive: true
  },
  {
    id: 'freeship',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    type: 'free_shipping',
    value: 0,
    minOrderAmount: 199,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 1000,
    usedCount: 0,
    isActive: true
  },
  {
    id: 'spice25',
    code: 'SPICE25',
    description: '25% off on Pure Spices category',
    type: 'percentage',
    value: 25,
    minOrderAmount: 299,
    maxDiscount: 300,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    applicableCategories: ['Pure Spices']
  },
  {
    id: 'combo20',
    code: 'COMBO20',
    description: '20% off on Combo Packs',
    type: 'percentage',
    value: 20,
    minOrderAmount: 599,
    maxDiscount: 250,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 150,
    usedCount: 0,
    isActive: true,
    applicableCategories: ['Combo Packs']
  }
];

export const CouponProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('prayan-coupons');
    return saved ? JSON.parse(saved) : defaultCoupons;
  });
  
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem('prayan-coupons', JSON.stringify(coupons));
  }, [coupons]);

  const calculateDiscount = (coupon: Coupon, orderAmount: number): number => {
    if (coupon.type === 'percentage') {
      const discount = (orderAmount * coupon.value) / 100;
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    } else if (coupon.type === 'fixed') {
      return Math.min(coupon.value, orderAmount);
    }
    return 0;
  };

  const applyCoupon = (code: string, orderAmount: number, isFirstTime = false) => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code', discount: 0 };
    }

    if (!coupon.isActive) {
      return { success: false, message: 'This coupon is no longer active', discount: 0 };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: 'This coupon has reached its usage limit', discount: 0 };
    }

    if (orderAmount < coupon.minOrderAmount) {
      return { 
        success: false, 
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`, 
        discount: 0 
      };
    }

    if (coupon.firstTimeOnly && !isFirstTime) {
      return { 
        success: false, 
        message: 'This coupon is only valid for first-time customers', 
        discount: 0 
      };
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      return { success: false, message: 'This coupon has expired', discount: 0 };
    }

    const discount = calculateDiscount(coupon, orderAmount);
    setAppliedCoupon(coupon);

    // Update usage count
    setCoupons(prev => prev.map(c => 
      c.id === coupon.id ? { ...c, usedCount: c.usedCount + 1 } : c
    ));

    return { 
      success: true, 
      message: `Coupon applied! You saved ₹${discount}`, 
      discount 
    };
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      // Revert usage count
      setCoupons(prev => prev.map(c => 
        c.id === appliedCoupon.id ? { ...c, usedCount: Math.max(0, c.usedCount - 1) } : c
      ));
      setAppliedCoupon(null);
    }
  };

  const getAvailableCoupons = (orderAmount: number, isFirstTime = false): Coupon[] => {
    return coupons.filter(coupon => {
      if (!coupon.isActive) return false;
      if (coupon.usedCount >= coupon.usageLimit) return false;
      if (coupon.firstTimeOnly && !isFirstTime) return false;
      
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);
      
      if (now < validFrom || now > validUntil) return false;
      
      return orderAmount >= coupon.minOrderAmount;
    });
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        getAvailableCoupons,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};