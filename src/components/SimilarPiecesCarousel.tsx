import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PotteryProduct } from '../types';
import { InventoryBadge } from './InventoryBadge';

interface SimilarPiecesCarouselProps {
  currentProduct: PotteryProduct;
  allProducts: PotteryProduct[];
  onSelectProduct: (product: PotteryProduct) => void;
  maxVisible?: number;
}

export const SimilarPiecesCarousel: React.FC<SimilarPiecesCarouselProps> = ({
  currentProduct,
  allProducts,
  onSelectProduct,
  maxVisible = 4
}) => {
  const similarProducts = useMemo(() => {
    // Find products with same category or similar glaze
    const candidates = allProducts.filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.category === currentProduct.category ||
          p.glaze === currentProduct.glaze ||
          p.clay === currentProduct.clay)
    );

    // Sort by relevance and return max items
    return candidates
      .sort((a, b) => {
        let aScore = 0;
        let bScore = 0;

        // Category match = 3 points
        if (a.category === currentProduct.category) aScore += 3;
        if (b.category === currentProduct.category) bScore += 3;

        // Glaze match = 2 points
        if (a.glaze === currentProduct.glaze) aScore += 2;
        if (b.glaze === currentProduct.glaze) bScore += 2;

        // Clay match = 1 point
        if (a.clay === currentProduct.clay) aScore += 1;
        if (b.clay === currentProduct.clay) bScore += 1;

        // In stock = 1 point
        if (a.inStock) aScore += 1;
        if (b.inStock) bScore += 1;

        return bScore - aScore;
      })
      .slice(0, maxVisible);
  }, [currentProduct, allProducts, maxVisible]);

  if (similarProducts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-lg text-[#2C2723] mb-3">
          Explore Similar Pieces
        </h3>
        <p className="text-xs text-[#7F7062] mb-4">
          You might also like these pieces from the collection
        </p>
      </div>

      {/* Carousel Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {similarProducts.map((product) => (
          <motion.button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group text-left"
          >
            <div className="relative rounded-xl overflow-hidden bg-[#EFEAE1] border border-[#E3D9CB] transition-all group-hover:border-[#C8623A]">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0]?.url || ''}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2723]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <h4 className="font-serif text-sm text-white font-semibold leading-tight mb-1.5">
                  {product.name}
                </h4>
                <p className="text-[11px] text-[#FAF7F2]/90 mb-2 line-clamp-2">
                  {product.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-semibold text-[#E2B17B]">
                    ${product.price}
                  </span>
                  <InventoryBadge product={product} size="sm" showLabel={false} />
                </div>
              </div>

              {/* Inventory Badge - Top Right */}
              <div className="absolute top-2 right-2 z-10">
                <InventoryBadge product={product} size="sm" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* View All Link */}
      <motion.button
        whileHover={{ x: 4 }}
        className="w-full py-2.5 text-center text-xs font-semibold text-[#C8623A] hover:text-[#8B3E18] transition-colors uppercase tracking-wider"
      >
        View all pieces →
      </motion.button>
    </div>
  );
};

/**
 * Simplified version for mobile showing 2 items max
 */
export const SimilarPiecesCarouselMobile: React.FC<
  Omit<SimilarPiecesCarouselProps, 'maxVisible'>
> = (props) => {
  return <SimilarPiecesCarousel {...props} maxVisible={2} />;
};
