"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationStep from "@/components/Order/ConfirmationStep";

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>({});

  useEffect(() => {
    const orderDataFromParams = {
      trackingNumber: searchParams.get('trackingNumber') || '',
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
    // console.log('ConfirmationPage - Parsed orderData:', orderDataFromParams);
    setOrderData(orderDataFromParams);
  }, [searchParams]);

  return <ConfirmationStep orderData={orderData} onFinish={() => router.push("/orders/all")} />;
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}