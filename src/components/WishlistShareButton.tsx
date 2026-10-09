import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistShareButtonProps {
  wishlistUuid: string;
  onShare?: () => void;
}

export const WishlistShareButton: React.FC<WishlistShareButtonProps> = ({
  wishlistUuid,
  onShare
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/wishlist/${wishlistUuid}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShare?.();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my pottery wishlist',
          text: 'I found some beautiful pieces I love',
          url: shareUrl,
        });
        onShare?.();
      } catch (err) {
        // User cancelled share
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="px-4 py-2 bg-[#443c36] hover:bg-[#524736] text-[#E2B17B] rounded-lg transition-colors flex items-center gap-2 font-semibold text-sm"
      >
        <Share2 className="w-4 h-4" />
        Share Wishlist
      </button>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#24201D] border border-[#3B3530] rounded-lg p-8 w-full max-w-md"
            >
              <h3 className="text-lg font-serif text-[#FAF7F2] mb-6">Share Your Wishlist</h3>

              <div className="space-y-6">
                {/* Copy Link */}
                <div>
                  <p className="text-xs text-[#8A7B6D] mb-3 uppercase font-semibold">Shareable Link</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-[#1a1816] border border-[#3B3530] rounded text-[#C4BAAE] text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-3 py-2 bg-[#E2B17B] text-[#24201D] rounded hover:bg-[#D4A46F] transition-colors flex items-center gap-1"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <p className="text-xs text-[#8A7B6D] mb-3 uppercase font-semibold">QR Code</p>
                  <div className="bg-[#1a1816] border border-[#3B3530] rounded p-4 flex justify-center">
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={qrUrl}
                      alt="Wishlist QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-[#8A7B6D] text-center mt-2">
                    Scan to share your wishlist
                  </p>
                </div>

                {/* Native Share */}
                {navigator.share && (
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-3 bg-[#E2B17B] text-[#24201D] rounded-lg hover:bg-[#D4A46F] transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share via...
                  </button>
                )}

                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full px-4 py-2 bg-[#3B3530] text-[#FAF7F2] rounded-lg hover:bg-[#443c36] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
