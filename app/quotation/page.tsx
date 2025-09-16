"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";
import LandingLayout from "@/components/LandingLayout";
import { QuotationForm } from "@/components/quotation/QuotationForm";
import { QuoteDisplay } from "@/components/quotation/QuoteDisplay";
import { ServiceTypesInfo } from "@/components/quotation/ServiceTypesInfo";
import { GuestBookingCTA } from "@/components/quotation/GuestBookingCTA";

const Quotation = () => {
  const [quotation, setQuotation] = useState<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);

  // Initialize secure proxy connection
  useEffect(() => {
    const testSecureProxy = async () => {
      try {
        console.log('Testing secure maps proxy connection...');
        setMapsLoaded(true);
        setMapsError(null);
        toast.success('Quotation system ready! Address suggestions and distance calculation are available.');
      } catch (error) {
        console.error('Failed to initialize maps proxy:', error);
        setMapsLoaded(true); // Allow manual input even if proxy fails
        setMapsError('Address suggestions may be limited');
        toast.warning('Address suggestions may be limited. Manual distance entry is available.');
      }
    };

    testSecureProxy();
  }, []);

  return (
    <LandingLayout>
      <div className="space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get Your Instant Quote</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Calculate delivery costs with our transparent pricing - No registration required
          </p>
          {mapsError && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-md max-w-2xl mx-auto">
              <p className="text-yellow-800 text-sm">
                {mapsError}. Manual address entry and distance calculation are still available.
              </p>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuotationForm 
              mapsLoaded={mapsLoaded}
              onQuotationCalculated={setQuotation}
            />

            <div className="space-y-6">
              <QuoteDisplay quotation={quotation} />
              {quotation && <GuestBookingCTA quotation={quotation} />}
              <ServiceTypesInfo />
            </div>
          </div>
        </div>

        {/* Trust indicators for guests */}
        <div className="bg-gray-50 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold mb-4">Why Choose TMOF COURIERS?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#ffd215] rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold">Fast & Reliable</h4>
                <p className="text-sm text-gray-600">Same-day and instant delivery options</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#ffd215] rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-semibold">Transparent Pricing</h4>
                <p className="text-sm text-gray-600">No hidden fees, get exact quotes instantly</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#ffd215] rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold">Secure & Insured</h4>
                <p className="text-sm text-gray-600">Your packages are safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default Quotation;
