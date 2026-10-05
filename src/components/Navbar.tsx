import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Search, 
  Menu, 
  X, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sliders,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ceramicAudio } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenScaleVisualizer: () => void;
  onOpenAdminConsole: () => void;
  onOpenCustomerOrders: () => void;
  onOpenAbout: () => void;
  isAboutOpen: boolean;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenScaleVisualizer,
  onOpenAdminConsole,
  onOpenCustomerOrders,
  onOpenAbout,
  isAboutOpen,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onScrollToSection
}) => {
  const { user, isAdmin, openAuthModal, logOut } = useAuth();
  const [isMuted, setIsMuted] = useState(ceramicAudio.getIsMuted());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const nextMuted = ceramicAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      ceramicAudio.playCeramicChime(640, 1.2);
    }
  };

  const navCategories = [
    { id: 'all', label: 'All Works' },
    { id: 'vessels', label: 'Vessels & Vases' },
    { id: 'tableware', label: 'Tableware' },
    { id: 'tea-ritual', label: 'Tea & Ritual' },
    { id: 'planters', label: 'Planters' },
    { id: 'sculptural', label: 'Sculptural' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E0D2] shadow-xs' 
        : 'bg-[#FAF7F2] border-b border-transparent'
    }`}>
      {/* Top Kiln Batch Announcement Bar */}
      <div className="bg-[#2B2622] text-[#EFEAE1] px-3 sm:px-4 py-1.5 text-xs flex items-center justify-between tracking-wider font-mono">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D97746]/20 text-[#E89369] font-medium text-[10px]">
            <Flame className="w-3 h-3 animate-pulse" />
            WOOD KILN BATCH UNLOCKED
          </span>
          <span className="hidden md:inline text-[#C4BAAE]">
            Autumn Batch W-25 now available • Free studio crating $150+
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#A69B8E]">
          <span>LIMITED ATELIER EDITIONS</span>
          <span className="w-1 h-1 rounded-full bg-[#8E8274]"></span>
          <span>SUSTAINABLE WOOD CRATES</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Hamburger & Logo Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close studio navigation menu" : "Open studio navigation menu"}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 rounded-full text-[#2C2723] hover:bg-[#EFEAE1] transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <button 
              id="brand-logo-btn"
              onClick={() => {
                onScrollToSection('hero-showcase');
                ceramicAudio.playCeramicChime(480, 1.5);
              }}
              className="text-left group focus:outline-none min-h-[44px] flex flex-col justify-center"
            >
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-[#2C2723] group-hover:text-[#C8623A] transition-colors">
                  Cliff Cooks
                </span>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#9E8E7E]">
                  Pottery in the Kiln
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#8A7B6D] -mt-0.5 font-medium">
                Small-Batch Ceramics & Craft
              </p>
            </button>
          </div>

          {/* Desktop Categories & About Link */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-about-btn"
              onClick={() => {
                onOpenAbout();
                ceramicAudio.playSlideSound();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isAboutOpen
                  ? 'bg-[#2C2723] text-[#FAF7F2] shadow-xs'
                  : 'text-[#8C4624] hover:text-[#2C2723] hover:bg-[#EFEAE1] font-semibold'
              }`}
            >
              About Me
            </button>

            <span className="w-px h-4 bg-[#D6CABE] mx-1"></span>

            {navCategories.map((cat) => {
              const isActive = !isAboutOpen && activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`nav-category-${cat.id}`}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onScrollToSection('hero-showcase');
                    ceramicAudio.playSlideSound();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2C2723] text-[#FAF7F2] shadow-xs'
                      : 'text-[#695E54] hover:text-[#2C2723] hover:bg-[#EFEAE1]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="fixed inset-x-3 top-20 z-50 sm:static sm:inset-auto flex items-center bg-[#FAF7F2] sm:bg-[#EFEAE1] rounded-full px-3.5 py-2 sm:py-1.5 border border-[#C8623A] sm:border-[#D9CEBE] shadow-lg sm:shadow-none transition-all">
                  <Search className="w-4 h-4 text-[#C8623A] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search clay, glazes, firing..."
                    autoFocus
                    className="bg-transparent text-base sm:text-xs text-[#2C2723] placeholder-[#9E8E7E] focus:outline-none w-full sm:w-44"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="min-w-[32px] min-h-[32px] flex items-center justify-center text-xs text-[#8A7B6D] hover:text-[#2C2723] ml-1 font-mono"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  id="navbar-search-btn"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search collection"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#5E5247] hover:text-[#2C2723] hover:bg-[#EFEAE1] transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist / Curate Drawer Trigger */}
            <button
              id="navbar-wishlist-btn"
              onClick={onOpenWishlist}
              aria-label="View curated wishlist"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#5E5247] hover:text-[#2C2723] hover:bg-[#EFEAE1] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C8623A] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Admin Console Direct Launcher (Visible to Admins or for Studio Management) */}
            {isAdmin && (
              <button
                id="navbar-admin-console-btn"
                onClick={onOpenAdminConsole}
                title="Open Studio Admin Console"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D97746]/15 hover:bg-[#D97746]/25 border border-[#D97746]/40 text-[#8B3E18] text-xs font-semibold tracking-wide transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-[#D97746] animate-pulse" />
                <span>Admin Console</span>
              </button>
            )}

            {/* User Account / Auth Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  id="navbar-user-account-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Collector account menu"
                  className="min-h-[44px] flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#D9CEBE] bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] text-[#2C2723] text-xs transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover border border-[#C8623A]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#2C2723] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center font-mono">
                      {(user.displayName || user.email || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline font-medium max-w-[100px] truncate text-xs">
                    {user.displayName?.split(' ')[0] || 'Collector'}
                  </span>
                  {isAdmin && (
                    <span className="w-2 h-2 rounded-full bg-[#D97746] shrink-0" title="Admin" />
                  )}
                </button>
              ) : (
                <button
                  id="navbar-signin-btn"
                  onClick={() => openAuthModal('signin')}
                  className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9CEBE] text-[#4A4036] hover:text-[#2C2723] hover:bg-[#EFEAE1] text-xs font-medium transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#8A7B6D]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Dropdown Popover */}
              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF7F2] border border-[#E3D9CB] shadow-xl p-3 z-50 text-xs text-[#2C2723]"
                  >
                    <div className="p-2.5 rounded-xl bg-[#F2EDE4] border border-[#E3D9CB] mb-2">
                      <div className="font-semibold text-[#2C2723] truncate">
                        {user.displayName || 'Collector Patron'}
                      </div>
                      <div className="text-[10px] text-[#736558] font-mono truncate">
                        {user.email}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-semibold ${
                          isAdmin 
                            ? 'bg-[#D97746]/20 text-[#8B3E18] border border-[#D97746]/30' 
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {isAdmin ? 'Master Potter / Admin' : 'Registered Patron'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdminConsole();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#EFEAE1] text-[#8B3E18] font-semibold transition-colors"
                        >
                          <Flame className="w-4 h-4 text-[#D97746]" />
                          <span>Admin Console</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenCustomerOrders();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#EFEAE1] text-[#2C2723] transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-[#736558]" />
                        <span>My Acquisitions / Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-rose-50 text-rose-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Drawer Trigger */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              aria-label="Open cart"
              className="min-h-[44px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-95 transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#E2B17B] shrink-0" />
              <span className="text-xs font-semibold tracking-wide">
                {cartCount > 0 ? (
                  <>
                    <span className="sm:hidden">{cartCount}</span>
                    <span className="hidden sm:inline">{cartCount} Piece{cartCount > 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <span className="hidden xs:inline">Bag</span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick-Category Scroll Strip */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 pt-0.5 border-t border-[#ECE5DA]/60">
          {navCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`mobile-nav-cat-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onScrollToSection('catalog-section');
                  ceramicAudio.playSlideSound();
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 min-h-[36px] rounded-full text-xs font-medium shrink-0 transition-colors flex items-center ${
                  isActive
                    ? 'bg-[#2C2723] text-[#FAF7F2] shadow-2xs font-semibold'
                    : 'text-[#695E54] bg-[#EFEAE1]/70 hover:bg-[#EFEAE1]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Navigation Slide-Down Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#FAF7F2] border-b border-[#E3D9CB] shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-5">
              <div>
                <button
                  onClick={() => {
                    onOpenAbout();
                    setIsMobileMenuOpen(false);
                    ceramicAudio.playSlideSound();
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between mb-3 ${
                    isAboutOpen
                      ? 'bg-[#2C2723] text-[#FAF7F2]'
                      : 'bg-[#D97746]/10 text-[#8C4624] border border-[#D97746]/30 hover:bg-[#D97746]/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D97746]" />
                    <span>About Me • Cliff Cooks</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7D70] block mb-2 font-semibold">
                  Studio Collections
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {navCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsMobileMenuOpen(false);
                        onScrollToSection('hero-showcase');
                        ceramicAudio.playSlideSound();
                      }}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                        activeCategory === cat.id
                          ? 'bg-[#2C2723] text-[#FAF7F2]'
                          : 'bg-[#F2EDE4] text-[#4A4036] hover:bg-[#EAE2D5]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Account / Admin Mobile Section */}
              <div className="pt-2 border-t border-[#E8DFD3] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7D70] block font-semibold">
                  Collector & Atelier Access
                </span>
                
                {user ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#F2EDE4] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#2C2723]">{user.displayName || 'Collector'}</div>
                        <div className="text-[10px] text-[#736558] font-mono">{user.email}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#2C2723] text-[#FAF7F2]">
                        {isAdmin ? 'Admin' : 'Patron'}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenAdminConsole();
                        }}
                        className="w-full min-h-[44px] p-3 rounded-xl bg-[#D97746] text-white flex items-center justify-between text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          <span>Kiln & Clay Admin Console</span>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenCustomerOrders();
                      }}
                      className="w-full min-h-[44px] p-3 rounded-xl bg-[#EFEAE1] text-[#2C2723] flex items-center justify-between text-xs font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-[#736558]" />
                        <span>My Acquisitions / Order Status</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-60" />
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logOut();
                      }}
                      className="w-full p-2.5 rounded-xl text-center text-xs text-rose-700 hover:bg-rose-50 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="w-full min-h-[44px] p-3 rounded-xl bg-[#2C2723] text-[#FAF7F2] flex items-center justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#D97746]" />
                        <span>Sign In / Join Studio</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#D9CEBE] text-center text-xs text-[#736558] hover:text-[#2C2723]"
                    >
                      Master Potter / Admin Login
                    </button>
                  </div>
                )}
              </div>

              {/* Special Features Quick Links */}
              <div className="pt-2 border-t border-[#E8DFD3]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenScaleVisualizer();
                  }}
                  className="w-full min-h-[44px] p-3 rounded-xl bg-[#EFEAE1] text-[#2C2723] flex items-center gap-3 text-xs font-medium"
                >
                  <Compass className="w-4 h-4 text-[#C8623A]" />
                  <span>Open Room & Object Scale Visualizer</span>
                </button>
              </div>

              {/* Acoustic Sound Setting */}
              <div className="p-3.5 rounded-xl bg-[#F2EDE4] flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-medium text-[#2C2723] block">Ceramic Acoustic Chimes</span>
                  <span className="text-[10px] text-[#8A7B6D]">Authentic pottery resonance ring</span>
                </div>
                <button
                  onClick={handleAudioToggle}
                  className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    !isMuted ? 'bg-[#2C2723] text-[#FAF7F2]' : 'bg-[#DDD1C0] text-[#544A41]'
                  }`}
                >
                  {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-[#E2B17B]" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{!isMuted ? 'Audio On' : 'Muted'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
