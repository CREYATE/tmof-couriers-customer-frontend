"use client";

import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function DashboardHeader({ onNotificationClick, onHamburgerClick }: { onNotificationClick?: () => void, onHamburgerClick?: () => void }) {
  const userInitials = "JD";
  return (
    <header className="px-4 py-3 border-b border-[#0C0E29] bg-[#ffd215] text-black flex items-center justify-between md:px-6 fixed top-0 left-0 w-full z-[100] h-16">
      {/* Hamburger for mobile only */}
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-full hover:bg-yellow-200" id="mobile-hamburger" onClick={onHamburgerClick}>
          <Menu className="h-6 w-6 text-black" />
        </button>
      </div>
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        <button className="relative p-2 rounded-full hover:bg-yellow-200" onClick={() => { onNotificationClick && onNotificationClick(); }}>
          <Bell className="h-6 w-6 text-black" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg">
          {userInitials}
        </div>
      </div>
    </header>
  );
}