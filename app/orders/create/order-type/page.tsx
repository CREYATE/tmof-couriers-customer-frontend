"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OrderTypeStep from "@/components/Order/OrderTypeStep";

export default function OrderTypePage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>({});

  const handleNext = (serviceType: string) => {
    const updatedOrderData = { ...orderData, serviceType };
    setOrderData(updatedOrderData);
    console.log('OrderTypePage - Proceeding with orderData:', updatedOrderData);
    
    // Route to appropriate form based on service type
    if (serviceType === "FURNITURE_MOVING") {
      router.push(`/orders/create/furniture?serviceType=${encodeURIComponent(serviceType)}`);
    } else {
      router.push(`/orders/create/delivery?serviceType=${encodeURIComponent(serviceType)}`);
    }
  };

  return <OrderTypeStep onNext={handleNext} />;
}