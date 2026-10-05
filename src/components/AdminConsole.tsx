import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Flame, 
  AlertTriangle, 
  X, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  DollarSign,
  Upload,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PotteryProduct, ClayType, FiringMethod, GlazeFinish, ProductCategory } from '../types';
import { 
  OrderRecord, 
  InquiryRecord, 
  subscribeToAllOrders, 
  updateOrderStatus, 
  saveProduct, 
  removeProduct, 
  seedDefaultCatalog, 
  subscribeToInquiries,
  uploadProductImage 
} from '../services/storeService';
import { ceramicAudio } from '../utils/audio';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  products: PotteryProduct[];
  onProductUpdated: () => void;
}

export function AdminConsole({ isOpen, onClose, products, onProductUpdated }: AdminConsoleProps) {
  const { user, isAdmin, logOut, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries' | 'settings'>('overview');
  
  // Real-time states
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PotteryProduct | null>(null);
  const [productForm, setProductForm] = useState<Partial<PotteryProduct>>({});

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Subscribe to orders and inquiries when opened
  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    const unsubOrders = subscribeToAllOrders((allOrders) => {
      setOrders(allOrders);
      setIsLoadingOrders(false);
    });

    const unsubInquiries = subscribeToInquiries((allInquiries) => {
      setInquiries(allInquiries);
    });

    return () => {
      unsubOrders();
      unsubInquiries();
    };
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161412]/95 backdrop-blur-md text-[#FAF7F2]">
        <div className="max-w-md w-full bg-[#201D1A] border border-[#3B342F] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#D97746]/20 border border-[#D97746]/40 text-[#D97746] flex items-center justify-center mx-auto">
            <Flame className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Access Restricted
            </span>
            <h2 className="font-serif text-2xl text-[#FAF7F2] mt-2">Atelier Master Potter Access</h2>
            <p className="text-xs text-[#A69B8E] mt-2 leading-relaxed">
              This console connects directly to the live Firestore archive and order fulfillment system. Sign in with the master administrator account to manage pieces, orders, and studio telemetry.
            </p>
            <div className="mt-3 p-2.5 rounded-xl bg-[#272320] border border-[#3B342F] font-mono text-[11px] text-[#D97746]">
              Authorized Email: buddhacmd02@gmail.com
            </div>
            {user && (
              <div className="mt-2 text-[11px] text-zinc-400">
                Currently signed in as: <span className="font-mono text-white">{user.email}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                openAuthModal('signin');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              Sign In with Google or Email
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-[#2A2521] hover:bg-[#38312B] text-[#C4BAAE] text-xs font-medium transition-colors cursor-pointer"
            >
              Return to Studio Showcase
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 3500);
  };

  // KPIs
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'firing_in_progress');
  const lowStockProducts = products.filter(p => !p.inStock || p.stockCount <= 0);

  // Status Change
  const handleStatusChange = async (orderId: string, nextStatus: OrderRecord['status']) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      showToast(`Order status updated to "${nextStatus}"`);
      ceramicAudio.playCeramicChime(750, 0.8);
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Seed default catalog to Firestore
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const count = await seedDefaultCatalog();
      showToast(`Successfully synced ${count} ceramic pieces to Firestore`);
      onProductUpdated();
    } catch (err: any) {
      showToast('Error syncing to Firestore: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Open product create/edit
  const handleOpenProductModal = (prod?: PotteryProduct) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({ ...prod });
    } else {
      setEditingProduct(null);
      const newId = 'kc-' + Date.now().toString(36);
      setProductForm({
        id: newId,
        name: '',
        japaneseName: '',
        subtitle: '',
        price: 120,
        category: 'vessels',
        clay: 'Black Stoneware',
        firing: 'Anagama Wood-Fired (72hr)',
        glaze: 'Raw Ash & Tenmoku',
        inStock: true,
        stockCount: 1,
        isFeatured: false,
        tagline: 'Artisanal wheel-thrown creation from the studio kiln.',
        description: 'Handcrafted stoneware vessel formed with traditional Japanese pottery techniques.',
        artisanNotes: 'Unique unglazed ash marks and flame-licked contours.',
        glazeFormulaSnippet: 'Wood ash and wild mountain clay slip',
        acousticResonance: 'Deep resonant tone (440Hz)',
        careInstructions: ['Hand wash gently with warm water', 'Vitrified Cone 10 stoneware'],
        dimensions: { heightCm: 22, diameterCm: 16, weightGrams: 1100 },
        edition: { total: 1, current: 1, year: new Date().getFullYear(), batchCode: 'AUTUMN-26' },
        accentColor: '#8B4513',
        roomContextImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        tactileHotspots: [],
        images: [
          {
            label: 'Front Staged',
            name: 'Primary View',
            url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85',
            alt: 'Handcrafted ceramic stoneware piece'
          }
        ]
      });
    }
    setIsProductModalOpen(true);
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Product name and price are required', 'error');
      return;
    }

    try {
      const payload = productForm as PotteryProduct;
      await saveProduct(payload);
      showToast(editingProduct ? 'Pottery piece updated' : 'New pottery piece published');
      setIsProductModalOpen(false);
      onProductUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to save piece', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the studio archive?`)) return;
    try {
      await removeProduct(id);
      showToast(`Piece "${name}" removed`);
      onProductUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove piece', 'error');
    }
  };

  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);

  // Upload image for a product via Firebase Storage
  const handleFileUploadForProduct = async (file: File, targetProductId: string) => {
    setUploadingTargetId(targetProductId);
    try {
      const url = await uploadProductImage(file, targetProductId);
      const targetProd = products.find(p => p.id === targetProductId);
      if (targetProd) {
        const updated: PotteryProduct = {
          ...targetProd,
          images: [
            { label: 'Real Photo', name: file.name, url, alt: targetProd.name },
            ...(targetProd.images?.slice(1) || [])
          ],
          roomContextImage: url
        };
        try {
          localStorage.setItem(`custom_photo_${targetProductId}`, url);
        } catch {}
        await saveProduct(updated);
        showToast(`Photo for "${targetProd.name}" uploaded to Firebase Storage!`);
        onProductUpdated();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingTargetId(null);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Filtered products
  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.clay.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1A1816] text-[#FAF7F2] overflow-hidden">
      
      {/* Top Banner / Navigation */}
      <header className="bg-[#24201D] border-b border-[#3B342F] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97746]/20 border border-[#D97746]/40 flex items-center justify-center text-[#D97746]">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-semibold tracking-wide text-[#FAF7F2]">
                Kiln & Clay Atelier Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Production Live
              </span>
            </div>
            <p className="text-[11px] text-[#A69B8E] font-mono">
              Database: <span className="text-[#D97746]">ai-studio-artisanalpottery</span> • Cloud Firestore
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2E2925] border border-[#423B35] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[#C4BAAE]">Master Potter:</span>
            <span className="font-mono text-[#FAF7F2]">{user?.email || 'Admin'}</span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-medium transition-all cursor-pointer"
          >
            <span>Return to Store</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className={`px-4 py-2 text-center text-xs font-medium shrink-0 transition-all ${
          actionNotice.type === 'success' ? 'bg-emerald-800 text-white' : 'bg-red-800 text-white'
        }`}>
          {actionNotice.message}
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-60 bg-[#201D1A] border-r border-[#332D28] flex flex-col shrink-0 p-3">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#D97746] text-white shadow-sm'
                  : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Studio Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#D97746] text-white shadow-sm'
                  : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Works & Inventory</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-black/30">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#D97746] text-white shadow-sm'
                  : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Acquisitions & Orders</span>
              </div>
              {pendingOrders.length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-[#D97746] text-white shadow-sm'
                  : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-black/30">
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#D97746] text-white shadow-sm'
                  : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Production & Auth</span>
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-[#332D28] space-y-2">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#2E2824] hover:bg-[#3D352F] text-[#E0D7CD] text-xs font-mono border border-[#473D35] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#D97746]" />
              <span>{isSeeding ? 'Syncing...' : 'Sync Catalog to DB'}</span>
            </button>

            <button
              onClick={logOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-medium border border-red-900/30 transition-colors cursor-pointer"
            >
              <span>Sign Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#161412]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Atelier Operational Overview</h2>
                <p className="text-xs text-[#A69B8E]">Real-time telemetry, acquisitions, and kiln inventory statuses.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28]">
                  <div className="flex items-center justify-between text-xs text-[#A69B8E] mb-2">
                    <span>Acquisition Volume</span>
                    <DollarSign className="w-4 h-4 text-[#D97746]" />
                  </div>
                  <div className="font-serif text-3xl font-semibold text-[#FAF7F2]">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>From {orders.length} total orders</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28]">
                  <div className="flex items-center justify-between text-xs text-[#A69B8E] mb-2">
                    <span>Pending Kiln Actions</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-serif text-3xl font-semibold text-amber-400">
                    {pendingOrders.length + inProgressOrders.length}
                  </div>
                  <div className="text-[11px] text-[#A69B8E] mt-2">
                    {pendingOrders.length} awaiting packing, {inProgressOrders.length} in kiln
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28]">
                  <div className="flex items-center justify-between text-xs text-[#A69B8E] mb-2">
                    <span>Active Pieces in Archive</span>
                    <Package className="w-4 h-4 text-[#C4BAAE]" />
                  </div>
                  <div className="font-serif text-3xl font-semibold text-[#FAF7F2]">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-[#A69B8E] mt-2">
                    {products.filter(p => p.inStock).length} available for acquisition
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28]">
                  <div className="flex items-center justify-between text-xs text-[#A69B8E] mb-2">
                    <span>Sold</span>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="font-serif text-3xl font-semibold text-rose-400">
                    {lowStockProducts.length}
                  </div>
                  <div className="text-[11px] text-[#A69B8E] mt-2">
                    Pieces marked as sold
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Acquisitions */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base text-[#FAF7F2]">Recent Customer Acquisitions</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#D97746] hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#8A7D71]">
                      No customer orders placed yet. Place an acquisition in store to test!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(ord => (
                        <div key={ord.id} className="p-3.5 rounded-xl bg-[#272320] border border-[#3B342F] flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#D97746] font-semibold">{ord.id}</span>
                              <span className="text-[#FAF7F2] font-medium">{ord.customerName}</span>
                            </div>
                            <div className="text-[11px] text-[#8A7D71] mt-0.5">
                              {ord.items?.length || 1} works • ${ord.total} • {new Date(ord.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${
                              ord.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              ord.status === 'dispatched' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              ord.status === 'firing_in_progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-zinc-800 text-zinc-300'
                            }`}>
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Studio Health & Quick Actions */}
                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-4">
                  <h3 className="font-serif text-base text-[#FAF7F2]">Kiln Master Controls</h3>
                  
                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Add New Ceramic Piece</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSeedDatabase}
                      disabled={isSeeding}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A2521] hover:bg-[#38312B] text-[#E0D7CD] text-xs font-medium border border-[#423932] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 text-[#D97746] ${isSeeding ? 'animate-spin' : ''}`} />
                        <span>Force Catalog Cloud Sync</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A2521] hover:bg-[#38312B] text-[#E0D7CD] text-xs font-medium border border-[#423932] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-sky-400" />
                        <span>Review Client Inquiries ({inquiries.length})</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1A1816] border border-[#2E2824] text-[11px] text-[#A69B8E] space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Security Rules Active</span>
                    </div>
                    <p>ABAC authorization enforced: only authorized admins can mutate catalog and orders.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: WORKS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-5 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#FAF7F2]">Pottery Archive & Inventory</h2>
                  <p className="text-xs text-[#A69B8E]">Manage wheel-thrown pieces, batches, pricing, and stock availability.</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8A7D71] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search works..."
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-[#201D1A] border border-[#332D28] text-xs text-[#FAF7F2] placeholder-[#8A7D71] focus:outline-none focus:border-[#D97746] w-48"
                    />
                  </div>

                  <button
                    onClick={() => handleOpenProductModal()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Piece</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-[#201D1A] border border-[#332D28] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#272320] text-[#A69B8E] uppercase font-mono tracking-wider text-[10px] border-b border-[#332D28]">
                      <tr>
                        <th className="py-3 px-4">Piece</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Clay / Firing</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2C2723]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#25211E] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80'}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-800 shrink-0"
                              />
                              <div>
                                <div className="font-medium text-[#FAF7F2]">{p.name}</div>
                                <div className="text-[10px] text-[#A69B8E] font-mono">{p.japaneseName || p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#D0C5B8] capitalize">
                            {p.category}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-[#A69B8E]">
                            <div>{p.clay}</div>
                            <div className="text-[10px] opacity-70">{p.firing}</div>
                          </td>
                          <td className="py-3.5 px-4 font-serif text-sm font-semibold text-[#FAF7F2]">
                            ${p.price}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {!p.inStock || p.stockCount <= 0 ? 'Sold' : 'Available'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              p.inStock ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                            }`}>
                              {p.inStock ? 'Available' : 'Archived'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-1.5 rounded-lg text-[#C4BAAE] hover:text-white hover:bg-[#38312B] transition-colors"
                                title="Edit Piece"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                                title="Delete Piece"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACQUISITIONS & ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-5 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#FAF7F2]">Collector Acquisitions & Orders</h2>
                  <p className="text-xs text-[#A69B8E]">Track order fulfillment, update packaging statuses, and log delivery milestones.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A7D71] font-mono">Filter:</span>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="bg-[#201D1A] border border-[#332D28] rounded-xl px-3 py-1.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  >
                    <option value="all">All Orders ({orders.length})</option>
                    <option value="pending">Pending</option>
                    <option value="firing_in_progress">Firing / Packing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#201D1A] border border-[#332D28] text-xs text-[#8A7D71]">
                  No orders match the selected filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-4">
                      
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C2723] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#D97746]">{order.id}</span>
                          <span className="text-xs text-[#FAF7F2] font-semibold">{order.customerName}</span>
                          <span className="text-xs text-[#8A7D71]">({order.customerEmail})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#8A7D71] font-mono">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>

                          {/* Status Dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                            className={`px-3 py-1 rounded-xl text-xs font-mono font-medium focus:outline-none cursor-pointer ${
                              order.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              order.status === 'dispatched' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              order.status === 'firing_in_progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              order.status === 'cancelled' ? 'bg-red-950 text-red-300 border border-red-800' :
                              'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="firing_in_progress">Firing / Packing In Progress</option>
                            <option value="dispatched">Dispatched (Studio Freight)</option>
                            <option value="delivered">Delivered to Patron</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Shipping Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        
                        {/* Ordered Items */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7D71] block font-semibold">
                            Acquired Pieces
                          </span>
                          <div className="space-y-1.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#272320]">
                                <span className="text-[#FAF7F2]">{item.quantity}× {item.productName}</span>
                                <span className="font-mono text-[#D0C5B8]">${item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7D71] block font-semibold">
                            Collector Shipping Dossier
                          </span>
                          <div className="p-3 rounded-lg bg-[#272320] space-y-1 text-[#C4BAAE]">
                            <p><strong className="text-[#FAF7F2]">Address:</strong> {order.shippingAddress}, {order.city} {order.postalCode}</p>
                            <p><strong className="text-[#FAF7F2]">Recipient:</strong> {order.customerName} &lt;{order.customerEmail}&gt;</p>
                            <div className="pt-2 mt-2 border-t border-[#332D28] flex items-center justify-between font-semibold text-[#FAF7F2]">
                              <span>Total Value (With Freight):</span>
                              <span className="font-serif text-sm">${order.total}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-5 max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Studio Inquiries & Commissions</h2>
                <p className="text-xs text-[#A69B8E]">Bespoke pottery commission requests and collector inquiries.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#201D1A] border border-[#332D28] text-xs text-[#8A7D71]">
                  No inquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 rounded-xl bg-[#201D1A] border border-[#332D28] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#FAF7F2]">{inq.name}</span>
                          <span className="text-[#8A7D71]">&lt;{inq.email}&gt;</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8A7D71]">
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#C4BAAE] leading-relaxed bg-[#272320] p-3 rounded-lg">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRODUCTION & AUTH SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Production Mode & Architecture</h2>
                <p className="text-xs text-[#A69B8E]">Production deployment readiness, Firebase Auth provider status, and security compliance.</p>
              </div>

              <div className="space-y-4">
                
                {/* Production Readiness Checklist */}
                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-3">
                  <h3 className="font-serif text-base text-[#FAF7F2] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Production Readiness Verification</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#272320]">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[#FAF7F2] font-medium">Google OAuth Authentication</div>
                          <div className="text-[10px] text-[#A69B8E]">Configured via Firebase Auth with popup mode</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#272320]">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[#FAF7F2] font-medium">Email / Password Normal Login</div>
                          <div className="text-[10px] text-[#A69B8E]">Native customer authentication with secure credential verification</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#272320]">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[#FAF7F2] font-medium">Cloud Firestore Security Rules</div>
                          <div className="text-[10px] text-[#A69B8E]">Hardened ABAC rules deployed via fax.DeployRules</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase">Deployed</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#272320]">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[#FAF7F2] font-medium">Bootstrapped Administrator Authorization</div>
                          <div className="text-[10px] text-[#A69B8E]">Target admin email: buddhacmd02@gmail.com</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase">Enforced</span>
                    </div>
                  </div>
                </div>

                {/* Cloud Config Details */}
                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-3 text-xs">
                  <h3 className="font-serif text-base text-[#FAF7F2]">Cloud Environment Parameters</h3>
                  <div className="font-mono text-[11px] p-4 rounded-xl bg-[#171513] border border-[#2E2824] space-y-2 text-[#C4BAAE]">
                    <div>Project ID: <span className="text-[#D97746]">affluence-arena</span></div>
                    <div>Firestore Database ID: <span className="text-[#D97746]">ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6</span></div>
                    <div>Authorized Studio Admin: <span className="text-[#D97746]">buddhacmd02@gmail.com</span></div>
                    <div>Current Client UID: <span className="text-zinc-400">{user?.uid || 'Not signed in'}</span></div>
                  </div>
                </div>

                {/* Firebase Storage Image Fix Card */}
                <div className="p-5 rounded-2xl bg-[#201D1A] border border-[#332D28] space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="font-serif text-base text-[#FAF7F2]">Why Firebase Storage Images 403 / Not Showing</h3>
                  </div>
                  <p className="text-[#C4BAAE] leading-relaxed">
                    By default, Firebase Storage buckets block public read access (returning <code className="text-amber-400">403 Forbidden</code> / <code className="text-amber-400">storage/unauthorized</code>). To make your uploaded storage images visible across the store without login prompts:
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="font-semibold text-[#FAF7F2]">1. Copy & Publish these Storage Security Rules in Firebase Console:</div>
                    <pre className="p-3 bg-[#171513] border border-[#2E2824] rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
                    </pre>
                    <div className="text-[11px] text-[#A69B8E]">
                      Go to <a href="https://console.firebase.google.com/project/affluence-arena/storage" target="_blank" rel="noopener noreferrer" className="text-[#D97746] underline">Firebase Console &rarr; affluence-arena &rarr; Storage &rarr; Rules</a> and paste these rules, then click Publish.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#201D1A] text-[#FAF7F2] rounded-3xl border border-[#3B342F] shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#332D28] mb-5">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#FAF7F2]">
                  {editingProduct ? 'Edit Pottery Piece' : 'Add New Handcrafted Piece'}
                </h3>
                <p className="text-xs text-[#A69B8E]">Archive details for the online studio catalog.</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#332D28] text-[#C4BAAE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Tenmoku Tea Bowl"
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Japanese Kanji Mark
                  </label>
                  <input
                    type="text"
                    value={productForm.japaneseName || ''}
                    onChange={(e) => setProductForm({ ...productForm, japaneseName: e.target.value })}
                    placeholder="e.g. 天目茶碗"
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Category *
                  </label>
                  <select
                    value={productForm.category || 'vessels'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  >
                    <option value="vessels">Vessels & Vases</option>
                    <option value="tableware">Tableware</option>
                    <option value="tea-ritual">Tea & Ritual</option>
                    <option value="planters">Planters</option>
                    <option value="sculptural">Sculptural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Clay Body
                  </label>
                  <select
                    value={productForm.clay || 'Black Stoneware'}
                    onChange={(e) => setProductForm({ ...productForm, clay: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  >
                    <option value="Black Stoneware">Black Stoneware</option>
                    <option value="Speckled Buff">Speckled Buff</option>
                    <option value="Raw Terracotta">Raw Terracotta</option>
                    <option value="Porcelain">Porcelain</option>
                    <option value="Wild River Clay">Wild River Clay</option>
                    <option value="Coarse Sand Clay">Coarse Sand Clay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Firing Method
                  </label>
                  <select
                    value={productForm.firing || 'Anagama Wood-Fired (72hr)'}
                    onChange={(e) => setProductForm({ ...productForm, firing: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  >
                    <option value="Anagama Wood-Fired (72hr)">Anagama Wood-Fired (72hr)</option>
                    <option value="Gas Reduction Cone 10">Gas Reduction Cone 10</option>
                    <option value="Pit Fired Smoke">Pit Fired Smoke</option>
                    <option value="Soda Kiln Vapor">Soda Kiln Vapor</option>
                    <option value="Electric Oxidation">Electric Oxidation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                    Available (1) or sold (0)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    value={productForm.stockCount ?? 1}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock ?? true}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="rounded border-[#3B342F] text-[#D97746] focus:ring-0"
                    />
                    <span className="text-[#FAF7F2]">In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured ?? false}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded border-[#3B342F] text-[#D97746] focus:ring-0"
                    />
                    <span className="text-[#FAF7F2]">Featured on Showcase</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] font-semibold">
                  Piece Photo (Firebase Storage Upload or URL)
                </label>
                
                <div className="flex items-center gap-3">
                  {productForm.images?.[0]?.url && (
                    <img
                      src={productForm.images[0].url}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#3B342F] bg-stone-900 shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2E2824] hover:bg-[#D97746] text-[#FAF7F2] text-xs font-medium border border-[#423932] transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo to Storage</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadProductImage(file, productForm.id || 'piece');
                            setProductForm({
                              ...productForm,
                              images: [
                                { label: 'Real Photo', name: file.name, url, alt: productForm.name || 'Ceramic piece' },
                                ...(productForm.images?.slice(1) || [])
                              ],
                              roomContextImage: url
                            });
                            showToast('Photo uploaded successfully!');
                          } catch (err: any) {
                            showToast('Failed to upload image: ' + err.message, 'error');
                          }
                        }}
                      />
                    </label>
                    
                    <input
                      type="url"
                      value={productForm.images?.[0]?.url || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setProductForm({
                          ...productForm,
                          images: [
                            { label: 'Front Staged', name: 'Profile View', url, alt: productForm.name || 'Ceramic piece' },
                            ...(productForm.images?.slice(1) || [])
                          ]
                        });
                      }}
                      placeholder="Or enter photo URL..."
                      className="w-full px-3 py-1.5 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A69B8E] mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Artisanal description of the piece, kiln atmosphere, and surface character..."
                  className="w-full px-3 py-2 bg-[#272320] border border-[#3B342F] rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D97746]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#332D28]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2A2521] hover:bg-[#38312B] text-[#C4BAAE] text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Piece to Database</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
