import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base dark:bg-surface-dark flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-bold text-navy-900 dark:text-white">
          <div className="w-5 h-5 border-2 border-aqua-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading AquaRegen...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !localStorage.getItem('aquaregen_token')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-base dark:bg-surface-dark transition-colors flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <TopNavbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
