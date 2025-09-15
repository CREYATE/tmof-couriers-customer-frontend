import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="flex flex-col gap-4">
        <Input placeholder="Card Number" />
        <Input placeholder="Expiry Date" />
        <Input placeholder="CVV" />
        <Button onClick={onNext}>Next</Button>
      </div>
    </Card>
  );
}
