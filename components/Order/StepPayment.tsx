"use client";
import React from 'react';

type Props = {
  onBack: () => void;
};

export default function StepPayment({ onBack }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl text-[#ffd215]">Payment</h2>
      <form className="flex flex-col gap-4 max-w-md mx-auto">
        <input type="text" className="input" placeholder="Card Number" />
        <input type="text" className="input" placeholder="Expiry Date (MM/YY)" />
        <input type="text" className="input" placeholder="CVV" />
        <input type="text" className="input" placeholder="Bank Account (optional)" />
        <button className="bg-[#ffd215] px-6 py-2 rounded font-bold mt-4">Pay with Paystack</button>
      </form>
      <button className="bg-gray-200 px-6 py-2 rounded font-bold" onClick={onBack}>Back</button>
    </div>
  );
}
