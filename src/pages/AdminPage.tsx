
import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPage = () => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return admin ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminPage;
