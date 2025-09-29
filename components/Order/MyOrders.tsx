"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import TmofSpinner from "@/components/ui/TmofSpinner";

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion since no actual data fetching yet
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <TmofSpinner show={loading} />
      
      {/* Mobile-Optimized Container */}
      <div className="min-h-screen">
        {/* Header with Orders Button */}
        <div className="flex items-center justify-between sm:justify-end pt-0 sm:pt-20">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0C0E29] sm:hidden"></h1>
          <Button
            type="button"
            onClick={() => router.push('/orders/all')}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-xl touch-manipulation"
          >
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
            My Orders
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-6 px-4">
          <Package className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">No orders yet</h3>
          <p className="text-gray-600 text-center max-w-md text-base sm:text-lg leading-relaxed">
            You haven't placed any orders yet. Create your first delivery order to get started.
          </p>
          <Button 
            type="button" 
            onClick={() => router.push('/orders/create/order-type')} 
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-3 mt-8 px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-xl touch-manipulation shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
            Create New Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

