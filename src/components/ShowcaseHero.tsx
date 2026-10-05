import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Maximize2, 
  Sun, 
  Moon, 
  Layers, 
  Sparkles, 
  Check, 
  Flame, 
  ArrowUpRight,
  Hand,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { PotteryProduct } from '../types';
import { ceramicAudio } from '../utils/audio';

interface ShowcaseHeroProps {
  products: PotteryProduct[];
  activeProductIndex: number;
  onSelectProductIndex: (index: number) => void;
  onAddToCart: (product: PotteryProduct) => void;
  onReservePiece: (product: PotteryProduct) => void;
  onToggleWishlist: (product: PotteryProduct) => void;
  isWishlisted: (id: string) => boolean;
  onOpenProductDetail: (product: PotteryProduct) => void;
}

export const ShowcaseHero: React.FC<ShowcaseHeroProps> = ({
  products,
  activeProductIndex,
  onSelectProductIndex,
  onAddToCart,
  onReservePiece,
  onToggleWishlist,
  isWishlisted,
  onOpenProductDetail
}) => {
  const currentProduct = products[activeProductIndex] || products[0];

  // Showcase state - Locked to Front View Perspective
  const [viewMode, setViewMode] = useState<'studio' | 'room'>('studio');
  const [lightingMode, setLightingMode] = useState<'natural' | 'golden' | 'dusk'>('natural');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Filmstrip auto-scroll & drag state
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [isFilmstripHovered, setIsFilmstripHovered] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  // Touch swipe handling for main stage
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset hotspot when changing product
  useEffect(() => {
    setActiveHotspotId(null);
  }, [activeProductIndex]);

  // Filmstrip continuous slow automatic scrolling from left
  useEffect(() => {
    const el = filmstripRef.current;
    if (!el) return;

    let animationFrameId: number;
    const speed = 0.55; // Gentle slow artisanal auto-scrolling

    const step = () => {
      if (!isFilmstripHovered && !isDraggingRef.current && el) {
        el.scrollLeft += speed;
        // Seamless loop wrap when passing half width (since items are duplicated)
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isFilmstripHovered]);

  // Auto-play sliding cards for main stage
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeProductIndex, products.length]);

  const handlePrevSlide = () => {
    setSlideDirection('left');
    const prev = activeProductIndex === 0 ? products.length - 1 : activeProductIndex - 1;
    onSelectProductIndex(prev);
    ceramicAudio.playSlideSound();
  };

  const handleNextSlide = () => {
    setSlideDirection('right');
    const next = (activeProductIndex + 1) % products.length;
    onSelectProductIndex(next);
    ceramicAudio.playSlideSound();
  };

  // Handle selecting a product from the collection filmstrip
  const handleSelectFromFilmstrip = (index: number) => {
    setSlideDirection(index > activeProductIndex ? 'right' : 'left');
    onSelectProductIndex(index);
    ceramicAudio.playSlideSound();

    // Smoothly scroll to the top of the showcase hero section
    const heroElement = document.getElementById('hero-showcase');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filmstrip manual nudge controls
  const handleFilmstripScroll = (direction: 'left' | 'right') => {
    if (!filmstripRef.current) return;
    const scrollAmount = direction === 'left' ? -220 : 220;
    filmstripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    ceramicAudio.playSlideSound();
  };

  // Filmstrip desktop mouse drag handlers
  const handleFilmstripMouseDown = (e: React.MouseEvent) => {
    if (!filmstripRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX - filmstripRef.current.offsetLeft;
    dragScrollLeftRef.current = filmstripRef.current.scrollLeft;
  };

  const handleFilmstripMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !filmstripRef.current) return;
    e.preventDefault();
    const x = e.pageX - filmstripRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.3;
    filmstripRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const handleFilmstripMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Touch swipe events for mobile main stage
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // Threshold in pixels
    if (diff > minSwipeDistance) {
      handleNextSlide();
    } else if (diff < -minSwipeDistance) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddToCart = () => {
    onAddToCart(currentProduct);
    setAddedAnimation(true);
    ceramicAudio.playCeramicChime(780, 1.0);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  if (!currentProduct) return null;

  // Front View Perspective is strictly preserved (index 0)
  const currentImage = viewMode === 'room' 
    ? { url: currentProduct.roomContextImage, label: 'In Room Setting', name: 'Ambient Setting', alt: currentProduct.name }
    : currentProduct.images[0];

  const activeHotspot = currentProduct.tactileHotspots.find(h => h.id === activeHotspotId);
  const duplicatedProducts = [...products, ...products];

  return (
    <section id="hero-showcase" className="relative overflow-hidden pt-2 sm:pt-4 pb-10 sm:pb-16 bg-[#FAF7F2]">
      {/* Ambient background lighting gradient */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-1000"
        style={{
          background: lightingMode === 'golden' 
            ? 'radial-gradient(ellipse 65% 50% at 50% 25%, #EBD5BE 0%, transparent 80%)'
            : lightingMode === 'dusk'
            ? 'radial-gradient(ellipse 65% 50% at 50% 25%, #DDD1C6 0%, transparent 80%)'
            : 'radial-gradient(ellipse 65% 50% at 50% 25%, #EAE2D5 0%, transparent 80%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Showcase Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[#E8DFD3]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEAE1] border border-[#E0D5C5] text-[11px] sm:text-xs font-mono text-[#5A4E44]">
              <span className="w-2 h-2 rounded-full bg-[#C8623A] animate-pulse"></span>
              <span>SHOWCASE STAGE</span>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-[#8C7D70]">
              ITEM <span className="font-semibold text-[#2C2723]">{String(activeProductIndex + 1).padStart(2, '0')}</span> / {String(products.length).padStart(2, '0')}
            </span>
          </div>

          {/* Quick Slider Controls & Autoplay */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="hero-toggle-autoplay"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`min-h-[36px] px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                isAutoPlaying 
                  ? 'bg-[#2C2723] text-[#FAF7F2] border-[#2C2723]' 
                  : 'bg-[#EFEAE1] text-[#695E54] hover:text-[#2C2723] border-[#DFD4C4]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoPlaying ? 'bg-[#E2B17B]' : 'bg-[#9E8E7E]'}`}></span>
              <span className="hidden xs:inline">{isAutoPlaying ? 'Autoplay On' : 'Autoplay'}</span>
            </button>

            <div className="flex items-center bg-[#EFEAE1] rounded-full p-0.5 border border-[#DFD4C4]">
              <button
                id="hero-slide-prev-btn"
                onClick={handlePrevSlide}
                aria-label="Previous showcase product"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-[#4A4036] hover:text-[#2C2723] hover:bg-[#FAF7F2] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-[1px] h-3.5 bg-[#D6CABE] mx-0.5"></span>
              <button
                id="hero-slide-next-btn"
                onClick={handleNextSlide}
                aria-label="Next showcase product"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-[#4A4036] hover:text-[#2C2723] hover:bg-[#FAF7F2] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Showcase Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mt-4 sm:mt-6 items-center">
          
          {/* Left Column: Visual Showcase Theater (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            
            {/* Visual Canvas Container with Touch Swipe Support */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-2xl sm:rounded-3xl bg-[#F2EDE4] border border-[#E3D9CB] shadow-sm overflow-hidden aspect-4/3 sm:aspect-16/11 group select-none touch-pan-y"
            >
              {/* Swipe Guide Badge on Mobile */}
              <div className="sm:hidden absolute top-3 left-3 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2C2723]/70 backdrop-blur-md text-[10px] text-[#FAF7F2] font-mono">
                  <Hand className="w-2.5 h-2.5" />
                  Swipe left/right
                </span>
              </div>

              {/* Animated Main Image with Slide Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentProduct.id}-${viewMode}`}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 30 : -30, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -30 : 30, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full relative"
                >
                  <picture className="w-full h-full block">
                    {currentImage.webpUrl && (
                      <source srcSet={currentImage.webpUrl} type="image/webp" />
                    )}
                    <source srcSet={`/uploads/${currentImage.name.replace(/\.[^/.]+$/, '')}.webp`} type="image/webp" />
                    <img
                      src={currentImage.webpUrl || currentImage.url}
                      alt={currentImage.alt}
                      title={`${currentProduct.name} - ${currentProduct.subtitle}`}
                      width={currentImage.width || 1200}
                      height={currentImage.height || 1600}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const baseName = currentImage.name.replace(/\.[^/.]+$/, '');
                        const fallback = `/uploads/${baseName}.webp`;
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
                      className={`w-full h-full object-cover transition-all duration-700 pointer-events-none ${
                        lightingMode === 'golden' 
                          ? 'brightness-95 contrast-105 sepia-[0.12]' 
                          : lightingMode === 'dusk' 
                          ? 'brightness-90 contrast-105 saturate-90' 
                          : 'brightness-100 contrast-100'
                      }`}
                    />
                  </picture>

                  {/* Tactile Hotspot Pins (only in studio mode) */}
                  {viewMode === 'studio' && currentProduct.tactileHotspots.map((hotspot) => {
                    const isSelected = activeHotspotId === hotspot.id;
                    return (
                      <div
                        key={hotspot.id}
                        style={{ top: `${hotspot.yPercent}%`, left: `${hotspot.xPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      >
                        <button
                          id={`hotspot-${hotspot.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspotId(isSelected ? null : hotspot.id);
                            ceramicAudio.playCeramicChime(580, 0.8);
                          }}
                          aria-label={`Hotspot: ${hotspot.title}`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center relative focus:outline-none"
                        >
                          <span className={`absolute inset-2 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-[#C8623A]' : 'bg-[#FAF7F2]'}`}></span>
                          <span className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md text-xs font-mono font-bold transition-all transform hover:scale-110 ${
                            isSelected 
                              ? 'bg-[#C8623A] text-[#FAF7F2] ring-2 ring-white scale-110' 
                              : 'bg-[#FAF7F2]/95 text-[#2C2723] hover:bg-[#FAF7F2] ring-1 ring-[#2C2723]/20'
                          }`}>
                            ✦
                          </span>
                        </button>

                        {/* Interactive Hotspot Tooltip (Desktop view) */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3.5 rounded-xl bg-[#2C2723]/95 backdrop-blur-md text-[#FAF7F2] shadow-xl border border-white/10 z-30 pointer-events-auto"
                            >
                              <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10 mb-1.5">
                                <span className="text-xs font-serif font-semibold text-[#E2B17B] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#E2B17B]" />
                                  {hotspot.title}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveHotspotId(null);
                                  }}
                                  className="text-[10px] text-white/60 hover:text-white p-1"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-[11px] leading-relaxed text-[#D6CBC0]">
                                {hotspot.description}
                              </p>
                              <div className="w-2.5 h-2.5 bg-[#2C2723] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Floating Stage Controls (Top-Right) */}
              <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
                {/* Full Inspect Modal Launcher */}
                <button
                  id="showcase-deep-inspect-btn"
                  onClick={() => onOpenProductDetail(currentProduct)}
                  aria-label="Full craft inspection modal"
                  title="Full Craft Inspection"
                  className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#E0D5C5] text-[#2C2723] hover:bg-[#FAF7F2] shadow-xs transition-transform active:scale-95"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Perspective Indicator (Locked strictly to Front View) */}
              {viewMode === 'studio' && (
                <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#E0D5C5] shadow-xs select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8623A]"></span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#4A4036] tracking-wider uppercase font-semibold">
                    Front View Perspective
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Touch Hotspot Bottom Sheet Card (when hotspot is tapped on mobile) */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="sm:hidden p-3.5 rounded-2xl bg-[#2C2723] text-[#FAF7F2] border border-[#443B33] shadow-lg flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-serif font-semibold text-[#E2B17B] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E2B17B]" />
                      <span>{activeHotspot.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#D6CBC0]">
                      {activeHotspot.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveHotspotId(null)}
                    className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full bg-white/10 text-white text-xs"
                    aria-label="Close hotspot note"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Showcase Dot Pagination */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {products.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSlideDirection(idx > activeProductIndex ? 'right' : 'left');
                    onSelectProductIndex(idx);
                    ceramicAudio.playSlideSound();
                  }}
                  aria-label={`Slide to ${p.name}`}
                  className={`min-h-[28px] min-w-[28px] flex items-center justify-center`}
                >
                  <span className={`rounded-full transition-all duration-300 ${
                    idx === activeProductIndex
                      ? 'w-6 h-2 bg-[#C8623A]'
                      : 'w-2 h-2 bg-[#D6CABE] hover:bg-[#A89888]'
                  }`} />
                </button>
              ))}
            </div>

            {/* Collection Filmstrip with Slow Automatic Scrolling from Left */}
            <div className="mt-1 relative group/filmstrip">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-wider text-[#8A7B6D] uppercase flex items-center gap-1.5 font-semibold">
                    <Layers className="w-3.5 h-3.5 text-[#C8623A]" />
                    Collection Filmstrip
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EFEAE1] text-[#7A6C5F] text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4E7755] animate-pulse"></span>
                    Auto-scrolling
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] text-[#A39587] mr-1 hidden xs:inline">
                    Scroll or tap piece
                  </span>
                  <button
                    onClick={() => handleFilmstripScroll('left')}
                    aria-label="Scroll filmstrip left"
                    className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#4A4036] transition-colors border border-[#DDD1C0]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFilmstripScroll('right')}
                    aria-label="Scroll filmstrip right"
                    className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#4A4036] transition-colors border border-[#DDD1C0]"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Edge Gradient Masks for Cinematic Depth */}
              <div className="relative">
                <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 inset-y-0 w-6 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>

                {/* Smooth Scrollable & Auto-scrolling Strip across Mobile, Tablet, Desktop */}
                <div
                  ref={filmstripRef}
                  onMouseEnter={() => setIsFilmstripHovered(true)}
                  onMouseLeave={() => {
                    setIsFilmstripHovered(false);
                    handleFilmstripMouseUpOrLeave();
                  }}
                  onMouseDown={handleFilmstripMouseDown}
                  onMouseMove={handleFilmstripMouseMove}
                  onMouseUp={handleFilmstripMouseUpOrLeave}
                  onTouchStart={() => setIsFilmstripHovered(true)}
                  onTouchEnd={() => setIsFilmstripHovered(false)}
                  className="flex gap-2.5 overflow-x-auto no-scrollbar py-1.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
                >
                  {duplicatedProducts.map((item, idx) => {
                    const originalIndex = idx % products.length;
                    const isCurrent = originalIndex === activeProductIndex;
                    return (
                      <button
                        key={`${item.id}-filmstrip-${idx}`}
                        id={`filmstrip-card-${item.id}-${idx}`}
                        onClick={() => handleSelectFromFilmstrip(originalIndex)}
                        className={`group/thumb text-left relative rounded-xl overflow-hidden border p-1 shrink-0 w-24 sm:w-28 transition-all duration-200 min-h-[44px] ${
                          isCurrent
                            ? 'border-[#2C2723] ring-2 ring-[#2C2723]/30 bg-[#FAF7F2] scale-[1.02] shadow-md'
                            : 'border-[#E0D5C5] bg-[#F2EDE4]/80 hover:border-[#8C7B6B] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden relative">
                          <picture className="w-full h-full block">
                            {item.images[0]?.webpUrl && (
                              <source srcSet={item.images[0].webpUrl} type="image/webp" />
                            )}
                            <img
                              src={item.images[0]?.webpUrl || item.images[0]?.url}
                              alt={item.images[0]?.alt || item.name}
                              title={item.name}
                              width={200}
                              height={200}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget;
                                const baseName = item.images[0]?.name?.replace(/\.[^/.]+$/, '') || 'IMG_2640';
                                const fallback = `/uploads/${baseName}.webp`;
                                if (!target.src.endsWith(fallback)) {
                                  target.src = fallback;
                                }
                              }}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 pointer-events-none"
                            />
                          </picture>
                          {isCurrent && (
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C8623A] ring-1 ring-white"></div>
                          )}
                        </div>
                        <div className="pt-1 px-0.5">
                          <p className="text-[10px] font-medium text-[#2C2723] truncate leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-mono text-[#8C7D70]">
                            ${item.price}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Touch Artisanal Craft Showcase Details (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-center mt-2 sm:mt-0">
            
            {/* Batch Registry & Firing Tag */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono bg-[#EFEAE1] text-[#5A4E44] border border-[#DDD1C0]">
                <Flame className="w-3 h-3 text-[#C8623A]" />
                {currentProduct.firing}
              </span>

              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono bg-[#EFEAE1] text-[#7A6C5F] border border-[#DDD1C0]">
                Batch {currentProduct.edition.batchCode} • #{String(currentProduct.edition.current).padStart(2, '0')} of {currentProduct.edition.total}
              </span>
            </div>

            {/* Product Title & Japanese Inscription */}
            <div className="mb-2">
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#2C2723] tracking-tight leading-tight">
                  {currentProduct.name}
                </h1>
                {currentProduct.japaneseName && (
                  <span className="font-serif text-lg sm:text-2xl text-[#A39587] select-none shrink-0">
                    {currentProduct.japaneseName}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#7F7062] font-medium mt-1">
                {currentProduct.subtitle}
              </p>
            </div>

            {/* Price & Availability */}
            <div className="flex items-baseline gap-2.5 sm:gap-3 py-2.5 sm:py-3 my-1 border-y border-[#E8DFD3]">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2723]">
                ${currentProduct.price}
              </span>
              <span className="text-[11px] sm:text-xs text-[#8A7B6D] font-mono">
                USD • Signed Certificate
              </span>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-[#4E7755] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#4E7755]"></span>
                <span>{currentProduct.stockCount} in Stock</span>
              </div>
            </div>

            {/* Tagline / Craft Story Snippet */}
            <p className="text-xs sm:text-sm leading-relaxed text-[#544A41] italic font-serif my-2.5 sm:my-3">
              "{currentProduct.tagline}"
            </p>

            {/* Craft Specs Matrix (Clay Body, Glaze, Dimensions) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-2.5 sm:my-3 p-3 sm:p-3.5 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB] text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                  Clay Body
                </span>
                <span className="font-medium text-[#2C2723] text-xs">
                  {currentProduct.clay}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                  Glaze Surface
                </span>
                <span className="font-medium text-[#2C2723] text-xs">
                  {currentProduct.glaze}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                  Dimensions
                </span>
                <span className="font-medium text-[#2C2723] text-xs">
                  {currentProduct.dimensions.heightCm}cm H × {currentProduct.dimensions.diameterCm}cm ⌀
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C7D70] block">
                  Weight
                </span>
                <span className="font-medium text-[#2C2723] text-xs">
                  {currentProduct.dimensions.weightGrams}g (Vitrified)
                </span>
              </div>
            </div>

            {/* Primary Action Buttons (Mobile-first large touch targets) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-2 sm:mt-3">
              {/* Reserve Piece CTA Button */}
              <button
                id="hero-reserve-piece-btn"
                onClick={() => {
                  onReservePiece(currentProduct);
                  ceramicAudio.playCeramicChime(880, 1.2);
                }}
                className="flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#C8623A] text-white hover:bg-[#B3522C] active:scale-[0.98] transition-all shadow-md group font-medium"
              >
                <Bookmark className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Reserve Piece • ${currentProduct.price}
                </span>
              </button>

              {/* Add to Bag with feedback */}
              <button
                id="hero-add-to-cart-btn"
                onClick={handleAddToCart}
                className="min-h-[48px] flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-[0.98] transition-all shadow-sm group"
                title="Add to Acquisition Bag"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#8FD19E]" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      In Bag
                    </span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#E2B17B] group-hover:rotate-6 transition-transform" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      Add to Bag
                    </span>
                  </>
                )}
              </button>

              {/* Wishlist Heart */}
              <button
                id="hero-wishlist-toggle-btn"
                onClick={() => {
                  onToggleWishlist(currentProduct);
                  ceramicAudio.playCeramicChime(700, 0.8);
                }}
                aria-label="Add to curated collection"
                className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full border transition-all ${
                  isWishlisted(currentProduct.id)
                    ? 'bg-[#C8623A] text-white border-[#C8623A] shadow-xs'
                    : 'bg-[#F2EDE4] text-[#695E54] hover:text-[#2C2723] border-[#DFD4C4] hover:border-[#8C7B6B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted(currentProduct.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Deep Craft Inspect Link */}
            <div className="mt-3.5 pt-3 flex items-center justify-between text-xs text-[#8A7B6D]">
              <button
                id="hero-craft-notes-btn"
                onClick={() => onOpenProductDetail(currentProduct)}
                className="min-h-[36px] flex items-center gap-1 text-[#8B5A3E] hover:text-[#2C2723] font-medium underline underline-offset-2 transition-colors"
              >
                <span>Read Glaze Recipe & Firing Curve</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#A89A8C]">
                Studio Stamp
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
