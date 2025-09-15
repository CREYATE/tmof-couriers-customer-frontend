import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


export default function ConfirmationStep({ onFinish }: { onFinish: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
      <p className="mb-4">Review your order details and confirm.</p>
      <Button onClick={onFinish}>Confirm Order</Button>
    </Card>
  );
}
