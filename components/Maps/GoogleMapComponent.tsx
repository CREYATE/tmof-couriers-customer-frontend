"use client";

import React from 'react';

export default function TrackParcelMap({ trackingNumber }: { trackingNumber: string }) {
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg shadow flex items-center justify-center">
      <span className="text-gray-500">Tracking Parcel: <span className="font-bold">{trackingNumber}</span> [Mocked Map]</span>
    </div>
  );
}