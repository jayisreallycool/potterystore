import React from 'react';
import { motion } from 'motion/react';
import { Flame, Utensils, Heart, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { ceramicAudio } from '../utils/audio';

interface AboutPageProps {
  onExploreCollection: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreCollection }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2723] pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 pt-6 sm:pt-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE1] border border-[#E0D5C5] text-[#8C4624] text-xs font-mono tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>The Studio Story</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#2C2723] leading-tight">
            Cliff Cooks: Pottery in the Kiln
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#6B5E51] font-light leading-relaxed">
            Where food, craft, and everyday ritual intersect in small-batch ceramics.
          </p>
        </motion.div>

        {/* Main Story Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-xl border border-[#E0D5C5] bg-[#EAE2D5]">
              <img
                src="/uploads/IMG_2640.webp"
                alt="Cliff Cooks handcrafted pottery in the kiln"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#2C2723]/80 backdrop-blur-md text-[#FAF7F2] space-y-1">
                <div className="text-xs font-mono text-[#D97746]">FOUNDER & MAKER</div>
                <div className="font-serif text-lg">Clifford in the Studio</div>
              </div>
            </div>
          </motion.div>

          {/* Story Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-6 space-y-6 text-[#4A4036] leading-relaxed text-base sm:text-lg font-light"
          >
            <p className="font-serif text-xl sm:text-2xl text-[#2C2723] leading-snug">
              "Cliff Cooks: Pottery in the Kiln is a small-batch ceramics brand inspired by the connection between food, craft, and everyday ritual."
            </p>
            <p>
              Founded by <strong className="font-medium text-[#2C2723]">Clifford</strong>, a passionate home cook and ceramic artist, the collection features handmade bowls, plates, vases, candle holders, and mugs designed to elevate shared moments.
            </p>
            <p className="text-sm sm:text-base text-[#6B5E51]">
              Each piece is wheel-thrown and kiln-fired in small batches, with a meticulous focus on warmth, color, and functionality. Whether you are plating a weekend meal or setting the table for guests, these ceramics bring tactile grounding to daily life.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  ceramicAudio.playCeramicChime(520, 1.2);
                  onExploreCollection();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C2723] text-[#FAF7F2] font-medium text-sm hover:bg-[#8C4624] transition-all shadow-sm active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pillars / Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          
          <div className="p-6 rounded-3xl bg-[#F4EFEA] border border-[#E3D9CB] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97746]/10 text-[#D97746] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#2C2723] font-semibold">Food & Ritual</h3>
            <p className="text-sm text-[#6B5E51] leading-relaxed">
              Rooted in home cooking and the joy of sharing meals around a thoughtfully set table.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F4EFEA] border border-[#E3D9CB] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97746]/10 text-[#D97746] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#2C2723] font-semibold">Wheel-Thrown</h3>
            <p className="text-sm text-[#6B5E51] leading-relaxed">
              Every bowl, plate, vase, and mug is individually shaped on the potter's wheel with hand-finished nuance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F4EFEA] border border-[#E3D9CB] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97746]/10 text-[#D97746] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#2C2723] font-semibold">Small Batches</h3>
            <p className="text-sm text-[#6B5E51] leading-relaxed">
              Kiln-fired in limited seasonal runs with organic reactive mineral glazes and tactile textures.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F4EFEA] border border-[#E3D9CB] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97746]/10 text-[#D97746] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#2C2723] font-semibold">Warmth & Function</h3>
            <p className="text-sm text-[#6B5E51] leading-relaxed">
              Designed to feel wonderful in the hand and endure years of daily culinary use and appreciation.
            </p>
          </div>

        </div>

        {/* Gallery Preview Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2723]">Handmade in Small Batches</h2>
            <p className="text-sm text-[#6B5E51]">Bowls, plates, vases, candle holders, and mugs crafted for your home.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#E0D5C5] bg-[#EAE2D5] shadow-xs">
              <img src="/uploads/IMG_2639.webp" alt="Deep Cobalt Studio Bowl" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#E0D5C5] bg-[#EAE2D5] shadow-xs">
              <img src="/uploads/IMG_2638.webp" alt="Speckled Primitive Textured Vessel" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#E0D5C5] bg-[#EAE2D5] shadow-xs">
              <img src="/uploads/IMG_2636.webp" alt="Mottled Turquoise & Jade Vase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#E0D5C5] bg-[#EAE2D5] shadow-xs">
              <img src="/uploads/IMG_2640.webp" alt="Split Glaze Platter" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
