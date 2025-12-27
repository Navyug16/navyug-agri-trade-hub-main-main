
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, Package, TrendingUp } from 'lucide-react';

interface AdminOverviewProps {
  stats: {
    totalInquiries: number;
    pendingInquiries: number;
    totalProducts: number;
    resolvedInquiries: number;
  };
  onInquiryClick: () => void;
  onProductClick: () => void;
}

const AdminOverview = ({ stats, onInquiryClick, onProductClick }: AdminOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
        onClick={onInquiryClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInquiries}</div>
          <p className="text-xs text-muted-foreground mt-1">View all inquiries</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-500"
        onClick={onInquiryClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Inquiries</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.pendingInquiries}</div>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-500"
        onClick={onProductClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground mt-1">Manage catalog</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-gray-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.resolvedInquiries}</div>
          <p className="text-xs text-muted-foreground mt-1">Completed requests</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
