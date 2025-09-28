"use client";

import { useState } from 'react';
import OrdersPageContent from '../orders/page';
import MapPageContent from '../maps/page';
import DashboardContent from '@/components/Dashboard/DashboardContent';

export default function DashboardPage() {
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
    <div className="pt-16"> {/* Add top padding to account for fixed header */}
      <main className="md:ml-56 min-h-0 overflow-auto"> {/* Add left margin for fixed sidebar */}
        {content}
      </main>
    </div>
  );
}