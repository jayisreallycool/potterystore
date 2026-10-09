import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';

interface HeroSectionProps {
  onBrowseCollection: () => void;
  onViewCommissions: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseCollection,
  onViewCommissions
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFDF] to-[#FAF7F2]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large organic shape - top right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C8623A] blur-3xl"
        />
        {/* Smaller organic shape - bottom left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#8A7B6D] blur-3xl"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 max-w-7xl mx-auto">

        {/* Main Headline + Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B17B]/15 border border-[#E2B17B]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8623A]" />
              <span className="text-xs sm:text-sm font-medium text-[#8B5A3E]">
                Handcrafted & One of a Kind
              </span>
            </motion.div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-[#2C2723] tracking-tight mb-4 leading-tight">
            Functional Art for Your Home
          </h1>

          <p className="text-base sm:text-lg text-[#544A41] leading-relaxed max-w-2xl mx-auto">
            Each piece is thoughtfully crafted in small batches. Discover unique ceramics made with intention, inspired by nature, and built to be used and loved.
          </p>
        </motion.div>

        {/* Two CTA Buttons - Mobile First Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12"
        >
          {/* Primary CTA: Browse Collection */}
          <button
            onClick={onBrowseCollection}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-3.5 bg-[#2C2723] hover:bg-[#3F3732] active:scale-95 text-[#FAF7F2] rounded-full font-semibold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] sm:min-h-auto"
          >
            <ShoppingBag className="w-5 h-5 text-[#E2B17B] group-hover:scale-110 transition-transform" />
            <span>Browse Collection</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
          </button>

          {/* Secondary CTA: Custom Orders */}
          <button
            onClick={onViewCommissions}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-3.5 bg-[#F5EFDF] hover:bg-[#EFEAE1] active:scale-95 text-[#2C2723] border-2 border-[#D9CEBE] hover:border-[#C8623A] rounded-full font-semibold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 transition-all duration-300 shadow-md hover:shadow-lg min-h-[48px] sm:min-h-auto"
          >
            <Heart className="w-5 h-5 text-[#C8623A] group-hover:fill-current transition-all" />
            <span>Commission a Piece</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
          </button>
        </motion.div>

        {/* Trust Badges - 3 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {[
            {
              icon: '🎯',
              title: 'One of a Kind',
              description: 'Every piece is unique, never mass-produced'
            },
            {
              icon: '✋',
              title: 'Handmade Locally',
              description: 'Crafted by hand in our studio'
            },
            {
              icon: '💚',
              title: 'Made to Last',
              description: 'Built for daily use and generational keeping'
            }
          ].map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
              className="p-4 text-center rounded-2xl bg-white/40 backdrop-blur-sm border border-[#E3D9CB]/50 hover:border-[#E2B17B]/50 hover:bg-white/60 transition-all"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold text-sm sm:text-base text-[#2C2723] mb-1">
                {badge.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#7F7062]">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup - Hero Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20"
        >
          <NewsletterSignup variant="hero" showDescription={true} />
        </motion.div>
      </div>

      {/* Scroll Indicator - Desktop Only */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex justify-center pb-8 pt-4"
      >
        <div className="text-[#8A7B6D] text-xs font-medium flex flex-col items-center gap-2">
          <span>Explore below</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
