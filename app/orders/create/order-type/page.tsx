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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl">
        <OrderTypeStep onNext={handleNext} />
      </div>
    </div>
  );
}