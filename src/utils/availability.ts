import { PotteryProduct } from '../types';

export interface Availability {
  isSold: boolean;
  /** "One of a kind" while available, "Sold" once it's gone */
  label: string;
  /** Short note for the piece header */
  editionLabel: string;
}

/**
 * Every Cliff Cooks piece is made once. A piece is either available or sold,
 * whatever number is stored in stockCount.
 */
export function getAvailability(product: PotteryProduct): Availability {
  const isSold = !product.inStock || (product.stockCount ?? 0) <= 0;
  return {
    isSold,
    label: isSold ? 'Sold' : 'One of a kind',
    editionLabel: 'Only one made',
  };
}

const CM_PER_INCH = 2.54;

function inches(cm: number): string {
  return (cm / CM_PER_INCH).toFixed(1).replace(/\.0$/, '');
}

/** "6 cm tall × 30 cm wide (2.4 × 11.8 in)" */
export function formatSize(product: PotteryProduct): string {
  const { heightCm, diameterCm } = product.dimensions;
  return `${heightCm} cm tall × ${diameterCm} cm wide (${inches(heightCm)} × ${inches(diameterCm)} in)`;
}

/** "1,250 g (2.8 lb)" */
export function formatWeight(product: PotteryProduct): string {
  const grams = product.dimensions.weightGrams;
  return `${grams.toLocaleString('en-US')} g (${(grams / 453.592).toFixed(1)} lb)`;
}

/** "350 ml (11.8 fl oz)" or null when the piece has no capacity */
export function formatCapacity(product: PotteryProduct): string | null {
  const ml = product.dimensions.capacityMl;
  if (!ml) return null;
  return `${ml} ml (${(ml / 29.5735).toFixed(1)} fl oz)`;
}
