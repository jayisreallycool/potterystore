export type ClayType = 'Black Stoneware' | 'Speckled Buff' | 'Raw Terracotta' | 'Porcelain' | 'Wild River Clay' | 'Coarse Sand Clay';

export type FiringMethod = 'Anagama Wood-Fired (72hr)' | 'Gas Reduction Cone 10' | 'Pit Fired Smoke' | 'Soda Kiln Vapor' | 'Electric Oxidation';

export type GlazeFinish = 'Matte Celadon' | 'Raw Ash & Tenmoku' | 'Wabi-sabi Crackle' | 'Unglazed Smoked' | 'Oatmeal Satin' | 'Iron Rust Splash';

export type ProductCategory = 'all' | 'vessels' | 'tableware' | 'planters' | 'tea-ritual' | 'sculptural';

export interface PotteryAngle {
  label: string;
  name: string;
  url: string;
  webpUrl?: string;
  storageUrl?: string;
  gsUri?: string;
  alt: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface TactilePoint {
  id: string;
  title: string;
  description: string;
  xPercent: number; // For interactive hotspot pin
  yPercent: number;
}

export interface PotteryProduct {
  id: string;
  name: string;
  japaneseName?: string;
  subtitle: string;
  price: number;
  category: 'vessels' | 'tableware' | 'planters' | 'tea-ritual' | 'sculptural';
  clay: ClayType;
  firing: FiringMethod;
  glaze: GlazeFinish;
  edition: {
    total: number;
    current: number;
    year: number;
    batchCode: string;
  };
  dimensions: {
    heightCm: number;
    diameterCm: number;
    weightGrams: number;
    capacityMl?: number;
  };
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  tagline: string;
  description: string;
  artisanNotes: string;
  glazeFormulaSnippet: string;
  careInstructions: string[];
  acousticResonance: string; // e.g. "Low resonant earthy chime (432Hz)"
  images: PotteryAngle[];
  tactileHotspots: TactilePoint[];
  roomContextImage: string;
  accentColor: string; // e.g. '#8B4513'
}

export interface CartItem {
  product: PotteryProduct;
  quantity: number;
  selectedFinish?: string;
  engravingText?: string;
  giftBoxIncluded: boolean;
}

export interface FilterState {
  category: ProductCategory;
  clay: string;
  firing: string;
  glaze: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'batch-newest';
}
