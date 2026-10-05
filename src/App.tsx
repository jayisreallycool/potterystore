import React, { useState, useEffect, useCallback } from 'react';
import { POTTERY_PRODUCTS } from './data/potteryData';
import { PotteryProduct, CartItem, FilterState, ProductCategory } from './types';
import { Navbar } from './components/Navbar';
import { ShowcaseHero } from './components/ShowcaseHero';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RoomScaleVisualizer } from './components/RoomScaleVisualizer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { ShutterIntro } from './components/ShutterIntro';
import { AuthModal } from './components/AuthModal';
import { AdminConsole } from './components/AdminConsole';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { AboutPage } from './components/AboutPage';
import { subscribeToProducts } from './services/storeService';
import { updateSEOForProduct } from './utils/seo';

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  clay: '',
  firing: '',
  glaze: '',
  minPrice: 0,
  maxPrice: 1000,
  inStockOnly: false,
  searchQuery: '',
  sortBy: 'featured'
};

export default function App() {
  // Real-time dynamic catalog initialized with the user's authentic products
  const [products, setProducts] = useState<PotteryProduct[]>(POTTERY_PRODUCTS);

  // Subscribe to real-time products from Firestore
  useEffect(() => {
    const unsub = subscribeToProducts((realtimeProducts) => {
      if (realtimeProducts && realtimeProducts.length > 0) {
        setProducts(realtimeProducts);
      }
    });
    return () => unsub();
  }, []);

  // Showcase state
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [detailedProduct, setDetailedProduct] = useState<PotteryProduct | null>(null);
  const [isScaleVisualizerOpen, setIsScaleVisualizerOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Cart & Wishlist state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kiln_clay_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kiln_clay_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer & Modal visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [introKey, setIntroKey] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiln_clay_cart', JSON.stringify(cart));
    } catch {
      // Ignored
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kiln_clay_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignored
    }
  }, [wishlist]);

  // Keyboard navigation for showcase slide (Arrow Left & Arrow Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hijacking inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (detailedProduct || isCheckoutOpen || isScaleVisualizerOpen || isAdminConsoleOpen || isCustomerOrdersOpen) return;

      if (e.key === 'ArrowRight') {
        setActiveProductIndex((prev) => (prev + 1) % products.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveProductIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailedProduct, isCheckoutOpen, isScaleVisualizerOpen, isAdminConsoleOpen, isCustomerOrdersOpen, products.length]);

  // Dynamic SEO metadata & JSON-LD updates
  useEffect(() => {
    if (detailedProduct) {
      updateSEOForProduct(detailedProduct);
    } else {
      const currentProduct = products[activeProductIndex] || null;
      updateSEOForProduct(currentProduct);
    }
  }, [detailedProduct, activeProductIndex, products]);

  // Cart actions
  const handleAddToCart = useCallback((product: PotteryProduct, options?: { giftBox: boolean; inscription?: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, giftBoxIncluded: options?.giftBox ?? item.giftBoxIncluded }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          giftBoxIncluded: options?.giftBox ?? false,
          engravingText: options?.inscription
        }
      ];
    });
  }, []);

  // Reserve Piece direct reservation handler
  const handleReservePiece = (product: PotteryProduct, options?: { giftBox: boolean; inscription?: string }) => {
    handleAddToCart(product, options);
    setDetailedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
      );
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist actions
  const handleToggleWishlist = (product: PotteryProduct) => {
    setWishlist((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Category selection handler
  const handleSelectCategory = (catId: string) => {
    setIsAboutOpen(false);
    const category = catId as ProductCategory;
    setFilters((f) => ({ ...f, category }));
    if (category !== 'all') {
      const idx = products.findIndex((p) => p.category === category);
      if (idx !== -1) {
        setActiveProductIndex(idx);
      }
    }
  };

  // Search handler
  const handleSearchChange = (query: string) => {
    setIsAboutOpen(false);
    setFilters((f) => ({ ...f, searchQuery: query }));
    if (query.trim()) {
      const q = query.toLowerCase();
      const idx = products.findIndex(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.clay.toLowerCase().includes(q) ||
          p.glaze.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      );
      if (idx !== -1) {
        setActiveProductIndex(idx);
      }
    }
  };

  // Smooth scroll
  const handleScrollToSection = (sectionId: string) => {
    setIsAboutOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Checkout totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 18;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2723] flex flex-col selection:bg-[#D97746]/20 selection:text-[#8B3E18]">
      
      {/* Navigation */}
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenScaleVisualizer={() => setIsScaleVisualizerOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onOpenCustomerOrders={() => setIsCustomerOrdersOpen(true)}
        onOpenAbout={() => {
          setIsAboutOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAboutOpen={isAboutOpen}
        activeCategory={filters.category}
        onSelectCategory={handleSelectCategory}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAboutOpen ? (
          <AboutPage
            onExploreCollection={() => {
              setIsAboutOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <ShowcaseHero
            products={products}
            activeProductIndex={activeProductIndex}
            onSelectProductIndex={setActiveProductIndex}
            onAddToCart={handleAddToCart}
            onReservePiece={handleReservePiece}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            onOpenProductDetail={setDetailedProduct}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onReplayIntro={() => setIntroKey((k) => k + 1)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
      />

      {/* Shutter Opening Page Intro */}
      <ShutterIntro key={`shutter-intro-${introKey}`} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailedProduct}
        onClose={() => setDetailedProduct(null)}
        onAddToCart={handleAddToCart}
        onReservePiece={handleReservePiece}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={detailedProduct ? isWishlisted(detailedProduct.id) : false}
      />

      {/* Room Scale Comparator Modal */}
      <RoomScaleVisualizer
        isOpen={isScaleVisualizerOpen}
        onClose={() => setIsScaleVisualizerOpen(false)}
        products={products}
        selectedProduct={products[activeProductIndex] || products[0]}
        onSelectProduct={(p) => {
          const idx = products.findIndex((item) => item.id === p.id);
          if (idx !== -1) setActiveProductIndex(idx);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={setDetailedProduct}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
        shippingCost={shippingCost}
        total={total}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Studio Admin Console */}
      <AdminConsole
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        products={products}
        onProductUpdated={() => {}}
      />

      {/* Customer Acquisitions & Orders Modal */}
      <CustomerOrdersModal
        isOpen={isCustomerOrdersOpen}
        onClose={() => setIsCustomerOrdersOpen(false)}
      />
    </div>
  );
}
