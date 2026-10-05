import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { ceramicAudio } from '../utils/audio';

interface ShutterIntroProps {
  onComplete?: () => void;
}

export const ShutterIntro: React.FC<ShutterIntroProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Show the large logo clearly, then smoothly trigger the shutter parting reveal
    const startTimer = setTimeout(() => {
      setIsOpen(true);
      ceramicAudio.playShutterOpenSound();
    }, 450);

    // Complete and unmount cleanly once animation concludes
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (isFinished) return null;

  // Multi-column shutter slats configuration (8 vertical columns with alternating slide directions)
  const slatsCount = 8;
  const slats = Array.from({ length: slatsCount }, (_, i) => i);

  return (
    <AnimatePresence>
      {!isFinished && (
        <div
          id="shutter-loading-overlay"
          aria-hidden="true"
          className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none select-none"
        >
          {/* Shutter Slat Blades */}
          <div className="absolute inset-0 flex w-full h-full">
            {slats.map((index) => {
              const isEven = index % 2 === 0;
              // Stagger delay originating from center outward for a cinematic opening curve
              const distanceFromCenter = Math.abs(index - (slatsCount - 1) / 2);
              const delay = distanceFromCenter * 0.045;

              return (
                <motion.div
                  key={`slat-${index}`}
                  initial={{ y: 0 }}
                  animate={
                    isOpen
                      ? {
                          y: isEven ? '-105%' : '105%',
                          transition: {
                            duration: 1.05,
                            ease: [0.76, 0, 0.24, 1],
                            delay: delay,
                          },
                        }
                      : { y: 0 }
                  }
                  className="flex-1 h-full relative border-r border-[#2C241F]/30 last:border-r-0 shadow-2xl"
                  style={{
                    backgroundColor: index % 2 === 0 ? '#16120F' : '#1E1915',
                    backgroundImage: `
                      radial-gradient(ellipse at 50% ${isEven ? '15%' : '85%'}, rgba(200, 98, 58, 0.08) 0%, transparent 70%),
                      repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 6px)
                    `,
                  }}
                >
                  {/* Subtle vertical wood/ceramic grain lines */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8623A_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Slat Edge amber accent highlight */}
                  <div className={`absolute left-0 right-0 ${isEven ? 'bottom-0 h-1 bg-[#C8623A]/40' : 'top-0 h-1 bg-[#C8623A]/40'}`} />
                </motion.div>
              );
            })}
          </div>

          {/* Golden Seam Glow upon parting */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: [0, 0.85, 0], scaleY: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 bg-radial from-[#E2B17B]/30 via-[#C8623A]/10 to-transparent pointer-events-none z-10"
            />
          )}

          {/* Large Studio Logo & Atelier Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={
              isOpen
                ? {
                    opacity: 0,
                    scale: 1.15,
                    filter: 'blur(10px)',
                    y: -12,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    transition: { duration: 0.35, ease: 'easeOut' },
                  }
            }
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6 text-center"
          >
            {/* Top Seal Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251E19]/90 border border-[#45372E] text-[#D8C7B5] text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-5 backdrop-blur-md shadow-xl">
              <Sparkles className="w-3 h-3 text-[#C8623A]" />
              <span>EST. 2026 • ANAGAMA STONEWARE</span>
            </div>

            {/* Large Signature Logo Emblem Disc */}
            <div className="relative mb-5">
              {/* Outer decorative halo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#C8623A]/50 flex items-center justify-center bg-[#231C17]/95 shadow-[0_0_50px_rgba(200,98,58,0.25)] relative backdrop-blur-md">
                {/* Rotating concentric dashed ring */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#A88B72]/40 animate-[spin_30s_linear_infinite]" />
                
                {/* Inner emblem */}
                <div className="flex flex-col items-center justify-center">
                  <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-[#C8623A] drop-shadow-[0_2px_12px_rgba(200,98,58,0.6)]" />
                </div>
              </div>
            </div>

            {/* Large Brand Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.08em] text-[#FAF7F2] font-normal mb-2 drop-shadow-lg text-center px-4">
              CliffCooks: Pottery in the Kiln
            </h1>

            {/* Atelier Descriptor Subtitle */}
            <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] text-[#D4C5B5] uppercase max-w-lg mb-3 drop-shadow-sm text-center px-4">
              Small-Batch Ceramics • Food, Craft & Everyday Ritual
            </p>

            {/* Subtle Divider Line */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C8623A]/80 to-transparent my-1" />

            <p className="text-[11px] font-mono tracking-[0.2em] text-[#8C7B6D] uppercase mt-2">
              HANDCRAFTED STONEWARE
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
