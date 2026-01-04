import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Star,
  Gift,
  Crown,
  TrendingUp,
  Calendar,
  Award,
  Coins,
  ShoppingBag
} from 'lucide-react';

const Loyalty = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    userPoints, 
    userTier, 
    transactions, 
    getNextTier, 
    getProgressToNextTier,
    getPointsValue 
  } = useLoyalty();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to access your loyalty rewards.</p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/auth')} className="w-full">
                Login / Register
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextTier = getNextTier();
  const progress = getProgressToNextTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-800">Loyalty Rewards</h1>
        </div>

        {/* Loyalty Status Card */}
        <Card className="mb-8 overflow-hidden">
          <div className={`${userTier.color} text-white p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userTier.name} Member</h2>
                  <p className="text-white/90">Welcome back, {user?.name}!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
                <div className="text-white/90">Points Available</div>
                <div className="text-sm">Worth ₹{getPointsValue(userPoints)}</div>
              </div>
            </div>
          </div>
          
          {nextTier && (
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Progress to {nextTier.name}</span>
                <span className="text-sm text-gray-600">
                  {progress.current} / {progress.required} points
                </span>
              </div>
              <Progress value={progress.percentage} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">
                Earn {progress.required - progress.current} more points to reach {nextTier.name} tier
              </p>
            </CardContent>
          )}
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tier Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Your {userTier.name} Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-green-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Points History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-blue-500" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <Gift className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.timestamp).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.points} pts
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to earn your first points!</p>
                      <Button onClick={() => navigate('/shop')}>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Earn Points */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Shop & Earn</h4>
                    <p className="text-sm text-gray-600">Earn 1 point for every ₹10 spent</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Write Reviews</h4>
                    <p className="text-sm text-gray-600">Get 50 points for each product review</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Refer Friends</h4>
                    <p className="text-sm text-gray-600">Earn 100 points for each successful referral</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redeem Points */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redeem Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">₹10 Discount</span>
                      <Badge variant="outline">100 pts</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Use on any order above ₹299</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={userPoints < 100}
                    >
                      {userPoints >= 100 ? 'Redeem Now' : 'Need 100 pts'}
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">₹50 Discount</span>
                      <Badge variant="outline">500 pts</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Use on any order above ₹999</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={userPoints < 500}
                    >
                      {userPoints >= 500 ? 'Redeem Now' : 'Need 500 pts'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Bronze', points: '0+', color: 'bg-amber-600' },
                  { name: 'Silver', points: '500+', color: 'bg-gray-400' },
                  { name: 'Gold', points: '1,500+', color: 'bg-yellow-500' },
                  { name: 'Platinum', points: '3,000+', color: 'bg-purple-600' }
                ].map((tier) => (
                  <div key={tier.name} className={`p-3 rounded-lg text-white ${tier.color} ${
                    userTier.name === tier.name ? 'ring-2 ring-white ring-offset-2' : ''
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tier.name}</span>
                      <span className="text-sm">{tier.points} pts</span>
                    </div>
                    {userTier.name === tier.name && (
                      <Badge className="mt-2 bg-white text-gray-800">Current Tier</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;