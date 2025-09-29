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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-l-[#ffd215] hover:shadow-xl transition-shadow duration-200 touch-manipulation">
      <h3 className="font-bold text-lg sm:text-xl text-[#0C0E29] mb-2">{order.title}</h3>
      <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{order.description}</p>
      {/* Add more order details here */}
    </div>
  );
}