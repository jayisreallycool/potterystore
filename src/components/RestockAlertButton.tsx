import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RestockAlertButtonProps {
  productId: string;
  productName: string;
  isOutOfStock: boolean;
  onSubscribe: (email: string) => void;
}

export const RestockAlertButton: React.FC<RestockAlertButtonProps> = ({
  productId,
  productName,
  isOutOfStock,
  onSubscribe
}) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      onSubscribe(email);
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setEmail('');
        setSubmitted(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOutOfStock) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-4 py-3 bg-[#443c36] hover:bg-[#524736] text-[#E2B17B] rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
      >
        <Bell className="w-4 h-4" />
        Notify Me When Back in Stock
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !submitted && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#24201D] border border-[#3B3530] rounded-lg p-6 w-full max-w-md"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-[#1f3a1f] rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-[#8fd19e]" />
                  </motion.div>
                  <h3 className="text-lg font-serif text-[#FAF7F2] mb-2">Alert Subscribed!</h3>
                  <p className="text-[#A69B8E] text-sm">
                    We'll notify you when {productName} is back in stock.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-lg font-serif text-[#FAF7F2] mb-2">
                    Get Notified
                  </h3>
                  <p className="text-[#A69B8E] text-sm mb-6">
                    We'll send you an email when {productName} is back in stock.
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs text-[#8A7B6D] mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-[#1a1816] border border-[#3B3530] rounded text-[#FAF7F2] placeholder-[#8A7B6D] focus:outline-none focus:border-[#E2B17B]"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-[#E2B17B] text-[#24201D] rounded hover:bg-[#D4A46F] transition-colors font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-[#3B3530] text-[#FAF7F2] rounded hover:bg-[#443c36] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
