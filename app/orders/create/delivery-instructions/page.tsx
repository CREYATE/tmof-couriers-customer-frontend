"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DeliveryInstructionsStep from "@/components/Order/DeliveryInstructionsStep";

function DeliveryInstructionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>({});

  useEffect(() => {
    const orderDataFromParams = {
      pickupAddress: searchParams.get('pickupAddress') || '',
      deliveryAddress: searchParams.get('deliveryAddress') || '',
      weight: searchParams.get('weight') || '',
      distance: searchParams.get('distance') || '',
      description: searchParams.get('description') || '',
      serviceType: searchParams.get('serviceType') || 'STANDARD',
      price: parseFloat(searchParams.get('price') || '0'),
    };
    // console.log('DeliveryInstructionsPage - Parsed orderData:', orderDataFromParams);
    setOrderData(orderDataFromParams);
  }, [searchParams]);

  const handleNext = (data: any) => {
    const updatedOrderData = { ...orderData, ...data };
    setOrderData(updatedOrderData);
    // console.log('DeliveryInstructionsPage - Proceeding with orderData:', updatedOrderData);
    router.push(
      `/orders/create/payment?pickupAddress=${encodeURIComponent(updatedOrderData.pickupAddress)}` +
      `&deliveryAddress=${encodeURIComponent(updatedOrderData.deliveryAddress)}` +
      `&weight=${encodeURIComponent(updatedOrderData.weight)}` +
      `&distance=${encodeURIComponent(updatedOrderData.distance)}` +
      `&description=${encodeURIComponent(updatedOrderData.description)}` +
      `&serviceType=${encodeURIComponent(updatedOrderData.serviceType)}` +
      `&price=${encodeURIComponent(updatedOrderData.price)}` +
      `&clientPhone=${encodeURIComponent(data.clientPhone || '')}` +
      `&recipientName=${encodeURIComponent(data.recipientName || '')}` +
      `&recipientPhone=${encodeURIComponent(data.recipientPhone || '')}` +
      `&recipientEmail=${encodeURIComponent(data.recipientEmail || '')}` +
      `&deliveryNotes=${encodeURIComponent(data.deliveryNotes || '')}` +
      `&preferredTime=${encodeURIComponent(data.preferredTime || '')}` +
      `&deliveryInstructions=${encodeURIComponent(data.deliveryInstructions || '')}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DeliveryInstructionsStep orderData={orderData} onNext={handleNext} />
    </div>
  );
}

export default function DeliveryInstructionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DeliveryInstructionsContent />
    </Suspense>
  );
}