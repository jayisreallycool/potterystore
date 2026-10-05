import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartWidgetProps {
  items: CartItem[];
  onOpenCart: () => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
}

/**
 * Floating cart widget with quick preview
 * Shows cart count badge, expands on hover to show items
 */
export const FloatingCartWidget: React.FC<FloatingCartWidgetProps> = ({
  items,
  onOpenCart,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        onClick={() => {
          if (!isExpanded) onOpenCart();
        }}
        className="fixed bottom-8 right-8 z-30 w-16 h-16 rounded-full bg-[#C8623A] hover:bg-[#B3522C] shadow-lg flex items-center justify-center transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={itemCount > 0 ? `Open cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}` : "Open cart"}
      >
        <ShoppingBag className="w-7 h-7 text-white" />

        {/* Count Badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FFA500] text-white text-xs font-bold flex items-center justify-center"
            >
              {itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded Preview Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className="fixed bottom-28 right-8 z-30 w-80 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E3D9CB] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#EFEAE1] border-b border-[#E3D9CB]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#2C2723]">Your Cart</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-full hover:bg-[#E3D9CB] transition-colors"
                  aria-label="Close cart preview"
                >
                  <X className="w-4 h-4 text-[#2C2723]" />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-[#D9CEBE] mx-auto mb-3" />
                  <p className="text-sm text-[#7F7062]">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 p-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-lg bg-[#EFEAE1]/50 hover:bg-[#EFEAE1] transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F2EDE4]">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2C2723] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#7F7062] mb-2">
                          ${item.product.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-[#D9CEBE] transition-colors"
                            aria-label={`Decrease quantity for ${item.product.name}`}
                          >
                            <Minus className="w-3 h-3 text-[#544A41]" />
                          </button>
                          <span className="text-xs font-medium text-[#2C2723] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-[#D9CEBE] transition-colors"
                            aria-label={`Increase quantity for ${item.product.name}`}
                          >
                            <Plus className="w-3 h-3 text-[#544A41]" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="ml-auto p-1 rounded hover:bg-[#F0A59A]/20 transition-colors"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-3 h-3 text-[#8B3E18]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-[#E3D9CB] bg-[#EFEAE1]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#2C2723]">Total:</span>
                  <span className="text-lg font-bold text-[#C8623A]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenCart();
                  }}
                  className="w-full py-3 rounded-full bg-[#C8623A] text-white font-semibold hover:bg-[#B3522C] transition-colors text-sm"
                >
                  View Full Cart
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
