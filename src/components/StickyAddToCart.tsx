import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { PotteryProduct } from '../types';
import { getInventoryStatus } from '../utils/inventoryManager';

interface StickyAddToCartProps {
  product: PotteryProduct | null;
  isVisible: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

/**
 * Mobile-optimized sticky "Add to Cart" button
 * Appears at bottom of viewport on small screens
 */
export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  product,
  isVisible,
  isWishlisted,
  onAddToCart,
  onToggleWishlist
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product || !isVisible) return null;

  const status = getInventoryStatus(product);
  const isSoldOut = !status.isAvailable;

  const handleAdd = () => {
    onAddToCart();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF7F2] border-t border-[#E3D9CB] shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
          <button
            onClick={onToggleWishlist}
            className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-[#C8623A] text-white border-[#C8623A]'
                : 'bg-[#EFEAE1] text-[#544A41] border-[#D9CEBE] hover:border-[#C8623A]'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>

          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`flex-1 h-12 rounded-full font-semibold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
              isSoldOut
                ? 'bg-[#8A7B6D] text-[#FAF7F2] cursor-not-allowed'
                : 'bg-[#C8623A] text-white hover:bg-[#B3522C] active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>{isSoldOut ? 'Sold Out' : `Buy • $${product.price}`}</span>
              </>
            )}
          </button>
        </div>

        {/* Inventory Status Line */}
        {status.badge && (
          <div className="px-4 py-2 bg-[#EFEAE1]/50 text-center text-xs text-[#544A41] font-medium">
            {status.label}
            {status.urgent && ' — Don\'t miss out!'}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
