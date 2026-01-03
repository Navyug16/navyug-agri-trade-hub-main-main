import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Mail, Package, LogOut, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavigationProps {
  activeTab: 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline';
  onTabChange: (tab: 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline') => void;
  pendingInquiries: number;
  onLogout: () => void;
  adminName?: string;
}

const AdminNavigation = ({ activeTab, onTabChange, pendingInquiries, onLogout, adminName }: AdminNavigationProps) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-2xl shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider text-amber-500">NAVYUG ENTERPRISE</h1>
        <p className="text-xs text-gray-500 mt-1">Logged in as {adminName || 'Admin'}</p>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start text-base h-12 ${activeTab === 'overview' ? 'bg-gray-800 text-white font-semibold border-l-4 border-amber-500 rounded-l-none pl-2' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          onClick={() => onTabChange('overview')}
        >
          <TrendingUp className="h-5 w-5 mr-3" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start text-base h-12 ${activeTab === 'pipeline' ? 'bg-gray-800 text-white font-semibold border-l-4 border-amber-500 rounded-l-none pl-2' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          onClick={() => onTabChange('pipeline')}
        >
          <div className="mr-3 h-5 w-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 7v7" />
              <path d="M12 7v4" />
              <path d="M16 7v9" />
            </svg>
          </div>
          Pipeline
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start text-base h-12 ${activeTab === 'inquiries' ? 'bg-gray-800 text-white font-semibold border-l-4 border-amber-500 rounded-l-none pl-2' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          onClick={() => onTabChange('inquiries')}
        >
          <Mail className="h-5 w-5 mr-3" />
          Inquiries
          {pendingInquiries > 0 && (
            <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingInquiries}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start text-base h-12 ${activeTab === 'products' ? 'bg-gray-800 text-white font-semibold border-l-4 border-amber-500 rounded-l-none pl-2' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          onClick={() => onTabChange('products')}
        >
          <Package className="h-5 w-5 mr-3" />
          Products
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start text-base h-12 ${activeTab === 'blogs' ? 'bg-gray-800 text-white font-semibold border-l-4 border-amber-500 rounded-l-none pl-2' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          onClick={() => onTabChange('blogs')}
        >
          <BookOpen className="h-5 w-5 mr-3" />
          Blogs
        </Button>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link to="/">
          <Button variant="outline" className="w-full mb-2 bg-transparent text-gray-400 border-gray-700 hover:text-white hover:border-gray-500">
            Visit Website
          </Button>
        </Link>
        <Button onClick={onLogout} variant="destructive" className="w-full bg-red-900/50 hover:bg-red-900 border border-red-900 text-red-100">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminNavigation;
