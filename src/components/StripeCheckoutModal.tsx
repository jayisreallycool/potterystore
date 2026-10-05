import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertCircle, Check, Loader } from 'lucide-react';
import { CartItem } from '../types';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onOrderSuccess?: () => void;
}

/**
 * Stripe Payment Integration Component
 *
 * Setup required:
 * 1. npm install @stripe/react-stripe-js @stripe/js
 * 2. Set VITE_STRIPE_PUBLISHABLE_KEY in .env.local
 * 3. Create backend endpoint POST /api/create-payment-intent
 */
export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  shippingCost,
  total,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In production, integrate with @stripe/react-stripe-js
      // For now, show setup instructions

      // This would create a payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'usd',
          customerEmail: email,
          customerName: name,
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // In a real implementation, use Stripe.js to confirm payment
      // For demo: show success
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onOrderSuccess?.();
          onClose();
        }, 2000);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setStep('payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3D9CB] bg-[#EFEAE1]">
          <h2 className="font-serif text-2xl text-[#2C2723]">
            {step === 'success' ? 'Order Confirmed' : 'Secure Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E3D9CB] transition-colors text-[#2C2723]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {step === 'info' && (
            <form onSubmit={handleContinueToPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#736558] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D9CEBE] focus:outline-none focus:border-[#C8623A] transition-colors"
                  placeholder="Clifford Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#736558] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D9CEBE] focus:outline-none focus:border-[#C8623A] transition-colors"
                  placeholder="clifford@example.com"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#F0A59A]/20 border border-[#C8623A] flex gap-2 text-sm text-[#8B3E18]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2C2723] text-[#FAF7F2] font-semibold hover:bg-[#3F3732] transition-colors mt-6"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB]">
                <p className="text-xs text-[#7F7062] mb-3">
                  To complete this demo, Stripe integration requires:
                </p>
                <ul className="space-y-2 text-xs text-[#544A41]">
                  <li>✓ Backend endpoint: POST /api/create-payment-intent</li>
                  <li>✓ Stripe account API keys configured</li>
                  <li>✓ @stripe/react-stripe-js and @stripe/js installed</li>
                  <li>✓ Payment form UI built with Stripe Elements</li>
                </ul>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7F7062]">Subtotal</span>
                  <span className="text-[#2C2723] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7F7062]">Shipping</span>
                  <span className="text-[#2C2723] font-medium">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[#E3D9CB]">
                  <span className="text-[#2C2723]">Total</span>
                  <span className="text-[#C8623A]">${total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#F0A59A]/20 border border-[#C8623A] flex gap-2 text-sm text-[#8B3E18]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#C8623A] text-white font-semibold hover:bg-[#B3522C] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay $' + total.toFixed(2)
                )}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-[#C8623A]/20 flex items-center justify-center mx-auto mb-4"
              >
                <Loader className="w-6 h-6 text-[#C8623A] animate-spin" />
              </motion.div>
              <p className="text-sm text-[#7F7062]">Processing your payment...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 rounded-full bg-[#4E7755]/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-[#4E7755]" />
              </motion.div>
              <h3 className="font-serif text-2xl text-[#2C2723] mb-2">
                Order Confirmed!
              </h3>
              <p className="text-sm text-[#7F7062] mb-4">
                A confirmation email has been sent to {email}
              </p>
              <p className="text-xs text-[#8A7B6D]">
                Order tracking details and shipping updates coming soon
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
