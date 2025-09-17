"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DeliveryStep from "@/components/Order/DeliveryStep";

export default function DeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>({});

  useEffect(() => {
    const orderDataFromParams = {
      serviceType: searchParams.get('serviceType') || 'STANDARD',
    };
    console.log('DeliveryPage - Parsed orderData:', orderDataFromParams);
    setOrderData(orderDataFromParams);
  }, [searchParams]);

  const handleNext = (data: any) => {
    const updatedOrderData = { ...orderData, ...data };
    setOrderData(updatedOrderData);
    console.log('DeliveryPage - Proceeding with orderData:', updatedOrderData);
    router.push(
      `/orders/create/delivery-instructions?pickupAddress=${encodeURIComponent(data.pickupAddress)}` +
      `&deliveryAddress=${encodeURIComponent(data.deliveryAddress)}` +
      `&weight=${encodeURIComponent(data.weight)}` +
      `&distance=${encodeURIComponent(data.distance)}` +
      `&description=${encodeURIComponent(data.description)}` +
      `&serviceType=${encodeURIComponent(data.serviceType)}` +
      `&price=${encodeURIComponent(data.price)}`
    );
  };

  return <DeliveryStep serviceType={orderData.serviceType} onNext={handleNext} />;
}