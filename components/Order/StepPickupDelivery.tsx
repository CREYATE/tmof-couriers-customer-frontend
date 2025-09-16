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
    <div className="space-y-6">
      <TmofSpinner show={loading} />
      <h2 className="font-bold text-xl text-[#ffd215]">Pickup & Delivery Details</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="input"
          placeholder="Pickup Address"
          value={pickup}
          onChange={e => setPickup(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="Delivery Address"
          value={delivery}
          onChange={e => setDelivery(e.target.value)}
        />
      </div>
      <button className="bg-[#ffd215] px-6 py-2 rounded font-bold" onClick={handleNext}>Next</button>
    </div>
  );
}
