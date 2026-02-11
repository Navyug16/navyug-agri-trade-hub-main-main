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
  'done': '#10b981', // emerald (same as won)
  'deleted': '#ef4444', // red
};

const AdminOverview = ({ stats, inquiries = [], onInquiryClick, onProductClick }: AdminOverviewProps) => {
  // Top Products logic removed as per user request


  // 1. Trend Data: Sales & Inquiries per day
  const trendData = useMemo(() => {
    if (!inquiries.length) return [];

    const grouped = inquiries.reduce((acc: any, curr: any) => {
      const dateObj = new Date(curr.created_at);
      const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!acc[date]) {
        acc[date] = {
          name: date,
          inquiries: 0,
          wonInquiries: 0,
          value: 0,
          timestamp: dateObj.setHours(0, 0, 0, 0)
        };
      }

      acc[date].inquiries += 1; // Total Inquiries volume

      // Only count value and count for WON deals
      if (curr.status === 'closed_won') {
        acc[date].value += (curr.dealValue || 0);
        acc[date].wonInquiries += 1;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
  }, [inquiries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div style={{ backgroundColor: entry.color, width: '8px', height: '8px', borderRadius: '50%' }}></div>
              <span className="text-sm font-medium text-gray-600 capitalize">
                {entry.name === 'value' ? 'Won Earnings' : entry.name}:
                <span className="ml-1 font-bold text-gray-900">
                  {entry.name === 'value' || entry.dataKey === 'value'
                    ? `₹${entry.value.toLocaleString()}`
                    : entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8 h-full flex flex-col overflow-y-auto pr-2">
      {/* Key Metrics Strip */}
      {/* Key Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 shrink-0">
        <Card className="border-l-4 border-l-emerald-600 shadow-sm bg-white/80 backdrop-blur hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">Earnings</CardTitle>
            <div className="hidden sm:block p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <DollarSign className="h-3 w-3 text-emerald-600 sm:hidden" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalEarnings)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white/80 backdrop-blur cursor-pointer hover:shadow-md transition-all duration-300" onClick={onInquiryClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">Pending</CardTitle>
            <div className="hidden sm:block p-2 bg-orange-100 rounded-full">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
            <Users className="h-3 w-3 text-orange-500 sm:hidden" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pendingInquiries}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">Inquiries</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white/80 backdrop-blur hover:shadow-md transition-all duration-300 col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 truncate">Closed</CardTitle>
            <div className="hidden sm:block p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <TrendingUp className="h-3 w-3 text-blue-500 sm:hidden" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.closedInquiries}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              Rate: {inquiries.length > 0 ? ((stats.closedInquiries / inquiries.length) * 100).toFixed(0) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section - Full Width */}
      <div className="grid grid-cols-1 gap-6">

        {/* Deals & Inquiry Trends */}
        <Card className="shadow-md border-none bg-white">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Performance Overview
            </CardTitle>
            <CardDescription>Daily inquiries vs. converted deals and revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[500px] p-2 sm:p-6">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 20 }} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />

                  {/* Left Axis: Money */}
                  <YAxis yAxisId="left" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />

                  {/* Right Axis: Count */}
                  <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={12} tickLine={false} axisLine={false} />

                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />

                  {/* Total Inquiries Bar */}
                  <Bar yAxisId="right" dataKey="inquiries" name="Total Inquiries" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />

                  {/* Won Inquiries Bar (Stacked or side-by-side? Side by side is clearer for volume comparison) */}
                  <Bar yAxisId="right" dataKey="wonInquiries" name="Won Deals" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />

                  <Line yAxisId="left" type="monotone" dataKey="value" name="Won Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
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
      </div>
    </div>
  );
};

export default AdminOverview;
