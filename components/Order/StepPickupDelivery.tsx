"use client";
import React, { useState } from 'react';
import TmofSpinner from '@/components/ui/TmofSpinner';

type Props = {
  pickup: string;
  setPickup: (val: string) => void;
  delivery: string;
  setDelivery: (val: string) => void;
  onNext: () => void;
};

export default function StepPickupDelivery({ pickup, setPickup, delivery, setDelivery, onNext }: Props) {
  const [loading, setLoading] = useState(false);

  function handleNext() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <TmofSpinner show={loading} />
      <h2 className="font-bold text-xl sm:text-2xl text-[#0C0E29] mb-6">Pickup & Delivery Details</h2>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
          <input
            type="text"
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation"
            placeholder="Enter pickup address"
            value={pickup}
            onChange={e => setPickup(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
          <input
            type="text"
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation"
            placeholder="Enter delivery address"
            value={delivery}
            onChange={e => setDelivery(e.target.value)}
          />
        </div>
      </div>
      <button 
        className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black px-6 py-4 rounded-xl font-semibold text-lg transition-colors touch-manipulation shadow-lg hover:shadow-xl" 
        onClick={handleNext}
        disabled={!pickup || !delivery}
      >
        Next
      </button>
    </div>
  );
}
