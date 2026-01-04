import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface MobileProductCardProps {
  product: Product;
  className?: string;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className={cn("block", className)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full shadow-sm transition-colors",
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white text-gray-600 hover:text-red-500"
            )}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Weight */}
            <span className="text-xs text-gray-500">
              {product.weight}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2"
            size="sm"
          >
            <ShoppingCart size={14} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default MobileProductCard;