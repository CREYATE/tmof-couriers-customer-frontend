
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, Truck } from "lucide-react";
import TmofSpinner from "@/components/ui/TmofSpinner";

export default function OrderTypeStep({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false);

  function handleNext() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  }

  return (
    <Card className="max-w-md mx-auto mt-16 p-8 flex flex-col items-center">
      <TmofSpinner show={loading} />
      <h2 className="text-2xl font-bold mb-6 text-center">Select Service Type</h2>
      <div className="flex flex-col gap-4 w-full">
        <Button onClick={handleNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full flex items-center justify-start gap-3">
          <Package className="h-5 w-5 text-blue-600" />
          Standard Delivery
        </Button>
        <Button onClick={handleNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full flex items-center justify-start gap-3">
          <Clock className="h-5 w-5 text-orange-600" />
          Same-Day Delivery
        </Button>
        <Button onClick={handleNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full flex items-center justify-start gap-3">
          <Package className="h-5 w-5 text-purple-600" />
          Swift Errand
        </Button>
        <div className="relative w-full">
          <Button onClick={handleNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full flex items-center justify-start gap-3 pr-20">
            <Truck className="h-5 w-5 text-green-600" />
            Furniture Moving
          </Button>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">NEW</span>
        </div>
      </div>
    </Card>
  );
}
