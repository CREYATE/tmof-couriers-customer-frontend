"use client";

import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import Notification from '@/components/Dashboard/Notification';
import WalletManagement from "@/components/Wallet/WalletManagement";
import { useState } from 'react';

export default function WalletPage() {
  const [showNotification, setShowNotification] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader 
        onNotificationClick={() => setShowNotification(v => !v)} 
        onHamburgerClick={() => setDrawerOpen(true)}
      />
      <Notification open={showNotification} onClose={() => setShowNotification(false)} />
      <div className="flex flex-1 pt-16"> {/* Add top padding to account for fixed header */}
        <DashboardSidebar 
          activeTab="wallet" 
          setActiveTab={() => {}} // No tab switching needed on this page
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <main className="flex-1 md:ml-56 min-h-0 overflow-auto"> {/* Add left margin for fixed sidebar */}
          <WalletManagement />
        </main>
      </div>
    </div>
  );
}