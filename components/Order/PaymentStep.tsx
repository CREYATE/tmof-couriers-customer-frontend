import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="flex flex-col gap-4">
        <div className="bg-[#ffd215] rounded-lg p-4 text-black font-bold text-center mb-2">
          Paystack Payment
        </div>
        <Input placeholder="Card Number" />
        <Input placeholder="Expiry Date" />
        <Input placeholder="CVV" />
        <div className="bg-gray-100 rounded-lg p-2 text-center text-gray-700 font-semibold mb-2">
          Amount to Pay: R150
        </div>
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Pay with Paystack</Button>
      </div>
    </Card>
  );
}
