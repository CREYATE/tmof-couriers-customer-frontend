"use client";

import React from 'react';

import OrderCard from './OrderCard';

export default function OrderList() {
  // Replace with your order data
interface Order {
    id: string;
    title: string;
    description: string;
    // Add other order properties as needed
}

const orders: Order[] = [
  { id: '1', title: 'Order #1234', description: 'Deliver package to 123 Main St.' },
  { id: '2', title: 'Order #1235', description: 'Pickup from 456 Oak Ave.' },
  { id: '3', title: 'Order #1236', description: 'Express delivery to 789 Pine Rd.' },
];

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-2 text-[#ffd215]">Order History</h3>
        <ul className="space-y-2">
          {orders.map(order => (
            <li key={order.id} className="text-gray-700">{order.title} - {order.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}