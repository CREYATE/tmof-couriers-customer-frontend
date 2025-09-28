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
    <div className="pt-16"> {/* Add top padding for fixed header */}
      <div className="md:ml-56 min-h-screen"> {/* Add left margin for fixed sidebar */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <Card className="w-full max-w-2xl border-2 border-[#ffd215] shadow-lg">
            <CardContent className="p-8 text-center">
          {/* Under Construction GIF */}
          <div className="mb-6">
            <Image
              src="/under-construction.gif"
              alt="Under Construction"
              width={200}
              height={150}
              className="mx-auto rounded-lg shadow-md"
              unoptimized
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wallet2 className="h-10 w-10 text-[#ffd215]" />
              <h1 className="text-3xl font-bold text-gray-800">TMOF Wallet Service</h1>
            </div>
            <p className="text-xl text-gray-600">Coming Soon!</p>
          </div>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              We're working hard to bring you an amazing digital wallet experience that will transform how you pay for your shipments.
            </p>
            
            <div className="bg-[#ffd215]/10 p-4 rounded-lg border border-[#ffd215]/20">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#ffd215]" />
                What to Expect:
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-[#ffd215] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Easy Top-ups:</span>
                    <span className="text-gray-600"> Load money into your wallet using multiple payment methods</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#ffd215] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Instant Payments:</span>
                    <span className="text-gray-600"> Pay for shipments instantly without entering card details every time</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#ffd215] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Secure & Safe:</span>
                    <span className="text-gray-600"> Bank-level security to protect your funds and transactions</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              For now, you can continue using direct payment methods for your shipment orders. 
              We'll notify you as soon as the wallet service is ready!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex items-center gap-2 border-[#ffd215] text-[#ffd215] hover:bg-[#ffd215] hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button
              onClick={() => router.push("/orders/create/order-type")}
              className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold flex items-center gap-2"
            >
              <Wallet2 className="h-4 w-4" />
              Create Order Instead
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact our support team and we'll keep you updated on the wallet service launch.
            </p>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletUnderConstructionPage;