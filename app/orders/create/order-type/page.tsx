"use client";
import OrderTypeStep from "@/components/Order/OrderTypeStep";
import { useRouter } from "next/navigation";

export default function OrderTypePage() {
  const router = useRouter();
  return <OrderTypeStep onNext={() => router.push("/orders/create/delivery")} />;
}
