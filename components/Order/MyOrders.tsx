"use client"

import Layout from '../Layout';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateOrder from './CreateOrder';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, Eye, Truck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOrderFlow, setShowOrderFlow] = useState(false);

  // Mock order creation handler
  const handleCreateOrder = (orderData: any) => {
    setOrders(prev => [
      {
        ...orderData,
        id: Math.random().toString(36).slice(2, 10),
        created_at: new Date().toISOString(),
        order_status: 'created',
        quotation: orderData.quotation || 150,
        pickup_city: 'Cape Town',
        pickup_postal_code: '8000',
        dropoff_city: 'Cape Town',
        dropoff_postal_code: '8000',
        tracking_updates: [],
      },
      ...prev
    ]);
    setShowSuccess(true);
    setTab('orders');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'created':
        return 'Order Created';
      case 'assigned':
        return 'Driver Assigned';
      case 'picked_up':
        return 'Package Picked Up';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
        <p className="text-gray-500 mb-6">Track and manage your delivery orders</p>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't placed any orders yet. Create your first delivery order to get started.
              </p>
              <Button onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">
                Create New Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 mb-8">
            {orders.map((order: any) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.order_status || 'created')}>
                        {getStatusLabel(order.order_status || 'created')}
                      </Badge>
                      <p className="text-lg font-semibold mt-1">R{order.quotation?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* ...existing order details... */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Button onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black mb-8">
          Create New Order
        </Button>
      </div>
    </Layout>
  );
};

export default MyOrders;
