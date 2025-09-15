"use client"

import React, { useState } from 'react';
import TmofSpinner from '@/components/ui/TmofSpinner';
import { useRouter } from 'next/navigation';
import CreateOrder from './CreateOrder';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, Eye, Truck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState('recent');
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'order001',
      customerName: 'John Doe',
      created_at: '2025-09-14T10:00:00Z',
      order_status: 'delivered',
      quotation: 200,
      pickup_address: '123 Main St',
      pickup_city: 'Johannesburg',
      pickup_postal_code: '2000',
      dropoff_address: '456 Oak Ave',
      dropoff_city: 'Pretoria',
      dropoff_postal_code: '0002',
      trackingNumber: 'TMof12345678',
    },
    {
      id: 'order002',
      customerName: 'Jane Smith',
      created_at: '2025-09-13T14:30:00Z',
      order_status: 'in_transit',
      quotation: 350,
      pickup_address: '789 Pine Rd',
      pickup_city: 'Ekurhuleni',
      pickup_postal_code: '1600',
      dropoff_address: '321 Maple St',
      dropoff_city: 'Tshwane',
      dropoff_postal_code: '0001',
      trackingNumber: 'TMof87654321',
    },
    {
      id: 'order003',
      customerName: 'Furniture Co.',
      created_at: '2025-09-12T09:15:00Z',
      order_status: 'cancelled',
      quotation: 500,
      pickup_address: '555 Warehouse',
      pickup_city: 'Sedibeng',
      pickup_postal_code: '1939',
      dropoff_address: '888 Delivery Ln',
      dropoff_city: 'West Rand',
      dropoff_postal_code: '1724',
      trackingNumber: 'TMof11223344',
    },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOrderFlow, setShowOrderFlow] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      case 'in_transit':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
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

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    setLoadingTrack(true);
    setTimeout(() => {
      setLoadingTrack(false);
      setShowOrderModal(false);
      router.push(`/orders/track-parcel?trackingNumber=${trackingNumber}`);
    }, 1500);
  };

  // Add tab switch loading
  const handleTabChange = (value: string) => {
    setLoadingTab(true);
    setTimeout(() => {
      setTab(value);
      setLoadingTab(false);
    }, 600);
  };

  return (
    <div className="space-y-6 min-h-screen p-8">
      <TmofSpinner show={loadingTrack || loadingTab || showSuccess} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <Button type="button" onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2">
          <Package className="h-5 w-5 text-black" />
          Create New Order
        </Button>
      </div>
  <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-10 flex border border-[#0C0E29] rounded-lg overflow-hidden">
          <TabsTrigger value="recent" className="flex-1 border-r border-[#0C0E29]">Recent Orders</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't placed any orders yet. Create your first delivery order to get started.
              </p>
              <Button type="button" onClick={() => router.push('/orders/create/order-type')} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2 mt-4">
                <Package className="h-5 w-5 text-black" />
                Create New Order
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-center mb-6">
                  You haven't placed any orders yet. Create your first delivery order to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 mb-8">
              {orders.map((order: any) => (
                <Card key={order.id} className="card-hover cursor-pointer" onClick={() => handleOrderClick(order)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{order.customerName || 'Customer'}</h3>
                      <Badge className={getStatusBadgeColor(order.order_status || 'created')}>
                        {getStatusLabel(order.order_status || 'created')}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-gray-300">
                      <div className="flex items-center mb-2">
                        <Package className="h-4 w-4 mr-2 text-[#ffd215]" />
                        <span>{order.trackingNumber || order.id}</span>
                      </div>
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-[#ffd215] mt-0.5" />
                        <div>
                          <p className="font-medium text-white">From</p>
                          <p className="text-xs">{order.pickup_address}</p>
                          <p className="text-xs">{order.pickup_city}, {order.pickup_postal_code}</p>
                        </div>
                      </div>
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-[#ffd215] mt-0.5" />
                        <div>
                          <p className="font-medium text-white">To</p>
                          <p className="text-xs">{order.dropoff_address}</p>
                          <p className="text-xs">{order.dropoff_city}, {order.dropoff_postal_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[#ffd215]" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Order Details Modal */}
          {showOrderModal && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-[#0C0E29] rounded-lg shadow-lg w-full max-w-md p-8 relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={handleCloseModal}>
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-white">Order Details</h2>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{selectedOrder.customerName}</span>
                    <Badge className={getStatusBadgeColor(selectedOrder.order_status)}>
                      {getStatusLabel(selectedOrder.order_status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <Package className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                    <span>{selectedOrder.trackingNumber || selectedOrder.id}</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                    <span>From: {selectedOrder.pickup_address}, {selectedOrder.pickup_city} {selectedOrder.pickup_postal_code}</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                    <span>To: {selectedOrder.dropoff_address}, {selectedOrder.dropoff_city} {selectedOrder.dropoff_postal_code}</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <Clock className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                    <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <span className="font-medium text-white">Total:</span> R{selectedOrder.quotation}
                  </div>
                </div>
                {/* Action buttons for in-transit orders */}
                {selectedOrder.order_status === 'in_transit' && (
                  <div className="flex gap-3 mt-4">
                    <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white flex-1" onClick={() => alert('Reschedule logic here')}>Reschedule</Button>
                    <Button type="button" className="bg-red-600 hover:bg-red-700 text-white flex-1" onClick={() => alert('Cancel logic here')}>Cancel</Button>
                    <Button type="button" className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1" onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}>
                      <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyOrders;
