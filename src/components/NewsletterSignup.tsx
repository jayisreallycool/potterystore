import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  onSubscribe?: (email: string) => void;
  variant?: 'hero' | 'footer' | 'inline';
  showDescription?: boolean;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onSubscribe,
  variant = 'footer',
  showDescription = true
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Call the email subscription endpoint
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          timestamp: new Date().toISOString(),
          source: 'newsletter_signup'
        })
      });

      if (!response.ok) throw new Error('Subscription failed');

      // Also save to localStorage for demo persistence
      const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
      }

      setStatus('success');
      setEmail('');
      onSubscribe?.(email);

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  // Hero variant - Large, standalone section
  if (variant === 'hero') {
    return (
      <section className="relative bg-gradient-to-r from-[#2C2723] to-[#3F3732] text-[#FAF7F2] py-12 sm:py-16 px-4 sm:px-6 md:px-8 rounded-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#E2B17B]/10 rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3">
            Get Early Access to New Pieces
          </h2>
          <p className="text-[#C4BAAE] mb-6 text-sm sm:text-base">
            Subscribe to our newsletter for exclusive previews, studio updates, and special releases delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-full bg-[#FAF7F2] text-[#2C2723] placeholder-[#8A7B6D] focus:outline-none focus:ring-2 focus:ring-[#E2B17B] disabled:opacity-50 min-h-[48px] sm:min-h-auto"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 bg-[#E2B17B] hover:bg-[#D4A46F] text-[#2C2723] font-semibold rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px] sm:min-h-auto whitespace-nowrap"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#2C2723]/30 border-t-[#2C2723] rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Subscribe
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center justify-center gap-2 text-red-300 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // Footer variant - Compact for footer section
  if (variant === 'footer') {
    return (
      <div className="py-6 sm:py-8 border-t border-[#E3D9CB]">
        <div className="max-w-md">
          <div className="mb-4">
            <h3 className="font-semibold text-[#2C2723] mb-1 text-sm sm:text-base">
              Stay Updated
            </h3>
            {showDescription && (
              <p className="text-xs sm:text-sm text-[#7F7062]">
                Get new releases and studio stories in your inbox
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-[#FAF7F2] border border-[#D9CEBE] text-[#2C2723] placeholder-[#8A7B6D] focus:outline-none focus:ring-1 focus:ring-[#E2B17B] disabled:opacity-50 min-h-[44px] sm:min-h-auto"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-4 py-2 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-auto whitespace-nowrap"
            >
              {status === 'loading' ? (
                <div className="w-3 h-3 border-2 border-[#FAF7F2]/30 border-t-[#FAF7F2] rounded-full animate-spin" />
              ) : status === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {status === 'success' ? 'Subscribed' : 'Subscribe'}
              </span>
            </button>
          </form>

          <AnimatePresence>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-xs text-red-600"
              >
                {errorMessage}
              </motion.p>
            )}
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-xs text-[#4E7755]"
              >
                Thanks for subscribing! Check your email for a welcome message.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Inline variant - Minimal, inline form
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={status === 'loading'}
        className="flex-1 px-3 py-1.5 text-xs rounded bg-[#FAF7F2]/80 border border-[#D9CEBE] text-[#2C2723] placeholder-[#8A7B6D] focus:outline-none focus:ring-1 focus:ring-[#E2B17B] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="px-3 py-1.5 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] text-xs font-semibold rounded transition-all disabled:opacity-50"
      >
        {status === 'success' ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
      </button>
    </motion.form>
  );
};
