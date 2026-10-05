import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Heart,
  Flame,
  Sparkles,
  Check,
  Gift,
  Bookmark,
  Share2,
  PencilRuler
} from 'lucide-react';
import { PotteryProduct } from '../types';
import { ceramicAudio } from '../utils/audio';
import { getAvailability, formatSize, formatWeight, formatCapacity } from '../utils/availability';
import { InventoryBadge, LastOneAlert } from './InventoryBadge';
import { SimilarPiecesCarousel } from './SimilarPiecesCarousel';
import { generateProductSchema, injectSchema, updateSEOMetadata } from '../utils/enhancedSEO';

interface ProductDetailModalProps {
  product: PotteryProduct | null;
  allProducts?: PotteryProduct[];
  onClose: () => void;
  onRequestSimilar: (product: PotteryProduct) => void;
  onAddToCart: (product: PotteryProduct, options?: { giftBox: boolean; inscription?: string }) => void;
  onReservePiece: (product: PotteryProduct, options?: { giftBox: boolean; inscription?: string }) => void;
  onToggleWishlist: (product: PotteryProduct) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts = [],
  onClose,
  onRequestSimilar,
  onAddToCart,
  onReservePiece,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [inscription, setInscription] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Start fresh whenever a different piece is opened
  useEffect(() => {
    setSelectedImageIndex(0);
    setIncludeGiftBox(false);
    setInscription('');
    setLinkCopied(false);
  }, [product?.id]);

  // Update SEO metadata and schema for the product
  useEffect(() => {
    if (!product) return;

    // Update meta tags
    updateSEOMetadata(
      `${product.name} — CliffCooks Ceramics`,
      product.subtitle || product.description,
      product.images[0]?.url
    );

    // Inject product schema for SEO and social sharing
    const schema = generateProductSchema(product);
    injectSchema(schema, 'product-schema');
  }, [product]);

  // Escape closes the piece
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const availability = getAvailability(product);
  const capacity = formatCapacity(product);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} — CliffCooks`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Sharing was cancelled or is unavailable; the link stays in the address bar
    }
  };

  const handleAdd = () => {
    onAddToCart(product, { giftBox: includeGiftBox, inscription });
    setAddedAnimation(true);
    ceramicAudio.playCeramicChime(820, 1.2);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1D1A18]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden z-10 my-auto max-h-[94vh] flex flex-col"
        >
          {/* Top Bar with Close */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8DFD3] bg-[#FAF7F2] sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#EFEAE1] text-[#5A4E44] border border-[#DDD1C0]">
                {product.edition.batchCode}
              </span>
              {availability.editionLabel && (
                <span className="text-[11px] sm:text-xs text-[#8C7D70]">
                  {availability.editionLabel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="modal-share-btn"
                onClick={handleShare}
                aria-label="Share a link to this piece"
                className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] border border-[#DFD4C4] text-[#2C2723] text-xs font-medium transition-colors"
              >
                {linkCopied ? <Check className="w-4 h-4 text-[#4E7755]" /> : <Share2 className="w-4 h-4" />}
                <span aria-live="polite">{linkCopied ? 'Link copied' : 'Share'}</span>
              </button>

              <button
                id="modal-wishlist-toggle"
                onClick={() => onToggleWishlist(product)}
                aria-label="Add to wishlist"
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full border transition-colors ${
                  isWishlisted 
                    ? 'bg-[#C8623A] text-white border-[#C8623A]' 
                    : 'bg-[#EFEAE1] text-[#544A41] hover:text-[#2C2723] border-[#DFD4C4]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                id="modal-close-btn"
                onClick={onClose}
                aria-label="Close"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto custom-scroll p-4 sm:p-6 md:p-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              {/* Left Column: Gallery & Front View (Col 1-6) */}
              <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-[#EAE2D5] border border-[#E0D5C5]">
                  <picture className="w-full h-full block">
                    {product.images[selectedImageIndex]?.webpUrl && (
                      <source srcSet={product.images[selectedImageIndex].webpUrl} type="image/webp" />
                    )}
                    <source srcSet={`/uploads/${(product.images[selectedImageIndex]?.name || 'IMG_2640').replace(/\.[^/.]+$/, '')}.webp`} type="image/webp" />
                    <img
                      src={product.images[selectedImageIndex]?.webpUrl || product.images[selectedImageIndex]?.url || product.images[0]?.url}
                      alt={product.images[selectedImageIndex]?.alt || product.name}
                      title={`${product.name} - ${product.subtitle}`}
                      width={1200}
                      height={1600}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const baseName = (product.images[selectedImageIndex]?.name || 'IMG_2640').replace(/\.[^/.]+$/, '');
                        const fallback = `/uploads/${baseName}.webp`;
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 sm:px-3 py-1 rounded-full bg-[#2C2723]/80 backdrop-blur-md text-[#FAF7F2] text-[11px] sm:text-xs font-mono flex items-center gap-1.5">
                    <span>{product.images[selectedImageIndex]?.label || 'Front view'}</span>
                  </div>
                  {availability.isSold && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-3 py-1 rounded-full bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold">
                      Sold
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.label}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        ceramicAudio.playSlideSound();
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border p-0.5 transition-all min-h-[44px] ${
                        selectedImageIndex === idx
                          ? 'border-[#2C2723] ring-2 ring-[#2C2723]/30 scale-[1.02]'
                          : 'border-[#E0D5C5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = `/uploads/${img.name || 'IMG_2640.jpeg'}`;
                          if (!target.src.endsWith(fallback)) {
                            target.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>

                {/* Size, weight and care */}
                <dl className="p-3.5 rounded-2xl bg-[#EFEAE1]/70 border border-[#DDD1C0] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                  <div>
                    <dt className="text-[11px] text-[#8C7D70]">Size</dt>
                    <dd className="text-[#2C2723] font-medium">{formatSize(product)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#8C7D70]">Weight</dt>
                    <dd className="text-[#2C2723] font-medium">{formatWeight(product)}</dd>
                  </div>
                  {capacity && (
                    <div>
                      <dt className="text-[11px] text-[#8C7D70]">Holds</dt>
                      <dd className="text-[#2C2723] font-medium">{capacity}</dd>
                    </div>
                  )}
                </dl>

                {product.careInstructions?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E3D9CB] text-xs">
                    <h3 className="font-sans text-xs font-semibold text-[#2C2723] mb-1.5">Use and care</h3>
                    <ul className="space-y-1 text-[#544A41]">
                      {product.careInstructions.map((line) => (
                        <li key={line} className="flex gap-2">
                          <Check className="w-3.5 h-3.5 mt-0.5 text-[#4E7755] shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right column: story and buying */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] sm:text-xs font-mono text-[#C8623A] uppercase tracking-wider font-semibold">
                      {product.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#8A7B6D]"></span>
                    <span className="text-[11px] sm:text-xs font-mono text-[#8A7B6D]">
                      {product.firing}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-4xl text-[#2C2723] font-medium tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-xs text-[#7F7062] font-medium mt-0.5">
                    {product.subtitle}
                  </p>

                  <div className="flex items-baseline gap-3 my-3 pb-3 border-b border-[#E8DFD3]">
                    <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2723]">
                      ${product.price}
                    </span>
                    <InventoryBadge product={product} size="md" />
                  </div>

                  {/* Last One Alert */}
                  <LastOneAlert product={product} />

                  {/* Craft Description */}
                  <p className="text-xs sm:text-sm text-[#544A41] leading-relaxed mb-3.5">
                    {product.description}
                  </p>

                  {/* Artisan Maker Note */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB] mb-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#8B5A3E] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8623A]" />
                      From the maker
                    </div>
                    <p className="text-xs text-[#5E5247] leading-relaxed italic">
                      "{product.artisanNotes}"
                    </p>
                  </div>

                  {/* Glaze & Clay Body Specs */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#EFEAE1]/70 border border-[#DDD1C0] text-xs mb-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                        Clay
                      </span>
                      <span className="text-xs text-[#2C2723] font-medium">
                        {product.clay}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                        Glaze
                      </span>
                      <span className="font-mono text-[11px] text-[#2C2723]">
                        {product.glazeFormulaSnippet}
                      </span>
                    </div>
                  </div>

                  {/* Customization Options */}
                  <div className="space-y-3 mb-4 p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3D9CB]">
                    <span className="text-xs font-mono uppercase text-[#736558] block font-semibold">
                      Free extras
                    </span>
                    
                    <label className="flex items-start gap-2.5 text-xs text-[#4A4036] cursor-pointer min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={includeGiftBox}
                        onChange={(e) => setIncludeGiftBox(e.target.checked)}
                        className="mt-0.5 w-5 h-5 sm:w-4 sm:h-4 rounded text-[#C8623A] focus:ring-[#C8623A]"
                      />
                      <div>
                        <span className="font-medium text-[#2C2723] flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-[#C8623A]" />
                          Paulownia Wood Presentation Crate & Wax Seal (+Free)
                        </span>
                        <p className="text-[11px] text-[#8C7D70]">
                          Packed in hand-crafted wood crate tied with traditional indigo cloth ribbon.
                        </p>
                      </div>
                    </label>

                    <div className="pt-1">
                      <label className="block text-[11px] text-[#736558] mb-1">
                        Add a handwritten note (optional):
                      </label>
                      <input
                        type="text"
                        value={inscription}
                        onChange={(e) => setInscription(e.target.value)}
                        placeholder="e.g. 'To Sarah, wishing you warmth with every tea morning.'"
                        className="w-full bg-[#FAF7F2] border border-[#D9CEBE] rounded-xl px-3 py-2 text-base sm:text-xs text-[#2C2723] focus:outline-none focus:ring-1 focus:ring-[#C8623A] min-h-[44px] sm:min-h-0"
                        maxLength={120}
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase Bar */}
                {availability.isSold ? (
                  <div className="pt-3 border-t border-[#E8DFD3] shrink-0">
                    <p className="text-xs text-[#544A41] mb-2.5">
                      This piece has sold. Cliff can make something similar to order.
                    </p>
                    <button
                      id="modal-request-similar-btn"
                      onClick={() => onRequestSimilar(product)}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-95 text-xs font-semibold transition-all shadow-sm"
                    >
                      <PencilRuler className="w-4 h-4 text-[#E2B17B]" />
                      <span>Request a similar piece</span>
                    </button>
                  </div>
                ) : (
                <div className="pt-3 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAdd}
                      className="min-h-[48px] px-4 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-95 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4 text-[#8FD19E]" />
                          <span>In Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#E2B17B]" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    id="modal-reserve-piece-btn"
                    onClick={() => {
                      onReservePiece(product, { giftBox: includeGiftBox, inscription });
                      ceramicAudio.playCeramicChime(880, 1.2);
                    }}
                    className="flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3.5 px-4 sm:px-6 rounded-full bg-[#C8623A] text-white hover:bg-[#B3522C] active:scale-95 text-xs font-semibold uppercase tracking-wider transition-all shadow-md group"
                  >
                    <Bookmark className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                    <span>Buy now • ${product.price}</span>
                  </button>
                </div>
                )}

              </div>
            </div>

            {/* Similar Pieces Carousel - Below Main Content */}
            {allProducts.length > 1 && (
              <div className="mt-8 pt-8 border-t border-[#E3D9CB]">
                <SimilarPiecesCarousel
                  currentProduct={product}
                  allProducts={allProducts}
                  onSelectProduct={(selectedProduct) => {
                    // Product will update via parent component when route changes
                    ceramicAudio.playSlideSound();
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
