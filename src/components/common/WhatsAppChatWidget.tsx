import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Phone,
  Clock,
  CheckCircle,
  Headphones
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';

const WhatsAppChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const chatOptions = [
    {
      id: 'product-help',
      title: 'Product Help',
      description: 'Need help choosing the right spices?',
      message: 'Hi! I need help choosing the right spices for my cooking. Can you help me?'
    },
    {
      id: 'order-support',
      title: 'Order Support',
      description: 'Questions about your order?',
      message: 'Hi! I have a question about my order. Can you please help me?'
    },
    {
      id: 'recipe-tips',
      title: 'Recipe Tips',
      description: 'Get cooking tips and recipes',
      message: 'Hi! I would like some recipe suggestions and cooking tips. Can you help?'
    },
    {
      id: 'bulk-order',
      title: 'Bulk Orders',
      description: 'Wholesale or bulk purchases',
      message: 'Hi! I am interested in bulk orders for my business. Can we discuss pricing?'
    }
  ];

  const handleOptionClick = (option: typeof chatOptions[0]) => {
    const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace('+', '')}?text=${encodeURIComponent(option.message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setSelectedOption(null);
  };

  const handleDirectChat = () => {
    const message = 'Hi! I visited your website and would like to know more about your spices.';
    const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-in-right">
          <Card className="w-80 shadow-xl border-2 border-green-200">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Prayan Masale</CardTitle>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      Online now
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  👋 Hi! How can we help you today?
                </p>
                
                <div className="space-y-2">
                  {chatOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-800">{option.title}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleDirectChat}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Usually replies instantly
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      100% Secure
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            1
          </div>
        )}
      </div>

      {/* Support Info Popup */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-30">
          <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-fade-in max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-green-500" />
              <span className="font-medium text-sm">Need Help?</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Chat with us for instant support!
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              <span>Available 9 AM - 8 PM</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppChatWidget;