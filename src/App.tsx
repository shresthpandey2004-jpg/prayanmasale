import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

// Inline TermsConditions component to avoid build issues
const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Terms & Conditions</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Terms and Conditions</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Prayan Royal Spice Emporium. By using our website and services, 
                you agree to comply with and be bound by the following terms and conditions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Business Information</h3>
              <p className="text-gray-700 mb-4">
                Prayan Royal Spice Emporium is a premium spice retailer specializing in authentic 
                Indian masalas and spices. We are committed to providing high-quality products 
                and excellent customer service.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Use of Service</h3>
              <p className="text-gray-700 mb-4">
                You may use our service to browse and purchase authentic Indian spices and masalas.
                You agree to provide accurate information and use the service lawfully. You must be 
                at least 18 years old to make purchases.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Orders and Payments</h3>
              <p className="text-gray-700 mb-4">
                All orders are subject to availability and acceptance. We reserve the right to 
                refuse or cancel orders. We accept various payment methods including UPI, credit/debit 
                cards, and cash on delivery. All prices are in Indian Rupees (₹) and include applicable taxes.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">4. Product Quality & Food Safety</h3>
              <p className="text-gray-700 mb-4">
                We maintain strict quality standards for all our spices and masalas. All products 
                are stored in hygienic conditions and have proper expiry dates. We comply with 
                food safety regulations and FSSAI guidelines.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">5. Contact Information</h3>
              <p className="text-gray-700 mb-4">
                For questions about these terms, product inquiries, or customer support, 
                please contact us:
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>WhatsApp:</strong> +91 8866658919<br />
                  <strong>Business Hours:</strong> 9:00 AM - 8:00 PM (Mon-Sat)
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              <strong>Last updated:</strong> January 2025<br />
              <strong>Effective from:</strong> January 1, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
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
                            <Route path="/terms-conditions" element={<TermsConditions />} />
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

export default App;
