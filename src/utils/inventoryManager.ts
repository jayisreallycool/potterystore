import { PotteryProduct } from '../types';

export interface InventoryStatus {
  isAvailable: boolean;
  label: string;
  badge?: string;
  urgent?: boolean;
}

/**
 * Determine inventory badge for a product
 * Shows "Last one available" or "Coming Soon" status
 */
export const getInventoryStatus = (product: PotteryProduct): InventoryStatus => {
  if (!product.inStock) {
    return {
      isAvailable: false,
      label: 'Sold out',
      badge: 'SOLD OUT',
      urgent: true
    };
  }

  if (product.stockCount === 1) {
    return {
      isAvailable: true,
      label: 'Last one available',
      badge: 'LAST ONE',
      urgent: true
    };
  }

  // Check for coming soon flag (would be on product if batching)
  if ((product as any).comingSoon) {
    return {
      isAvailable: false,
      label: 'Coming in next batch',
      badge: 'COMING SOON'
    };
  }

  return {
    isAvailable: true,
    label: 'In stock',
    badge: 'AVAILABLE'
  };
};

/**
 * Group products by inventory status for display
 */
export const groupProductsByInventoryStatus = (
  products: PotteryProduct[]
): {
  available: PotteryProduct[];
  lastOne: PotteryProduct[];
  comingSoon: PotteryProduct[];
  soldOut: PotteryProduct[];
} => {
  return {
    available: products.filter(
      (p) =>
        p.inStock &&
        p.stockCount > 1 &&
        !(p as any).comingSoon
    ),
    lastOne: products.filter(
      (p) =>
        p.inStock &&
        p.stockCount === 1 &&
        !(p as any).comingSoon
    ),
    comingSoon: products.filter((p) => (p as any).comingSoon),
    soldOut: products.filter((p) => !p.inStock)
  };
};

/**
 * Calculate batch status - when next batch arrives
 */
export const getBatchInfo = (
  product: PotteryProduct
): {
  batchNumber: number;
  estimatedAvailableDate?: string;
  isPreOrder: boolean;
} => {
  const batchCode = product.edition.batchCode;
  const batchNumber = parseInt(batchCode.match(/\d+/) ?.[0] || '0', 10);

  return {
    batchNumber,
    estimatedAvailableDate: (product as any).estimatedAvailableDate,
    isPreOrder: (product as any).comingSoon || false
  };
};
