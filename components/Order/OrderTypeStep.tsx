import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, Truck, ArrowLeft } from "lucide-react";
import TmofSpinner from "@/components/ui/TmofSpinner";

// Map display names to backend-compatible service types
const serviceTypes = [
  { display: "Standard Delivery", value: "STANDARD" },
  { display: "Same-Day Delivery", value: "SAME_DAY" },
  { display: "Swift Errand", value: "SWIFT_ERRAND" },
  { display: "Movers", value: "FURNITURE_MOVING" },
];

export default function OrderTypeStep({ onNext }: { onNext: (serviceType: string) => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleNext(serviceType: string) {
    console.log('OrderTypeStep - Selected serviceType:', serviceType);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext(serviceType);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto pt-16 sm:pt-20">
        <Card className="p-6 sm:p-8">
          <TmofSpinner show={loading} />
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-[#0C0E29]">Select Service Type</h2>
          
          <div className="flex flex-col gap-4 w-full mb-8">
            {serviceTypes.map(({ display, value }) => (
              <div key={value} className="relative w-full">
                <Button
                  onClick={() => handleNext(value)}
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full flex items-center justify-start gap-3 pr-20 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 touch-manipulation"
                >
                  {value === "STANDARD" && <Package className="h-5 w-5 text-blue-600" />}
                  {value === "SAME_DAY" && <Clock className="h-5 w-5 text-orange-600" />}
                  {value === "SWIFT_ERRAND" && <Package className="h-5 w-5 text-purple-600" />}
                  {value === "FURNITURE_MOVING" && <Truck className="h-5 w-5 text-green-600" />}
                  {display}
                </Button>
                {value === "FURNITURE_MOVING" && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">NEW</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Back Button */}
          <div className="flex justify-start pt-6 border-t border-gray-200">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="bg-[#ffd215] hover:bg-[#e5bd13] px-6 py-3 sm:px-8 font-semibold text-base touch-manipulation w-full"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}