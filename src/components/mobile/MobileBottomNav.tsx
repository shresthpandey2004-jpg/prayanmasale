import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: location.pathname === '/'
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: Search,
      active: location.pathname === '/shop'
    },
    {
      name: 'Cart',
      href: '#',
      icon: ShoppingBag,
      active: false,
      badge: totalItems,
      onClick: () => setIsCartOpen(true)
    },
    {
      name: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      active: location.pathname === '/wishlist'
    },
    {
      name: 'Account',
      href: isAuthenticated ? '/account' : '/auth',
      icon: User,
      active: location.pathname === '/account' || location.pathname === '/auth'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 relative",
                  "hover:bg-gray-50 transition-colors",
                  item.active ? "text-orange-500" : "text-gray-600"
                )}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 relative",
                "hover:bg-gray-50 transition-colors",
                item.active ? "text-orange-500" : "text-gray-600"
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;