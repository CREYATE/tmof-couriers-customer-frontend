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
        <Select>
          <option value="">Select Region</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </Select>
        <Button onClick={onNext}>Next</Button>
      </div>
    </Card>
  );
}
