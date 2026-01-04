import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  MapPin, 
  Clock,
  X,
  TrendingUp,
  Users
} from 'lucide-react';

interface PurchaseNotification {
  id: string;
  customerName: string;
  productName: string;
  location: string;
  timeAgo: string;
  type: 'purchase' | 'review' | 'signup';
}

// Sample notifications data
const SAMPLE_NOTIFICATIONS: PurchaseNotification[] = [
  {
    id: '1',
    customerName: 'Priya S.',
    productName: 'Premium Garam Masala',
    location: 'Mumbai',
    timeAgo: '2 minutes ago',
    type: 'purchase'
  },
  {
    id: '2',
    customerName: 'Rajesh K.',
    productName: 'Organic Turmeric Powder',
    location: 'Delhi',
    timeAgo: '5 minutes ago',
    type: 'purchase'
  },
  {
    id: '3',
    customerName: 'Anita M.',
    productName: 'Red Chili Powder',
    location: 'Bangalore',
    timeAgo: '8 minutes ago',
    type: 'review'
  },
  {
    id: '4',
    customerName: 'Vikram P.',
    productName: 'Coriander Seeds',
    location: 'Pune',
    timeAgo: '12 minutes ago',
    type: 'purchase'
  },
  {
    id: '5',
    customerName: 'Meera J.',
    productName: 'Cumin Powder',
    location: 'Chennai',
    timeAgo: '15 minutes ago',
    type: 'signup'
  }
];

const SocialProofNotifications = () => {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize with sample data
    setNotifications(SAMPLE_NOTIFICATIONS);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000);

    // Then show random notifications every 15-25 seconds
    const interval = setInterval(() => {
      if (!isVisible) {
        showNotification();
      }
    }, Math.random() * 10000 + 15000); // Random between 15-25 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [notifications, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-green-600" />;
      case 'review':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'signup':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-green-600" />;
    }
  };

  const getNotificationText = (notification: PurchaseNotification) => {
    switch (notification.type) {
      case 'purchase':
        return `just purchased ${notification.productName}`;
      case 'review':
        return `left a 5-star review for ${notification.productName}`;
      case 'signup':
        return `just joined Prayan Masale`;
      default:
        return `just purchased ${notification.productName}`;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'border-l-green-500 bg-green-50';
      case 'review':
        return 'border-l-blue-500 bg-blue-50';
      case 'signup':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  if (!currentNotification || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-in-left">
      <Card className={`w-80 shadow-lg border-l-4 ${getNotificationColor(currentNotification.type)} transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                {getNotificationIcon(currentNotification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    {currentNotification.customerName}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {getNotificationText(currentNotification)}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentNotification.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentNotification.timeAgo}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialProofNotifications;