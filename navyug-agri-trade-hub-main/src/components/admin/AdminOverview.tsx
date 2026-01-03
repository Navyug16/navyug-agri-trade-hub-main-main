import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Users, Package, TrendingUp, DollarSign, Award, BarChart as BarChartIcon, PieChart as PieChartIcon, Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS: Record<string, string> = {
  'pending': '#f59e0b', // amber
  'in_progress': '#3b82f6', // blue
  'closed_won': '#10b981', // emerald
  'closed_lost': '#ef4444', // red
  'closed': '#6b7280', // gray
};

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

  // 1. Trend Data: Inquiries count and Deal Value sum per day
  const trendData = useMemo(() => {
    if (!inquiries.length) return [];

    const grouped = inquiries.reduce((acc: any, curr: any) => {
      const dateObj = new Date(curr.created_at);
      const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!acc[date]) {
        acc[date] = {
          name: date,
          inquiries: 0,
          value: 0,
          timestamp: dateObj.setHours(0, 0, 0, 0) // Store timestamp for sorting
        };
      }
      acc[date].inquiries += 1;
      acc[date].value += (curr.dealValue || 0);
      return acc;
    }, {});

    // Sort by timestamp ascending (Oldest -> Newest)
    return Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
  }, [inquiries]);

  // 2. Status Distribution Data
  const statusData = useMemo(() => {
    if (!inquiries.length) return [];

    const counts = inquiries.reduce((acc: any, curr: any) => {
      const status = curr.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      rawStatus: name
    }));
  }, [inquiries]);

  // 3. Product Interest Data
  const productInterestData = useMemo(() => {
    if (!stats.topProducts) return [];
    return Object.entries(stats.topProducts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 5); // Top 5
  }, [stats.topProducts]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name === 'value' ? 'Sales Value' : entry.name === 'inquiries' ? 'Inquiries' : entry.name}:
              {entry.name === 'value' ? ` ₹${entry.value.toLocaleString()}` : ` ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8 h-full flex flex-col overflow-y-auto pr-2">
      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="border-l-4 border-l-emerald-600 shadow-sm bg-white/80 backdrop-blur hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white/80 backdrop-blur cursor-pointer hover:shadow-md transition-all duration-300" onClick={onInquiryClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Inquiries</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white/80 backdrop-blur hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Closed Deals</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.closedInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">Conversion rate: {inquiries.length > 0 ? ((stats.closedInquiries / inquiries.length) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-amber-500 shadow-sm bg-white/80 backdrop-blur cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => setShowTopProducts(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Product</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Award className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900 truncate" title={topProductName}>{topProductName}</div>
            <p className="text-xs text-muted-foreground mt-1">Most requested item</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Sales & Inquiry Trends (Wide Chart) */}
        <Card className="col-span-1 lg:col-span-2 shadow-md border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Sales & Inquiry Volume
            </CardTitle>
            <CardDescription>Daily breakdown of inquiries and total deal value</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 20 }} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="inquiries" name="Inquiries" fill="url(#colorInquiries)" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="value" name="Sales Value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BarChartIcon className="h-12 w-12 mb-3 opacity-20" />
                <p>No activity data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Inquiry Status Distribution (Pie Chart) */}
        <Card className="col-span-1 shadow-md border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-indigo-600" />
              Inquiry Status
            </CardTitle>
            <CardDescription>Current distribution of leads</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.rawStatus] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <PieChartIcon className="h-12 w-12 mb-3 opacity-20" />
                <p>No status data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Top Products (Horizontal Bar Chart) */}
        <Card className="col-span-1 lg:col-span-3 shadow-md border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              Product Performance
            </CardTitle>
            <CardDescription>Top products by inquiry volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {productInterestData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={productInterestData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" name="Inquiries" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                    {productInterestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Award className="h-12 w-12 mb-3 opacity-20" />
                <p>No product data available</p>
              </div>
            )}
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
    </div>
  );
};

export default AdminOverview;
