import React from "react";

export function GuestBookingCTA({ quotation }: { quotation: any }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
      <h4 className="font-semibold mb-2">Ready to Book?</h4>
      <button className="bg-[#ffd215] text-black px-6 py-2 rounded font-bold mt-2">Book as Guest</button>
    </div>
  );
}
