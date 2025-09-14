"use client";
import React from 'react';

const stats = [
  { label: 'Total Orders', value: 42, color: 'bg-blue-100', text: 'text-blue-700' },
  { label: 'Money Spent', value: '₦120,000', color: 'bg-green-100', text: 'text-green-700' },
  { label: 'Complaints Logged', value: 3, color: 'bg-red-100', text: 'text-red-700' },
];

const graphData = [12, 19, 8, 15, 22, 30, 18]; // Example: orders per month
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`rounded-lg p-6 shadow flex flex-col items-center ${stat.color}`}>
            <span className="text-lg font-bold mb-2">{stat.label}</span>
            <span className={`text-2xl font-extrabold ${stat.text}`}>{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4 text-[#ffd215]">Orders This Year</h3>
        <div className="w-full h-48 flex items-end gap-2">
          {graphData.map((val, idx) => (
            <div key={months[idx]} className="flex flex-col items-center justify-end h-full">
              <div
                className="w-8 rounded bg-[#ffd215]"
                style={{ height: `${val * 4}px` }}
                title={`${val} orders`}
              ></div>
              <span className="text-xs mt-2 text-gray-500">{months[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
