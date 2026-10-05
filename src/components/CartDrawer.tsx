import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { ceramicAudio } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 18;
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1D1A18]/60 backdrop-blur-xs transition-opacity"
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
                <ShoppingBag className="w-5 h-5 text-[#C8623A]" />
                <h2 className="font-serif text-2xl text-[#2C2723] font-medium">
                  Your bag
                </h2>
                <span className="text-xs font-mono text-[#8C7D70]">
                  ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>
              </div>
              <button
                id="cart-drawer-close"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#EFEAE1] text-[#2C2723] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-6 py-3 bg-[#F2EDE4] border-b border-[#E3D9CB] text-xs">
              {amountToFreeShipping > 0 ? (
                <div>
                  <p className="text-[#5A4E44]">
                    Add <strong className="text-[#C8623A] font-serif font-bold">${amountToFreeShipping}</strong> more for complimentary insured studio freight.
                  </p>
                  <div className="w-full h-1.5 bg-[#DDD1C0] rounded-full mt-2 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      className="h-full bg-[#C8623A] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#4E7755] font-medium">
                  <Truck className="w-4 h-4 text-[#4E7755]" />
                  <span>You've got free shipping</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#EFEAE1] flex items-center justify-center mx-auto mb-3 text-[#A39587]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-serif text-xl text-[#2C2723]">Your bag is empty</p>
                  <p className="text-xs text-[#8A7B6D] mt-1 max-w-xs mx-auto">
                    Explore our wood-fired and reduction glazed vessels on the main showcase stage.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB] flex gap-3.5 items-center"
                  >
                    <img
                      src={item.product.images[0]?.webpUrl || item.product.images[0]?.url}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const baseName = (item.product.images[0]?.name || 'IMG_2640').replace(/\.[^/.]+$/, '');
                        const fallback = `/uploads/${baseName}.webp`;
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
                      className="w-16 h-16 rounded-xl object-cover bg-[#EAE2D5] shrink-0 border border-[#DDD1C0]"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base text-[#2C2723] font-medium truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-[10px] font-mono text-[#8C7D70]">
                        {item.product.clay} • {item.product.firing}
                      </p>
                      <span className="font-serif text-sm font-semibold text-[#2C2723] block mt-0.5">
                        ${item.product.price}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#A39587] hover:text-[#C8623A] p-1 transition-colors"
                        title="Remove piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[11px] text-[#7A6C5F]">One of a kind</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-[#FAF7F2] border-t border-[#E8DFD3] space-y-3">
                <div className="space-y-1.5 text-xs text-[#5A4E44]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#2C2723]">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-[#2C2723]">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#2C2723] pt-2 border-t border-[#E8DFD3]">
                    <span className="font-serif">Total</span>
                    <span className="font-serif text-lg">${total}</span>
                  </div>
                </div>

                <button
                  id="cart-proceed-checkout-btn"
                  onClick={onCheckout}
                  className="w-full py-3.5 px-6 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-[0.98] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
