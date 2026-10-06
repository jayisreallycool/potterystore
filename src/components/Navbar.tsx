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
import { Logo } from './Logo';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdminConsole: () => void;
  onOpenCustomerOrders: () => void;
  onOpenAbout: () => void;
  isAboutOpen: boolean;
  onOpenCommissions: () => void;
  isCommissionsOpen: boolean;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToSection: (id: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenShipping?: () => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdminConsole,
  onOpenCustomerOrders,
  onOpenAbout,
  isAboutOpen,
  onOpenCommissions,
  isCommissionsOpen,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onScrollToSection,
  onOpenPrivacy,
  onOpenTerms,
  onOpenShipping,
  onOpenContact
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
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <>
      {/* Announcement bar (scrolls away; only the header below is sticky) */}
      <div className="bg-[#2B2622] text-[#E6DED2] px-4 py-2 text-xs text-center">
        Autumn batch W-25 is available now
        <span className="hidden sm:inline"> — free studio crating on orders over $150</span>
      </div>

    <header className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
      isScrolled
        ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E0D2] shadow-xs'
        : 'bg-[#FAF7F2] border-b border-transparent'
    }`}>
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Hamburger & Logo Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
              aria-label="Cliff Cooks home"
              className="group text-left min-h-[44px] flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9552D] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF7F2]"
            >
              <Logo />
            </button>
          </div>

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
              aria-label="Wishlist"
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
                title="Open admin console"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D97746]/15 hover:bg-[#D97746]/25 border border-[#D97746]/40 text-[#8B3E18] text-xs font-semibold tracking-wide transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-[#D97746] animate-pulse" />
                <span>Admin Console</span>
              </button>
            )}

            {/* User Account / Auth Dropdown */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {user ? (
                <button
                  id="navbar-user-account-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Account menu"
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
                    {user.displayName?.split(' ')[0] || 'Account'}
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
                        {user.displayName || 'Your account'}
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
                          {isAdmin ? 'Admin' : 'Customer'}
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
                        <span>My orders</span>
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

            {/* Login/Register Button or Cart */}
            {!user ? (
              <button
                id="navbar-login-btn"
                onClick={() => openAuthModal('signin')}
                aria-label="Login or register"
                className="min-h-[44px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] active:scale-95 transition-all shadow-xs font-semibold text-xs tracking-wide"
              >
                <UserIcon className="w-4 h-4 text-[#E2B17B] shrink-0" />
                <span className="hidden sm:inline">Login</span>
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Desktop navigation row */}
        <nav aria-label="Shop" className="hidden lg:flex items-center gap-7 border-t border-[#ECE5DA]">
          {navCategories.map((cat) => {
            const isActive = !isAboutOpen && !isCommissionsOpen && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`nav-category-${cat.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onScrollToSection('hero-showcase');
                  ceramicAudio.playSlideSound();
                }}
                className={`relative px-1 py-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:text-[#B9552D] after:absolute after:left-1 after:right-1 after:bottom-1.5 after:h-[2px] after:rounded-full after:transition-transform after:duration-300 after:origin-left ${
                  isActive
                    ? 'text-[#2C2723] after:bg-[#B9552D] after:scale-x-100'
                    : 'text-[#695E54] hover:text-[#2C2723] after:bg-[#D6CABE] after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          <button
            id="nav-custom-orders-btn"
            aria-current={isCommissionsOpen ? 'page' : undefined}
            onClick={() => {
              onOpenCommissions();
              ceramicAudio.playSlideSound();
            }}
            className={`ml-auto relative px-1 py-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:text-[#B9552D] after:absolute after:left-1 after:right-1 after:bottom-1.5 after:h-[2px] after:rounded-full after:transition-transform after:duration-300 after:origin-left ${
              isCommissionsOpen
                ? 'text-[#2C2723] after:bg-[#B9552D] after:scale-x-100'
                : 'text-[#695E54] hover:text-[#2C2723] after:bg-[#D6CABE] after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Custom orders
          </button>

          <button
            id="nav-about-btn"
            aria-current={isAboutOpen ? 'page' : undefined}
            onClick={() => {
              onOpenAbout();
              ceramicAudio.playSlideSound();
            }}
            className={`relative px-1 py-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:text-[#B9552D] after:absolute after:left-1 after:right-1 after:bottom-1.5 after:h-[2px] after:rounded-full after:transition-transform after:duration-300 after:origin-left ${
              isAboutOpen
                ? 'text-[#2C2723] after:bg-[#B9552D] after:scale-x-100'
                : 'text-[#695E54] hover:text-[#2C2723] after:bg-[#D6CABE] after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            About Cliff
          </button>
        </nav>

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
                    <span>About Cliff</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onOpenCommissions();
                    setIsMobileMenuOpen(false);
                    ceramicAudio.playSlideSound();
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between mb-3 ${
                    isCommissionsOpen
                      ? 'bg-[#2C2723] text-[#FAF7F2]'
                      : 'bg-[#F2EDE4] text-[#2C2723] hover:bg-[#EAE2D5]'
                  }`}
                >
                  <span>Custom orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs text-[#8C7D70] block mb-2 font-semibold">
                  Shop by type
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
                <span className="text-xs text-[#8C7D70] block font-semibold">
                  Your account
                </span>
                
                {user ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#F2EDE4] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#2C2723]">{user.displayName || 'Your account'}</div>
                        <div className="text-[10px] text-[#736558] font-mono">{user.email}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#2C2723] text-[#FAF7F2]">
                        {isAdmin ? 'Admin' : 'Customer'}
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
                          <span>Admin console</span>
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
                        <span>My orders</span>
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
                        <span>Sign in or create account</span>
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
                      Admin sign in
                    </button>
                  </div>
                )}
              </div>

              {/* Acoustic Sound Setting */}
              <div className="p-3.5 rounded-xl bg-[#F2EDE4] flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-[#2C2723] block">Sound effects</span>
                  <span className="text-[10px] text-[#8A7B6D]">Soft chimes when you tap</span>
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

              {/* Legal & Help Links */}
              <div className="pt-2 border-t border-[#E8DFD3]">
                <span className="text-xs text-[#8C7D70] block mb-2 font-semibold">Help & Legal</span>
                <div className="space-y-1.5">
                  {onOpenContact && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenContact();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EFEAE1] text-xs text-[#4A4036] transition-colors"
                    >
                      Contact Us
                    </button>
                  )}
                  {onOpenShipping && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenShipping();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EFEAE1] text-xs text-[#4A4036] transition-colors"
                    >
                      Shipping & Returns
                    </button>
                  )}
                  {onOpenTerms && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenTerms();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EFEAE1] text-xs text-[#4A4036] transition-colors"
                    >
                      Terms of Service
                    </button>
                  )}
                  {onOpenPrivacy && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenPrivacy();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EFEAE1] text-xs text-[#4A4036] transition-colors"
                    >
                      Privacy Policy
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};
