import { BUSINESS_CONFIG } from '@/config/business';

export interface NotificationData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderTotal: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
}

// SMS Notification Templates
export const SMS_TEMPLATES = {
  orderPlaced: (data: NotificationData) => 
    `Hi ${data.customerName}, your order ${data.orderId} for ₹${data.orderTotal} has been placed successfully. We'll call you soon to confirm. - Prayan Masale`,
  
  orderConfirmed: (data: NotificationData) => 
    `Great news ${data.customerName}! Your order ${data.orderId} is confirmed and being prepared. Expected delivery: 2-3 days. - Prayan Masale`,
  
  orderShipped: (data: NotificationData) => 
    `Your order ${data.orderId} has been shipped! Track your fresh spices delivery. Expected arrival: 1-2 days. - Prayan Masale`,
  
  orderDelivered: (data: NotificationData) => 
    `Order ${data.orderId} delivered! Enjoy your fresh spices. Rate your experience: [link]. Thank you for choosing Prayan Masale!`
};

// Email Templates
export const EMAIL_TEMPLATES = {
  orderPlaced: (data: NotificationData) => ({
    subject: `Order Confirmation - ${data.orderId} | Prayan Masale`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">प्रयाण मसाले</h1>
          <p style="color: white; margin: 5px 0;">Pure Taste, Pure Emotions</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Order Placed Successfully! 🎉</h2>
          <p>Dear ${data.customerName},</p>
          <p>Thank you for your order! We're excited to bring authentic Indian spices to your kitchen.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f97316; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Total Amount:</strong> ₹${data.orderTotal}</p>
            
            <h4>Items Ordered:</h4>
            <ul>
              ${data.items.map(item => 
                `<li>${item.name} × ${item.quantity} - ₹${item.price * item.quantity}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">What's Next?</h4>
            <ol style="color: #92400e;">
              <li>We'll call you within 30 minutes to confirm your order</li>
              <li>Your spices will be freshly packed with care</li>
              <li>Delivery within 2-3 business days</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/${BUSINESS_CONFIG.whatsapp.replace('+', '')}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Contact us on WhatsApp
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Need help? Contact us at ${BUSINESS_CONFIG.phone} or ${BUSINESS_CONFIG.email}
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 Prayan Masale. All rights reserved.</p>
          <p>${BUSINESS_CONFIG.address.street}, ${BUSINESS_CONFIG.address.city}</p>
        </div>
      </div>
    `
  }),

  orderStatusUpdate: (data: NotificationData) => ({
    subject: `Order Update - ${data.orderId} | ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">प्रयाण मसाले</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2>Order Status Update</h2>
          <p>Dear ${data.customerName},</p>
          <p>Your order <strong>${data.orderId}</strong> status has been updated to: 
             <span style="background: #f97316; color: white; padding: 4px 8px; border-radius: 4px;">
               ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}
             </span>
          </p>
          
          ${data.status === 'shipped' ? `
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">📦 Your Order is On the Way!</h4>
              <p style="color: #1e40af;">Your fresh spices are being delivered. Expected arrival: 1-2 business days.</p>
            </div>
          ` : ''}
          
          ${data.status === 'delivered' ? `
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #166534; margin-top: 0;">🎉 Order Delivered!</h4>
              <p style="color: #166534;">Enjoy your authentic spices! We'd love to hear about your cooking experience.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `
  })
};

// WhatsApp Message Templates
export const WHATSAPP_TEMPLATES = {
  orderConfirmed: (data: NotificationData) => 
    `🌶️ *Order Confirmed - Prayan Masale*\n\nHi ${data.customerName}!\n\nYour order ${data.orderId} is confirmed! 🎉\n\n📦 *Order Details:*\n${data.items.map(item => `• ${item.name} × ${item.quantity}`).join('\n')}\n\n💰 *Total:* ₹${data.orderTotal}\n\n🚚 *Delivery:* 2-3 business days\n\nThank you for choosing Prayan Masale! 🙏`,

  orderShipped: (data: NotificationData) => 
    `🚚 *Order Shipped - Prayan Masale*\n\nGreat news ${data.customerName}!\n\nYour order ${data.orderId} is on its way! 📦\n\n🕐 *Expected Delivery:* 1-2 days\n\nYour fresh, authentic spices will be with you soon! 🌶️✨`,

  orderDelivered: (data: NotificationData) => 
    `✅ *Order Delivered - Prayan Masale*\n\nHi ${data.customerName}!\n\nYour order ${data.orderId} has been delivered! 🎉\n\nEnjoy cooking with our premium spices! 👨‍🍳\n\nWe'd love your feedback. How was your experience? ⭐`
};

// Notification Service
export class NotificationService {
  static async sendSMS(phone: string, message: string): Promise<boolean> {
    // In a real app, integrate with SMS service like Twilio, MSG91, etc.
    console.log(`SMS to ${phone}: ${message}`);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  static async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    // In a real app, integrate with email service like SendGrid, Mailgun, etc.
    console.log(`Email to ${email}: ${subject}`);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  static sendWhatsApp(phone: string, message: string): void {
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  static async notifyOrderPlaced(data: NotificationData): Promise<void> {
    // Send SMS
    await this.sendSMS(data.customerPhone, SMS_TEMPLATES.orderPlaced(data));
    
    // Send Email if provided
    if (data.customerEmail) {
      const emailTemplate = EMAIL_TEMPLATES.orderPlaced(data);
      await this.sendEmail(data.customerEmail, emailTemplate.subject, emailTemplate.html);
    }
  }

  static async notifyOrderStatusUpdate(data: NotificationData): Promise<void> {
    // Send SMS for status updates
    const smsTemplate = SMS_TEMPLATES[data.status as keyof typeof SMS_TEMPLATES];
    if (smsTemplate) {
      await this.sendSMS(data.customerPhone, smsTemplate(data));
    }

    // Send Email if provided
    if (data.customerEmail) {
      const emailTemplate = EMAIL_TEMPLATES.orderStatusUpdate(data);
      await this.sendEmail(data.customerEmail, emailTemplate.subject, emailTemplate.html);
    }

    // WhatsApp for important updates
    if (data.status === 'confirmed' || data.status === 'shipped' || data.status === 'delivered') {
      const whatsappTemplate = WHATSAPP_TEMPLATES[data.status as keyof typeof WHATSAPP_TEMPLATES];
      if (whatsappTemplate) {
        this.sendWhatsApp(data.customerPhone, whatsappTemplate(data));
      }
    }
  }
}