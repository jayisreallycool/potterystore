/**
 * Stripe Payment Integration Setup
 *
 * To enable Stripe payments:
 * 1. Install: npm install @stripe/react-stripe-js @stripe/js
 * 2. Create Stripe account at https://dashboard.stripe.com
 * 3. Get your publishable key from the API keys page
 * 4. Add to .env.local:
 *    VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
 *    VITE_STRIPE_SECRET_KEY=sk_live_xxx (backend only)
 * 5. Update CheckoutModal.tsx to use Stripe instead of manual payment entry
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  // Supported payment methods for ceramics business
  supportedPaymentMethods: ['card', 'apple_pay', 'google_pay'],
  // Minimum order value in cents
  minOrderValue: 1000, // $10
  // Currency
  currency: 'usd',
  // Account name for payment processing
  accountName: 'Cliff Cooks Ceramics'
};

/**
 * Check if Stripe is configured and ready
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_CONFIG.publishableKey &&
         STRIPE_CONFIG.publishableKey.startsWith('pk_');
};

/**
 * Format price for Stripe (cents)
 */
export const formatPriceForStripe = (dollars: number): number => {
  return Math.round(dollars * 100);
};

/**
 * Create a payment intent for order
 * Should be called from your backend
 */
export const createPaymentIntent = async (
  orderData: {
    amount: number;
    currency?: string;
    description: string;
    metadata?: Record<string, string>;
  }
) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: formatPriceForStripe(orderData.amount),
        currency: orderData.currency || 'usd',
        description: orderData.description,
        metadata: orderData.metadata
      })
    });

    if (!response.ok) {
      throw new Error(`Payment intent creation failed: ${response.statusText}`);
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Format order data for Stripe metadata
 */
export const formatOrderMetadata = (
  cartItems: Array<{ product: { id: string; name: string }; quantity: number }>,
  customerEmail: string
) => {
  return {
    customer_email: customerEmail,
    item_count: cartItems.length.toString(),
    items: cartItems.map((item) => item.product.id).join(','),
    source: 'pottery_store'
  };
};

/**
 * Webhook handler for Stripe events
 * Deploy as serverless function at /api/webhook/stripe
 */
export const stripeWebhookHandler = {
  events: ['payment_intent.succeeded', 'payment_intent.payment_failed'],
  description: 'Handles Stripe payment confirmation and order processing'
};
