"use client"

import DeliveryInstructionsStep from '@/components/Order/DeliveryInstructionsStep';
import { useRouter } from 'next/navigation';

export default function DeliveryInstructionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DeliveryInstructionsStep onNext={() => router.push('/orders/create/payment')} />
    </div>
  );
}
