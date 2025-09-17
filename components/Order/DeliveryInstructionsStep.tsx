import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TmofSpinner from "@/components/ui/TmofSpinner";

export default function DeliveryInstructionsStep({ orderData, onNext }: { orderData: any; onNext: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    deliveryNotes: "",
    preferredTime: "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const phoneRegex = /^\+?\d{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(form.clientPhone)) {
      return "Invalid client phone number";
    }
    if (!phoneRegex.test(form.recipientPhone)) {
      return "Invalid recipient phone number";
    }
    if (form.recipientEmail && !emailRegex.test(form.recipientEmail)) {
      return "Invalid recipient email";
    }
    if (form.deliveryNotes.length > 1000) {
      return "Delivery notes cannot exceed 1000 characters";
    }
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    console.log('DeliveryInstructionsStep - Submitting orderData:', { ...orderData, ...form });
    onNext({ ...orderData, ...form, deliveryInstructions: form.deliveryNotes });
    setLoading(false);
  }

  console.log('DeliveryInstructionsStep - Received orderData:', orderData);

  return (
    <Card className="max-w-2xl w-full mx-auto mt-12 p-10 shadow-2xl border-2 border-[#ffd215]">
      <TmofSpinner show={loading} />
      <h2 className="text-2xl font-bold mb-6 text-center text-[#0C0E29]">Delivery Instructions</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#0C0E29]">Client Cellphone Number</label>
            <Input
              name="clientPhone"
              type="tel"
              placeholder="e.g. +278031234567"
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
              placeholder="e.g. +278029876543"
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
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{form.deliveryNotes.length}/1000 characters</p>
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