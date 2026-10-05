import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Heart, Gift, AlertCircle, Check } from 'lucide-react';

type ModalState = 'input' | 'success' | 'error';

/**
 * Premium email collection modal
 * Appears strategically: on first visit after scrolling, or after time on site
 * Shows value propositions and gentle CTAs
 */
export const EmailCaptureModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ModalState>('input');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed this
    const hasSeenEmailCapture = localStorage.getItem('kiln_clay_email_capture');
    if (hasSeenEmailCapture) return;

    // Trigger conditions:
    // 1. After 20 seconds on site
    const timer1 = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem('kiln_clay_email_capture', JSON.stringify({ dismissed: new Date().toISOString() }));
    }, 20000);

    // 2. When user scrolls down 40% of page (for mobile/quick browsers)
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / docHeight) * 100;

      if (scrollPercent > 40 && !isVisible) {
        setIsVisible(true);
        localStorage.setItem('kiln_clay_email_capture', JSON.stringify({ dismissed: new Date().toISOString() }));
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer1);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // In production, send to your backend/email service
      // For now, simulate success
      console.log('Email captured:', email);
      setState('success');

      // Auto-close after success message
      setTimeout(() => {
        setIsVisible(false);
        // Reset state for next modal trigger
        setState('input');
        setEmail('');
      }, 2500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setState('input');
    setEmail('');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-gradient-to-br from-[#FAF7F2] to-[#F2EDE4] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-[#E3D9CB] transition-colors text-[#2C2723]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success State */}
              {state === 'success' && (
                <div className="px-8 py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 rounded-full bg-[#4E7755]/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-8 h-8 text-[#4E7755]" />
                  </motion.div>
                  <h2 className="font-serif text-2xl text-[#2C2723] mb-2">
                    Welcome to the circle!
                  </h2>
                  <p className="text-sm text-[#7F7062] mb-4">
                    Check your inbox for exclusive updates and early access to new pieces.
                  </p>
                  <p className="text-xs text-[#8A7B6D]">
                    You'll hear from us soon with something special.
                  </p>
                </div>
              )}

              {/* Input State */}
              {state === 'input' && (
                <div className="px-8 py-10">
                  {/* Header with Icon */}
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block mb-4"
                    >
                      <Mail className="w-10 h-10 text-[#C8623A]" />
                    </motion.div>
                    <h2 className="font-serif text-3xl text-[#2C2723] mb-2">
                      Handcrafted Updates
                    </h2>
                    <p className="text-sm text-[#7F7062]">
                      Be the first to see new pieces, restocks, and exclusive artist stories.
                    </p>
                  </div>

                  {/* Value Propositions */}
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-3 items-start">
                      <Gift className="w-5 h-5 text-[#C8623A] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#544A41]">
                        <span className="font-semibold">10% off</span> your first order
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Heart className="w-5 h-5 text-[#C8623A] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#544A41]">
                        <span className="font-semibold">Early access</span> to new releases
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Mail className="w-5 h-5 text-[#C8623A] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#544A41]">
                        <span className="font-semibold">Insider stories</span> about the studio
                      </p>
                    </div>
                  </div>

                  {/* Email Input */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="your email"
                        className="w-full px-4 py-3 rounded-xl border border-[#D9CEBE] focus:outline-none focus:border-[#C8623A] focus:ring-2 focus:ring-[#C8623A]/20 transition-all text-[#2C2723] placeholder-[#8A7B6D]"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-[#F0A59A]/20 border border-[#C8623A] flex gap-2 text-sm text-[#8B3E18]">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-full bg-[#C8623A] text-white font-semibold hover:bg-[#B3522C] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Yes, Count Me In
                        </>
                      )}
                    </button>
                  </form>

                  {/* Privacy Notice */}
                  <p className="text-xs text-[#8A7B6D] text-center mt-4">
                    We respect your privacy. Unsubscribe anytime.{' '}
                    <a href="/privacy" className="text-[#C8623A] hover:underline">
                      See our privacy policy
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
