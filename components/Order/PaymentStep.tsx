import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TmofSpinner from "@/components/ui/TmofSpinner";

export default function PaymentStep({ onNext }: { onNext: () => void }) {
  const [redirecting, setRedirecting] = useState(false);

  const handlePaystackPayment = () => {
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
      onNext();
    }, 1800);
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <TmofSpinner show={redirecting} />
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="flex flex-col gap-4">
        <div className="bg-[#ffd215] rounded-lg p-4 text-black font-bold text-center mb-2">
          Paystack Payment
        </div>
        <div className="bg-gray-100 rounded-lg p-2 text-center text-gray-700 font-semibold mb-2">
          Amount to Pay: R150
        </div>
        <Button onClick={handlePaystackPayment} disabled={redirecting} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full h-12 text-lg font-bold flex items-center justify-center">
          {redirecting ? (
            <span className="flex items-center gap-2">
              Redirecting to Paystack…
            </span>
          ) : (
            'Pay with Paystack'
          )}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          You will be redirected to Paystack's secure payment gateway to complete your payment.
        </p>
      </div>
    </Card>
  );
}
