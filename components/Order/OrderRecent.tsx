"use client";
import React, { useState } from 'react';

const recentOrders = [
  { id: '1', title: 'Order #1240', description: 'Pickup at 22 New St.', status: 'Pending' },
  { id: '2', title: 'Order #1241', description: 'Pickup at 33 Old Rd.', status: 'Pending' },
];

export default function OrderRecent() {
  const [orders, setOrders] = useState(recentOrders);
  const handleReschedule = (id: string) => {
    alert(`Reschedule order ${id}`);
  };
  const handleCancel = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };
  const handleTrack = (id: string) => {
    alert(`Track order ${id}`);
  };
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl text-[#ffd215] mb-4">Recent Orders</h2>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="bg-white rounded p-4 shadow flex flex-col gap-2">
            <span className="font-semibold">{order.title}</span>
            <span className="text-gray-700">{order.description}</span>
            <span className="text-xs text-gray-400">Status: {order.status}</span>
            <div className="flex gap-2 mt-2">
              <button className="bg-[#ffd215] px-3 py-1 rounded font-bold" onClick={() => handleReschedule(order.id)}>Reschedule</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded font-bold" onClick={() => handleCancel(order.id)}>Cancel</button>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-bold mt-2 self-end" onClick={() => handleTrack(order.id)}>Track Order</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
