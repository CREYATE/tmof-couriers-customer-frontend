"use client";

import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function DashboardHeader({ onNotificationClick, onHamburgerClick }: { onNotificationClick?: () => void, onHamburgerClick?: () => void }) {
  const userInitials = "JD";
  return (
    <header className="px-6 py-4 border-b border-[#0C0E29] bg-[#ffd215] text-black flex items-center justify-between fixed top-0 left-0 w-full z-[100] h-16">
      {/* Left side - Hamburger and Logo */}
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-full hover:bg-yellow-200 transition-colors" id="mobile-hamburger" onClick={onHamburgerClick}>
          <Menu className="h-5 w-5 text-black" />
        </button>
        <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-10 w-auto" />
      </div>
      
      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-3">
        {/* <button className="relative p-2 rounded-full hover:bg-yellow-200 transition-colors" onClick={() => { onNotificationClick && onNotificationClick(); }}>
          <Bell className="h-5 w-5 text-black" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button> */}
        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
          {userInitials}
        </div>
      </div>
    </header>
  );
}