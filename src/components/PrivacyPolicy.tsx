import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1D1A18]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden my-8"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3] bg-[#FAF7F2]">
          <h2 className="font-serif text-2xl text-[#2C2723]">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scroll max-h-[calc(100vh-120px)] text-sm text-[#5A4E44]">
          <div className="space-y-6 font-serif leading-relaxed">

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Introduction</h3>
              <p>
                CliffCooks ("we," "us," "our," or "the Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Information We Collect</h3>
              <p className="mb-2">We collect information you voluntarily provide to us when you:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create an account or sign in</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Submit a custom order inquiry</li>
                <li>Contact us via email or forms</li>
              </ul>
              <p className="mt-2">This information may include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing address</li>
                <li>Order history and preferences</li>
                <li>Payment information (processed securely)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">How We Use Your Information</h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and customer service requests</li>
                <li>Send marketing emails (with your opt-in consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Third-Party Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only with service providers necessary to operate our business (e.g., payment processors, shipping carriers) who are bound by confidentiality agreements.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Cookies and Tracking</h3>
              <p>
                Our website uses cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact us at the email address below.</p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:<br />
                <strong>Email:</strong> hello@cliffcooks.studio
              </p>
            </div>

            <div className="text-xs text-[#8A7B6D] pt-4 border-t border-[#DDD1C0]">
              <p>Last updated: October 2026</p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
