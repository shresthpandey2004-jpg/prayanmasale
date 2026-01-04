import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User, Heart, ChevronDown, LogOut, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Shop', 
    href: '/shop',
    submenu: [
      { name: 'All Spices', href: '/shop' },
      { name: 'Pure Spices', href: '/shop?category=pure-spices' },
      { name: 'Blended Spices', href: '/shop?category=blended-spices' },
      { name: 'Whole Spices', href: '/shop?category=whole-spices' },
      { name: 'Combo Packs', href: '/shop?category=combo-packs' },
    ]
  },
  { name: 'Recipes', href: '/recipes' },
  { name: 'Our Story', href: '/about' },
  { name: 'Export Inquiry', href: '/export' },
  { name: 'Contact', href: '/contact' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-accent text-accent-foreground text-center py-2 px-4 text-sm font-body">
        <p>
          🎉 Free Shipping on orders above ₹499 | Use code <span className="font-semibold text-gold">PRAYAN10</span> for 10% off
        </p>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-soft'
            : 'bg-background'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-display text-2xl font-bold text-primary-foreground">प्</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">PRAYAN</h1>
                <p className="text-xs text-muted-foreground -mt-1">Pure Taste, Pure Emotions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      location.pathname === item.href
                        ? 'text-primary bg-secondary'
                        : 'text-foreground hover:text-primary hover:bg-secondary/50'
                    )}
                  >
                    {item.name}
                    {item.submenu && <ChevronDown size={14} className="mt-0.5" />}
                  </Link>

                  {/* Dropdown */}
                  {item.submenu && activeSubmenu === item.name && (
                    <div className="absolute top-full left-0 pt-2 animate-fade-in">
                      <div className="bg-popover rounded-xl shadow-medium border border-border p-2 min-w-[200px]">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to="/wishlist"
                className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                to="/wishlist"
                className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* User Account */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2.5 rounded-full hover:bg-secondary transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 hidden sm:block" />
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                        <div className="p-3 border-b border-border">
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/account"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            My Orders
                          </Link>
                          <Link
                            to="/loyalty"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Gift className="w-4 h-4" />
                            Loyalty Points
                          </Link>
                          <Link
                            to="/referrals"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Gift className="w-4 h-4" />
                            Refer & Earn
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Login"
                  >
                    <User size={20} />
                  </Link>
                )}
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="font-display text-2xl font-bold text-foreground">
                  PRAYAN
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'block px-4 py-3 rounded-lg font-medium transition-colors',
                        location.pathname === item.href
                          ? 'bg-secondary text-primary'
                          : 'hover:bg-secondary'
                      )}
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/account">My Account</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/my-orders">My Orders</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/loyalty">Loyalty Points</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/referrals">Refer & Earn</Link>
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/my-orders">Track Order</Link>
                    </Button>
                    <Button variant="premium" className="w-full" asChild>
                      <Link to="/auth">Login / Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl mx-4 animate-fade-in">
            <div className="bg-background rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-4">
                <Search size={24} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for spices, recipes..."
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
