// Notification Service
// Handles email notifications and alert subscriptions

export const notificationService = {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(to: string, order: {
    orderId: string;
    items: Array<{ name: string; price: number; quantity: number }>;
    total: number;
  }) {
    return fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `Order Confirmation #${order.orderId}`,
        type: 'order_confirmation',
        data: order
      })
    });
  },

  /**
   * Send shipping update email
   */
  async sendShippingUpdate(to: string, shipping: {
    orderId: string;
    trackingNumber: string;
    trackingUrl: string;
  }) {
    return fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `Your Order is Shipped - Track it Now`,
        type: 'shipping_update',
        data: shipping
      })
    });
  },

  /**
   * Send review request email
   */
  async sendReviewRequest(to: string, review: {
    productName: string;
    reviewUrl: string;
  }) {
    return fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `How was your ${review.productName}?`,
        type: 'review_request',
        data: review
      })
    });
  },

  /**
   * Send restock alert email
   */
  async sendRestockAlert(to: string, product: {
    productName: string;
    productUrl: string;
  }) {
    return fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `${product.productName} is Back in Stock!`,
        type: 'restock_alert',
        data: product
      })
    });
  },

  /**
   * Subscribe to restock alerts (save to localStorage for demo)
   */
  subscribeToRestockAlert(productId: string, email: string): boolean {
    try {
      const alerts = JSON.parse(localStorage.getItem('restockAlerts') || '{}');
      if (!alerts[productId]) {
        alerts[productId] = [];
      }
      // Only add if not already subscribed
      if (!alerts[productId].includes(email)) {
        alerts[productId].push(email);
        localStorage.setItem('restockAlerts', JSON.stringify(alerts));
      }
      return true;
    } catch (error) {
      console.error('Error subscribing to restock alert:', error);
      return false;
    }
  },

  /**
   * Get restock alert subscribers for a product
   */
  getRestockAlertSubscribers(productId: string): string[] {
    try {
      const alerts = JSON.parse(localStorage.getItem('restockAlerts') || '{}');
      return alerts[productId] || [];
    } catch (error) {
      console.error('Error retrieving restock alert subscribers:', error);
      return [];
    }
  },

  /**
   * Save product review to localStorage (for demo)
   */
  saveProductReview(productId: string, review: {
    customerId: string;
    customerName: string;
    rating: number;
    text: string;
    verified: boolean;
  }): boolean {
    try {
      const reviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
      if (!reviews[productId]) {
        reviews[productId] = [];
      }
      reviews[productId].push({
        id: 'review-' + Date.now(),
        productId,
        ...review,
        createdAt: Date.now(),
        helpful: 0
      });
      localStorage.setItem('productReviews', JSON.stringify(reviews));
      return true;
    } catch (error) {
      console.error('Error saving product review:', error);
      return false;
    }
  },

  /**
   * Get all reviews for a product
   */
  getProductReviews(productId: string): any[] {
    try {
      const reviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
      return reviews[productId] || [];
    } catch (error) {
      console.error('Error retrieving product reviews:', error);
      return [];
    }
  },

  /**
   * Calculate average rating for a product
   */
  getAverageRating(productId: string): { avg: number; count: number } {
    const reviews = this.getProductReviews(productId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: sum / reviews.length,
      count: reviews.length
    };
  }
};
