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
    <div className="space-y-6 min-h-screen p-8">
      <TmofSpinner show={loading} />
      <div className="flex items-center justify-between mb-6">
        <Button
          type="button"
          onClick={() => router.push('/orders/all')}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2"
        >
          My Orders
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 text-center mb-6">
          You haven't placed any orders yet. Create your first delivery order to get started.
        </p>
        <Button type="button" onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2 mt-4">
          <Package className="h-5 w-5 text-black" />
          Create New Order
        </Button>
      </div>
    </div>
  );
};

export default MyOrders;

