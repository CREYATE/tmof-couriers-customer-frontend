"use client";

import React, { useState } from 'react';
import { Menu, Home, Package, MapPin, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ activeTab, setActiveTab, drawerOpen, setDrawerOpen }: {
  activeTab: string,
  setActiveTab: (tab: string) => void,
  drawerOpen?: boolean,
  setDrawerOpen?: (open: boolean) => void
}) {
  const menuItems = [
    { label: 'Overview', tab: 'overview', href: '/dashboard', icon: Home },
    { label: 'Orders', tab: 'orders', href: '/orders', icon: Package },
    { label: 'Track Parcel', tab: 'track-parcel', href: '/orders/track-parcel', icon: MapPin },
  ];
  
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
        onClick={() => setDrawerOpen && setDrawerOpen(false)}
      />

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-xl transition-transform duration-300 z-50 md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile sidebar header with close button */}
        <div className="flex items-center justify-between p-4 ">
          {/* <img 
          src="/tmof logo.png" 
          alt="TMOF Couriers Logo" 
          className="h-8 w-auto sm:h-10" 
          /> */}
          <button 
            onClick={() => setDrawerOpen && setDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
          >
            {/* <Menu className="h-5 w-5 text-[#0C0E29]" /> */}
          </button>
        </div>
        
        <nav className="flex flex-col py-4 px-4 flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.tab} passHref legacyBehavior>
                <button
                  type="button"
                  tabIndex={0}
                  onClick={() => { 
                    setActiveTab(item.tab); 
                    setDrawerOpen && setDrawerOpen(false); 
                  }}
                  className={`flex items-center gap-3 w-full text-left font-medium rounded-xl px-4 py-3 text-sm transition-all touch-manipulation ${
                    activeTab === item.tab 
                      ? 'bg-[#ffd215] text-black shadow-sm' 
                      : 'text-[#0C0E29] hover:text-[#ffd215] hover:bg-[#0C0E29]/5'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
        
        {/* Mobile Logout Button */}
        <div className="px-4 pb-4">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors touch-manipulation">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </Link>
        </div>
      </aside>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] z-30 shadow-sm">
        <nav className="flex flex-col py-6 px-4 flex-1 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.tab} passHref legacyBehavior>
                <button
                  type="button"
                  tabIndex={0}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-3 w-full text-left font-medium rounded-xl px-4 py-3 text-sm transition-all ${
                    activeTab === item.tab 
                      ? 'bg-[#ffd215] text-black shadow-sm' 
                      : 'text-[#0C0E29] hover:text-[#ffd215] hover:bg-[#0C0E29]/5'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
        
        {/* Desktop Logout Button */}
        <div className="px-4 pb-6">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}