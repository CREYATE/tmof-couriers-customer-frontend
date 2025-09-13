"use client";
import React from 'react';

import { Trash2 } from 'lucide-react';

export default function Notification({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = React.useState([
    { id: 1, message: 'Order #1234 has been delivered.' },
    { id: 2, message: 'New order received.' },
    { id: 3, message: 'Order #1235 is out for delivery.' },
  ]);

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'} w-full max-w-sm`}
    >
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg text-[#ffd215]">Notifications</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <ul className="flex flex-col gap-3">
          {notifications.length === 0 ? (
            <li className="text-gray-400 text-center">No notifications</li>
          ) : (
            notifications.map(n => (
              <li key={n.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-gray-800">{n.message}</span>
                <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}