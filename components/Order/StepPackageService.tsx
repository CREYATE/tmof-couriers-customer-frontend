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
    <div className="space-y-6">
      <TmofSpinner show={loading} />
      <h2 className="font-bold text-xl text-[#ffd215]">Package & Service Selection</h2>
      <div className="flex flex-col gap-4">
        <input type="number" className="input" placeholder="Length (cm)" value={dimensions.l} onChange={e => setDimensions({ ...dimensions, l: +e.target.value })} />
        <input type="number" className="input" placeholder="Width (cm)" value={dimensions.w} onChange={e => setDimensions({ ...dimensions, w: +e.target.value })} />
        <input type="number" className="input" placeholder="Height (cm)" value={dimensions.h} onChange={e => setDimensions({ ...dimensions, h: +e.target.value })} />
        <input type="number" className="input" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(+e.target.value)} />
        <select className="input" value={itemType} onChange={e => setItemType(e.target.value)}>
          <option value="document">Document</option>
          <option value="parcel">Parcel</option>
          <option value="food">Food</option>
        </select>
        <select className="input" value={service} onChange={e => setService(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="same-day">Same Day</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button className="bg-gray-200 px-6 py-2 rounded font-bold" onClick={onBack}>Back</button>
        <button className="bg-[#ffd215] px-6 py-2 rounded font-bold" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
