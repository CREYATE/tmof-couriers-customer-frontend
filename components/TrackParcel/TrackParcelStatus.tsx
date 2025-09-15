import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TrackParcelStatus() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  return (
    <Card className="p-8 max-w-lg mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Track Parcel
      </h2>
      <div className="flex flex-col gap-4 mb-6">
        <Input
          placeholder="Enter Tracking Number"
          value={trackingNumber}
          onChange={e => setTrackingNumber(e.target.value)}
        />
        <Button
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black"
          onClick={() => setShowStatus(true)}
          disabled={!trackingNumber}
        >
          Track
        </Button>
      </div>
      {showStatus && (
        <div className="space-y-6 mt-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="font-semibold">Collected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="font-semibold">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="font-semibold">Delivered</span>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">Tracking Parcel: <span className="font-bold">{trackingNumber}</span> [Mocked Map]</span>
          </div>
        </div>
      )}
    </Card>
  );
}
