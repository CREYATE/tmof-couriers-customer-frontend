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
    <div className="space-y-6 sm:space-y-8">
      <TmofSpinner show={loading} />
      <h2 className="font-bold text-xl sm:text-2xl text-[#0C0E29] mb-6">Instant Pricing Quote</h2>
      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
        <PricingEngine distance={distance} baseFare={baseFare} perKmRate={perKmRate} weight={weight} dimensions={dimensions} />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-xl font-semibold text-lg transition-colors touch-manipulation" 
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="flex-1 bg-[#ffd215] hover:bg-[#e5bd13] text-black px-6 py-4 rounded-xl font-semibold text-lg transition-colors touch-manipulation shadow-lg hover:shadow-xl" 
          onClick={handleNext}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
