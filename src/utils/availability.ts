import { PotteryProduct } from '../types';

export interface Availability {
  isSold: boolean;
  /** Short label, e.g. "One of a kind", "Last one", "3 left", "Sold" */
  label: string;
  /** How many were made, e.g. "Batch of 10" (empty when unknown) */
  editionLabel: string;
}

export function getAvailability(product: PotteryProduct): Availability {
  const made = product.edition?.total ?? 0;
  const left = Math.max(0, product.stockCount ?? 0);
  const isSold = !product.inStock || left === 0;

  let label: string;
  if (isSold) {
    label = 'Sold';
  } else if (made === 1) {
    label = 'One of a kind';
  } else if (left === 1) {
    label = 'Last one';
  } else {
    label = `${left} left`;
  }

  const editionLabel = made === 1 ? 'Only one made' : made > 1 ? `Batch of ${made}` : '';
  return { isSold, label, editionLabel };
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
