import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { PotteryProduct } from '../types';
import { ceramicAudio } from '../utils/audio';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: PotteryProduct[];
  onRemoveFromWishlist: (product: PotteryProduct) => void;
  onAddToCart: (product: PotteryProduct) => void;
  onOpenProductDetail: (product: PotteryProduct) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenProductDetail
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1D1A18]/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#E3D9CB] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-[#C8623A] fill-current" />
                <h2 className="font-serif text-2xl text-[#2C2723] font-medium">
                  Curated Collection
                </h2>
                <span className="text-xs font-mono text-[#8C7D70]">
                  ({wishlistProducts.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#EFEAE1] text-[#2C2723] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#EFEAE1] flex items-center justify-center mx-auto mb-3 text-[#A39587]">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="font-serif text-xl text-[#2C2723]">No Curated Pieces Yet</p>
                  <p className="text-xs text-[#8A7B6D] mt-1 max-w-xs mx-auto">
                    Click the heart icon on any pottery piece on the showcase stage to save it to your personal curation.
                  </p>
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB] flex gap-3.5 items-center"
                  >
                    <img
                      src={product.images[0]?.webpUrl || product.images[0]?.url}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const baseName = (product.images[0]?.name || 'IMG_2640').replace(/\.[^/.]+$/, '');
                        const fallback = `/uploads/${baseName}.webp`;
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
                      className="w-16 h-16 rounded-xl object-cover bg-[#EAE2D5] shrink-0 border border-[#DDD1C0] cursor-pointer"
                      onClick={() => {
                        onOpenProductDetail(product);
                        onClose();
                      }}
                    />

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                      onOpenProductDetail(product);
                      onClose();
                    }}>
                      <h3 className="font-serif text-base text-[#2C2723] font-medium truncate">
                        {product.name}
                      </h3>
                      <p className="text-[10px] font-mono text-[#8C7D70]">
                        {product.clay} • {product.firing}
                      </p>
                      <span className="font-serif text-sm font-semibold text-[#2C2723] block mt-0.5">
                        ${product.price}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-[#A39587] hover:text-[#C8623A] p-1 transition-colors"
                        title="Remove from curated list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onAddToCart(product);
                          ceramicAudio.playCeramicChime(780, 0.9);
                        }}
                        className="px-3 py-1 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] text-[11px] font-medium flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#E2B17B]" />
                        <span>Acquire</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
