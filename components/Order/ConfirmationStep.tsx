import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { useRouter } from 'next/navigation';

export default function ConfirmationStep({ orderData, onFinish }: { orderData: any; onFinish: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFinish() {
    setLoading(true);
    console.log('ConfirmationStep - Finishing with orderData:', orderData);
    onFinish();
    setLoading(false);
  }

  console.log('ConfirmationStep - Received orderData:', orderData);

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <TmofSpinner show={loading} />
      <h2 className="text-xl font-bold mb-4">Order Confirmed!</h2>
      <p className="mb-4 text-green-700 font-semibold">Your order has been placed successfully.</p>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
        <div className="font-bold text-lg text-[#0C0E29]">Tracking Number:</div>
        <div className="text-xl text-[#ffd215] font-mono mt-2">{orderData.trackingNumber || 'N/A'}</div>
        <div className="text-sm text-gray-700 mt-2">
          <p><strong>Service Type:</strong> {orderData.serviceType || 'N/A'}</p>
          <p><strong>Pickup Address:</strong> {orderData.pickupAddress || 'N/A'}</p>
          <p><strong>Delivery Address:</strong> {orderData.deliveryAddress || 'N/A'}</p>
          <p><strong>Weight:</strong> {orderData.weight || '1'} kg</p>
          <p><strong>Distance:</strong> {orderData.distance || 'N/A'} km</p>
          <p><strong>Price:</strong> R{orderData.price || 'N/A'}</p>
          <p><strong>Delivery Notes:</strong> {orderData.deliveryNotes || 'None'}</p>
          <p><strong>Recipient Name:</strong> {orderData.recipientName || 'N/A'}</p>
          <p><strong>Recipient Phone:</strong> {orderData.recipientPhone || 'N/A'}</p>
          <p><strong>Recipient Email:</strong> {orderData.recipientEmail || 'N/A'}</p>
          <p><strong>Preferred Delivery Time:</strong> {orderData.preferredTime || 'N/A'}</p>
        </div>
      </div>
      <Button
        onClick={handleFinish}
        className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full"
      >
        Go to Orders
      </Button>
    </Card>
  );
}