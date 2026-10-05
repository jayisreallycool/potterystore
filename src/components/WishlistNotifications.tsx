import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Heart, ShoppingBag } from 'lucide-react';
import { PotteryProduct } from '../types';

interface WishlistNotification {
  id: string;
  productId: string;
  productName: string;
  message: string;
  type: 'price_drop' | 'back_in_stock' | 'reminder' | 'batch_available';
  createdAt: Date;
  actionLabel?: string;
}

interface WishlistNotificationsProps {
  wishlistProductIds: string[];
  allProducts: PotteryProduct[];
  onNotificationAction?: (productId: string) => void;
}

export const WishlistNotifications: React.FC<WishlistNotificationsProps> = ({
  wishlistProductIds,
  allProducts,
  onNotificationAction
}) => {
  const [notifications, setNotifications] = useState<WishlistNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Check for notification-worthy events
  useEffect(() => {
    const newNotifications: WishlistNotification[] = [];

    // Check each wishlisted product for changes
    wishlistProductIds.forEach((productId) => {
      const product = allProducts.find((p) => p.id === productId);
      if (!product) return;

      // Back in stock notification
      if (product.inStock && !localStorage.getItem(`notif-stock-${productId}`)) {
        newNotifications.push({
          id: `stock-${productId}-${Date.now()}`,
          productId,
          productName: product.name,
          message: `${product.name} is back in stock!`,
          type: 'back_in_stock',
          createdAt: new Date(),
          actionLabel: 'View piece'
        });
        localStorage.setItem(`notif-stock-${productId}`, 'true');
      }

      // Last one available
      if (product.stockCount === 1 && !localStorage.getItem(`notif-last-${productId}`)) {
        newNotifications.push({
          id: `last-${productId}-${Date.now()}`,
          productId,
          productName: product.name,
          message: 'Last one available - this piece may sell out soon',
          type: 'reminder',
          createdAt: new Date(),
          actionLabel: 'Reserve now'
        });
        localStorage.setItem(`notif-last-${productId}`, 'true');
      }
    });

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 10));
    }
  }, [wishlistProductIds, allProducts]);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAction = (productId: string) => {
    onNotificationAction?.(productId);
    handleDismiss(productId);
  };

  const unreadCount = notifications.length;

  return (
    <>
      {/* Floating Bell Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-6 z-40 p-3 rounded-full bg-[#2C2723] text-[#FAF7F2] shadow-lg hover:shadow-xl transition-shadow group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={unreadCount > 0 ? `${unreadCount} wishlist updates` : "Wishlist notifications"}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C8623A] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center"
          >
            {Math.min(unreadCount, 9)}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/20"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="fixed bottom-56 right-6 z-40 w-80 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E3D9CB] overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#E3D9CB] flex items-center justify-between bg-[#EFEAE1]">
                <h3 className="font-serif text-sm font-semibold text-[#2C2723]">
                  Wishlist Updates
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-[#E3D9CB] rounded-full transition-colors"
                  aria-label="Close wishlist updates"
                >
                  <X className="w-4 h-4 text-[#2C2723]" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto custom-scroll">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[#7F7062]">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No updates yet. Add pieces to your wishlist!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E3D9CB]">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="p-3 hover:bg-[#EFEAE1]/50 transition-colors"
                      >
                        <div className="flex gap-2">
                          {notif.type === 'back_in_stock' && (
                            <ShoppingBag className="w-4 h-4 text-[#4E7755] shrink-0 mt-1" />
                          )}
                          {notif.type === 'reminder' && (
                            <Heart className="w-4 h-4 text-[#C8623A] shrink-0 mt-1" />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#2C2723]">
                              {notif.productName}
                            </p>
                            <p className="text-xs text-[#7F7062] mt-0.5">
                              {notif.message}
                            </p>
                            {notif.actionLabel && (
                              <button
                                onClick={() => handleAction(notif.productId)}
                                className="mt-2 px-2 py-1 rounded text-xs font-semibold bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] transition-colors"
                              >
                                {notif.actionLabel}
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => handleDismiss(notif.id)}
                            className="text-[#8A7B6D] hover:text-[#2C2723] transition-colors shrink-0"
                            aria-label={`Dismiss notification for ${notif.productName}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear All Button */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-[#E3D9CB] bg-[#EFEAE1]/50">
                  <button
                    onClick={() => setNotifications([])}
                    className="w-full text-xs text-[#8A7B6D] hover:text-[#2C2723] transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Email notification signup for wishlist items
 */
export const WishlistEmailNotifications: React.FC<{ productIds: string[] }> = ({
  productIds
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send email subscription request
    // Connect to your email service (Mailchimp, SendGrid, etc.)
    console.log('Subscribe email notifications:', { email, productIds });
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-2">
      <label className="block text-xs font-semibold text-[#2C2723]">
        Email me when items in my wishlist change
      </label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 rounded-lg border border-[#D9CEBE] text-sm focus:outline-none focus:border-[#C8623A]"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#2C2723] text-[#FAF7F2] text-sm font-semibold hover:bg-[#3F3732] transition-colors"
        >
          Subscribe
        </button>
      </div>
      {isSubscribed && (
        <p className="text-xs text-[#4E7755]">✓ You'll receive updates about your wishlist</p>
      )}
    </form>
  );
};
