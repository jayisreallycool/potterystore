import React from 'react';
import { motion } from 'motion/react';

interface ScrollingAnnouncementProps {
  text?: string;
  className?: string;
}

/**
 * Full-width scrolling announcement bar with animated red text
 * Scrolls continuously from right to left
 */
export const ScrollingAnnouncement: React.FC<ScrollingAnnouncementProps> = ({
  text = 'One of a Kind • Limited Time • One of a Kind • Limited Time • One of a Kind • Limited Time •',
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] py-3 sm:py-4 border-b border-[#2a2a2a] ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -2000] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {/* Primary text */}
        <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#FF4444] font-bold px-8 flex-shrink-0">
          {text}
        </span>

        {/* Duplicate for seamless loop */}
        <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#FF4444] font-bold px-8 flex-shrink-0">
          {text}
        </span>
      </motion.div>
    </div>
  );
};
