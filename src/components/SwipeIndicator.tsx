import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeIndicatorProps {
  showLeft?: boolean;
  showRight?: boolean;
  side?: 'left' | 'right';
  isVisible?: boolean;
}

/**
 * Visual indicator to show users they can swipe (mobile UX)
 */
export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  showLeft = false,
  showRight = true,
  isVisible = true
}) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!isVisible) {
      setOpacity(0);
      return;
    }

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible || opacity === 0) return null;

  return (
    <>
      {/* Left Swipe Indicator */}
      {showLeft && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: opacity * 0.6, x: 0 }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <motion.div animate={{ x: [-4, 4, -4] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>
      )}

      {/* Right Swipe Indicator */}
      {showRight && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: opacity * 0.6, x: 0 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <motion.div animate={{ x: [4, -4, 4] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
