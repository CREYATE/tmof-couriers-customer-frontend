import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DeliveryInstructionsStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Delivery Instructions</h2>
      <div className="flex flex-col gap-4">
        <Input placeholder="Recipient Name" />
        <Input placeholder="Recipient Contact Number" />
        <Input placeholder="Recipient Email" />
        <Textarea placeholder="Delivery Notes (optional)" />
        <Input placeholder="Preferred Delivery Time Slot" />
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Proceed to Payment</Button>
      </div>
    </Card>
  );
}
