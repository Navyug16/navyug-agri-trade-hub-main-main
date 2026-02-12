import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Mail, Package, LogOut, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface AdminNavigationProps {
  activeTab: 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline';
  onTabChange: (tab: 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline') => void;
  pendingInquiries: number;
  onLogout: () => void;
  adminName?: string;
  className?: string;
  onClose?: () => void;
}

const AdminNavigation = ({ activeTab, onTabChange, pendingInquiries, onLogout, adminName, className, onClose }: AdminNavigationProps) => {
  const handleTabClick = (tab: 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline') => {
    onTabChange(tab);
    if (onClose) onClose();
  };

  return (
    <div className={cn("w-64 bg-gray-900 text-white h-full flex flex-col shadow-2xl shrink-0", className)}>
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="bg-amber-500/20 p-2 rounded-lg">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          <TrendingUp className="h-6 w-6 text-amber-500" style={{ display: 'none' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider text-amber-500 leading-none">NAVYUG</h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Enterprise Admin</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-base h-11 transition-all", activeTab === 'overview' ? 'bg-gray-800 text-white font-medium pl-4 border-l-4 border-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50')}
          onClick={() => handleTabClick('overview')}
        >
          <TrendingUp className="h-5 w-5 mr-3" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-base h-11 transition-all", activeTab === 'pipeline' ? 'bg-gray-800 text-white font-medium pl-4 border-l-4 border-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50')}
          onClick={() => handleTabClick('pipeline')}
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

        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</p>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-base h-11 transition-all", activeTab === 'inquiries' ? 'bg-gray-800 text-white font-medium pl-4 border-l-4 border-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50')}
          onClick={() => handleTabClick('inquiries')}
        >
          <Mail className="h-5 w-5 mr-3" />
          Inquiries
          {pendingInquiries > 0 && (
            <span className="ml-auto bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingInquiries}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-base h-11 transition-all", activeTab === 'products' ? 'bg-gray-800 text-white font-medium pl-4 border-l-4 border-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50')}
          onClick={() => handleTabClick('products')}
        >
          <Package className="h-5 w-5 mr-3" />
          Products
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-base h-11 transition-all", activeTab === 'blogs' ? 'bg-gray-800 text-white font-medium pl-4 border-l-4 border-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50')}
          onClick={() => handleTabClick('blogs')}
        >
          <BookOpen className="h-5 w-5 mr-3" />
          Blogs
        </Button>
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-9 w-9 border border-gray-700">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${adminName || 'Admin'}&background=amber&color=fff`} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{adminName || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">admin@navyug.com</p>
          </div>
        </div>
        <Link to="/">
          <Button variant="outline" className="w-full mb-2 bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700 transition-colors h-9 text-xs">
            Visit Website
          </Button>
        </Link>
        <Button onClick={onLogout} variant="destructive" className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-200 hover:text-red-100 transition-colors h-9 text-xs">
          <LogOut className="h-3 w-3 mr-2" />
          Logout
        </Button>
      </div>
      {/* Mobile close button if needed, although Sheet handles it */}
    </div>
  );
};

export default AdminNavigation;
