import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Send, Check } from 'lucide-react';
import { submitInquiry } from '../services/storeService';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitInquiry({
        id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: formData.name.trim() || 'Anonymous',
        email: formData.email.trim(),
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        pieceOfInterest: 'Contact form',
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1D1A18]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden my-8"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3] bg-[#FAF7F2]">
          <h2 className="font-serif text-2xl text-[#2C2723]">Contact Us</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scroll max-h-[calc(100vh-120px)]">
          <div className="space-y-6">

            {/* Intro */}
            <div>
              <p className="text-sm text-[#5A4E44] mb-4">
                Have a question about a piece, custom order, or just want to say hello? We'd love to hear from you. Fill out the form below or reach out directly.
              </p>
            </div>

            {/* Contact Info */}
            <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB]">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C8623A] shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#2C2723] text-sm">Email</p>
                  <p className="text-xs text-[#5A4E44]">hello@cliffcooks.studio</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#736558] mb-2 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-[#D9CEBE] rounded-xl px-4 py-3 text-sm text-[#2C2723] focus:outline-none focus:border-[#E2B17B] transition-colors"
                  placeholder="Your name (optional)"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#736558] mb-2 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D9CEBE] rounded-xl px-4 py-3 text-sm text-[#2C2723] focus:outline-none focus:border-[#E2B17B] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#736558] mb-2 font-semibold">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D9CEBE] rounded-xl px-4 py-3 text-sm text-[#2C2723] focus:outline-none focus:border-[#E2B17B] transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#736558] mb-2 font-semibold">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-[#FAF7F2] border border-[#D9CEBE] rounded-xl px-4 py-3 text-sm text-[#2C2723] focus:outline-none focus:border-[#E2B17B] transition-colors resize-none"
                  placeholder="Your message…"
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-3 rounded-xl bg-[#4E7755]/15 border border-[#4E7755] flex items-center gap-2 text-xs text-[#2C2723]">
                  <Check className="w-4 h-4 text-[#4E7755]" />
                  <span>Message sent! Clifford will get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 rounded-xl bg-[#C8623A]/15 border border-[#C8623A] text-xs text-[#2C2723]">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-[0.99] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-[#8A7B6D] text-center">
              We typically respond within 24 hours during business days.
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
