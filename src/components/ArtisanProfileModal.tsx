import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Mail, ArrowUpRight, Award, Sparkles } from 'lucide-react';

interface ArtisanProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1D1A18]/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="sticky top-4 right-4 z-10 float-right ml-4 mt-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Image Section */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#E8D9C8] via-[#D4C4B0] to-[#C8B8A0] overflow-hidden">
              {/* Decorative ceramic pattern background */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <circle cx="80" cy="60" r="40" fill="#2C2723" opacity="0.3" />
                  <circle cx="320" cy="240" r="50" fill="#2C2723" opacity="0.2" />
                  <path d="M 0 150 Q 100 100 200 150 T 400 150" stroke="#2C2723" strokeWidth="2" fill="none" opacity="0.2" />
                </svg>
              </div>

              {/* Main content overlay */}
              <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
                {/* Avatar Circle */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#2C2723] border-4 border-[#FAF7F2] shadow-lg flex items-center justify-center mb-4"
                >
                  <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-[#E2B17B]" />
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C2723] mb-1"
                >
                  Cliff Cooks
                </motion.h1>

                {/* Title */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-sm sm:text-base text-[#8B5A3E] font-medium"
                >
                  Ceramic Artist & Studio Owner
                </motion.p>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 sm:px-8 py-8">
              {/* Bio Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl font-semibold text-[#2C2723] mb-4">
                  The Story
                </h2>
                <p className="text-[#544A41] leading-relaxed mb-4">
                  With over 12 years of ceramics experience, Cliff creates functional art pieces inspired by natural forms and the Japanese philosophy of wabi-sabi — finding beauty in imperfection and simplicity.
                </p>
                <p className="text-[#544A41] leading-relaxed mb-6">
                  Each piece is hand-thrown on the wheel, carefully glazed, and fired in a custom kiln. From the clay selection to the final glaze formula, every detail reflects Cliff's commitment to quality and authenticity.
                </p>
              </motion.div>

              {/* Technique Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="font-serif text-2xl font-semibold text-[#2C2723] mb-4">
                  Process & Technique
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Hand-Throwing',
                      desc: 'Each piece starts on the wheel with carefully selected stoneware clay'
                    },
                    {
                      title: 'Custom Glazes',
                      desc: 'Proprietary glaze formulas developed over years of experimentation'
                    },
                    {
                      title: 'High Fire',
                      desc: 'Cone 10 reduction firing creates durability and unique color variations'
                    },
                    {
                      title: 'Quality Testing',
                      desc: 'All pieces are food-safe, dishwasher-safe, and built for daily use'
                    }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 + idx * 0.08, duration: 0.5 }}
                      className="p-4 rounded-xl bg-[#F5EFDF] border border-[#E3D9CB] hover:border-[#E2B17B] transition-colors"
                    >
                      <h3 className="font-semibold text-[#2C2723] mb-1 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#7F7062]">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Credentials Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="font-serif text-2xl font-semibold text-[#2C2723] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C8623A]" />
                  Background & Experience
                </h2>
                <ul className="space-y-3 text-[#544A41] text-sm">
                  <li className="flex gap-3">
                    <span className="text-[#E2B17B] font-semibold">→</span>
                    <span>BFA in Ceramics from [University Name] - 2012</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#E2B17B] font-semibold">→</span>
                    <span>Residency at [Ceramics Workshop] - 2016</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#E2B17B] font-semibold">→</span>
                    <span>Featured in [Craft Magazine] - 2020</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#E2B17B] font-semibold">→</span>
                    <span>Juried exhibitions at regional ceramic societies</span>
                  </li>
                </ul>
              </motion.div>

              {/* Philosophy Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
                className="mb-8 p-6 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB]"
              >
                <p className="text-[#5E5247] font-medium italic text-center leading-relaxed">
                  "I believe ceramics should be used, touched, and loved. Each piece I create is designed to become part of your everyday rituals — your morning coffee, your evening meal, your quiet moments. In this way, functional pottery becomes something more: a tangible connection between maker and user."
                </p>
              </motion.div>

              {/* Social & Contact Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2C2723] hover:bg-[#3F3732] text-[#FAF7F2] rounded-full font-semibold transition-colors group"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Follow on Instagram</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href="mailto:hello@cliffcooks.com"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#F5EFDF] hover:bg-[#EFEAE1] text-[#2C2723] border-2 border-[#D9CEBE] hover:border-[#C8623A] rounded-full font-semibold transition-colors group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.div>

              {/* Commission CTA */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.6 }}
                className="text-center text-xs text-[#8A7B6D] mt-6"
              >
                Interested in a custom commission? Cliff accepts bespoke orders year-round.
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
