"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, Home } from "lucide-react";
import TrackParcelMap from "@/components/Maps/GoogleMapComponent";

export default function TrackParcelPage() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("trackingNumber") || "";
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [showMap, setShowMap] = useState(!!initialTracking);
  // Mock order status lookup
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching order status by tracking number
    if (trackingNumber) {
      // Demo: last digit even = delivered, odd = in_transit
      const lastDigit = trackingNumber.slice(-1);
      if (lastDigit === '1' || lastDigit === '3' || lastDigit === '5' || lastDigit === '7' || lastDigit === '9') {
        setOrderStatus('in_transit');
      } else if (lastDigit === '2' || lastDigit === '4' || lastDigit === '6' || lastDigit === '8' || lastDigit === '0') {
        setOrderStatus('delivered');
      } else {
        setOrderStatus(null);
      }
    } else {
      setOrderStatus(null);
    }
  }, [trackingNumber]);

  return (
  <div className="max-w-lg mx-auto mt-12">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Package className="h-6 w-6 text-[#ffd215]" /> Track Parcel
        </h2>
        <div className="flex flex-col gap-4 mb-6">
          <Input
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
          />
          <Button
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black"
            onClick={() => setShowMap(true)}
            disabled={!trackingNumber}
          >
            Track
          </Button>
        </div>
        {showMap && (
          <div className="space-y-6 mt-6">
            {/* Horizontal stepper for delivery status */}
            <div className="flex items-center justify-between gap-0 w-full max-w-xl mx-auto">
              {/* Step 1: Collected */}
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Collected</span>
              </div>
              {/* Connector: green if Collected is completed */}
              <div className={`h-1 w-8 mx-2 ${orderStatus ? 'bg-green-500' : 'bg-gray-300'}`} style={{ opacity: orderStatus ? 1 : 0.5 }} />
              {/* Step 2: In Transit */}
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus === 'in_transit' || orderStatus === 'delivered' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">In Transit</span>
              </div>
              {/* Connector: green if In Transit is completed */}
              <div className={`h-1 w-8 mx-2 ${(orderStatus === 'delivered') ? 'bg-green-500' : 'bg-gray-300'}`} style={{ opacity: orderStatus === 'delivered' ? 1 : 0.5 }} />
              {/* Step 3: Delivered */}
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}>
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Delivered</span>
              </div>
            </div>
            <TrackParcelMap trackingNumber={trackingNumber} />
          </div>
        )}
      </Card>
    </div>
  );
}
