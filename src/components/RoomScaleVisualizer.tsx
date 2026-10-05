import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Ruler, Compass, Sun, Moon, Flame } from 'lucide-react';
import { PotteryProduct } from '../types';
import { ceramicAudio } from '../utils/audio';

interface RoomScaleVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  products: PotteryProduct[];
  selectedProduct: PotteryProduct;
  onSelectProduct: (product: PotteryProduct) => void;
}

interface BenchmarkObject {
  id: string;
  name: string;
  heightCm: number;
  widthCm: number;
  iconName: string;
  color: string;
}

const BENCHMARKS: BenchmarkObject[] = [
  { id: 'phone', name: 'Smartphone (6.1")', heightCm: 14.7, widthCm: 7.1, iconName: '📱', color: '#3B3B3B' },
  { id: 'cup', name: 'Espresso Cup', heightCm: 6.5, widthCm: 7.5, iconName: '☕', color: '#C8623A' },
  { id: 'book', name: 'Hardcover Novel', heightCm: 22.0, widthCm: 15.0, iconName: '📖', color: '#5A6B57' },
  { id: 'bottle', name: 'Wine Bottle (750ml)', heightCm: 30.5, widthCm: 8.0, iconName: '🍾', color: '#3A4A38' },
  { id: 'laptop', name: '13" MacBook', heightCm: 21.2, widthCm: 30.4, iconName: '💻', color: '#888888' },
];

export const RoomScaleVisualizer: React.FC<RoomScaleVisualizerProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onSelectProduct
}) => {
  const [activeBenchmarkId, setActiveBenchmarkId] = useState('phone');
  const [roomScene, setRoomScene] = useState<'credenza' | 'teatable' | 'plinth'>('credenza');

  if (!isOpen) return null;

  const benchmark = BENCHMARKS.find(b => b.id === activeBenchmarkId) || BENCHMARKS[0];
  const maxVisualHeightCm = 36; // scale baseline
  const potteryHeightPx = (selectedProduct.dimensions.heightCm / maxVisualHeightCm) * 260;
  const benchmarkHeightPx = (benchmark.heightCm / maxVisualHeightCm) * 260;

  const sceneImages = {
    credenza: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85',
    teatable: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
    plinth: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1D1A18]/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3]">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C8623A]" />
              <h2 className="font-serif text-xl sm:text-2xl text-[#2C2723] font-medium">
                Scale & Spatial Dimension Comparator
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scroll space-y-6">
            
            {/* Product Switcher Pill Strip */}
            <div>
              <span className="text-xs font-mono uppercase text-[#736558] block mb-2 font-semibold">
                Select Pottery Piece To Compare
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {products.map(p => {
                  const isCur = p.id === selectedProduct.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        ceramicAudio.playSlideSound();
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-2 transition-all ${
                        isCur 
                          ? 'bg-[#2C2723] text-[#FAF7F2] shadow-xs' 
                          : 'bg-[#EFEAE1] text-[#5A4E44] hover:bg-[#E5DDCF]'
                      }`}
                    >
                      <img src={p.images[0]?.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span>{p.name}</span>
                      <span className="font-mono text-[10px] opacity-75">{p.dimensions.heightCm}cm</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scale Comparison Canvas */}
            <div className="p-6 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#736558] font-semibold flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#C8623A]" />
                  Real-World Silhouette Comparison
                </span>

                {/* Benchmark object selector */}
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] rounded-full p-1 border border-[#DDD1C0]">
                  {BENCHMARKS.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBenchmarkId(b.id);
                        ceramicAudio.playSlideSound();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        activeBenchmarkId === b.id 
                          ? 'bg-[#2C2723] text-[#FAF7F2]' 
                          : 'text-[#695E54] hover:text-[#2C2723]'
                      }`}
                    >
                      {b.iconName} <span className="hidden sm:inline">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Staging Ruler Floor */}
              <div className="relative h-72 border-b-2 border-[#2C2723] flex items-end justify-center gap-12 sm:gap-20 bg-linear-to-b from-transparent to-[#E8E0D2]/50 rounded-b-xl px-8 pb-1">
                
                {/* Benchmark object */}
                <div className="flex flex-col items-center">
                  <div 
                    style={{ height: `${benchmarkHeightPx}px`, width: `${Math.max(48, (benchmark.widthCm / maxVisualHeightCm) * 260)}px` }}
                    className="rounded-xl border-2 border-dashed border-[#8A7B6D] bg-[#DFD4C4]/60 flex items-center justify-center text-center p-2 transition-all duration-300 shadow-xs"
                  >
                    <span className="text-2xl">{benchmark.iconName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5A4E44] mt-2 font-semibold">
                    {benchmark.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C7D70]">
                    {benchmark.heightCm} cm
                  </span>
                </div>

                {/* Pottery Piece */}
                <div className="flex flex-col items-center">
                  <div 
                    style={{ height: `${potteryHeightPx}px` }}
                    className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2C2723] relative group transition-all duration-300"
                  >
                    <img 
                      src={selectedProduct.images[0]?.webpUrl || selectedProduct.images[0]?.url} 
                      alt={selectedProduct.name} 
                      onError={(e) => {
                        const target = e.currentTarget;
                        const baseName = (selectedProduct.images[0]?.name || 'IMG_2640').replace(/\.[^/.]+$/, '');
                        const fallback = `/uploads/${baseName}.webp`;
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono">
                      {selectedProduct.dimensions.heightCm} cm
                    </div>
                  </div>
                  <span className="text-[11px] font-serif font-bold text-[#2C2723] mt-2">
                    {selectedProduct.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#C8623A] font-bold">
                    {selectedProduct.dimensions.heightCm}cm H × {selectedProduct.dimensions.diameterCm}cm ⌀
                  </span>
                </div>

                {/* Vertical Ruler Guide */}
                <div className="absolute right-4 top-4 bottom-1 w-6 border-r border-[#B8AA99] flex flex-col justify-between text-[9px] font-mono text-[#8A7B6D]">
                  <span>35cm</span>
                  <span>25cm</span>
                  <span>15cm</span>
                  <span>5cm</span>
                  <span>0cm</span>
                </div>
              </div>
            </div>

            {/* Room Setting Photo Mockup */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#736558] font-semibold">
                  Interior Context Staging
                </span>
                <div className="flex gap-1 bg-[#EFEAE1] rounded-full p-1 border border-[#DDD1C0]">
                  <button
                    onClick={() => setRoomScene('credenza')}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${roomScene === 'credenza' ? 'bg-[#2C2723] text-white' : 'text-[#695E54]'}`}
                  >
                    Dining Credenza
                  </button>
                  <button
                    onClick={() => setRoomScene('teatable')}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${roomScene === 'teatable' ? 'bg-[#2C2723] text-white' : 'text-[#695E54]'}`}
                  >
                    Tea Ceremony Alcove
                  </button>
                  <button
                    onClick={() => setRoomScene('plinth')}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${roomScene === 'plinth' ? 'bg-[#2C2723] text-white' : 'text-[#695E54]'}`}
                  >
                    Minimalist Plinth
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 relative border border-[#E0D5C5]">
                <img
                  src={sceneImages[roomScene]}
                  alt="Interior staged context"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1D1A18]/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs text-[#FAF7F2] font-serif">
                    Showing proportional balance of handcrafted ceramics in architectural residential interiors.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
