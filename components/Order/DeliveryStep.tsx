import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const regions = [
  "Ekurhuleni",
  "Tshwane",
  "Johannesburg",
  "Sedibeng",
  "West Rand"
];

export default function DeliveryStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
      <div className="flex flex-col gap-4">
        <Input placeholder="Pickup Address" />
        <Input placeholder="Dropoff Address" />
        {/* Google Maps snapshot zone (mocked) */}
        <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
          <span className="text-gray-500">[Google Maps Snapshot Here]</span>
        </div>
        {/* PriceEngine below map (mocked) */}
        <div className="bg-[#ffd215] rounded-lg p-4 text-black font-bold text-center mb-4">
          Estimated Price: R150
        </div>
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Proceed</Button>
      </div>
    </Card>
  );
}
