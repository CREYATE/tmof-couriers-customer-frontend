"use client";
import PaymentStep from "@/components/Order/PaymentStep";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  return <PaymentStep onNext={() => router.push("/orders/create/confirmation")} />;
}
