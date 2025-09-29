// components/Order/PaymentStep.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { payWithPaystack } from '@/integrations/paystack';
import axios from 'axios';
import { walletService, Wallet } from '@/lib/walletService';

interface PaymentStepProps {
  orderData: any;
  onNext: (data: any) => void;
}

export default function PaymentStep({ orderData, onNext }: PaymentStepProps) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(true);

  useEffect(() => {
    loadWalletBalance();
  }, []);

  const loadWalletBalance = async () => {
    try {
      const walletData = await walletService.getWalletBalance();
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const mapServiceType = (serviceType: string) => {
    switch (serviceType) {
      case 'Standard Delivery': return 'STANDARD';
      case 'Same-Day Delivery': return 'SAME_DAY';
      case 'Swift Errand': return 'SWIFT_ERRAND';
      case 'Furniture Moving': return 'FURNITURE_MOVING';
      default: return serviceType;
    }
  };

  const handleWalletPayment = async () => {
    if (!orderData.price) {
      setError('Price is missing. Please go back and recalculate the estimate.');
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
        useWallet: true,
      };

      console.log('Processing wallet payment:', mappedOrderData);
      const initResponse = await axios.post('/api/orders/initialize-payment', mappedOrderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });

      if (initResponse.data.error) {
        throw new Error(initResponse.data.error);
      }

      // For wallet payments, we can proceed directly since payment is instant
      const verifyResponse = await axios.post('/api/orders/verify-payment', {
        paystackVerifyRequest: { reference: initResponse.data.reference },
        orderRequest: mappedOrderData,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });

      if (verifyResponse.data.error) {
        throw new Error(verifyResponse.data.error);
      }

      console.log('Wallet payment successful:', verifyResponse.data);
      onNext(verifyResponse.data);
      
      // Refresh wallet balance
      await loadWalletBalance();

    } catch (error: any) {
      setError(error.response?.data?.error || 'Wallet payment failed. Please try again or use Paystack.');
      console.error('Wallet payment error:', error);
      setRedirecting(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!orderData.price) {
      setError('Price is missing. Please go back and recalculate the estimate.');
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
        useWallet: false,
      };

      console.log('Processing Paystack payment:', mappedOrderData);
      const initResponse = await axios.post('/api/orders/initialize-payment', mappedOrderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });

      if (initResponse.data.error) {
        throw new Error(initResponse.data.error);
      }

      const { authorizationUrl, reference } = initResponse.data;

      payWithPaystack({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_missing',
        email: orderData.recipientEmail || localStorage.getItem('userEmail') || 'customer@example.com',
        amount: orderData.price * 100,
        currency: 'ZAR',
        ref: reference,
        onSuccess: async (paystackResponse) => {
          try {
            console.log('Paystack success:', paystackResponse);
            const verifyResponse = await axios.post('/api/orders/verify-payment', {
              paystackVerifyRequest: { reference },
              orderRequest: mappedOrderData,
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            });

            if (verifyResponse.data.error) {
              throw new Error(verifyResponse.data.error);
            }

            console.log('Order placed:', verifyResponse.data);
            onNext(verifyResponse.data);
          } catch (verifyError: any) {
            setError(verifyError.response?.data?.error || 'Payment verification failed.');
            console.error('Verification error:', verifyError);
            setRedirecting(false);
          }
        },
        onClose: () => {
          setRedirecting(false);
          setError('Payment cancelled. You can try again.');
        },
      });

    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to initialize payment.');
      console.error('Payment init error:', error);
      setRedirecting(false);
    }
  };

  const canUseWallet = wallet?.isActive && wallet.balance >= orderData.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen">
        <Card className="p-6">
          <TmofSpinner show={redirecting || loadingWallet} />
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Wallet Balance Display */}
      {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <p className="text-2xl font-bold text-green-700">
              R{wallet ? wallet.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) : '0.00'}
            </p>
            <p className={`text-xs ${wallet?.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {wallet?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          {canUseWallet && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Amount</p>
              <p className="text-lg font-semibold">R{orderData.price?.toFixed(2)}</p>
              <p className="text-xs text-green-600">
                Balance after: R{(wallet.balance - orderData.price).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div> */}

      {/* Payment Options */}
      <div className="space-y-4">
        {/* Wallet Payment Option - Coming Soon */}
        <div className="border-2 rounded-lg p-4 border-gray-200 bg-gray-50 opacity-60">
          <label className="flex items-center space-x-3 cursor-not-allowed">
            <input
              type="radio"
              name="paymentMethod"
              checked={false}
              disabled={true}
              className="h-4 w-4 text-gray-400 focus:ring-gray-400 cursor-not-allowed"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500">Pay with Wallet</span>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Instant payment using your wallet balance - Available soon!
              </p>
            </div>
          </label>
        </div>

        {/* Paystack Payment Option */}
        <div className="border-2 rounded-lg p-4 border-[#ffd215] bg-[#ffd215]/10">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              checked={true}
              onChange={() => setUseWallet(false)}
              className="h-4 w-4 text-[#ffd215] focus:ring-[#ffd215]"
            />
            <div>
              <span className="font-medium">Pay with Paystack</span>
              <p className="text-sm text-gray-600">
                Secure payment via credit/debit card
              </p>
            </div>
          </label>
        </div>

        {/* Payment and Back Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="bg-[#ffd215] hover:bg-[#e5bd13] px-6 py-3 sm:px-8 font-semibold text-base touch-manipulation"
          >
            Back
          </Button>
          <Button
            onClick={handlePaystackPayment}
            disabled={redirecting || !orderData.price}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black px-6 py-3 sm:px-8 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
          >
            {redirecting ? 'Processing Payment...' : 'Pay with Paystack'}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-2">
          You will be redirected to Paystack's secure payment gateway.
        </p>
      </div>
        </Card>
      </div>
    </div>
  );
}