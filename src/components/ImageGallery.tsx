import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface Image {
  label: string;
  url: string;
  webpUrl?: string;
  alt: string;
}

interface ImageGalleryProps {
  images: Image[];
  productName: string;
  accentColor?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  accentColor = '#C8623A'
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex];

  const handlePrevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !zoomContainerRef.current) return;

    const rect = zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel((prev) => Math.min(Math.max(prev * delta, 1), 3));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape' && isZoomed) setIsZoomed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevImage, handleNextImage, isZoomed]);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div
        ref={zoomContainerRef}
        className="relative w-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3D9CB] group cursor-zoom-in"
        onMouseMove={handleZoomMouseMove}
        onWheel={handleWheel}
        style={{ aspectRatio: '1 / 1' }}
      >
        <motion.img
          key={`${selectedIndex}-main`}
          src={currentImage.webpUrl || currentImage.url}
          alt={currentImage.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-contain transition-transform duration-300"
          style={{
            transform: isZoomed
              ? `scale(${zoomLevel}) translate(-${mousePos.x * 0.01 * (zoomLevel - 1)}%, -${mousePos.y * 0.01 * (zoomLevel - 1)}%)`
              : 'scale(1)',
            cursor: isZoomed ? 'grab' : 'zoom-in'
          }}
        />

        {/* Zoom Toggle Button */}
        <button
          onClick={() => {
            setIsZoomed(!isZoomed);
            if (isZoomed) setZoomLevel(1);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#2C2723] transition-all shadow-lg opacity-0 group-hover:opacity-100"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          {isZoomed ? (
            <X className="w-5 h-5" />
          ) : (
            <ZoomIn className="w-5 h-5" />
          )}
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#2C2723] transition-all shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#2C2723] transition-all shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-2.5 py-1.5 rounded-full bg-[#2C2723]/80 backdrop-blur-sm text-[#FAF7F2] text-xs font-mono">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom Level Indicator */}
        {isZoomed && (
          <div className="absolute bottom-4 right-4 px-2.5 py-1.5 rounded-full bg-[#2C2723]/80 backdrop-blur-sm text-[#FAF7F2] text-xs font-mono">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {images.map((image, index) => (
            <motion.button
              key={`thumb-${index}`}
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? `border-[${accentColor}] ring-2 ring-offset-2`
                  : 'border-[#D9CEBE] hover:border-[#C4BAAE]'
              }`}
            >
              <img
                src={image.webpUrl || image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Image Information */}
      <div className="text-center">
        <p className="text-xs text-[#8A7B6D] font-mono uppercase tracking-wide">
          {currentImage.label}
        </p>
      </div>
    </div>
  );
};
