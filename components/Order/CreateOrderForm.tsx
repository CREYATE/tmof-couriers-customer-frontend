"use client";
import React, { useState } from 'react';
import TmofSpinner from '@/components/ui/TmofSpinner';
import StepPickupDelivery from './StepPickupDelivery';
import StepPackageService from './StepPackageService';
import StepPricingQuote from './StepPricingQuote';
import StepSenderReceiver from './StepSenderReceiver';
import StepPayment from './StepPayment';
import DeliveryInstructionsStep from './DeliveryInstructionsStep';

export default function CreateOrderForm() {
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [dimensions, setDimensions] = useState({ l: 0, w: 0, h: 0 });
  const [weight, setWeight] = useState(0);
  const [itemType, setItemType] = useState('document');
  const [service, setService] = useState('standard');
  const [sender, setSender] = useState({ name: '', phone: '' });
  const [receiver, setReceiver] = useState({ name: '', phone: '' });
  const [showLoader, setShowLoader] = useState(false);

  // Dummy pricing config
  const baseFare = 500;
  const perKmRate = 100;
  // Dummy distance (replace with Google Maps API integration)
  const distance = 12;

  function handleProceedToPayment() {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setStep(6);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg relative mt-16 sm:mt-20">
          <TmofSpinner show={showLoader} />
      {step === 1 && (
        <StepPickupDelivery
          pickup={pickup}
          setPickup={setPickup}
          delivery={delivery}
          setDelivery={setDelivery}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepPackageService
          dimensions={dimensions}
          setDimensions={setDimensions}
          weight={weight}
          setWeight={setWeight}
          itemType={itemType}
          setItemType={setItemType}
          service={service}
          setService={setService}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepPricingQuote
          distance={distance}
          baseFare={baseFare}
          perKmRate={perKmRate}
          weight={weight}
          dimensions={dimensions}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <StepSenderReceiver
          sender={sender}
          setSender={setSender}
          receiver={receiver}
          setReceiver={setReceiver}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <DeliveryInstructionsStep
          orderData={{ pickup, delivery, dimensions, weight, itemType, service, sender, receiver }}
          onNext={handleProceedToPayment}
        />
      )}
      {showLoader && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="loader mb-4" style={{ width: 40, height: 40, border: '4px solid #ffd215', borderRadius: '50%', borderTop: '4px solid #0C0E29', animation: 'spin 1s linear infinite' }}></div>
          <div className="text-lg font-bold text-[#ffd215]">Redirecting to payment gateway...</div>
        </div>
      )}
      {step === 6 && !showLoader && (
        <StepPayment onBack={() => setStep(5)} />
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
      </div>
    </div>
  );
}