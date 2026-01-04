// Google Analytics & Facebook Pixel Integration
export class Analytics {
  static initialized = false;

  static init() {
    if (this.initialized) return;
    
    // Google Analytics 4
    this.initGA4();
    
    // Facebook Pixel
    this.initFacebookPixel();
    
    this.initialized = true;
  }

  static initGA4() {
    // Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }

  static initFacebookPixel() {
    // Replace 'YOUR_PIXEL_ID' with your actual Facebook Pixel ID
    const PIXEL_ID = 'YOUR_PIXEL_ID';
    
    (function(f: any, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    (window as any).fbq('init', PIXEL_ID);
    (window as any).fbq('track', 'PageView');
  }

  // E-commerce Events
  static trackPurchase(orderId: string, value: number, currency = 'INR', items: any[]) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: value,
        currency: currency,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category || 'Spices',
          quantity: item.quantity,
          price: item.price
        }))
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: value,
        currency: currency,
        content_ids: items.map(item => item.id),
        content_type: 'product'
      });
    }
  }

  static trackAddToCart(item: any, value: number) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: value,
        items: [{
          item_id: item.id,
          item_name: item.name,
          category: item.category || 'Spices',
          quantity: item.quantity || 1,
          price: item.price
        }]
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        value: value,
        currency: 'INR',
        content_ids: [item.id],
        content_type: 'product'
      });
    }
  }

  static trackViewItem(item: any) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        currency: 'INR',
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          category: item.category || 'Spices',
          price: item.price
        }]
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        value: item.price,
        currency: 'INR',
        content_ids: [item.id],
        content_type: 'product'
      });
    }
  }

  static trackSearch(searchTerm: string) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: searchTerm
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Search', {
        search_string: searchTerm
      });
    }
  }

  static trackBeginCheckout(value: number, items: any[]) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category || 'Spices',
          quantity: item.quantity,
          price: item.price
        }))
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: value,
        currency: 'INR',
        content_ids: items.map(item => item.id),
        content_type: 'product'
      });
    }
  }

  static trackSignUp(method = 'email') {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'sign_up', {
        method: method
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration');
    }
  }

  static trackLogin(method = 'email') {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'login', {
        method: method
      });
    }
  }

  // Custom Events
  static trackCustomEvent(eventName: string, parameters: any = {}) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  }

  // Page Views
  static trackPageView(pagePath: string, pageTitle: string) {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }
}

// SEO Utils
export class SEO {
  static updateMetaTags(data: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
  }) {
    // Update title
    if (data.title) {
      document.title = data.title;
      this.updateMetaTag('og:title', data.title);
      this.updateMetaTag('twitter:title', data.title);
    }

    // Update description
    if (data.description) {
      this.updateMetaTag('description', data.description);
      this.updateMetaTag('og:description', data.description);
      this.updateMetaTag('twitter:description', data.description);
    }

    // Update keywords
    if (data.keywords) {
      this.updateMetaTag('keywords', data.keywords);
    }

    // Update image
    if (data.image) {
      this.updateMetaTag('og:image', data.image);
      this.updateMetaTag('twitter:image', data.image);
    }

    // Update URL
    if (data.url) {
      this.updateMetaTag('og:url', data.url);
    }
  }

  private static updateMetaTag(name: string, content: string) {
    let element = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  static generateProductSchema(product: any) {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": "Prayan Masale"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR",
        "availability": product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Prayan Royal Spice Emporium"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviews
      }
    };

    this.updateStructuredData('product-schema', schema);
  }

  private static updateStructuredData(id: string, data: any) {
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}

// Performance Monitoring
export class Performance {
  static measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      Analytics.trackCustomEvent('page_load_time', {
        load_time: Math.round(loadTime),
        page_path: window.location.pathname
      });
    });
  }

  static measureLCP() {
    if ('web-vitals' in window) {
      // This would require importing web-vitals library
      // import { getLCP } from 'web-vitals';
      // getLCP((metric) => {
      //   Analytics.trackCustomEvent('largest_contentful_paint', {
      //     value: Math.round(metric.value),
      //     page_path: window.location.pathname
      //   });
      // });
    }
  }
}