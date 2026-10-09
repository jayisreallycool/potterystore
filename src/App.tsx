import React, { useState, useEffect, useCallback } from 'react';
import { POTTERY_PRODUCTS } from './data/potteryData';
import { PotteryProduct, CartItem, FilterState, ProductCategory, OrderRecord, InquiryRecord } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ShowcaseHero } from './components/ShowcaseHero';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductFiltersPanel } from './components/ProductFiltersPanel';
import { Footer } from './components/Footer';
import { ShutterIntro } from './components/ShutterIntro';
import { AuthModal } from './components/AuthModal';
import { AdminConsole } from './components/AdminConsole';
import { AdminConsoleExtended } from './components/AdminConsoleExtended';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { AboutPage } from './components/AboutPage';
import { CommissionPage } from './components/CommissionPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ShippingReturns } from './components/ShippingReturns';
import { ContactPage } from './components/ContactPage';
import { ArtisanProfileModal } from './components/ArtisanProfileModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WishlistNotifications } from './components/WishlistNotifications';
import { ReservationModal } from './components/ReservationModal';
import { CustomWorkSection } from './components/CustomWorkSection';
import { FloatingCartWidget } from './components/FloatingCartWidget';
import { CookieConsent } from './components/CookieConsent';
import { EmailCaptureModal } from './components/EmailCaptureModal';
import { navigate, piecePath, useRoute } from './utils/router';
import { subscribeToProducts, subscribeToAllOrders, subscribeToInquiries } from './services/storeService';
import { updateSEOForProduct, updateSEOForPage } from './utils/seo';

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
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);

  // Admin data state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  // Subscribe to orders and inquiries when admin console is open
  useEffect(() => {
    if (!isAdminConsoleOpen) return;

    const unsubOrders = subscribeToAllOrders((allOrders) => {
      setOrders(allOrders);
    });

    const unsubInquiries = subscribeToInquiries((allInquiries) => {
      setInquiries(allInquiries);
    });

    return () => {
      unsubOrders();
      unsubInquiries();
    };
  }, [isAdminConsoleOpen]);

  // The address bar decides which page or piece is showing, so every piece has a shareable link
  const route = useRoute();
  const isAboutOpen = route.name === 'about';
  const isCommissionsOpen = route.name === 'custom-orders';
  const routePieceId = route.name === 'piece' ? route.id : null;
  const detailedProduct = routePieceId ? products.find((p) => p.id === routePieceId) || null : null;
  const [commissionReference, setCommissionReference] = useState<PotteryProduct | null>(null);

  // Reservation modal state
  const [reservationProduct, setReservationProduct] = useState<PotteryProduct | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const openProductDetail = useCallback((product: PotteryProduct) => {
    navigate(piecePath(product.id));
  }, []);

  const closeProductDetail = useCallback(() => {
    navigate('/');
  }, []);

  const openCommissions = useCallback((reference?: PotteryProduct | null) => {
    setCommissionReference(reference ?? null);
    navigate('/custom-orders');
    window.scrollTo({ top: 0 });
  }, []);

  // Keep the showcase on the piece whose link was opened
  useEffect(() => {
    if (!routePieceId) return;
    const idx = products.findIndex((p) => p.id === routePieceId);
    if (idx !== -1) setActiveProductIndex(idx);
  }, [routePieceId, products]);

  // Cart & Wishlist state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kiln_clay_cart');
      const parsed: CartItem[] = saved ? JSON.parse(saved) : [];
      // Each piece exists once, so a bag never holds more than one of it
      return parsed.map((item) => ({ ...item, quantity: 1 }));
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Legal pages
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Artisan profile modal
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);

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
      if (detailedProduct || isCheckoutOpen || isAdminConsoleOpen || isCustomerOrdersOpen) return;

      if (e.key === 'ArrowRight') {
        setActiveProductIndex((prev) => (prev + 1) % products.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveProductIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailedProduct, isCheckoutOpen, isAdminConsoleOpen, isCustomerOrdersOpen, products.length]);

  // Dynamic SEO metadata & JSON-LD updates
  useEffect(() => {
    if (detailedProduct) {
      updateSEOForProduct(detailedProduct);
    } else if (isAboutOpen) {
      updateSEOForPage('About Cliff', 'Meet Clifford, the home cook and ceramic artist behind Cliff Cooks handmade pottery.');
    } else if (isCommissionsOpen) {
      updateSEOForPage('Custom orders', 'Request a custom handmade ceramic piece from Cliff Cooks: choose the form, size, glaze and quantity.');
    } else {
      updateSEOForProduct(null);
    }
  }, [detailedProduct, isAboutOpen, isCommissionsOpen]);

  // Cart actions
  const handleAddToCart = useCallback((product: PotteryProduct, options?: { inscription?: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          engravingText: options?.inscription
        }
      ];
    });
  }, []);

  // Reserve Piece direct reservation handler
  const handleReservePiece = (product: PotteryProduct, options?: { inscription?: string }) => {
    setReservationProduct(product);
    setIsReservationOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity: 1 } : item))
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
    if (route.name !== 'home') navigate('/');
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
    if (route.name !== 'home' && query.trim()) navigate('/');
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
    if (route.name !== 'home') navigate('/');
    // Wait a frame so the section exists when coming back from another page
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  // Apply filters to products
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (filters.category !== 'all' && p.category !== filters.category) return false;

    // Price range filter
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

    // Clay filter (multiple selection)
    if (filters.clay) {
      const selectedClays = filters.clay.split(',');
      if (!selectedClays.includes(p.clay)) return false;
    }

    // Firing filter (multiple selection)
    if (filters.firing) {
      const selectedFirings = filters.firing.split(',');
      if (!selectedFirings.includes(p.firing)) return false;
    }

    // Glaze filter (multiple selection)
    if (filters.glaze) {
      const selectedGlazes = filters.glaze.split(',');
      if (!selectedGlazes.includes(p.glaze)) return false;
    }

    // Stock filter
    if (filters.inStockOnly && p.stock === 0) return false;

    // Search filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) &&
          !p.clay.toLowerCase().includes(q) &&
          !p.glaze.toLowerCase().includes(q) &&
          !p.subtitle.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'batch-newest':
        return new Date(b.batchDate || 0).getTime() - new Date(a.batchDate || 0).getTime();
      case 'featured':
      default:
        return 0;
    }
  });

  // Use filtered products for showcase, fallback to all if none match
  const displayProducts = sortedProducts.length > 0 ? sortedProducts : products;

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
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onOpenCustomerOrders={() => setIsCustomerOrdersOpen(true)}
        onOpenAbout={() => {
          navigate('/about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAboutOpen={isAboutOpen}
        onOpenCommissions={() => openCommissions(null)}
        isCommissionsOpen={isCommissionsOpen}
        activeCategory={filters.category}
        onSelectCategory={handleSelectCategory}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onScrollToSection={handleScrollToSection}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenShipping={() => setIsShippingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenArtisanProfile={() => setIsArtisanModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAboutOpen ? (
          <AboutPage
            onExploreCollection={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : isCommissionsOpen ? (
          <CommissionPage
            referencePiece={commissionReference}
            onBrowsePieces={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              onBrowseCollection={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
              onViewCommissions={() => openCommissions(null)}
            />

            <div className="flex lg:gap-0">
              {/* Filters Sidebar (desktop) + Toggle (mobile) */}
              <ProductFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
              />

              {/* Main Showcase */}
              <div className="flex-1">
                <ShowcaseHero
                products={displayProducts}
                activeProductIndex={Math.min(activeProductIndex, displayProducts.length - 1)}
                onSelectProductIndex={setActiveProductIndex}
                onAddToCart={handleAddToCart}
                onReservePiece={handleReservePiece}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isWishlisted}
                onOpenProductDetail={openProductDetail}
                onOpenFilters={() => setIsFiltersOpen(true)}
              />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Custom Work Section */}
      {!isAboutOpen && !isCommissionsOpen && (
        <CustomWorkSection onRequestCustom={() => openCommissions(null)} />
      )}

      {/* Footer */}
      <Footer
        onReplayIntro={() => setIntroKey((k) => k + 1)}
        onOpenCommissions={() => openCommissions(null)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenShipping={() => setIsShippingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Shutter Opening Page Intro */}
      <ShutterIntro key={`shutter-intro-${introKey}`} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailedProduct}
        allProducts={products}
        onClose={closeProductDetail}
        onRequestSimilar={(p) => openCommissions(p)}
        onAddToCart={handleAddToCart}
        onReservePiece={handleReservePiece}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={detailedProduct ? isWishlisted(detailedProduct.id) : false}
      />

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => {
          setIsReservationOpen(false);
          setReservationProduct(null);
        }}
        product={reservationProduct}
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
        onOpenProductDetail={openProductDetail}
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
      <AdminConsoleExtended
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        products={products}
        orders={orders}
        inquiries={inquiries}
      />

      {/* Customer orders */}
      <CustomerOrdersModal
        isOpen={isCustomerOrdersOpen}
        onClose={() => setIsCustomerOrdersOpen(false)}
      />

      {/* Legal Pages */}
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsOfService
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <ShippingReturns
        isOpen={isShippingOpen}
        onClose={() => setIsShippingOpen(false)}
      />
      <ContactPage
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Wishlist Notifications System */}
      <WishlistNotifications
        wishlistProductIds={wishlist}
        allProducts={products}
        onNotificationAction={(productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) openProductDetail(product);
        }}
      />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Floating Cart Widget - Bottom Right */}
      <FloatingCartWidget
        items={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Email Capture Modal */}
      <EmailCaptureModal />

      {/* Artisan Profile Modal */}
      <ArtisanProfileModal
        isOpen={isArtisanModalOpen}
        onClose={() => setIsArtisanModalOpen(false)}
      />

    </div>
  );
}
