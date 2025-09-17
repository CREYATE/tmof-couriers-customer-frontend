import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { payWithPaystack } from '@/integrations/paystack';
import axios from 'axios';

export default function PaymentStep({ orderData, onNext }: { orderData: any; onNext: (data: any) => void }) {
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');

  const mapServiceType = (serviceType: string) => {
    switch (serviceType) {
      case 'Standard Delivery': return 'STANDARD';
      case 'Same-Day Delivery': return 'SAME_DAY';
      case 'Swift Errand': return 'SWIFT_ERRAND';
      case 'Furniture Moving': return 'FURNITURE_MOVING';
      default: return serviceType;
    }
  };

  const handlePaystackPayment = async () => {
    if (!orderData.price) {
      setError('Price is missing. Please go back and recalculate the estimate.');
      console.error('PaymentStep - Missing price in orderData:', orderData);
      return;
    }
    setRedirecting(true);
    setError('');
    try {
      const mappedOrderData = {
        pickupAddress: orderData.pickupAddress,
        deliveryAddress: orderData.deliveryAddress,
        weight: orderData.weight,
        serviceType: mapServiceType(orderData.serviceType),
        description: orderData.description,
        recipientName: orderData.recipientName,
        recipientPhone: orderData.recipientPhone,
        recipientEmail: orderData.recipientEmail,
        deliveryNotes: orderData.deliveryNotes,
        preferredTime: orderData.preferredTime,
      };
      console.log('PaymentStep - Sending initialize-payment request:', mappedOrderData);
      const initResponse = await axios.post('/api/orders/initialize-payment', mappedOrderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      const { authorizationUrl, reference } = initResponse.data;

      if (initResponse.data.error) {
        throw new Error(initResponse.data.error);
      }

      payWithPaystack({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_missing',
        email: orderData.recipientEmail || localStorage.getItem('userEmail') || 'customer@example.com',
        amount: orderData.price * 100,
        currency: 'ZAR',
        ref: reference,
        onSuccess: async (paystackResponse) => {
          try {
            console.log('PaymentStep - Paystack success:', paystackResponse);
            const verifyResponse = await axios.post('/api/orders/verify-payment', {
              paystackVerifyRequest: { reference },
              orderRequest: mappedOrderData,
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            });
            if (verifyResponse.data.error) {
              throw new Error(verifyResponse.data.error);
            }
            console.log('PaymentStep - Order placed:', verifyResponse.data);
            onNext(verifyResponse.data);
          } catch (verifyError: any) {
            setError(verifyError.response?.data?.error || 'Payment verification failed. Please contact support.');
            console.error('PaymentStep - Verification error:', verifyError);
            setRedirecting(false);
          }
        },
        onClose: () => {
          setRedirecting(false);
          setError('Payment cancelled. You can try again.');
          console.log('PaymentStep - Paystack popup closed');
        },
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to initialize payment. Please try again or contact support.');
      console.error('PaymentStep - Payment init error:', error);
      setRedirecting(false);
    }
  };

  console.log('PaymentStep - Received orderData:', orderData);

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <TmofSpinner show={redirecting} />
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        <div className="bg-[#ffd215] rounded-lg p-4 text-black font-bold text-center mb-2">
          Paystack Payment
        </div>
        <div className="bg-gray-100 rounded-lg p-2 text-center text-gray-700 font-semibold mb-2">
          Amount to Pay: R{orderData.price ? orderData.price.toFixed(2) : 'N/A'}
        </div>
        <Button
          onClick={handlePaystackPayment}
          disabled={redirecting || !orderData.price}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full h-12 text-lg font-bold flex items-center justify-center"
        >
          {redirecting ? 'Redirecting to Paystack…' : 'Pay with Paystack'}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          You will be redirected to Paystack's secure payment gateway to complete your payment.
        </p>
      </div>
    </Card>
  );
}