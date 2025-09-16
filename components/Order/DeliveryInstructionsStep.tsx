import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TmofSpinner from "@/components/ui/TmofSpinner";

export default function DeliveryInstructionsStep({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    deliveryNotes: "",
    preferredTime: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1200);
  }

  return (
    <Card className="max-w-2xl w-full mx-auto mt-12 p-10 shadow-2xl border-2 border-[#ffd215]">
      <TmofSpinner show={loading} />
      <h2 className="text-2xl font-bold mb-6 text-center text-[#0C0E29]">Delivery Instructions</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Client Cellphone Number</label>
            <Input
              name="clientPhone"
              type="tel"
              placeholder="e.g. 0803 123 4567"
              value={form.clientPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Recipient Name</label>
            <Input
              name="recipientName"
              placeholder="Recipient's Full Name"
              value={form.recipientName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Recipient Cellphone Number</label>
            <Input
              name="recipientPhone"
              type="tel"
              placeholder="e.g. 0802 987 6543"
              value={form.recipientPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Recipient Email</label>
            <Input
              name="recipientEmail"
              type="email"
              placeholder="recipient@email.com"
              value={form.recipientEmail}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Delivery Notes</label>
          <Textarea
            name="deliveryNotes"
            placeholder="e.g. Call on arrival, leave at reception, etc."
            value={form.deliveryNotes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Preferred Delivery Time</label>
          <Input
            name="preferredTime"
            type="text"
            placeholder="e.g. 10:00 AM - 12:00 PM"
            value={form.preferredTime}
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-bold text-lg py-3 mt-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </Card>
  );
}
