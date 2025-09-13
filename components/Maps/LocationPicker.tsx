"use client";

import React from 'react';

export default function LocationPicker() {
  return (
    <div className="mb-6">
      <label className="block font-medium mb-2 text-gray-700">Pick a location:</label>
      <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter address..." />
    </div>
  );
}