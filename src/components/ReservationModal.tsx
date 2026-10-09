import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PotteryProduct, ProductReservation } from '../types';
import { createReservation } from '../services/storeService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: PotteryProduct | null;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, product }) => {
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!product) return;

    setLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const reservation: ProductReservation = {
        id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        productName: product.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone || undefined,
        status: 'pending',
        reservedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        notes: formData.notes || undefined
      };

      await createReservation(reservation);
      setStep('success');
    } catch (err) {
      console.error('Reservation error:', err);
      setStep('error');
      setError('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setError('');
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#1D1A18]/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="sticky top-4 right-4 z-10 float-right ml-4 mt-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#C8623A]" />
                  <h2 className="font-serif text-2xl font-semibold text-[#2C2723]">
                    {step === 'form' ? 'Reserve This Piece' : step === 'success' ? 'Reservation Confirmed' : 'Reservation Error'}
                  </h2>
                </div>
              </motion.div>

              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-6"
                >
                  {/* Product Info */}
                  <div className="p-4 rounded-xl bg-[#F5EFDF] border border-[#E3D9CB]">
                    <p className="text-xs text-[#8A7B6D] font-mono uppercase mb-1">Item</p>
                    <p className="font-serif text-lg text-[#2C2723]">{product.name}</p>
                    <p className="text-sm text-[#6B5E51] mt-2">${product.price.toFixed(2)}</p>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-900 font-medium mb-2">ℹ️ About Your Reservation</p>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Your reservation will hold this piece for 7 days. We'll contact you to confirm availability and arrange purchase.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2723] mb-2 uppercase">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3D9CB] focus:border-[#C8623A] focus:outline-none text-[#2C2723] placeholder-[#A69B8E] transition-colors"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2723] mb-2 uppercase">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3D9CB] focus:border-[#C8623A] focus:outline-none text-[#2C2723] placeholder-[#A69B8E] transition-colors"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2723] mb-2 uppercase">Phone (optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3D9CB] focus:border-[#C8623A] focus:outline-none text-[#2C2723] placeholder-[#A69B8E] transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2C2723] mb-2 uppercase">Notes (optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3D9CB] focus:border-[#C8623A] focus:outline-none text-[#2C2723] placeholder-[#A69B8E] transition-colors resize-none"
                        placeholder="Any special requests or questions?"
                        rows={3}
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {loading ? 'Submitting...' : 'Reserve This Piece'}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-6 text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </motion.div>

                  <div>
                    <h3 className="font-serif text-xl text-[#2C2723] mb-2">Reservation Confirmed</h3>
                    <p className="text-sm text-[#6B5E51] leading-relaxed">
                      We've received your reservation for <strong>{product.name}</strong>. We'll reach out within 24 hours to confirm availability.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5EFDF] border border-[#E3D9CB] text-left">
                    <p className="text-xs text-[#8A7B6D] font-mono uppercase mb-2">Next Steps</p>
                    <ul className="text-xs text-[#6B5E51] space-y-2">
                      <li>✓ Check your email for confirmation</li>
                      <li>✓ We'll contact you shortly</li>
                      <li>✓ 7-day hold on this piece</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] rounded-full font-semibold transition-colors active:scale-95"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-[#2C2723] mb-2">Something Went Wrong</h3>
                    <p className="text-sm text-[#6B5E51] leading-relaxed">
                      {error || 'Unable to create your reservation. Please try again.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('form')}
                    className="w-full px-6 py-3 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] rounded-full font-semibold transition-colors active:scale-95"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
