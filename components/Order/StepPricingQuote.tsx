"use client";
import React, { useState } from 'react';
import PricingEngine from './PricingEngine';
import TmofSpinner from '@/components/ui/TmofSpinner';

type Dimensions = { l: number; w: number; h: number };
type Props = {
  distance: number;
  baseFare: number;
  perKmRate: number;
  weight: number;
  dimensions: Dimensions;
  onNext: () => void;
  onBack: () => void;
};

export default function StepPricingQuote({ distance, baseFare, perKmRate, weight, dimensions, onNext, onBack }: Props) {
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
      <h2 className="font-bold text-xl text-[#ffd215]">Instant Pricing Quote</h2>
      <PricingEngine distance={distance} baseFare={baseFare} perKmRate={perKmRate} weight={weight} dimensions={dimensions} />
      <div className="flex gap-4">
        <button className="bg-gray-200 px-6 py-2 rounded font-bold" onClick={onBack}>Back</button>
        <button className="bg-[#ffd215] px-6 py-2 rounded font-bold" onClick={handleNext}>Proceed</button>
      </div>
    </div>
  );
}
