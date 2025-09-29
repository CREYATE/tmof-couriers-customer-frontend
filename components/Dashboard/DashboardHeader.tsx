"use client";

import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function DashboardHeader({ onNotificationClick, onHamburgerClick }: { onNotificationClick?: () => void, onHamburgerClick?: () => void }) {
  const userInitials = "JD";
  return (
    <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#0C0E29] bg-[#ffd215] text-black flex items-center justify-between fixed top-0 left-0 w-full z-[100] h-14 sm:h-16">
      {/* Left side - Hamburger and Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="md:hidden p-2 rounded-full hover:bg-yellow-200 transition-colors touch-manipulation" 
          id="mobile-hamburger" 
          onClick={onHamburgerClick}
        >
          <Menu className="h-5 w-5 text-black" />
        </button>
        {/* <img 
          src="/tmof logo.png" 
          alt="TMOF Couriers Logo" 
          className="h-8 w-auto sm:h-10" 
        /> */}
      </div>
      
      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* <button className="relative p-2 rounded-full hover:bg-yellow-200 transition-colors touch-manipulation" onClick={() => { onNotificationClick && onNotificationClick(); }}>
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button> */}
        {/* <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
          {userInitials}
        </div> */}
      </div>
    </header>
  );
}