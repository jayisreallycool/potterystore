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
  TrendingUp,
  Users,
  Mail,
  BarChart3,
  Zap,
  Archive,
  Eye,
  EyeOff,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Layers,
  DollarSign,
  Calendar,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  FileText,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { PotteryProduct } from '../types';
import { OrderRecord, InquiryRecord } from '../services/storeService';

interface AdminConsoleExtendedProps {
  isOpen: boolean;
  onClose: () => void;
  products: PotteryProduct[];
  orders: OrderRecord[];
  inquiries: InquiryRecord[];
}

export const AdminConsoleExtended: React.FC<AdminConsoleExtendedProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  inquiries
}) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'analytics' | 'email' | 'subscribers' | 'automations' | 'content' | 'seo' | 'integrations'
  >('dashboard');
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen || !isAdmin) return null;

  // ========== METRICS CALCULATIONS ==========

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => !p.inStock || (p.stockCount || 0) <= 0).length;

  const totalInquiries = inquiries.length;
  const unreadInquiries = inquiries.filter(i => i.status === 'unread').length;

  const newsletterSubscribers = inquiries
    .filter(i => i.pieceOfInterest === 'New batch emails')
    .length;

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-[#0F0E0C] via-[#1A1816] to-[#1F1D1A] text-[#FAF7F2] overflow-hidden">

      {/* Header */}
      <header className="bg-[#24201D]/80 backdrop-blur-md border-b border-[#3B342F] px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D97746] to-[#A0522D] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#FAF7F2]">Studio Command Center</h1>
            <p className="text-xs text-[#A69B8E] font-mono">Extended Management Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-[#2C2723] transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97746] hover:bg-[#C06536] text-white text-xs font-semibold transition-all"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 bg-[#201D1A] border-r border-[#332D28] overflow-y-auto flex flex-col p-4 gap-6 shrink-0">

          {/* Core Stats */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#A69B8E] uppercase tracking-wider">Quick Stats</p>
            <div className="space-y-2.5">
              <StatCard label="Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={DollarSign} />
              <StatCard label="Orders" value={totalOrders.toString()} icon={ShoppingBag} />
              <StatCard label="Pieces" value={totalProducts.toString()} icon={Package} />
              <StatCard label="Inquiries" value={totalInquiries.toString()} icon={Mail} />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <p className="text-xs font-semibold text-[#A69B8E] uppercase tracking-wider px-2 mb-3">Management</p>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'email', label: 'Email Campaigns', icon: Mail },
              { id: 'subscribers', label: 'Subscribers', icon: Users },
              { id: 'automations', label: 'Automations', icon: Zap },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'seo', label: 'SEO & Social', icon: TrendingUp },
              { id: 'integrations', label: 'Integrations', icon: Layers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#D97746] text-white shadow-lg'
                    : 'text-[#C4BAAE] hover:text-[#FAF7F2] hover:bg-[#2C2723]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-1">Studio Dashboard</h2>
                <p className="text-sm text-[#A69B8E]">Real-time overview of your pottery business</p>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Total Revenue"
                  value={`$${totalRevenue.toFixed(0)}`}
                  change="+12.5%"
                  icon={DollarSign}
                  color="emerald"
                />
                <KPICard
                  title="Total Orders"
                  value={totalOrders.toString()}
                  change={`+${Math.floor(completedOrders)} completed`}
                  icon={ShoppingBag}
                  color="blue"
                />
                <KPICard
                  title="Avg Order Value"
                  value={`$${averageOrderValue.toFixed(0)}`}
                  change={`${conversionRate}% conversion`}
                  icon={TrendingUp}
                  color="amber"
                />
                <KPICard
                  title="In Stock"
                  value={`${totalProducts - outOfStockProducts}/${totalProducts}`}
                  change={`${outOfStockProducts} out of stock`}
                  icon={Package}
                  color="red"
                />
              </div>

              {/* Charts & Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Recent Orders" icon={ShoppingBag}>
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                        <div>
                          <p className="text-sm font-medium text-[#FAF7F2]">Order #{order.id?.slice(0, 8)}</p>
                          <p className="text-xs text-[#A69B8E]">{order.status}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#D97746]">${order.total?.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Top Inquiries" icon={MessageSquare}>
                  <div className="space-y-2">
                    {inquiries.slice(0, 5).map((inq, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                        <div>
                          <p className="text-sm font-medium text-[#FAF7F2]">{inq.name || 'Anonymous'}</p>
                          <p className="text-xs text-[#A69B8E]">{inq.pieceOfInterest}</p>
                        </div>
                        <Badge status={inq.status} />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-1">Analytics & Performance</h2>
                <p className="text-sm text-[#A69B8E]">Track your studio's growth metrics</p>
              </div>

              <div className="bg-[#201D1A] border border-[#332D28] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#FAF7F2]">Time Period</h3>
                  <div className="flex gap-2">
                    {['7d', '30d', '90d', '1y'].map(range => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          dateRange === range
                            ? 'bg-[#D97746] text-white'
                            : 'bg-[#2C2723] text-[#A69B8E] hover:bg-[#332D28]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#A69B8E] mb-3">Revenue Trend</p>
                    <div className="h-32 bg-[#1F1B18] rounded-lg border border-[#2E2824] flex items-center justify-center">
                      <p className="text-sm text-[#A69B8E]">Chart: ${totalRevenue.toFixed(0)} total</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#A69B8E] mb-3">Orders by Status</p>
                    <div className="h-32 bg-[#1F1B18] rounded-lg border border-[#2E2824] flex items-center justify-center">
                      <p className="text-sm text-[#A69B8E]">{totalOrders} total orders</p>
                    </div>
                  </div>
                </div>
              </div>

              <SectionCard title="Detailed Metrics" icon={BarChart3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricBox label="Conversion Rate" value={`${conversionRate}%`} />
                  <MetricBox label="Avg Order Value" value={`$${averageOrderValue.toFixed(0)}`} />
                  <MetricBox label="Repeat Customers" value="24%" />
                  <MetricBox label="Product Views" value="1.2K" />
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Email Campaigns Tab */}
          {activeTab === 'email' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-1">Email Campaigns</h2>
                  <p className="text-sm text-[#A69B8E]">Create and manage email marketing</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#D97746] hover:bg-[#C06536] rounded-lg text-white text-sm font-semibold transition-all">
                  <Plus className="w-4 h-4" />
                  New Campaign
                </button>
              </div>

              <SectionCard title="Recent Campaigns" icon={Mail}>
                <div className="space-y-3">
                  {[
                    { name: 'Autumn Collection Launch', sent: 2847, open: '42%', click: '8.3%' },
                    { name: 'Flash Sale: 20% Off', sent: 2104, open: '35%', click: '5.2%' },
                    { name: 'New Batch: Winter Glazes', sent: 1956, open: '38%', click: '7.1%' }
                  ].map((campaign, i) => (
                    <div key={i} className="p-4 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-[#FAF7F2]">{campaign.name}</p>
                        <Button variant="secondary" size="sm">View</Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-[#A69B8E]">Sent</p>
                          <p className="font-semibold text-[#FAF7F2]">{campaign.sent}</p>
                        </div>
                        <div>
                          <p className="text-[#A69B8E]">Open Rate</p>
                          <p className="font-semibold text-emerald-400">{campaign.open}</p>
                        </div>
                        <div>
                          <p className="text-[#A69B8E]">Click Rate</p>
                          <p className="font-semibold text-blue-400">{campaign.click}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-1">Email Subscribers</h2>
                <p className="text-sm text-[#A69B8E]">Manage your newsletter subscribers</p>
              </div>

              <KPICard
                title="Newsletter Subscribers"
                value={newsletterSubscribers.toString()}
                change="Growing 8% monthly"
                icon={Users}
                color="green"
              />

              <SectionCard title="Subscriber List" icon={Users}>
                <div className="space-y-2">
                  {inquiries
                    .filter(i => i.pieceOfInterest === 'New batch emails')
                    .slice(0, 10)
                    .map((sub, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                        <div>
                          <p className="text-sm font-medium text-[#FAF7F2]">{sub.email}</p>
                          <p className="text-xs text-[#A69B8E]">Subscribed {sub.createdAt ? 'recently' : 'unknown'}</p>
                        </div>
                        <Button variant="secondary" size="sm">Remove</Button>
                      </div>
                    ))}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Automations Tab */}
          {activeTab === 'automations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-1">Automations</h2>
                  <p className="text-sm text-[#A69B8E]">Set up automated workflows</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#D97746] hover:bg-[#C06536] rounded-lg text-white text-sm font-semibold transition-all">
                  <Plus className="w-4 h-4" />
                  New Automation
                </button>
              </div>

              <SectionCard title="Active Automations" icon={Zap}>
                <div className="space-y-3">
                  {[
                    { name: 'Welcome Email', trigger: 'New subscriber', status: 'active' },
                    { name: 'Order Confirmation', trigger: 'Purchase', status: 'active' },
                    { name: 'Shipping Update', trigger: 'Order shipped', status: 'active' },
                    { name: 'Re-engagement', trigger: '30 days inactive', status: 'disabled' }
                  ].map((auto, i) => (
                    <div key={i} className="p-4 bg-[#1F1B18] rounded-lg border border-[#2E2824] flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#FAF7F2]">{auto.name}</p>
                        <p className="text-xs text-[#A69B8E]">{auto.trigger}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        auto.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-stone-500/20 text-stone-400'
                      }`}>
                        {auto.status}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-1">Content Management</h2>
                  <p className="text-sm text-[#A69B8E]">Create pages and manage copy</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#D97746] hover:bg-[#C06536] rounded-lg text-white text-sm font-semibold transition-all">
                  <Plus className="w-4 h-4" />
                  New Page
                </button>
              </div>

              <SectionCard title="Pages" icon={FileText}>
                <div className="space-y-2">
                  {[
                    { name: 'Homepage', path: '/', status: 'published' },
                    { name: 'About', path: '/about', status: 'published' },
                    { name: 'Custom Orders', path: '/custom-orders', status: 'published' },
                    { name: 'Shipping & Returns', path: '/shipping', status: 'published' }
                  ].map((page, i) => (
                    <div key={i} className="p-3 bg-[#1F1B18] rounded-lg border border-[#2E2824] flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#FAF7F2]">{page.name}</p>
                        <p className="text-xs text-[#A69B8E] font-mono">{page.path}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-medium">
                          {page.status}
                        </span>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-1">SEO & Social Media</h2>
                <p className="text-sm text-[#A69B8E]">Optimize for search and social</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard title="SEO Checklist" icon={TrendingUp}>
                  <div className="space-y-2">
                    {[
                      { item: 'Meta descriptions', done: true },
                      { item: 'Open Graph tags', done: true },
                      { item: 'Structured data', done: false },
                      { item: 'XML sitemap', done: true }
                    ].map((check, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <CheckCircle2 className={`w-4 h-4 ${check.done ? 'text-emerald-400' : 'text-stone-600'}`} />
                        <span className="text-sm text-[#FAF7F2]">{check.item}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Social Profiles" icon={Layers}>
                  <div className="space-y-2">
                    {[
                      { platform: 'Instagram', followers: '2.4K', url: '@cliffcooks' },
                      { platform: 'Pinterest', followers: '1.8K', url: '/cliffcooks' },
                      { platform: 'TikTok', followers: '856', url: '@cliffcooks' }
                    ].map((social, i) => (
                      <div key={i} className="p-3 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-[#FAF7F2]">{social.platform}</p>
                          <p className="text-xs text-[#D97746] font-semibold">{social.followers}</p>
                        </div>
                        <p className="text-xs text-[#A69B8E]">{social.url}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-1">Integrations</h2>
                <p className="text-sm text-[#A69B8E]">Connect third-party services</p>
              </div>

              <SectionCard title="Connected Services" icon={Layers}>
                <div className="space-y-3">
                  {[
                    { name: 'Stripe', status: 'connected', icon: '💳' },
                    { name: 'Gmail', status: 'connected', icon: '📧' },
                    { name: 'Google Analytics', status: 'connected', icon: '📊' },
                    { name: 'Zapier', status: 'available', icon: '⚡' }
                  ].map((integration, i) => (
                    <div key={i} className="p-4 bg-[#1F1B18] rounded-lg border border-[#2E2824] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="font-medium text-[#FAF7F2]">{integration.name}</p>
                          <p className="text-xs text-[#A69B8E]">
                            {integration.status === 'connected' ? 'Ready to use' : 'Available'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={integration.status === 'connected' ? 'secondary' : 'primary'}
                        size="sm"
                      >
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="API & Webhooks" icon={Code}>
                <div className="space-y-3">
                  <div className="p-4 bg-[#1F1B18] rounded-lg border border-[#2E2824]">
                    <p className="text-sm font-medium text-[#FAF7F2] mb-2">API Key</p>
                    <div className="font-mono text-xs bg-[#0F0E0C] p-3 rounded border border-[#2E2824] text-[#C4BAAE] truncate">
                      pk_live_51234567890abcdef
                    </div>
                    <Button variant="secondary" size="sm" className="mt-2">Copy</Button>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

// ========== HELPER COMPONENTS ==========

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon }) => (
  <div className="p-3 bg-[#2C2723] rounded-lg border border-[#332D28]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-[#A69B8E] mb-1">{label}</p>
        <p className="text-lg font-semibold text-[#FAF7F2]">{value}</p>
      </div>
      <Icon className="w-5 h-5 text-[#D97746] opacity-50" />
    </div>
  </div>
);

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'blue' | 'amber' | 'red' | 'green';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
  };

  const colors = colorMap[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-5`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-[#A69B8E] uppercase tracking-wider">{title}</p>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <p className="text-3xl font-bold text-[#FAF7F2] mb-1">{value}</p>
      <p className={`text-xs font-medium ${colors.text}`}>{change}</p>
    </div>
  );
};

interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-[#201D1A] border border-[#332D28] rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-5 h-5 text-[#D97746]" />
      <h3 className="text-lg font-semibold text-[#FAF7F2]">{title}</h3>
    </div>
    {children}
  </div>
);

interface MetricBoxProps {
  label: string;
  value: string;
}

const MetricBox: React.FC<MetricBoxProps> = ({ label, value }) => (
  <div className="bg-[#1F1B18] border border-[#2E2824] rounded-lg p-4 text-center">
    <p className="text-xs text-[#A69B8E] mb-2">{label}</p>
    <p className="text-2xl font-bold text-[#D97746]">{value}</p>
  </div>
);

interface BadgeProps {
  status: string;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusColors: Record<string, string> = {
    unread: 'bg-amber-500/20 text-amber-400',
    read: 'bg-stone-500/20 text-stone-400',
    replied: 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded font-medium ${statusColors[status] || 'bg-stone-500/20 text-stone-400'}`}>
      {status}
    </span>
  );
};

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, className = '', onClick }) => {
  const baseClasses = 'rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-[#D97746] hover:bg-[#C06536] text-white',
    secondary: 'bg-[#2C2723] hover:bg-[#332D28] text-[#A69B8E]'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
