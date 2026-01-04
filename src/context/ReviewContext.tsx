import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  images?: string[]; // Optional review images
  verified: boolean; // Verified purchase
  helpful: number; // Helpful votes
  timestamp: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number }; // 1-5 star counts
}

interface ReviewContextType {
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'userId' | 'userName' | 'helpful' | 'timestamp'>) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductStats: (productId: string) => ReviewStats;
  getUserReviews: () => ProductReview[];
  markHelpful: (reviewId: string) => void;
  canUserReview: (productId: string) => boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('prayan-reviews');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('prayan-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'userId' | 'userName' | 'helpful' | 'timestamp'>) => {
    if (!user) return;

    // Check if user has purchased this product
    const orders = JSON.parse(localStorage.getItem('prayan-orders') || '[]');
    const userOrders = orders.filter((order: any) => 
      order.customerDetails.email === user.email && order.status === 'delivered'
    );
    
    const hasPurchased = userOrders.some((order: any) =>
      order.items.some((item: any) => item.id === reviewData.productId)
    );

    const newReview: ProductReview = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      helpful: 0,
      timestamp: new Date().toISOString(),
      verified: hasPurchased,
      ...reviewData
    };

    setReviews(prev => [...prev, newReview]);
  };

  const getProductReviews = (productId: string): ProductReview[] => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getProductStats = (productId: string): ReviewStats => {
    const productReviews = getProductReviews(productId);
    
    if (productReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;

    const ratingDistribution = productReviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, {} as { [key: number]: number });

    // Ensure all ratings 1-5 are present
    for (let i = 1; i <= 5; i++) {
      if (!ratingDistribution[i]) ratingDistribution[i] = 0;
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: productReviews.length,
      ratingDistribution
    };
  };

  const getUserReviews = (): ProductReview[] => {
    if (!user) return [];
    return reviews
      .filter(review => review.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const markHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const canUserReview = (productId: string): boolean => {
    if (!user) return false;

    // Check if user already reviewed this product
    const hasReviewed = reviews.some(review => 
      review.productId === productId && review.userId === user.id
    );

    if (hasReviewed) return false;

    // Check if user has purchased this product
    const orders = JSON.parse(localStorage.getItem('prayan-orders') || '[]');
    const userOrders = orders.filter((order: any) => 
      order.customerDetails.email === user.email && order.status === 'delivered'
    );
    
    return userOrders.some((order: any) =>
      order.items.some((item: any) => item.id === productId)
    );
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        getProductStats,
        getUserReviews,
        markHelpful,
        canUserReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};