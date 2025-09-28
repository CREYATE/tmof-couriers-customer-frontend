"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Truck, Clock, Wallet2 } from "lucide-react";
// import { Package, Truck, Clock, Wallet2 } from "lucide-react";
import Stats from "./Stats";
import ShipmentCard from "./ShipmentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import { walletService, Wallet } from "@/lib/walletService";
import toast, { Toaster } from "react-hot-toast";

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
  // const [wallet, setWallet] = useState<Wallet | null>(null);
  // const [loadingWallet, setLoadingWallet] = useState(true);
  // const [togglingWallet, setTogglingWallet] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

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

    // const loadWalletData = async () => {
    //   try {
    //     const walletData = await walletService.getWalletBalance();
    //     setWallet(walletData);
    //   } catch (error: any) {
    //     console.error("Failed to load wallet data:", error);
    //     toast.error(error.message || "Failed to load wallet data");
    //   } finally {
    //     setLoadingWallet(false);
    //   }
    // };

    fetchOrders();
    // loadWalletData();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket disconnected");
      }
    };
  }, []);

  // useEffect(() => {
  //   if (wallet && wallet.userId) {
  //     setupWebSocket(wallet.userId);
  //   }
  // }, [wallet]);

  useEffect(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.deactivate();
    }
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket reconnected for new orders");
        orders.forEach((order) => {
          client.subscribe(`/topic/order/${order.trackingNumber}`, (message) => {
            const update = JSON.parse(message.body);
            console.log("WebSocket update received:", update);
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.trackingNumber === order.trackingNumber ? { ...o, status: update.status } : o
              )
            );
          });
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
      },
      onWebSocketClose: () => {
        console.log("WebSocket disconnected");
      },
    });
    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket disconnected");
      }
    };
  }, [orders.length]);

  // const setupWebSocket = (userId: number) => {
  //   if (stompClientRef.current) {
  //     stompClientRef.current.deactivate();
  //   }

  //   const socket = new SockJS("http://localhost:8080/ws");
  //   const client = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //     onConnect: () => {
  //       console.log("WebSocket connected for wallet updates in dashboard");
  //       client.subscribe(`/topic/wallet/update/${userId}`, (message) => {
  //         const updatedWallet: Wallet = JSON.parse(message.body);
  //         console.log("WebSocket wallet update received in dashboard:", updatedWallet);
  //         setWallet(updatedWallet);
  //       });
  //     },
  //     onStompError: (frame) => {
  //       console.error("WebSocket error:", frame);
  //     },
  //     onWebSocketClose: () => {
  //       console.log("WebSocket disconnected");
  //     },
  //   });
  //   client.activate();
  //   stompClientRef.current = client;
  // };

  // const handleToggleWallet = async () => {
  //   if (!wallet) return;
  //   setTogglingWallet(true);
  //   try {
  //     const updatedWallet = await walletService.toggleWalletStatus(!wallet.isActive);
  //     setWallet(updatedWallet);
  //     toast.success(
  //       updatedWallet.isActive
  //         ? "Wallet activated successfully! Check your email for confirmation."
  //         : "Wallet deactivated successfully."
  //     );
  //   } catch (error: any) {
  //     console.error("Failed to toggle wallet status:", error);
  //     toast.error(error.message || "Failed to toggle wallet status");
  //   } finally {
  //     setTogglingWallet(false);
  //   }
  // };

  const shipmentStats = getShipmentStats(orders);

  const stats = [
    {
      title: "Wallet Balance",
      value: "R0.00",
      changeValue: "Inactive",
      changeDirection: "down" as const,
      description: "wallet disabled",
      icon: <Wallet2 className="h-4 w-4 text-courier-600" />,
    },
    // {
    //   title: "Wallet Balance",
    //   value: `R${wallet ? wallet.balance.toLocaleString("en-ZA", { minimumFractionDigits: 2 }) : "0.00"}`,
    //   changeValue: wallet?.isActive ? "Active" : "Inactive",
    //   changeDirection: wallet?.isActive ? ("up" as const) : ("down" as const),
    //   description: wallet?.isActive ? "available funds" : "wallet disabled",
    //   icon: <Wallet2 className="h-4 w-4 text-courier-600" />,
    // },
    {
      title: "Total Shipments",
      value: orders.length,
      changeValue: "+12%",
      changeDirection: "up" as const,
      description: "vs last month",
      icon: <Package className="h-4 w-4 text-courier-600" />,
    },
    {
      title: "Awaiting Collection",
      value: shipmentStats.awaiting_collection,
      changeValue: "+5%",
      changeDirection: "up" as const,
      description: "vs last week",
      icon: <Clock className="h-4 w-4 text-courier-600" />,
    },
    {
      title: "In Transit",
      value: shipmentStats.in_transit,
      changeValue: "0%",
      changeDirection: "neutral" as const,
      description: "vs yesterday",
      icon: <Truck className="h-4 w-4 text-courier-600" />,
    },
  ];

  const recentAwaitingCollection = orders
    .filter((order) => order.status === "AWAITING_COLLECTION" || order.status === "PAID")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1);

  return (
    <div className="pt-0 p-8 space-y-8">
      <Toaster position="top-right" />
      <TmofSpinner show={loading} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div>
          {/* <Button
            onClick={() => router.push("/orders/create/delivery")}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2"
          >
            <Package className="h-5 w-5" />
            Create Order
          </Button> */}
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="flex justify-center py-12">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : !loading ? (
        <>
          <Stats stats={stats} />

          {/* NEW WALLET SECTION - Routes to Under Construction */}
          <Card className="border border-[#ffd215] bg-gradient-to-r from-[#ffd215]/5 to-[#ffd215]/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Wallet2 className="h-6 w-6 text-[#ffd215]" />
                TMOF Wallet Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Digital Payment Solution</p>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Load money to your wallet for seamless payments
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-amber-600">
                      ● Coming Soon
                    </span>
                    <span className="text-xs text-gray-500">
                      Enhanced payment experience
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold px-6"
                    onClick={() => router.push("/dashboard/wallet/under-construction")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WALLET SECTION COMMENTED OUT */}
          {/* 
          <Card className="border border-[#ffd215] bg-gradient-to-r from-[#ffd215]/5 to-[#ffd215]/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Wallet2 className="h-6 w-6 text-[#ffd215]" />
                My Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R{wallet ? wallet.balance.toLocaleString("en-ZA", { minimumFractionDigits: 2 }) : "0.00"}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-sm ${wallet?.isActive ? "text-green-600" : "text-red-600"}`}>
                      {wallet?.isActive ? "● Active" : "● Inactive"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Last updated: Just now
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold px-6"
                    onClick={() => router.push("/wallet")}
                  >
                    Manage Wallet
                  </Button>
                  <Button
                    variant={wallet?.isActive ? "destructive" : "default"}
                    className={
                      wallet?.isActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                    onClick={handleToggleWallet}
                    disabled={togglingWallet || !wallet}
                  >
                    {togglingWallet ? (
                      <TmofSpinner show={true} />
                    ) : wallet?.isActive ? (
                      "Deactivate Wallet"
                    ) : (
                      "Activate Wallet"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 flex flex-col h-full">
              <Card className="flex flex-col flex-1 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Shipments (Awaiting Collection)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-4 flex-1">
                    {recentAwaitingCollection.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No orders awaiting collection.</p>
                    ) : (
                      recentAwaitingCollection.map((shipment) => (
                        <Card key={shipment.id} className="p-4 hover:shadow-md transition-shadow duration-200 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg text-gray-900">
                                  Order #{shipment.trackingNumber}
                                </h4>
                                <Badge className={getStatusBadgeColor(shipment.status)}>
                                  {getStatusLabel(shipment.status)}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                  <Package className="h-4 w-4 text-[#ffd215] mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium text-gray-900">From: </span>
                                    <span>{shipment.pickupAddress}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Truck className="h-4 w-4 text-[#ffd215] mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium text-gray-900">To: </span>
                                    <span>{shipment.deliveryAddress}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#ffd215] flex-shrink-0" />
                                  <div>
                                    <span className="font-medium text-gray-900">Created: </span>
                                    <span>{new Date(shipment.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      variant="default"
                      className="bg-[#ffd215] hover:bg-[#e5bd13] text-black"
                      onClick={() => router.push("/orders/all")}
                    >
                      View all shipments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col h-full">
              <Card className="flex-1 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Shipment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2 py-3">
                      <span>Awaiting Collection</span>
                      <span className="font-medium">{shipmentStats.awaiting_collection}</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-3">
                      <span>Collected</span>
                      <span className="font-medium">{shipmentStats.collected}</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-3">
                      <span>In Transit</span>
                      <span className="font-medium">{shipmentStats.in_transit}</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-3">
                      <span>Delivered</span>
                      <span className="font-medium">{shipmentStats.delivered}</span>
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