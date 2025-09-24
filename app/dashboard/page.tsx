"use client";

import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import Notification from '@/components/Dashboard/Notification';
import { useState } from 'react';
import OrdersPageContent from '../orders/page';
import MapPageContent from '../maps/page';
import DashboardContent from '@/components/Dashboard/DashboardContent';

export default function DashboardPage() {
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  let content;
  if (activeTab === 'orders') {
    content = <OrdersPageContent />;
  } else if (activeTab === 'maps') {
    content = <MapPageContent />;
  } else {
    content = <DashboardContent />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader 
        onNotificationClick={() => setShowNotification(v => !v)} 
        onHamburgerClick={() => setDrawerOpen(true)}
      />
      <Notification open={showNotification} onClose={() => setShowNotification(false)} />
      <div className="flex flex-1 pt-16"> {/* Add top padding to account for fixed header */}
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <main className="flex-1 md:ml-56 min-h-0 overflow-auto"> {/* Add left margin for fixed sidebar */}
          {content}
        </main>
      </div>
    </div>
  );
}