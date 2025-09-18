"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, Truck } from "lucide-react";
import axios from "axios";

interface Order {
  id: number;
  trackingNumber: string;
  distance: number;
  price: number;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  deliveryNotes?: string;
  preferredTime?: string;
  serviceType: string;
  createdAt: string;
  customerName?: string;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-600 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    case "IN_TRANSIT":
      return "bg-orange-500 text-white";
    case "AWAITING_COLLECTION":
    case "PAID":
      return "bg-yellow-500 text-black";
    case "COLLECTED":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "AWAITING_COLLECTION":
    case "PAID":
      return "Awaiting Collection";
    case "COLLECTED":
      return "Collected";
    case "IN_TRANSIT":
      return "In Transit";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const AllOrders: React.FC = () => {
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [oldOrders, setOldOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        console.log("JWT for order history:", jwt);
        if (!jwt) {
          throw new Error("No JWT found. Please log in.");
        }
        const response = await axios.get("/api/orders/history", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Order history response:", response.data);
        const orders: Order[] = response.data;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recent = orders.filter(
          (order) => new Date(order.createdAt) >= sevenDaysAgo
        );
        const old = orders.filter(
          (order) => new Date(order.createdAt) < sevenDaysAgo
        );
        console.log("Recent orders:", recent);
        console.log("Old orders:", old);
        setRecentOrders(recent);
        setOldOrders(old);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    router.push(`/orders/track-parcel?trackingNumber=${trackingNumber}`);
  };

  const renderOrders = (orders: Order[], title: string) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {title.toLowerCase()}</h3>
            <p className="text-gray-500 text-center mb-6">
              No {title.toLowerCase()} found. Create a new order to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="card-hover cursor-pointer" onClick={() => handleOrderClick(order)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{order.customerName || "Customer"}</h3>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-gray-300">
                  <div className="flex items-center mb-2">
                    <Package className="h-4 w-4 mr-2 text-[#ffd215]" />
                    <span>{order.trackingNumber}</span>
                  </div>
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-[#ffd215] mt-0.5" />
                    <div>
                      <p className="font-medium text-white">From</p>
                      <p className="text-xs">{order.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-[#ffd215] mt-0.5" />
                    <div>
                      <p className="font-medium text-white">To</p>
                      <p className="text-xs">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-[#ffd215]" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <Button
          type="button"
          onClick={() => router.push("/orders/create/order-type")}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2"
        >
          <Package className="h-5 w-5 text-black" />
          Create New Order
        </Button>
      </div>
      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {renderOrders(recentOrders, "Recent Orders")}
          {renderOrders(oldOrders, "Older Orders")}
        </>
      )}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#0C0E29] rounded-lg shadow-lg w-full max-w-md p-8 relative"
            style={{ backgroundColor: "#0C0E29", opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={handleCloseModal}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Order Details</h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{selectedOrder.customerName || "Customer"}</span>
                <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <Package className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                <span>{selectedOrder.trackingNumber}</span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <MapPin className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                <span>From: {selectedOrder.pickupAddress}</span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <MapPin className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                <span>To: {selectedOrder.deliveryAddress}</span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <Clock className="h-4 w-4 mr-2 inline text-[#ffd215]" />
                <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-white">Total:</span> R{selectedOrder.price}
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-white">Recipient:</span> {selectedOrder.recipientName} ({selectedOrder.recipientPhone})
              </div>
              <div className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-white">Service Type:</span> {selectedOrder.serviceType}
              </div>
            </div>
            {selectedOrder.status === "IN_TRANSIT" && (
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  onClick={() => alert("Reschedule logic here")}
                >
                  Reschedule
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  onClick={() => alert("Cancel logic here")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1"
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}
                >
                  <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                </Button>
              </div>
            )}
            {["AWAITING_COLLECTION", "PAID", "COLLECTED"].includes(selectedOrder.status) && (
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1"
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}
                >
                  <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;