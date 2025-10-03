"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from 'axios';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'cancelled'>('verifying');
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    // Handle cancellation
    if (searchParams.get('cancelled') === 'true') {
      setStatus('cancelled');
      return;
    }

    // Verify payment
    const verifyPayment = async () => {
      try {
        const paymentReference = reference || trxref;
        if (!paymentReference) {
          throw new Error('No payment reference found');
        }

        // Get stored order data from sessionStorage (we'll need to store this during payment initialization)
        const storedOrderData = sessionStorage.getItem('pendingOrderData');
        if (!storedOrderData) {
          throw new Error('Order data not found');
        }

        const orderRequest = JSON.parse(storedOrderData);
        
        const verifyResponse = await axios.post('/api/orders/verify-payment', {
          paystackVerifyRequest: { reference: paymentReference },
          orderRequest,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });

        if (verifyResponse.data.error) {
          throw new Error(verifyResponse.data.error);
        }

        setOrderData(verifyResponse.data);
        setStatus('success');
        
        // Clear stored order data
        sessionStorage.removeItem('pendingOrderData');
        
        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
          router.push(`/orders/create/confirmation?trackingNumber=${encodeURIComponent(verifyResponse.data.trackingNumber || '')}`);
        }, 2000);

      } catch (error: any) {
        // console.error('Payment verification error:', error);
        setError(error.message || 'Payment verification failed');
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  const handleRetryPayment = () => {
    router.back(); // Go back to payment page
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="h-16 w-16 text-[#ffd215] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your order has been created successfully. You will be redirected to the confirmation page.
            </p>
            {orderData?.trackingNumber && (
              <p className="text-sm text-gray-500 mb-4">
                Tracking Number: <span className="font-mono font-bold">{orderData.trackingNumber}</span>
              </p>
            )}
            <Button 
              onClick={() => router.push('/orders/create/confirmation')}
              className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
            >
              Continue to Confirmation
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              {error || 'We could not process your payment. Please try again.'}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleRetryPayment}
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

        {status === 'cancelled' && (
          <>
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-orange-700 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-4">
              You cancelled the payment. No charges were made to your account.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleRetryPayment}
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}