"use client";

import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import Notification from '@/components/Dashboard/Notification';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotification, setShowNotification] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader 
        onNotificationClick={() => setShowNotification(v => !v)} 
        onHamburgerClick={() => setDrawerOpen(true)}
      />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeTab=""
          setActiveTab={() => {}} 
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