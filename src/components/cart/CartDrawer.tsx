import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Tag, Percent } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCoupons } from '@/context/CouponContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount, getAvailableCoupons } = useCoupons();
  const { user } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const isFirstTimeUser = !user || user.createdAt === user.lastLogin;
  const availableCoupons = getAvailableCoupons(totalPrice, isFirstTimeUser);
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, totalPrice) : 0;
  const finalTotal = totalPrice - discount;

  if (!isCartOpen) return null;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        description: "Please enter a valid coupon code.",
        variant: "destructive"
      });
      return;
    }

    const result = applyCoupon(couponCode.trim(), totalPrice, isFirstTimeUser);
    
    if (result.success) {
      toast({
        title: "Coupon applied! 🎉",
        description: result.message,
      });
      setCouponCode('');
      setShowAvailableCoupons(false);
    } else {
      toast({
        title: "Coupon not applied",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Coupon removed",
      description: "Coupon has been removed from your order.",
    });
  };

  const handleQuickApplyCoupon = (code: string) => {
    const result = applyCoupon(code, totalPrice, isFirstTimeUser);
    
    if (result.success) {
      toast({
        title: "Coupon applied! 🎉",
        description: result.message,
      });
      setShowAvailableCoupons(false);
    } else {
      toast({
        title: "Coupon not applied",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-primary" />
            <h2 className="font-display text-xl font-semibold">Your Cart</h2>
            <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {totalItems} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Add some aromatic spices to your cart
              </p>
              <Button variant="premium" onClick={() => setIsCartOpen(false)} asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{item.weight}</p>
                    <p className="font-semibold text-primary">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 bg-secondary rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-muted rounded-l-lg transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted rounded-r-lg transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            {/* Coupon Section */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">-₹{discount}</span>
                    <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  
                  {availableCoupons.length > 0 && (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                        className="text-xs text-primary"
                      >
                        <Percent className="w-3 h-3 mr-1" />
                        {availableCoupons.length} coupon{availableCoupons.length > 1 ? 's' : ''} available
                      </Button>
                      
                      {showAvailableCoupons && (
                        <div className="mt-2 space-y-2">
                          {availableCoupons.slice(0, 3).map(coupon => (
                            <div
                              key={coupon.id}
                              className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded cursor-pointer hover:bg-orange-100"
                              onClick={() => handleQuickApplyCoupon(coupon.code)}
                            >
                              <div>
                                <p className="text-xs font-medium text-orange-800">{coupon.code}</p>
                                <p className="text-xs text-orange-600">{coupon.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : 
                                 coupon.type === 'fixed' ? `₹${coupon.value} OFF` : 'FREE SHIP'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount ({appliedCoupon.code})</span>
                  <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-cardamom">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="hero" className="w-full gap-2" asChild>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setIsCartOpen(false)} asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
