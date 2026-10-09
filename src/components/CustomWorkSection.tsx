import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, Palette, Clock, Zap } from 'lucide-react';

interface CustomWorkSectionProps {
  onRequestCustom: () => void;
}

export const CustomWorkSection: React.FC<CustomWorkSectionProps> = ({ onRequestCustom }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2C2723] via-[#3B342F] to-[#2C2723] py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-[#E2B17B] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#C8623A] blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E2B17B]/15 border border-[#E2B17B]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#E2B17B]" />
            <span className="text-sm font-medium text-[#E2B17B]">Commission Your Vision</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#FAF7F2] mb-6 leading-tight">
            Bring Your Ideas to Life
          </h2>

          <p className="text-base sm:text-lg text-[#D9CEBE] max-w-2xl mx-auto leading-relaxed">
            Not seeing what you're looking for? Cliff accepts bespoke commissions for custom vessels, tableware, and sculptural pieces tailored to your vision.
          </p>
        </motion.div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {[
            {
              icon: Palette,
              title: 'Custom Design',
              description: 'Specify your exact dimensions, glaze colors, and finishes for a completely unique piece.'
            },
            {
              icon: Heart,
              title: 'Personal Connection',
              description: 'Collaborate directly with Cliff to ensure your vision becomes a functional work of art.'
            },
            {
              icon: Clock,
              title: 'Dedicated Timeline',
              description: 'Typically 6-12 weeks from design consultation to final delivery of your custom piece.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative p-8 rounded-2xl bg-[#3B342F]/50 border border-[#5A4E45]/60 hover:border-[#E2B17B]/40 backdrop-blur-sm transition-all hover:bg-[#3B342F]/70"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#E2B17B]/5 to-transparent rounded-2xl transition-opacity" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#E2B17B]/20 border border-[#E2B17B]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#E2B17B]" />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#FAF7F2] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#B5A89A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Commission Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 sm:mb-16"
        >
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF7F2] mb-8 text-center">
            Commission Process
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', label: 'Inquiry', desc: 'Share your ideas' },
              { step: '2', label: 'Consultation', desc: 'Design together' },
              { step: '3', label: 'Creation', desc: '6-12 weeks' },
              { step: '4', label: 'Delivery', desc: 'Your masterpiece arrives' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E2B17B] to-[#C8623A] flex items-center justify-center mb-3 shadow-lg"
                >
                  <span className="font-serif text-xl font-bold text-[#2C2723]">{item.step}</span>
                </motion.div>
                <h4 className="font-semibold text-[#FAF7F2] text-center mb-1">{item.label}</h4>
                <p className="text-xs text-[#B5A89A] text-center">{item.desc}</p>

                {idx < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 + 0.3 }}
                    className="hidden sm:block absolute -right-2 top-7 w-4 h-1 bg-gradient-to-r from-[#E2B17B] to-transparent origin-left"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 sm:mb-16 max-w-3xl mx-auto"
        >
          <h3 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {[
              {
                q: 'What does a commission cost?',
                a: 'Commission pricing depends on complexity, size, and glaze choices. Typically ranging from $150 to $500+. We provide a quote after the initial consultation.'
              },
              {
                q: 'How long will my commission take?',
                a: 'Most commissions take 6-12 weeks from confirmed design to completion. We work on a queue basis to ensure quality.'
              },
              {
                q: 'Can I request specific colors or techniques?',
                a: 'Absolutely! We work with you to specify clay body, glaze colors, firing methods, and dimensions. Bring reference images and inspiration.'
              },
              {
                q: 'Is a deposit required?',
                a: '50% deposit is required to secure your commission. Balance due upon completion before shipment.'
              }
            ].map((item, idx) => (
              <details key={idx} className="group p-4 sm:p-6 rounded-xl bg-[#3B342F]/50 border border-[#5A4E45]/60 hover:border-[#E2B17B]/40 transition-all cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-[#FAF7F2] select-none">
                  <span>{item.q}</span>
                  <Zap className="w-5 h-5 text-[#E2B17B] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm text-[#B5A89A] mt-4 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onRequestCustom}
            className="group relative px-8 sm:px-10 py-4 bg-gradient-to-r from-[#E2B17B] to-[#C8623A] hover:from-[#F0C494] hover:to-[#E0A64A] text-[#2C2723] rounded-full font-semibold text-base sm:text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <span>Request a Commission</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-[#B5A89A]">
            Or email <span className="font-mono text-[#E2B17B]">hello@cliffcooks.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
