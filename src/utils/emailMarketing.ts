import { BUSINESS_CONFIG } from '@/config/business';

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  preferences: {
    newProducts: boolean;
    offers: boolean;
    recipes: boolean;
    newsletter: boolean;
  };
  tags: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  lastEmailSent?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'recipe';
  targetAudience: 'all' | 'new_customers' | 'loyal_customers' | 'inactive_customers';
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
}

// Email Templates
export const EMAIL_MARKETING_TEMPLATES = {
  welcome: (subscriberName: string) => ({
    subject: "Welcome to Prayan Masale Family! 🌶️",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">प्रयाण मसाले</h1>
          <p style="color: white; margin: 10px 0; font-size: 16px;">Pure Taste, Pure Emotions</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome ${subscriberName}! 🙏</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the Prayan Masale family! We're excited to share our journey of bringing 
            authentic, premium Indian spices directly from farmers to your kitchen.
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #f97316; margin-top: 0;">🎁 Welcome Gift</h3>
            <p style="margin: 15px 0;">Use code <strong style="background: #fef3c7; padding: 5px 10px; border-radius: 5px;">WELCOME10</strong> 
            and get 10% off on your first order!</p>
            <a href="https://prayanmasale.vercel.app/shop" 
               style="background: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Start Shopping
            </a>
          </div>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 25px 0;">
            <h4 style="color: #1e40af; margin-top: 0;">What to expect:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li>Weekly recipes using our premium spices</li>
              <li>Exclusive offers and early access to new products</li>
              <li>Tips for authentic Indian cooking</li>
              <li>Stories from our spice farmers</li>
            </ul>
          </div>
          
          <p style="color: #666; text-align: center; margin-top: 30px;">
            Follow us for daily spice inspiration:<br>
            <a href="${BUSINESS_CONFIG.social.instagram}" style="color: #f97316; text-decoration: none;">Instagram</a> | 
            <a href="${BUSINESS_CONFIG.social.facebook}" style="color: #f97316; text-decoration: none;">Facebook</a> | 
            <a href="${BUSINESS_CONFIG.social.youtube}" style="color: #f97316; text-decoration: none;">YouTube</a>
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Prayan Masale. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">${BUSINESS_CONFIG.address.street}, ${BUSINESS_CONFIG.address.city}</p>
        </div>
      </div>
    `
  }),

  weeklyNewsletter: (recipes: any[], newProducts: any[], offers: any[]) => ({
    subject: "This Week's Spice Stories & Recipes 🍛",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Weekly Spice Stories</h1>
          <p style="color: white; margin: 5px 0;">From Prayan Masale Kitchen</p>
        </div>
        
        <div style="padding: 30px;">
          ${recipes.length > 0 ? `
            <div style="margin-bottom: 30px;">
              <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">🍛 This Week's Recipes</h2>
              ${recipes.map(recipe => `
                <div style="background: #f9f9f9; padding: 20px; margin: 15px 0; border-radius: 8px;">
                  <h3 style="margin-top: 0; color: #333;">${recipe.name}</h3>
                  <p style="color: #666; margin: 10px 0;">${recipe.description}</p>
                  <p style="color: #f97316; font-weight: bold;">Key Spices: ${recipe.spices.join(', ')}</p>
                  <a href="${recipe.link}" style="color: #f97316; text-decoration: none;">Read Full Recipe →</a>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${newProducts.length > 0 ? `
            <div style="margin-bottom: 30px;">
              <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">🆕 New Arrivals</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                ${newProducts.map(product => `
                  <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center;">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px;">
                    <h4 style="margin: 10px 0; color: #333;">${product.name}</h4>
                    <p style="color: #f97316; font-weight: bold; font-size: 18px;">₹${product.price}</p>
                    <a href="https://prayanmasale.vercel.app/product/${product.id}" 
                       style="background: #f97316; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
                      Shop Now
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${offers.length > 0 ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
              <h2 style="color: #92400e; margin-top: 0;">🎁 Special Offers</h2>
              ${offers.map(offer => `
                <div style="margin: 15px 0;">
                  <h3 style="color: #92400e; margin: 5px 0;">${offer.title}</h3>
                  <p style="color: #92400e; margin: 5px 0;">${offer.description}</p>
                  <p style="color: #92400e; font-weight: bold;">Code: ${offer.code}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `
  }),

  abandonedCart: (customerName: string, cartItems: any[], cartTotal: number) => ({
    subject: "Your spices are waiting! Complete your order 🛒",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Don't Let Your Spices Wait!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p>Hi ${customerName},</p>
          <p>You left some amazing spices in your cart. Complete your order now and bring authentic flavors to your kitchen!</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Cart Items:</h3>
            ${cartItems.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <div>
                  <strong>${item.name}</strong><br>
                  <small>${item.weight} × ${item.quantity}</small>
                </div>
                <div style="font-weight: bold;">₹${item.price * item.quantity}</div>
              </div>
            `).join('')}
            <div style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold; color: #f97316;">
              Total: ₹${cartTotal}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://prayanmasale.vercel.app/checkout" 
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Complete Your Order
            </a>
          </div>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #1e40af;">
              🚚 <strong>Free Delivery</strong> on orders above ₹499<br>
              💯 <strong>100% Authentic</strong> spices from farmers
            </p>
          </div>
        </div>
      </div>
    `
  }),

  loyaltyReward: (customerName: string, rewardPoints: number, rewardValue: number) => ({
    subject: `You've earned ₹${rewardValue} in rewards! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Congratulations ${customerName}! 🎉</h1>
          <p style="color: white; margin: 10px 0; font-size: 18px;">You've earned loyalty rewards!</p>
        </div>
        
        <div style="padding: 30px; text-align: center;">
          <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 15px; padding: 30px; margin: 20px 0;">
            <h2 style="color: #059669; margin: 0; font-size: 36px;">₹${rewardValue}</h2>
            <p style="color: #059669; margin: 10px 0; font-size: 18px;">${rewardPoints} Reward Points</p>
            <p style="color: #065f46; margin: 0;">Available in your account</p>
          </div>
          
          <p style="color: #666; margin: 20px 0;">
            Thank you for being a loyal customer! Use your reward points on your next order.
          </p>
          
          <a href="https://prayanmasale.vercel.app/shop" 
             style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; margin: 20px 0; display: inline-block;">
            Shop Now & Use Rewards
          </a>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">How to use your rewards:</h3>
            <ol style="color: #92400e; text-align: left; margin: 0; padding-left: 20px;">
              <li>Add items to your cart</li>
              <li>Go to checkout</li>
              <li>Apply your reward points</li>
              <li>Enjoy instant discount!</li>
            </ol>
          </div>
        </div>
      </div>
    `
  })
};

export class EmailMarketing {
  static subscribers: EmailSubscriber[] = [];
  static campaigns: EmailCampaign[] = [];

  static init() {
    this.loadSubscribers();
    this.loadCampaigns();
  }

  static loadSubscribers() {
    const saved = localStorage.getItem('prayan-email-subscribers');
    this.subscribers = saved ? JSON.parse(saved) : [];
  }

  static loadCampaigns() {
    const saved = localStorage.getItem('prayan-email-campaigns');
    this.campaigns = saved ? JSON.parse(saved) : [];
  }

  static saveSubscribers() {
    localStorage.setItem('prayan-email-subscribers', JSON.stringify(this.subscribers));
  }

  static saveCampaigns() {
    localStorage.setItem('prayan-email-campaigns', JSON.stringify(this.campaigns));
  }

  static subscribe(email: string, name?: string, preferences = {
    newProducts: true,
    offers: true,
    recipes: true,
    newsletter: true
  }): boolean {
    const existingSubscriber = this.subscribers.find(s => s.email === email);
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        existingSubscriber.preferences = preferences;
        this.saveSubscribers();
        return true;
      }
      return false; // Already subscribed
    }

    const newSubscriber: EmailSubscriber = {
      id: Date.now().toString(),
      email,
      name,
      preferences,
      tags: ['new_subscriber'],
      status: 'active',
      subscribedAt: new Date().toISOString()
    };

    this.subscribers.push(newSubscriber);
    this.saveSubscribers();

    // Send welcome email
    this.sendWelcomeEmail(newSubscriber);
    
    return true;
  }

  static unsubscribe(email: string): boolean {
    const subscriber = this.subscribers.find(s => s.email === email);
    if (subscriber) {
      subscriber.status = 'unsubscribed';
      this.saveSubscribers();
      return true;
    }
    return false;
  }

  static sendWelcomeEmail(subscriber: EmailSubscriber) {
    const template = EMAIL_MARKETING_TEMPLATES.welcome(subscriber.name || 'Friend');
    
    // In a real app, this would integrate with an email service like SendGrid, Mailgun, etc.
    console.log(`Sending welcome email to ${subscriber.email}:`, template);
    
    // Simulate email sending
    setTimeout(() => {
      subscriber.lastEmailSent = new Date().toISOString();
      this.saveSubscribers();
    }, 1000);
  }

  static createCampaign(campaign: Omit<EmailCampaign, 'id' | 'stats'>): string {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      }
    };

    this.campaigns.push(newCampaign);
    this.saveCampaigns();
    
    return newCampaign.id;
  }

  static getTargetAudience(targetAudience: string): EmailSubscriber[] {
    const activeSubscribers = this.subscribers.filter(s => s.status === 'active');
    
    switch (targetAudience) {
      case 'new_customers':
        return activeSubscribers.filter(s => s.tags.includes('new_subscriber'));
      case 'loyal_customers':
        return activeSubscribers.filter(s => s.tags.includes('loyal_customer'));
      case 'inactive_customers':
        return activeSubscribers.filter(s => s.tags.includes('inactive'));
      default:
        return activeSubscribers;
    }
  }

  static getSubscriberStats() {
    return {
      total: this.subscribers.length,
      active: this.subscribers.filter(s => s.status === 'active').length,
      unsubscribed: this.subscribers.filter(s => s.status === 'unsubscribed').length,
      newThisMonth: this.subscribers.filter(s => {
        const subscribedDate = new Date(s.subscribedAt);
        const now = new Date();
        return subscribedDate.getMonth() === now.getMonth() && 
               subscribedDate.getFullYear() === now.getFullYear();
      }).length
    };
  }
}