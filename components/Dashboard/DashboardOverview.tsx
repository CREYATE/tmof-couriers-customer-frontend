"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Truck, Clock, Wallet2 } from "lucide-react";
import Stats from "./Stats";
import ShipmentCard from "./ShipmentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { useRouter } from "next/navigation";
import axios from "axios";
// Remove: import SockJS from "sockjs-client";  // No longer needed
import toast, { Toaster } from "react-hot-toast";
// Add: Import your WS helpers
import { initializeWebSocket, subscribeToTopic, disconnectWebSocket, Client } from "@/lib/websocket";

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

interface ShipmentStats {
  awaiting_collection: number;
  collected: number;
  in_transit: number;
  delivered: number;
}

const getShipmentStats = (orders: Order[]): ShipmentStats => {
  return {
    awaiting_collection: orders.filter(
      (order) => order.status === "AWAITING_COLLECTION" || order.status === "PAID"
    ).length,
    collected: orders.filter((order) => order.status === "COLLECTED").length,
    in_transit: orders.filter((order) => order.status === "IN_TRANSIT").length,
    delivered: orders.filter((order) => order.status === "DELIVERED").length,
  };
};

const DashboardOverview: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);
  // Change: Use ref for the shared client from your helper
  const stompClientRef = useRef<Client | null>(null);
  // Add: Track subscriptions for cleanup
  const subscriptionsRef = useRef<Map<string, any>>(new Map());  // Keyed by trackingNumber

  const handleWalletLearnMore = () => {
    setWalletLoading(true);
    // Simulate loading time for navigation
    setTimeout(() => {
      router.push("/dashboard/wallet/under-construction");
      setWalletLoading(false);
    }, 800);
  };

  const handleViewAllShipments = () => {
    setShipmentsLoading(true);
    // Simulate loading time for navigation
    setTimeout(() => {
      router.push("/orders/all");
      setShipmentsLoading(false);
    }, 800);
  };

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
          throw new Error("No JWT found. Please log in.");
        }
        const response = await axios.get("/api/orders/history", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Dashboard orders response:", response.data);
        const fetchedOrders: Order[] = response.data;
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        const errorMessage = err.response?.status === 403
          ? "Access denied. Please log in again."
          : err.response?.data?.error || err.message || "Failed to fetch orders";
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      }
    };

    fetchOrders();

    // Cleanup WS on unmount
    return () => {
      if (stompClientRef.current) {
        disconnectWebSocket();  // Use your helper
        stompClientRef.current = null;
      }
      subscriptionsRef.current.clear();
    };
  }, []);

  // New useEffect: Initialize WS once on mount, subscribe when orders load
  useEffect(() => {
    // Initialize client (handles auth via localStorage in your helper)
    stompClientRef.current = initializeWebSocket();

    // Cleanup function for this effect
    return () => {
      if (stompClientRef.current) {
        disconnectWebSocket();
        stompClientRef.current = null;
      }
    };
  }, []);  // Run once on mount, not dependent on orders

  // New useEffect: Subscribe to order updates when orders change
  useEffect(() => {
    if (!stompClientRef.current || orders.length === 0) return;

    const client = stompClientRef.current;

    // Unsubscribe from old ones first
    subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    subscriptionsRef.current.clear();

    // Subscribe to each order's topic
    orders.forEach((order) => {
      const topic = `/topic/order/${order.trackingNumber}`;
      const subscription = subscribeToTopic(client, topic, (message) => {
        const update = JSON.parse(message.body);
        console.log("WebSocket update received:", update);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.trackingNumber === order.trackingNumber ? { ...o, status: update.status } : o
          )
        );
      });
      subscriptionsRef.current.set(order.trackingNumber, subscription);
    });

    // Cleanup on unmount or orders change
    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current.clear();
    };
  }, [orders]);  // Depend on orders array (stable reference via useState)

  const shipmentStats = getShipmentStats(orders);
  const totalOrders = orders.length;

  const stats = [
    {
      title: "Total Shipments",
      value: totalOrders,
      changeValue: "0%",
      changeDirection: "neutral" as const,
      // description: "vs yesterday",
      icon: <Package className="h-5 w-5 text-[#ffd215]" />,
    },
    {
      title: "Awaiting Collection",
      value: shipmentStats.awaiting_collection,
      changeValue: "0%",
      changeDirection: "neutral" as const,
      // description: "vs yesterday",
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
    },
    {
      title: "In Transit",
      value: shipmentStats.in_transit,
      changeValue: "0%",
      changeDirection: "neutral" as const,
      // description: "vs yesterday",
      icon: <Truck className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Delivered",
      value: shipmentStats.delivered,
      changeValue: "0%",
      changeDirection: "neutral" as const,
      // description: "vs yesterday",
      icon: <Truck className="h-5 w-5 text-green-600" />,
    },
  ];

  const recentAwaitingCollection = orders
    .filter((order) => order.status === "AWAITING_COLLECTION" || order.status === "PAID")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1);

  return (
    <div className="pt-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      <Toaster position="top-right" />
      <TmofSpinner show={loading} />
      <TmofSpinner show={walletLoading} />
      <TmofSpinner show={shipmentsLoading} />
      
      {/* Dashboard Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your shipments.</p>
        </div>
      </div>

      {error ? (
        <Card className="border border-red-200">
          <CardContent className="flex justify-center py-12">
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      ) : !loading ? (
        <>
          {/* Stats Section - Mobile Optimized */}
          <Stats stats={stats} />

          {/* Wallet Section - Mobile Optimized */}
          <Card className="border border-[#ffd215] bg-gradient-to-r from-[#ffd215]/5 to-[#ffd215]/10 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Wallet2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffd215]" />
                TMOF Wallet Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Digital Payment Solution</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Load money to your wallet for seamless payments
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-sm text-amber-600 font-medium">
                      ● Coming Soon
                    </span>
                    <span className="text-xs text-gray-500">
                      Enhanced payment experience
                    </span>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Button
                    className="w-full sm:w-auto bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold px-6 py-2 text-sm sm:text-base touch-manipulation"
                    onClick={handleWalletLearnMore}
                    disabled={walletLoading}
                  >
                    {walletLoading ? "Loading..." : "Learn More"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Shipments & Status - Mobile Optimized */}
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            {/* Recent Shipments Card */}
            <div className="flex-1">
              <Card className="h-full shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Recent Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAwaitingCollection.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No recent shipments awaiting collection.</p>
                    ) : (
                      recentAwaitingCollection.map((shipment) => (
                        <Card key={shipment.id} className="hover:shadow-lg cursor-pointer transition-all duration-200 border border-gray-200 bg-white touch-manipulation">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate mr-2">{shipment.customerName || "Customer"}</h3>
                              <Badge className={`${getStatusBadgeColor(shipment.status)} text-xs sm:text-sm px-2 py-1 rounded-full`}>
                                {getStatusLabel(shipment.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">Tracking:</span>
                                  <span className="text-xs sm:text-sm text-gray-900 font-mono">#{shipment.trackingNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                  <span className="text-xs sm:text-sm text-gray-600 truncate">{shipment.pickupAddress}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">Service:</span>
                                  <span className="text-xs sm:text-sm text-gray-900">{shipment.serviceType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                  <span className="text-xs sm:text-sm text-gray-600 truncate">{shipment.deliveryAddress}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {new Date(shipment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="text-sm sm:text-base font-bold text-[#0C0E29]">
                                R{shipment.price.toFixed(2)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                  <div className="text-center mt-6">
                    <Button
                      variant="default"
                      className="w-full sm:w-auto bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold px-8 py-2 touch-manipulation"
                      onClick={handleViewAllShipments}
                      disabled={shipmentsLoading}
                    >
                      {shipmentsLoading ? "Loading..." : "View all shipments"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipment Status Summary Card */}
            <div className="flex flex-col xl:w-80">
              <Card className="flex-1 h-full shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Shipment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-3 py-3 rounded-lg bg-yellow-50">
                      <span className="text-sm font-medium text-gray-700">Awaiting Collection</span>
                      <span className="text-lg font-bold text-yellow-700">{shipmentStats.awaiting_collection}</span>
                    </div>
                    <div className="flex justify-between items-center px-3 py-3 rounded-lg bg-blue-50">
                      <span className="text-sm font-medium text-gray-700">Collected</span>
                      <span className="text-lg font-bold text-blue-700">{shipmentStats.collected}</span>
                    </div>
                    <div className="flex justify-between items-center px-3 py-3 rounded-lg bg-orange-50">
                      <span className="text-sm font-medium text-gray-700">In Transit</span>
                      <span className="text-lg font-bold text-orange-700">{shipmentStats.in_transit}</span>
                    </div>
                    <div className="flex justify-between items-center px-3 py-3 rounded-lg bg-green-50">
                      <span className="text-sm font-medium text-gray-700">Delivered</span>
                      <span className="text-lg font-bold text-green-700">{shipmentStats.delivered}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DashboardOverview;