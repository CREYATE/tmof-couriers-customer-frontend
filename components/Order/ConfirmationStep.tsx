import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TmofSpinner from "@/components/ui/TmofSpinner";

type ConfirmationStepProps = {
  onFinish?: () => void;
};

export default function ConfirmationStep({ onFinish }: ConfirmationStepProps) {
  const [loading, setLoading] = useState(false);

  function handleFinish() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onFinish && onFinish();
    }, 1000);
  }

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <TmofSpinner show={loading} />
      <h2 className="text-xl font-bold mb-4">Order Confirmed!</h2>
      <p className="mb-4 text-green-700 font-semibold">Your order has been placed successfully.</p>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
        <span className="font-bold text-lg text-[#0C0E29]">Tracking Number:</span>
        <span className="block text-xl text-[#ffd215] font-mono mt-2">TMof{Math.floor(Math.random()*10000000)}</span>
      </div>
      <Button onClick={handleFinish} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Go to Orders</Button>
    </Card>
  );
}
