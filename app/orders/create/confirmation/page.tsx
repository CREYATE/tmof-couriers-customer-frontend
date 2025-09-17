"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationStep from "@/components/Order/ConfirmationStep";

export default function ConfirmationPage() {
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
    console.log('ConfirmationPage - Parsed orderData:', orderDataFromParams);
    setOrderData(orderDataFromParams);
  }, [searchParams]);

  return <ConfirmationStep orderData={orderData} onFinish={() => router.push("/orders")} />;
}