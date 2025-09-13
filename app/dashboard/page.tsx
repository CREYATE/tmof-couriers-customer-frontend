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

  let content;
  if (activeTab === 'orders') {
    content = <OrdersPageContent />;
  } else if (activeTab === 'maps') {
    content = <MapPageContent />;
  } else {
    content = <DashboardContent />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader onNotificationClick={() => setShowNotification(v => !v)} />
      <Notification open={showNotification} onClose={() => setShowNotification(false)} />
      <div className="flex flex-col md:flex-row flex-1">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          {content}
        </div>
      </div>
    </div>
  );
}