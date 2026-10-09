import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductStorySectionProps {
  story?: string;
  inspiration?: string;
  process?: string;
  dimensions?: {
    heightCm: number;
    diameterCm: number;
    weightGrams: number;
    capacityMl?: number;
  };
}

export const ProductStorySection: React.FC<ProductStorySectionProps> = ({
  story,
  inspiration,
  process,
  dimensions
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('story');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-[#24201D] border border-[#3B3530] rounded-lg overflow-hidden">
      {/* Story Section */}
      {story && (
        <div className="border-b border-[#3B3530]">
          <button
            onClick={() => toggleSection('story')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2c2723] transition-colors"
          >
            <h3 className="text-lg font-serif text-[#FAF7F2]">The Story</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#E2B17B] transition-transform ${
                expandedSection === 'story' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'story' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-[#C4BAAE] leading-relaxed whitespace-pre-line">
                  {story}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Inspiration Section */}
      {inspiration && (
        <div className="border-b border-[#3B3530]">
          <button
            onClick={() => toggleSection('inspiration')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2c2723] transition-colors"
          >
            <h3 className="text-lg font-serif text-[#FAF7F2]">Inspiration</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#E2B17B] transition-transform ${
                expandedSection === 'inspiration' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'inspiration' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-[#C4BAAE] leading-relaxed whitespace-pre-line">
                  {inspiration}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Process Section */}
      {process && (
        <div className="border-b border-[#3B3530]">
          <button
            onClick={() => toggleSection('process')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2c2723] transition-colors"
          >
            <h3 className="text-lg font-serif text-[#FAF7F2]">The Process</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#E2B17B] transition-transform ${
                expandedSection === 'process' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'process' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-[#C4BAAE] leading-relaxed whitespace-pre-line">
                  {process}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dimensions Section */}
      {dimensions && (
        <div>
          <button
            onClick={() => toggleSection('dimensions')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2c2723] transition-colors"
          >
            <h3 className="text-lg font-serif text-[#FAF7F2]">Dimensions & Specs</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#E2B17B] transition-transform ${
                expandedSection === 'dimensions' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'dimensions' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#8A7B6D] uppercase font-semibold mb-1">Height</p>
                    <p className="text-lg font-serif text-[#FAF7F2]">{dimensions.heightCm} cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A7B6D] uppercase font-semibold mb-1">Diameter</p>
                    <p className="text-lg font-serif text-[#FAF7F2]">{dimensions.diameterCm} cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A7B6D] uppercase font-semibold mb-1">Weight</p>
                    <p className="text-lg font-serif text-[#FAF7F2]">{dimensions.weightGrams} g</p>
                  </div>
                  {dimensions.capacityMl && (
                    <div>
                      <p className="text-xs text-[#8A7B6D] uppercase font-semibold mb-1">Capacity</p>
                      <p className="text-lg font-serif text-[#FAF7F2]">{dimensions.capacityMl} ml</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
