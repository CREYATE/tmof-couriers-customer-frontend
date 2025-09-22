"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, Home } from "lucide-react";
import TrackParcelMap from "@/components/Maps/GoogleMapComponent";
import { initializeWebSocket, subscribeToTopic, disconnectWebSocket } from "@/lib/websocket";
import axios from "axios";
import { Client } from "@stomp/stompjs";

interface OrderUpdateResponse {
  status: string;
  currentLocation?: string;
}

export default function TrackParcelPage() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("trackingNumber") || "";
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [showMap, setShowMap] = useState(!!initialTracking);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void; id: string } | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (trackingNumber) {
        await fetchOrderStatus(trackingNumber);
        connectWebSocket(trackingNumber);
      }
    };

    fetchInitialData();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      disconnectWebSocket();
    };
  }, [trackingNumber]);

  const fetchOrderStatus = async (tracking: string) => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await axios.get(`/api/orders/track/${tracking}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const data: OrderUpdateResponse = response.data;
      setOrderStatus(data.status);
      setCurrentLocation(data.currentLocation || null);
      setError(null);
      console.log("Fetched order status:", data);
    } catch (error: any) {
      console.error("Track error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to fetch order status");
      setOrderStatus(null);
      setCurrentLocation(null);
    }
  };

  const connectWebSocket = (tracking: string) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setError("Authentication required for real-time updates. Please log in.");
      return;
    }

    const client = initializeWebSocket();
    wsClientRef.current = client;

    const checkConnection = setInterval(() => {
      if (client.connected) {
        clearInterval(checkConnection);
        subscriptionRef.current = subscribeToTopic(client, `/topic/order/${tracking}`, (message) => {
          try {
            const update: OrderUpdateResponse = JSON.parse(message.body);
            setOrderStatus(update.status);
            setCurrentLocation(update.currentLocation || null);
            setError(null);
            console.log("Real-time update:", update);
            if (update.status === "DELIVERED") {
              subscriptionRef.current?.unsubscribe();
              disconnectWebSocket();
              console.log("WebSocket disconnected due to DELIVERED status");
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            setError("Error receiving real-time update");
          }
        });
      }
    }, 100);
  };

  const handleTrack = () => {
    if (trackingNumber) {
      setShowMap(true);
      fetchOrderStatus(trackingNumber);
      connectWebSocket(trackingNumber);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Package className="h-6 w-6 text-[#ffd215]" /> Track Parcel
        </h2>
        <div className="flex flex-col gap-4 mb-6">
          <Input
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Button
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black"
            onClick={handleTrack}
            disabled={!trackingNumber}
          >
            Track
          </Button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}
        {showMap && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between gap-0 w-full max-w-xl mx-auto">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    orderStatus && orderStatus !== "AWAITING_COLLECTION"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Awaiting Collection</span>
              </div>
              <div
                className={`h-1 w-8 mx-2 ${
                  orderStatus && orderStatus !== "AWAITING_COLLECTION"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                style={{ opacity: orderStatus && orderStatus !== "AWAITING_COLLECTION" ? 1 : 0.5 }}
              />
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    orderStatus === "COLLECTED" ||
                    orderStatus === "IN_TRANSIT" ||
                    orderStatus === "DELIVERED"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Collected</span>
              </div>
              <div
                className={`h-1 w-8 mx-2 ${
                  orderStatus === "IN_TRANSIT" || orderStatus === "DELIVERED"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                style={{
                  opacity: orderStatus === "IN_TRANSIT" || orderStatus === "DELIVERED" ? 1 : 0.5,
                }}
              />
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    orderStatus === "IN_TRANSIT" || orderStatus === "DELIVERED"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">In Transit</span>
              </div>
              <div
                className={`h-1 w-8 mx-2 ${orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"}`}
                style={{ opacity: orderStatus === "DELIVERED" ? 1 : 0.5 }}
              />
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Delivered</span>
              </div>
            </div>
            {orderStatus === "IN_TRANSIT" && currentLocation && (
              <TrackParcelMap trackingNumber={trackingNumber} currentLocation={currentLocation} />
            )}
            {orderStatus === "DELIVERED" && (
              <div className="text-center mt-4">
                <p className="text-green-500 font-semibold">Parcel has been delivered!</p>
              </div>
            )}
            <div className="text-center mt-4">
              <p className="text-gray-700 font-semibold">
                {orderStatus ? `Status: ${orderStatus.replace("_", " ")}` : "No order found for this tracking number"}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}