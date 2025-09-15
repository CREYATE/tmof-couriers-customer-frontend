import React from "react";
import { Card } from "@/components/ui/card";

const ShipmentCard = ({ shipment }: { shipment: any }) => (
  <Card className="p-4 flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <div className="font-bold">{shipment.title || shipment.id}</div>
      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{shipment.status}</span>
    </div>
    <div className="text-sm text-gray-500">{shipment.destination || shipment.address}</div>
    <div className="text-xs text-gray-400">{shipment.date || "Date not available"}</div>
  </Card>
);

export default ShipmentCard;
