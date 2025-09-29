import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TmofSpinner from "@/components/ui/TmofSpinner";

export default function DeliveryInstructionsStep({ orderData, onNext }: { orderData: any; onNext: (data: any) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => {
    // Try to restore form data from localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('deliveryInstructionsFormData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          return {
            clientPhone: "",
            recipientName: "",
            recipientPhone: "",
            recipientEmail: "",
            deliveryNotes: "",
            preferredTime: "",
            ...parsed
          };
        } catch (error) {
          console.error('Failed to parse saved delivery instructions data:', error);
        }
      }
    }
    return {
      clientPhone: "",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      deliveryNotes: "",
      preferredTime: "",
    };
  });
  const [error, setError] = useState("");

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryInstructionsFormData', JSON.stringify(form));
    }
  }, [form]);

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
    <div className="min-h-screen bg-white">
      <div className="min-h-screen">
        <Card className="bg-white">
          <div className="p-4 sm:p-6 lg:p-8">
            <TmofSpinner show={loading} />
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0C0E29] mb-2">Delivery Instructions</h2>
              <p className="text-sm sm:text-base text-gray-600">Please provide contact details and delivery preferences</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm sm:text-base">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0C0E29]">Client Cellphone Number</label>
                  <Input
                    name="clientPhone"
                    type="tel"
                    placeholder="e.g. +278031234567"
                    value={form.clientPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0C0E29]">Recipient Name</label>
                  <Input
                    name="recipientName"
                    placeholder="Recipient's Full Name"
                    value={form.recipientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0C0E29]">Recipient Cellphone Number</label>
                  <Input
                    name="recipientPhone"
                    type="tel"
                    placeholder="e.g. +278029876543"
                    value={form.recipientPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0C0E29]">Recipient Email</label>
                  <Input
                    name="recipientEmail"
                    type="email"
                    placeholder="recipient@email.com"
                    value={form.recipientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0C0E29]">Delivery Notes</label>
                <Textarea
                  name="deliveryNotes"
                  placeholder="e.g. Call on arrival, leave at reception, etc."
                  value={form.deliveryNotes}
                  onChange={handleChange}
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent resize-none touch-manipulation"
                />
                <p className="text-xs text-gray-500">{form.deliveryNotes.length}/1000 characters</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0C0E29]">Preferred Delivery Time</label>
                <Input
                  name="preferredTime"
                  type="text"
                  placeholder="e.g. 10:00 AM - 12:00 PM"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] px-6 py-3 sm:px-8 font-semibold text-base touch-manipulation"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold text-base sm:text-lg py-4 sm:py-5 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}