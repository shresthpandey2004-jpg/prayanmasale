import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  points: number;
  orderId?: string;
  description: string;
  timestamp: string;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercentage: number;
  color: string;
}

interface LoyaltyContextType {
  userPoints: number;
  userTier: LoyaltyTier;
  transactions: LoyaltyTransaction[];
  earnPoints: (orderId: string, orderAmount: number) => void;
  redeemPoints: (points: number, orderId: string) => boolean;
  getPointsValue: (points: number) => number;
  canRedeem: (points: number) => boolean;
  getNextTier: () => LoyaltyTier | null;
  getProgressToNextTier: () => { current: number; required: number; percentage: number };
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    benefits: ['1% cashback on orders', 'Birthday discount'],
    discountPercentage: 1,
    color: 'bg-amber-600'
  },
  {
    name: 'Silver',
    minPoints: 500,
    benefits: ['2% cashback on orders', 'Free shipping on ₹299+', 'Early access to sales'],
    discountPercentage: 2,
    color: 'bg-gray-400'
  },
  {
    name: 'Gold',
    minPoints: 1500,
    benefits: ['3% cashback on orders', 'Free shipping always', 'Exclusive products', 'Priority support'],
    discountPercentage: 3,
    color: 'bg-yellow-500'
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    benefits: ['5% cashback on orders', 'Free express shipping', 'Personal spice consultant', 'VIP events'],
    discountPercentage: 5,
    color: 'bg-purple-600'
  }
];

const POINTS_PER_RUPEE = 1; // 1 point per ₹10 spent
const RUPEES_PER_POINT = 0.1; // 1 point = ₹0.10

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>(() => {
    const saved = localStorage.getItem('prayan-loyalty-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('prayan-loyalty-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Calculate user points
  const userTransactions = transactions.filter(t => t.userId === user?.id);
  const userPoints = userTransactions.reduce((total, transaction) => {
    return transaction.type === 'earned' ? total + transaction.points : total - transaction.points;
  }, 0);

  // Determine user tier
  const userTier = LOYALTY_TIERS
    .slice()
    .reverse()
    .find(tier => userPoints >= tier.minPoints) || LOYALTY_TIERS[0];

  const earnPoints = (orderId: string, orderAmount: number) => {
    if (!user) return;

    const pointsEarned = Math.floor(orderAmount / 10) * POINTS_PER_RUPEE;
    
    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'earned',
      points: pointsEarned,
      orderId,
      description: `Earned ${pointsEarned} points from order #${orderId.slice(-6)}`,
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [...prev, transaction]);
  };

  const redeemPoints = (points: number, orderId: string): boolean => {
    if (!user || !canRedeem(points)) return false;

    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'redeemed',
      points,
      orderId,
      description: `Redeemed ${points} points for ₹${getPointsValue(points)} discount`,
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [...prev, transaction]);
    return true;
  };

  const getPointsValue = (points: number): number => {
    return Math.floor(points * RUPEES_PER_POINT);
  };

  const canRedeem = (points: number): boolean => {
    return userPoints >= points && points >= 100; // Minimum 100 points to redeem
  };

  const getNextTier = (): LoyaltyTier | null => {
    const currentTierIndex = LOYALTY_TIERS.findIndex(tier => tier.name === userTier.name);
    return currentTierIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentTierIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) {
      return { current: userPoints, required: userTier.minPoints, percentage: 100 };
    }

    const current = userPoints - userTier.minPoints;
    const required = nextTier.minPoints - userTier.minPoints;
    const percentage = Math.min((current / required) * 100, 100);

    return { current: userPoints, required: nextTier.minPoints, percentage };
  };

  return (
    <LoyaltyContext.Provider
      value={{
        userPoints,
        userTier,
        transactions: userTransactions,
        earnPoints,
        redeemPoints,
        getPointsValue,
        canRedeem,
        getNextTier,
        getProgressToNextTier,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};