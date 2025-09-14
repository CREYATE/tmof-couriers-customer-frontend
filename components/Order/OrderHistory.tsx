"use client";
import React from 'react';

const orders = [
  { id: '1', title: 'Order #1234', description: 'Delivered to 123 Main St.', date: '2025-09-10' },
  { id: '2', title: 'Order #1235', description: 'Delivered to 456 Oak Ave.', date: '2025-09-09' },
  { id: '3', title: 'Order #1236', description: 'Delivered to 789 Pine Rd.', date: '2025-09-08' },
];

export default function OrderHistory() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl text-[#ffd215] mb-4">Order History</h2>
      <ul className="space-y-2">
        {orders.map(order => (
          <li key={order.id} className="bg-gray-50 rounded p-4 shadow flex flex-col gap-1">
            <span className="font-semibold">{order.title}</span>
            <span className="text-gray-700">{order.description}</span>
            <span className="text-xs text-gray-400">{order.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
