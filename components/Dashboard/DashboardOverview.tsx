"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Truck, Clock } from "lucide-react";
import Stats from "./Stats";
import ShipmentCard from "./ShipmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Fetch orders
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
        setError(err.response?.data?.error || err.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchOrders();

    // Set up WebSocket
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        orders.forEach((order) => {
          client.subscribe(`/topic/order/${order.trackingNumber}`, (message) => {
            const update = JSON.parse(message.body);
            console.log("WebSocket update received:", update);
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.trackingNumber === order.trackingNumber
                  ? { ...o, status: update.status }
                  : o
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

    // Cleanup
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket disconnected");
      }
    };
  }, []);

  useEffect(() => {
    // Update subscriptions when orders change
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
                o.trackingNumber === order.trackingNumber
                  ? { ...o, status: update.status }
                  : o
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

  const shipmentStats = getShipmentStats(orders);

  const stats = [
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
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <TmofSpinner show={loading} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your courier management dashboard.</p>
        </div>
        <div>
          <Button
            onClick={() => router.push("/orders/create/delivery")}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2"
          >
            <Package className="h-5 w-5" />
            Create Order
          </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 flex flex-col h-full">
              <Card className="flex flex-col flex-1 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Shipments (Awaiting Collection)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-4 flex-1">
                    {recentAwaitingCollection.length === 0 ? (
                      <p className="text-gray-500 text-center">No orders awaiting collection.</p>
                    ) : (
                      recentAwaitingCollection.map((shipment) => (
                        <ShipmentCard key={shipment.id} shipment={shipment} />
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