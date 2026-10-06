import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState, ProductCategory } from '../types';

interface ProductFiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'vessels', label: 'Vessels' },
  { value: 'tableware', label: 'Tableware' },
  { value: 'ritual', label: 'Tea & Ritual' }
];

const CLAYS = ['Earthenware', 'Stoneware', 'Porcelain'];
const FIRINGS = ['Cone 6', 'Cone 10', 'High Fire', 'Raku'];
const GLAZES = ['Glossy', 'Matte', 'Speckled', 'Ash', 'Unglazed'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'batch-newest', label: 'Newest' }
];

export const ProductFiltersPanel: React.FC<ProductFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
    price: true,
    materials: true,
    availability: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    onFiltersChange({ ...filters, category: category as any });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: number) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleClayToggle = (clay: string) => {
    const current = filters.clay ? filters.clay.split(',') : [];
    const updated = current.includes(clay)
      ? current.filter(c => c !== clay)
      : [...current, clay];
    onFiltersChange({ ...filters, clay: updated.join(',') });
  };

  const handleFiringToggle = (firing: string) => {
    const current = filters.firing ? filters.firing.split(',') : [];
    const updated = current.includes(firing)
      ? current.filter(f => f !== firing)
      : [...current, firing];
    onFiltersChange({ ...filters, firing: updated.join(',') });
  };

  const handleGlazeToggle = (glaze: string) => {
    const current = filters.glaze ? filters.glaze.split(',') : [];
    const updated = current.includes(glaze)
      ? current.filter(g => g !== glaze)
      : [...current, glaze];
    onFiltersChange({ ...filters, glaze: updated.join(',') });
  };

  const handleInStockToggle = () => {
    onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      category: 'all',
      clay: '',
      firing: '',
      glaze: '',
      minPrice: 0,
      maxPrice: 1000,
      inStockOnly: false,
      searchQuery: filters.searchQuery,
      sortBy: 'featured'
    });
  };

  const activeFilterCount = [
    filters.category !== 'all',
    filters.clay,
    filters.firing,
    filters.glaze,
    filters.minPrice > 0,
    filters.maxPrice < 1000,
    filters.inStockOnly
  ].filter(Boolean).length;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <div className={`
        fixed lg:relative lg:translate-x-0 lg:block
        top-0 left-0 h-screen lg:h-auto w-80 lg:w-64 xl:w-72
        bg-[#24201D] border-r border-[#3B3530]
        overflow-y-auto
        transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:sticky lg:top-24
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-[#24201D] border-b border-[#3B3530] p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#FAF7F2]">Filters</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-[#A69B8E] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Filter Count */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#E2B17B]">{activeFilterCount} active</span>
              <button
                onClick={handleClearFilters}
                className="text-[#8A7B6D] hover:text-[#FAF7F2] transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Sections */}
        <div className="p-4 lg:p-6 space-y-6">

          {/* Sort */}
          <div>
            <button
              onClick={() => toggleSection('sort')}
              className="w-full flex items-center justify-between text-[#FAF7F2] font-semibold mb-3 hover:text-[#E2B17B] transition-colors"
            >
              <span className="text-sm">Sort by</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.sort ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections.sort && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  {SORT_OPTIONS.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                        className="w-4 h-4 accent-[#E2B17B]"
                      />
                      <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between text-[#FAF7F2] font-semibold mb-3 hover:text-[#E2B17B] transition-colors"
            >
              <span className="text-sm">Category</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.category ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections.category && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  {CATEGORIES.map(cat => (
                    <label
                      key={cat.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={filters.category === cat.value}
                        onChange={() => handleCategoryChange(cat.value)}
                        className="w-4 h-4 accent-[#E2B17B]"
                      />
                      <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Range */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between text-[#FAF7F2] font-semibold mb-3 hover:text-[#E2B17B] transition-colors"
            >
              <span className="text-sm">Price Range</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.price ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections.price && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div>
                    <label className="text-xs text-[#A69B8E] mb-2 block">
                      Min: ${filters.minPrice}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange('minPrice', Number(e.target.value))}
                      className="w-full h-2 bg-[#3B3530] rounded-full accent-[#E2B17B] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#A69B8E] mb-2 block">
                      Max: ${filters.maxPrice}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange('maxPrice', Number(e.target.value))}
                      className="w-full h-2 bg-[#3B3530] rounded-full accent-[#E2B17B] cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Materials */}
          <div>
            <button
              onClick={() => toggleSection('materials')}
              className="w-full flex items-center justify-between text-[#FAF7F2] font-semibold mb-3 hover:text-[#E2B17B] transition-colors"
            >
              <span className="text-sm">Materials</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.materials ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections.materials && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  {/* Clay */}
                  <div>
                    <p className="text-xs font-mono text-[#E2B17B] mb-2">Clay</p>
                    <div className="space-y-1.5">
                      {CLAYS.map(clay => (
                        <label key={clay} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.clay.includes(clay)}
                            onChange={() => handleClayToggle(clay)}
                            className="w-4 h-4 rounded accent-[#E2B17B]"
                          />
                          <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                            {clay}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Firing */}
                  <div>
                    <p className="text-xs font-mono text-[#E2B17B] mb-2">Firing</p>
                    <div className="space-y-1.5">
                      {FIRINGS.map(firing => (
                        <label key={firing} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.firing.includes(firing)}
                            onChange={() => handleFiringToggle(firing)}
                            className="w-4 h-4 rounded accent-[#E2B17B]"
                          />
                          <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                            {firing}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Glaze */}
                  <div>
                    <p className="text-xs font-mono text-[#E2B17B] mb-2">Glaze</p>
                    <div className="space-y-1.5">
                      {GLAZES.map(glaze => (
                        <label key={glaze} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.glaze.includes(glaze)}
                            onChange={() => handleGlazeToggle(glaze)}
                            className="w-4 h-4 rounded accent-[#E2B17B]"
                          />
                          <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                            {glaze}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Availability */}
          <div>
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between text-[#FAF7F2] font-semibold mb-3 hover:text-[#E2B17B] transition-colors"
            >
              <span className="text-sm">Availability</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.availability ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections.availability && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={handleInStockToggle}
                      className="w-4 h-4 rounded accent-[#E2B17B]"
                    />
                    <span className="text-xs text-[#C4BAAE] group-hover:text-[#FAF7F2] transition-colors">
                      In stock only
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </>
  );
};
