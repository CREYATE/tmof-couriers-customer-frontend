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
    <div className="space-y-8 p-8 pt-4">
      <TmofSpinner show={loading} />
      
      {/* Header with Orders Button */}
      <div className="flex items-center justify-end mb-0 mt-20">
        <Button
          type="button"
          onClick={() => router.push('/orders/all')}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2"
        >
          My Orders
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <Package className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          You haven't placed any orders yet. Create your first delivery order to get started.
        </p>
        <Button type="button" onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2 mt-6">
          <Package className="h-5 w-5 text-black" />
          Create New Order
        </Button>
      </div>
    </div>
  );
};

export default MyOrders;

