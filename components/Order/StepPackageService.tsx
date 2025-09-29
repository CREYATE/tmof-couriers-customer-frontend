"use client";
import React, { useState } from 'react';
import TmofSpinner from '@/components/ui/TmofSpinner';

type Dimensions = { l: number; w: number; h: number };
type Props = {
  dimensions: Dimensions;
  setDimensions: (val: Dimensions) => void;
  weight: number;
  setWeight: (val: number) => void;
  itemType: string;
  setItemType: (val: string) => void;
  service: string;
  setService: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepPackageService({ dimensions, setDimensions, weight, setWeight, itemType, setItemType, service, setService, onNext, onBack }: Props) {
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
      <h2 className="font-bold text-xl sm:text-2xl text-[#0C0E29] mb-6">Package & Service Selection</h2>
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
              placeholder="Length" 
              value={dimensions.l} 
              onChange={e => setDimensions({ ...dimensions, l: +e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
              placeholder="Width" 
              value={dimensions.w} 
              onChange={e => setDimensions({ ...dimensions, w: +e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
              placeholder="Height" 
              value={dimensions.h} 
              onChange={e => setDimensions({ ...dimensions, h: +e.target.value })} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input 
            type="number" 
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
            placeholder="Weight" 
            value={weight} 
            onChange={e => setWeight(+e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Item Type</label>
          <select 
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
            value={itemType} 
            onChange={e => setItemType(e.target.value)}
          >
            <option value="document">Document</option>
            <option value="parcel">Parcel</option>
            <option value="food">Food</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select 
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
            value={service} 
            onChange={e => setService(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="same-day">Same Day</option>
          </select>
        </div>
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
          Next
        </button>
      </div>
    </div>
  );
}
