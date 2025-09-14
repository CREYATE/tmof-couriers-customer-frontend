"use client";
import React, { useState } from 'react';
import CreateOrderForm from '@/components/Order/CreateOrderForm';
import OrderHistory from '@/components/Order/OrderHistory';
import OrderRecent from '@/components/Order/OrderRecent';

const tabs = [
  { label: 'Create Order', value: 'create' },
  { label: 'History', value: 'history' },
  { label: 'Recent', value: 'recent' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('create');
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#ffd215]">Orders</h1>
      <div className="flex gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`px-6 py-2 rounded font-bold border-b-2 transition-all ${activeTab === tab.value ? 'border-[#ffd215] text-[#ffd215] bg-gray-50' : 'border-transparent text-gray-700 bg-white hover:bg-gray-100'}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'create' && <CreateOrderForm />}
      {activeTab === 'history' && <OrderHistory />}
      {activeTab === 'recent' && <OrderRecent />}
    </div>
  );
}