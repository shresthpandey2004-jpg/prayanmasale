import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CouponProvider } from "@/context/CouponContext";
import { ReferralProvider } from "@/context/ReferralContext";
import { LoyaltyProvider } from "@/context/LoyaltyContext";
import { ReviewProvider } from "@/context/ReviewContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import Auth from "./pages/Auth";
import AccountSimple from "./pages/AccountSimple";
import AdminDashboard from "./pages/AdminDashboard";
import Referrals from "./pages/Referrals";
import Loyalty from "./pages/Loyalty";
import ReturnPolicy from "./pages/ReturnPolicy";
import NotFound from "./pages/NotFound";
import MobileBottomNav from "./components/mobile/MobileBottomNav";
import PWAInstallPrompt from "./components/mobile/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReferralProvider>
          <LoyaltyProvider>
            <ReviewProvider>
              <WishlistProvider>
                <CouponProvider>
                  <OrderProvider>
                    <CartProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                          <div className="min-h-screen bg-background">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/shop" element={<Shop />} />
                              <Route path="/product/:id" element={<ProductDetail />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                              <Route path="/my-orders" element={<MyOrders />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/account" element={<AccountSimple />} />
                              <Route path="/referrals" element={<Referrals />} />
                              <Route path="/loyalty" element={<Loyalty />} />
                              <Route path="/return-policy" element={<ReturnPolicy />} />
                              <Route path="/admin" element={<AdminDashboard />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                            
                            {/* Mobile-specific components */}
                            <MobileBottomNav />
                            <PWAInstallPrompt />
                          </div>
                        </BrowserRouter>
                      </TooltipProvider>
                    </CartProvider>
                  </OrderProvider>
                </CouponProvider>
              </WishlistProvider>
            </ReviewProvider>
          </LoyaltyProvider>
        </ReferralProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
