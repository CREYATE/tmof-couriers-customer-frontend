"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet2, CreditCard, Zap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const WalletUnderConstructionPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile-first responsive container */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Main content card - no border, clean design */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            
            {/* Under Construction GIF */}
            <div className="text-center mb-8 sm:mb-10">
              <Image
                src="/under-construction.gif"
                alt="Under Construction"
                width={180}
                height={135}
                className="mx-auto rounded-xl shadow-lg mb-6 w-32 h-24 sm:w-44 sm:h-32 lg:w-48 lg:h-36 object-cover"
                unoptimized
              />
              
              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Wallet2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#ffd215]" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">TMOF Wallet Service</h1>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-[#ffd215] font-semibold">Coming Soon!</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center">
                We're working hard to bring you an amazing digital wallet experience that will transform how you pay for your shipments.
              </p>
              
              {/* Features section */}
              <div className="bg-gradient-to-r from-[#ffd215]/10 to-[#ffd215]/5 p-6 sm:p-8 rounded-2xl border border-[#ffd215]/20">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-6 flex items-center justify-center gap-3">
                  <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-[#ffd215]" />
                  What to Expect:
                </h3>
                
                <div className="grid gap-6 sm:gap-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#ffd215] p-2 rounded-full flex-shrink-0">
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base sm:text-lg text-gray-800 block mb-1">Easy Top-ups</span>
                      <span className="text-sm sm:text-base text-gray-600">Load money into your wallet using multiple payment methods</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#ffd215] p-2 rounded-full flex-shrink-0">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base sm:text-lg text-gray-800 block mb-1">Instant Payments</span>
                      <span className="text-sm sm:text-base text-gray-600">Pay for shipments instantly without entering card details every time</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#ffd215] p-2 rounded-full flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base sm:text-lg text-gray-800 block mb-1">Secure & Safe</span>
                      <span className="text-sm sm:text-base text-gray-600">Bank-level security to protect your funds and transactions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                <p className="text-sm sm:text-base text-gray-700 text-center">
                  <span className="font-semibold">Good news:</span> For now, you can continue using direct payment methods for your shipment orders. 
                  We'll notify you as soon as the wallet service is ready! 🎉
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="flex items-center gap-2 border-2 border-[#ffd215] text-[#ffd215] hover:bg-[#ffd215] hover:text-black font-semibold py-3 px-6 sm:px-8 text-base sm:text-lg rounded-xl transition-all duration-200 touch-manipulation"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                Back to Dashboard
              </Button>
              
              <Button
                onClick={() => router.push("/orders/create/order-type")}
                className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold flex items-center gap-2 py-3 px-6 sm:px-8 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
              >
                <Wallet2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Create Order Instead
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-500 text-center">
                Questions? Contact our support team and we'll keep you updated on the wallet service launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletUnderConstructionPage;