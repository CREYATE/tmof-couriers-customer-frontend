"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FurnitureMovingForm from '@/components/Order/FurnitureMovingForm';
import PaymentStep from '@/components/Order/PaymentStep';
import TmofSpinner from '@/components/ui/TmofSpinner';

// Separate component for search params to handle Suspense
function FurnitureOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<any>({
    serviceType: searchParams.get('serviceType') || 'FURNITURE_MOVING'
  });

  const handleFurnitureFormComplete = (data: any) => {
    console.log('Furniture form completed:', data);
    
    // Transform furniture data to match PaymentStep expectations
    const transformedData = {
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      serviceType: 'Furniture Moving',
      description: data.furnitureDescription,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      recipientEmail: data.recipientEmail,
      deliveryNotes: data.specialInstructions,
      preferredTime: data.preferredTime,
      price: data.price,
      // Store furniture-specific data in a structured format
      furnitureDetails: {
        moveType: data.moveType,
        pickupBuilding: {
          name: data.pickupBuildingName,
          floor: data.pickupFloor,
          unit: data.pickupUnitNumber,
          hasElevator: data.pickupHasElevator,
          parkingAccess: data.pickupParkingAccess
        },
        deliveryBuilding: {
          name: data.deliveryBuildingName,
          floor: data.deliveryFloor,
          unit: data.deliveryUnitNumber,
          hasElevator: data.deliveryHasElevator,
          parkingAccess: data.deliveryParkingAccess
        },
        estimatedVolume: data.estimatedVolume,
        services: {
          hasFragileItems: data.hasFragileItems,
          requiresDisassembly: data.requiresDisassembly,
          packingRequired: data.packingRequired,
          needsPackingMaterials: data.needsPackingMaterials,
          storageRequired: data.storageRequired,
          requiresInsurance: data.requiresInsurance
        },
        scheduling: {
          preferredDate: data.preferredDate,
          isFlexibleTiming: data.isFlexibleTiming
        }
      }
    };
    
    setOrderData(transformedData);
    setStep(2);
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    // Handle successful payment
    router.push('/orders/success');
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex-1 p-6">
      {step === 1 && (
        <FurnitureMovingForm
          orderData={orderData}
          onNext={handleFurnitureFormComplete}
          onBack={handleBack}
        />
      )}
      
      {step === 2 && (
        <PaymentStep
          orderData={orderData}
          onNext={handlePaymentComplete}
        />
      )}
    </div>
  );
}

export default function FurniturePage() {
  return (
    <Suspense fallback={<TmofSpinner show={true} />}>
      <FurnitureOrderContent />
    </Suspense>
  );
}