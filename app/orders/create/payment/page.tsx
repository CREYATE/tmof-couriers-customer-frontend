"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentStep from "@/components/Order/PaymentStep";

function PaymentContent() {
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
      clientPhone: searchParams.get('clientPhone') || '',
      recipientName: searchParams.get('recipientName') || '',
      recipientPhone: searchParams.get('recipientPhone') || '',
      recipientEmail: searchParams.get('recipientEmail') || '',
      deliveryNotes: searchParams.get('deliveryNotes') || '',
      preferredTime: searchParams.get('preferredTime') || '',
      deliveryInstructions: searchParams.get('deliveryInstructions') || '',
    };
    // console.log('PaymentPage - Parsed orderData:', orderDataFromParams);
    setOrderData(orderDataFromParams);
  }, [searchParams]);

  const handleNext = (data: any) => {
    const updatedOrderData = { ...orderData, ...data };
    setOrderData(updatedOrderData);
    // console.log('PaymentPage - Proceeding with orderData:', updatedOrderData);
    router.push(
      `/orders/create/confirmation?trackingNumber=${encodeURIComponent(data.trackingNumber || '')}` +
      `&pickupAddress=${encodeURIComponent(orderData.pickupAddress)}` +
      `&deliveryAddress=${encodeURIComponent(orderData.deliveryAddress)}` +
      `&weight=${encodeURIComponent(orderData.weight)}` +
      `&distance=${encodeURIComponent(orderData.distance)}` +
      `&description=${encodeURIComponent(orderData.description)}` +
      `&serviceType=${encodeURIComponent(orderData.serviceType)}` +
      `&price=${encodeURIComponent(orderData.price)}` +
      `&clientPhone=${encodeURIComponent(orderData.clientPhone)}` +
      `&recipientName=${encodeURIComponent(orderData.recipientName)}` +
      `&recipientPhone=${encodeURIComponent(orderData.recipientPhone)}` +
      `&recipientEmail=${encodeURIComponent(orderData.recipientEmail)}` +
      `&deliveryNotes=${encodeURIComponent(orderData.deliveryNotes)}` +
      `&preferredTime=${encodeURIComponent(orderData.preferredTime)}` +
      `&deliveryInstructions=${encodeURIComponent(orderData.deliveryInstructions)}`
    );
  };

  return <PaymentStep orderData={orderData} onNext={handleNext} />;
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}