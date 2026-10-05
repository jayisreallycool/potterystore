import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Eye, ShoppingBag, Heart, TrendingUp, Users } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  cartAdditions: number;
  wishlistAdditions: number;
  conversionRate: number;
  avgSessionDuration: number;
  topProducts: Array<{ name: string; views: number; wishlists: number }>;
}

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Analytics Dashboard Component
 * Displays Vercel Analytics & GA4 data
 * Requires: @vercel/analytics configured
 */
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Fetch from your analytics API
        const response = await fetch(`/api/analytics?range=${timeRange}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [isOpen, timeRange]);

  if (!isOpen || !analytics) return null;

  const metrics = [
    {
      label: 'Page Views',
      value: analytics.pageViews.toLocaleString(),
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Unique Visitors',
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Cart Additions',
      value: analytics.cartAdditions,
      icon: ShoppingBag,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Wishlist Additions',
      value: analytics.wishlistAdditions,
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3D9CB] bg-[#EFEAE1]">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-[#C8623A]" />
            <h2 className="font-serif text-2xl text-[#2C2723]">Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A7B6D] hover:text-[#2C2723] text-2xl"
          >
            ×
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="px-6 py-3 flex gap-2 border-b border-[#E3D9CB]">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#2C2723] text-[#FAF7F2]'
                  : 'bg-[#EFEAE1] text-[#7F7062] hover:bg-[#E3D9CB]'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scroll flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse">Loading analytics...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={metric.label}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-2xl bg-[#EFEAE1] border border-[#E3D9CB]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#8A7B6D] font-medium mb-1">
                            {metric.label}
                          </p>
                          <p className="text-2xl font-bold text-[#2C2723]">
                            {metric.value}
                          </p>
                        </div>
                        <div className={`p-2 rounded-lg ${metric.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Top Products */}
              <div>
                <h3 className="font-serif text-lg text-[#2C2723] mb-3">Top Products</h3>
                <div className="space-y-2">
                  {analytics.topProducts.map((product, idx) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 rounded-xl bg-[#EFEAE1] border border-[#E3D9CB] flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#2C2723] truncate">
                          {product.name}
                        </p>
                        <div className="flex gap-4 text-xs text-[#8A7B6D] mt-1">
                          <span>{product.views} views</span>
                          <span>{product.wishlists} wishlists</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-1.5 rounded-full bg-[#D9CEBE] overflow-hidden">
                          <div
                            className="h-full bg-[#C8623A]"
                            style={{
                              width: `${Math.min((product.views / 100) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Avg Session Duration */}
              <div className="p-4 rounded-2xl bg-[#EFEAE1] border border-[#E3D9CB]">
                <p className="text-xs text-[#8A7B6D] font-medium mb-1">
                  Avg. Session Duration
                </p>
                <p className="text-3xl font-bold text-[#2C2723]">
                  {Math.round(analytics.avgSessionDuration)}s
                </p>
              </div>

              {/* Insights */}
              <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB]">
                <h4 className="font-semibold text-[#2C2723] text-sm mb-2">Insights</h4>
                <ul className="text-xs text-[#544A41] space-y-1">
                  <li>✓ Set up Google Analytics 4 for detailed traffic insights</li>
                  <li>✓ Track conversion funnel from view → cart → checkout</li>
                  <li>✓ Monitor most wishlisted pieces for inventory planning</li>
                  <li>✓ Analyze user behavior with heatmaps (Hotjar integration)</li>
                  <li>✓ Set up email recovery for abandoned carts</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E3D9CB] bg-[#EFEAE1] text-xs text-[#8A7B6D]">
          <p>
            Powered by Vercel Analytics. Connect Google Analytics 4 for additional insights.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Setup guide for analytics
 */
export const analyticsSetupGuide = {
  vercelAnalytics: `
1. Install: npm install @vercel/analytics @vercel/speed-insights
2. Already imported in App.tsx
3. View dashboard: https://vercel.com/dashboard/analytics
  `,
  googleAnalytics4: `
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID: G-XXXXXXXXXX
3. Install: npm install react-ga4
4. Add initialization code to App.tsx
5. Track custom events for cart/wishlist actions
  `,
  heatmaps: `
1. Sign up at https://www.hotjar.com
2. Get Site ID from settings
3. Add Hotjar script to index.html
4. Visualize user clicks and scrolling patterns
  `
};
