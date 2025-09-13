"use client";
import React from 'react';

type Dimensions = { l: number; w: number; h: number };
type PricingProps = {
  distance: number;
  baseFare: number;
  perKmRate: number;
  weight: number;
  dimensions: Dimensions;
};

export function calculatePrice({ distance, baseFare, perKmRate, weight, dimensions }: PricingProps) {
  let price = baseFare + distance * perKmRate;
  // Add package factors
  if (weight > 5) price += 200;
  if (dimensions.l * dimensions.w * dimensions.h > 100000) price += 300;
  return price;
}

export default function PricingEngine({ distance, baseFare, perKmRate, weight, dimensions }: PricingProps) {
  const price = calculatePrice({ distance, baseFare, perKmRate, weight, dimensions });
  return (
    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
      <h3 className="font-bold text-lg mb-2 text-[#ffd215]">Instant Pricing Quote</h3>
      <div className="text-xl font-semibold">₦{price.toLocaleString()}</div>
    </div>
  );
}
