"use client";

import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const menuItems = [
    { label: 'Overview', tab: 'overview' },
    { label: 'Orders', tab: 'orders' },
    { label: 'Map', tab: 'maps' },
  ];
  return (
    <aside className="w-full md:w-64 bg-gray-100 border-r border-gray-200 flex flex-col justify-between min-h-[300px]">
      <nav className="flex flex-col gap-4 py-8 px-6 flex-1">
        {menuItems.map(item => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`block w-full text-left font-medium rounded-lg px-4 py-2 transition-all text-[#0C0E29] hover:text-[#ffd215] hover:bg-[#0C0E29]/10 ${activeTab === item.tab ? 'bg-[#ffd215] text-black' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 pb-6">
        <Link href="/">
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </Link>
      </div>
    </aside>
  );
}