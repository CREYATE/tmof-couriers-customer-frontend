"use client";

import React from 'react';

type Order = {
  title: string;
  description: string;
  // Add more fields as needed
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
  <div className="bg-[#0C0E29]/5 rounded-lg shadow p-4 border-l-4 border-l-[#ffd215]">
  <h3 className="font-bold text-lg text-[#ffd215]">{order.title}</h3>
      <p className="text-gray-700">{order.description}</p>
      {/* Add more order details here */}
    </div>
  );
}