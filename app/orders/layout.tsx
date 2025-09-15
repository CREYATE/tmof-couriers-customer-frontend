"use client"

import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

import React, { useState } from 'react';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('orders');
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
