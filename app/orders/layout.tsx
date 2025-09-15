"use client"

import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import Notifications from '@/components/Dashboard/Notifications';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/orders/track-parcel') {
      setActiveTab('track-parcel');
    } else if (pathname === '/orders') {
      setActiveTab('orders');
    } else if (pathname === '/dashboard') {
      setActiveTab('overview');
    } else if (pathname === '/maps') {
      setActiveTab('maps');
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader onNotificationClick={() => setShowNotifications(true)} />
      <Notifications show={showNotifications} onClose={() => setShowNotifications(false)} />
      <div className="flex flex-col md:flex-row flex-1">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
