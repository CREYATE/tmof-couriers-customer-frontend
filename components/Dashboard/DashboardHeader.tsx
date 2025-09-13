"use client";

import React from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';

export default function DashboardHeader({ onNotificationClick }: { onNotificationClick?: () => void }) {
  // Example user initials, replace with actual user data as needed
  const userInitials = "JD";
  return (
    <header className="px-6 py-4 border-b border-gray-200 bg-[#ffd215] text-black flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src="/tmof logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
        <span className="font-bold text-xl">Dashboard</span>
      </div>
      <div className="flex items-center gap-6">
  <button className="relative p-2 rounded-full hover:bg-yellow-200" onClick={() => { console.log('Bell clicked'); onNotificationClick && onNotificationClick(); }}>
          <Bell className="h-6 w-6 text-black" />
          {/* Notification dot example */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg">
          {userInitials}
        </div>
      </div>
    </header>
  );
}