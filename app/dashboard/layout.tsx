"use client";

import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import Notification from '@/components/Dashboard/Notification';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotification, setShowNotification] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const pathname = usePathname();

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname === '/dashboard') {
      setActiveTab('overview');
    } else if (pathname.startsWith('/orders')) {
      setActiveTab('orders');
    } else if (pathname.startsWith('/maps') || pathname.includes('track-parcel')) {
      setActiveTab('track-parcel');
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader 
        onNotificationClick={() => setShowNotification(v => !v)} 
        onHamburgerClick={() => setDrawerOpen(prev => !prev)}
      />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab} 
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Notification Component */}
      {showNotification && (
        <div className="fixed top-16 right-4 z-50">
          <Notification 
            open={showNotification}
            onClose={() => setShowNotification(false)} 
          />
        </div>
      )}
    </div>
  );
}