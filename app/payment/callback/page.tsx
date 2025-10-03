"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'cancelled' | 'failed'>('success');

  useEffect(() => {
    // Check URL parameters to determine payment status
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const cancelled = searchParams.get('cancelled');
    
    if (cancelled === 'true' || !reference) {
      setStatus('cancelled');
    } else {
      setStatus('success');
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (status === 'success') {
      // Redirect to dashboard or order confirmation
      router.push('/dashboard');
    } else {
      // Go back to try payment again
      router.back();
    }
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">Payment Completed!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed. Please check your order status in the dashboard.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {status === 'cancelled' && (
          <>
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-orange-700 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-4">
              You cancelled the payment. No charges were made to your account.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              There was an issue processing your payment. Please try again.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentCallbackContent />
    </React.Suspense>
  );
}