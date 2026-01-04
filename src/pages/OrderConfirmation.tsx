import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders, type Order } from '@/context/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, MessageCircle, Home, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrder(orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, getOrder]);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast({
        title: "Order ID copied!",
        description: "You can use this to track your order.",
      });
    }
  };

  const openWhatsApp = () => {
    const message = `Hi! I just placed an order (ID: ${orderId}) on Prayan Masale website. Please confirm my order. Thank you!`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for choosing Prayan Masale</p>
        </div>
        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Button variant="outline" size="sm" onClick={copyOrderId}>
                <Copy className="w-4 h-4 mr-2" />
                Copy ID
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono font-bold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.timestamp).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{order.totalPrice}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium">
                {order.customerDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium">Order Confirmation</h4>
                <p className="text-sm text-gray-600">We'll call you within 30 minutes to confirm your order details.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium">Preparation</h4>
                <p className="text-sm text-gray-600">Your fresh spices will be packed with care.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium">Delivery</h4>
                <p className="text-sm text-gray-600">Your order will be delivered within 2-3 business days.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={openWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact us on WhatsApp
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="mt-6">
          <CardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact us for any queries about your order
            </p>
            <div className="flex justify-center gap-4">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-blue-600">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
              <a href="https://wa.me/919876543210" className="flex items-center gap-2 text-green-600">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;