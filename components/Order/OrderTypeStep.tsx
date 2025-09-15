import React from "react";
import { Button} from "@/components/ui/button";
import { Card } from "@/components/ui/card";


export default function OrderTypeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Select Order Type</h2>
      <div className="flex flex-col gap-4">
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Document Delivery</Button>
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Parcel Delivery</Button>
        <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Furniture Moving</Button>
      </div>
    </Card>
  );
}
