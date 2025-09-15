"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ activeTab, setActiveTab, drawerOpen, setDrawerOpen }: {
  activeTab: string,
  setActiveTab: (tab: string) => void,
  drawerOpen?: boolean,
  setDrawerOpen?: (open: boolean) => void
}) {
  const menuItems = [
    { label: 'Overview', tab: 'overview', href: '/dashboard' },
    { label: 'Orders', tab: 'orders', href: '/orders' },
    { label: 'Track Parcel', tab: 'track-parcel', href: '/orders/track-parcel' },
  ];
  // drawerOpen and setDrawerOpen now come from props for mobile control
  return (
    <>
      {/* Hamburger for mobile - should be placed in header, not floating */}
      {/* Remove floating hamburger from sidebar, ensure header renders it */}
      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-all duration-300 ${drawerOpen ? 'block' : 'hidden'}`}
  onClick={() => setDrawerOpen && setDrawerOpen(false)}
      >
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gray-100 border-r border-gray-200 flex flex-col justify-between min-h-[300px] shadow-lg transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-4 py-8 px-6 flex-1">
            {menuItems.map(item => (
              <Link href={item.href} key={item.tab} passHref legacyBehavior>
                <button
                  type="button"
                  tabIndex={0}
                  onClick={() => { setActiveTab(item.tab); setDrawerOpen && setDrawerOpen(false); }}
                  className={`block w-full text-left font-medium rounded-lg px-6 py-4 text-lg transition-all text-[#0C0E29] hover:text-[#ffd215] hover:bg-[#0C0E29]/10 focus:outline-none focus:ring-2 focus:ring-[#ffd215] ${activeTab === item.tab ? 'bg-[#ffd215] text-black' : ''}`}
                >
                  {item.label}
                </button>
              </Link>
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
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-100 border-r border-gray-200 flex-col justify-between min-h-[300px]">
        <nav className="flex flex-col gap-4 py-8 px-6 flex-1">
          {menuItems.map(item => (
            <Link href={item.href} key={item.tab} passHref legacyBehavior>
              <button
                type="button"
                tabIndex={0}
                onClick={() => setActiveTab(item.tab)}
                className={`block w-full text-left font-medium rounded-lg px-6 py-4 text-lg transition-all text-[#0C0E29] hover:text-[#ffd215] hover:bg-[#0C0E29]/10 focus:outline-none focus:ring-2 focus:ring-[#ffd215] ${activeTab === item.tab ? 'bg-[#ffd215] text-black' : ''}`}
              >
                {item.label}
              </button>
            </Link>
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
    </>
  );
}