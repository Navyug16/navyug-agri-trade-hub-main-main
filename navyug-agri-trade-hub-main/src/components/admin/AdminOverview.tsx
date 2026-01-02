
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, Package, TrendingUp, DollarSign, Award, BarChart as BarChartIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdminOverviewProps {
  stats: {
    totalInquiries: number;
    pendingInquiries: number;
    totalProducts: number;
    closedInquiries: number;
    totalEarnings: number;
    topProducts?: Record<string, number>;
  };
  inquiries?: any[];
  onInquiryClick: () => void;
  onProductClick: () => void;
}

const AdminOverview = ({ stats, inquiries = [], onInquiryClick, onProductClick }: AdminOverviewProps) => {
  const [showTopProducts, setShowTopProducts] = useState(false);

  // Find top product name
  const topProductName = stats.topProducts
    ? Object.entries(stats.topProducts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    : 'N/A';

  const top3Products = stats.topProducts
    ? Object.entries(stats.topProducts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    : [];

  // Prepare chart data (Inquiries per day/month)
  const chartData = useMemo(() => {
    if (!inquiries.length) return [];

    // Group by date (MM-DD)
    const grouped = inquiries.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [inquiries]);

  return (
    <div className="space-y-6 mb-8 h-full flex flex-col">
      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="border-l-4 border-l-emerald-600 shadow-sm bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stats.totalEarnings)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white/50 backdrop-blur cursor-pointer hover:bg-white transition-colors" onClick={onInquiryClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingInquiries}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Closed Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.closedInquiries}</div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-amber-500 shadow-sm bg-white/50 backdrop-blur cursor-pointer hover:bg-white transition-colors"
          onClick={() => setShowTopProducts(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Product</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900 truncate" title={topProductName}>{topProductName}</div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showTopProducts} onOpenChange={setShowTopProducts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Performing Products</DialogTitle>
            <DialogDescription>Based on inquiry volume.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {top3Products.length > 0 ? (
              top3Products.map(([name, count], index) => (
                <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-700'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="font-medium text-gray-900">{name}</div>
                  </div>
                  <div className="text-sm text-gray-500 font-semibold">{count} Inquiries</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available yet.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Chart - Digital Dashboard Style */}
      <Card className="flex-1 shadow-lg border-none bg-gradient-to-br from-white to-gray-50 overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-white/50 backdrop-blur shrink-0">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-gray-800">
            <BarChartIcon className="h-5 w-5 text-indigo-600" /> Sales & Inquiry Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative min-h-[500px]">
          <div className="absolute inset-0 p-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '12px' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#colorValue)"
                    radius={[8, 8, 0, 0]}
                    barSize={60}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BarChartIcon className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg">No data available for the selected period</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
