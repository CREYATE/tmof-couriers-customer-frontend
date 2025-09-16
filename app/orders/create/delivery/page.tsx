"use client";
import DeliveryStep from "@/components/Order/DeliveryStep";
import { useRouter } from "next/navigation";

export default function DeliveryPage() {
  const router = useRouter();
  return <DeliveryStep onNext={() => router.push("/orders/create/delivery-instructions")} />;
}
