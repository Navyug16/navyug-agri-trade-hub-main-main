
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Mail, Package } from 'lucide-react';

interface AdminNavigationProps {
  activeTab: 'overview' | 'inquiries' | 'products';
  onTabChange: (tab: 'overview' | 'inquiries' | 'products') => void;
  pendingInquiries: number;
}

const AdminNavigation = ({ activeTab, onTabChange, pendingInquiries }: AdminNavigationProps) => {
  return (
    <div className="flex space-x-4 mb-8">
      <Button 
        variant={activeTab === 'overview' ? 'default' : 'outline'}
        onClick={() => onTabChange('overview')}
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        Overview
      </Button>
      <Button 
        variant={activeTab === 'inquiries' ? 'default' : 'outline'}
        onClick={() => onTabChange('inquiries')}
      >
        <Mail className="h-4 w-4 mr-2" />
        Inquiries ({pendingInquiries})
      </Button>
      <Button 
        variant={activeTab === 'products' ? 'default' : 'outline'}
        onClick={() => onTabChange('products')}
      >
        <Package className="h-4 w-4 mr-2" />
        Products
      </Button>
    </div>
  );
};

export default AdminNavigation;
