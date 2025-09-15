"use client";
import ConfirmationStep from "@/components/Order/ConfirmationStep";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  return <ConfirmationStep onFinish={() => router.push("/orders")} />;
}
