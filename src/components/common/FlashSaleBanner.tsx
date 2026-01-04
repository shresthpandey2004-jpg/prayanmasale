import { useState, useEffect } from 'react';
import { useFlashSales } from '@/context/FlashSaleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Flame, 
  ShoppingCart, 
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';

const FlashSaleBanner = () => {
  const { activeFlashSales, getTimeRemaining } = useFlashSales();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (activeFlashSales.length === 0) return null;

  const featuredSale = activeFlashSales[0]; // Show the first active sale
  const timeRemaining = getTimeRemaining(featuredSale.endTime);
  const stockPercentage = ((featuredSale.stockLimit - featuredSale.soldCount) / featuredSale.stockLimit) * 100;

  if (!timeRemaining) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-4 px-4 mb-6">
      <div className="container mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Flash Sale Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Flame className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold text-lg">FLASH SALE</span>
                      <Badge className="bg-yellow-400 text-black font-bold">
                        {featuredSale.discountPercentage}% OFF
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm">{featuredSale.title}</p>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Ends in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[50px]">
                      <div className="text-xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</div>
                      <div className="text-xs">Hours</div>
                    </div>
                    <span className="text-xl">:</span>
                    <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[50px]">
                      <div className="text-xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                      <div className="text-xs">Mins</div>
                    </div>
                    <span className="text-xl">:</span>
                    <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[50px]">
                      <div className="text-xl font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                      <div className="text-xs">Secs</div>
                    </div>
                  </div>
                </div>

                {/* Stock Info */}
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Stock:</span>
                  </div>
                  <div className="text-lg font-bold">
                    {featuredSale.stockLimit - featuredSale.soldCount} left
                  </div>
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => navigate(`/product/${featuredSale.productId}`)}
                  className="bg-white text-red-600 hover:bg-white/90 font-bold px-6 py-3 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Price Display */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-white/70">Original Price</div>
                  <div className="text-lg line-through text-white/60">₹{featuredSale.originalPrice}</div>
                </div>
                <div className="text-4xl font-bold text-yellow-300">→</div>
                <div className="text-center">
                  <div className="text-sm text-white/70">Flash Sale Price</div>
                  <div className="text-2xl font-bold text-yellow-300">₹{featuredSale.salePrice}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white/70">You Save</div>
                  <div className="text-xl font-bold text-green-300">₹{featuredSale.originalPrice - featuredSale.salePrice}</div>
                </div>
              </div>
            </div>

            {/* Urgency Message */}
            <div className="mt-4 text-center">
              <p className="text-yellow-200 font-medium animate-pulse">
                🔥 {featuredSale.soldCount} people already bought this! Don't miss out! 🔥
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashSaleBanner;