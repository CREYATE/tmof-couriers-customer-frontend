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
import TmofSpinner from "@/components/ui/TmofSpinner";

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
      } else {
        setLoading(false); // Set loading to false if no tracking number
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
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/orders/track/${tracking}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const data: OrderUpdateResponse = response.data;
      setOrderStatus(data.status);
      setCurrentLocation(data.currentLocation || null);
      setError(null);
      setLoading(false);
      console.log("Fetched order status:", data);
    } catch (error: any) {
      console.error("Track error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to fetch order status");
      setOrderStatus(null);
      setCurrentLocation(null);
      setLoading(false);
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
      setLoading(true);
      setShowMap(true);
      fetchOrderStatus(trackingNumber);
      connectWebSocket(trackingNumber);
    }
  };
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto pt-16 sm:pt-20">
        <TmofSpinner show={loading} />
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0C0E29] mb-2 flex items-center justify-center gap-2">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-[#ffd215]" /> 
            Track Your Parcel
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Enter your tracking number to get real-time updates</p>
        </div>

        {/* Tracking Input Card */}
        <Card className="p-4 sm:p-6 lg:p-8 mb-6 shadow-lg border-0 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
              <Input
                placeholder="Enter your tracking number (e.g., TMF123456)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
              />
            </div>
            <Button
              className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
              onClick={handleTrack}
              disabled={!trackingNumber || loading}
            >
              {loading ? "Tracking..." : "Track Package"}
            </Button>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <h3 className="font-semibold text-red-800 text-sm sm:text-base">Tracking Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-center border-red-300 text-red-700 hover:bg-red-100 touch-manipulation"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tracking Progress */}
        {showMap && orderStatus && (
          <Card className="p-4 sm:p-6 lg:p-8 shadow-lg border-0 bg-white">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Package Status Overview */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0C0E29]">Package Status</h2>
                <p className="text-lg sm:text-xl font-semibold text-[#ffd215] bg-[#ffd215]/10 inline-block px-4 py-2 rounded-xl">
                  {orderStatus ? orderStatus.replace("_", " ").toUpperCase() : "UNKNOWN"}
                </p>
              </div>

              {/* Mobile-First Progress Tracker */}
              <div className="space-y-6">
                {/* Desktop Progress Steps - Horizontal */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between relative">
                    
                    {/* Step 1: Awaiting Collection */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        orderStatus && orderStatus !== "AWAITING_COLLECTION" ? "bg-green-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center mt-3">
                        <span className="font-semibold text-base text-gray-900 block">Awaiting Collection</span>
                        <p className="text-sm text-gray-600 mt-1">Order confirmed and ready for pickup</p>
                      </div>
                    </div>

                    {/* Step 2: Collected */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        ["COLLECTED", "IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-orange-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center mt-3">
                        <span className="font-semibold text-base text-gray-900 block">Collected</span>
                        <p className="text-sm text-gray-600 mt-1">Package picked up by courier</p>
                      </div>
                    </div>

                    {/* Step 3: In Transit */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        ["IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-blue-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center mt-3">
                        <span className="font-semibold text-base text-gray-900 block">In Transit</span>
                        <p className="text-sm text-gray-600 mt-1">On the way to destination</p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        orderStatus === "DELIVERED" ? "bg-green-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Home className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center mt-3">
                        <span className="font-semibold text-base text-gray-900 block">Delivered</span>
                        <p className="text-sm text-gray-600 mt-1">Package successfully delivered</p>
                      </div>
                    </div>

                    {/* Desktop Progress Lines - Absolute positioned to connect circles */}
                    <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-8">
                      <div className={`h-1 flex-1 transition-all duration-300 ${
                        orderStatus && orderStatus !== "AWAITING_COLLECTION" ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                      <div className="w-16"></div> {/* Space for circle */}
                      <div className={`h-1 flex-1 transition-all duration-300 ${
                        ["IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                      <div className="w-16"></div> {/* Space for circle */}
                      <div className={`h-1 flex-1 transition-all duration-300 ${
                        orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Mobile Progress Steps - Vertical */}
                <div className="sm:hidden space-y-0">
                  
                  {/* Step 1: Awaiting Collection */}
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        orderStatus && orderStatus !== "AWAITING_COLLECTION" ? "bg-green-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className={`w-1 h-12 transition-all duration-300 ${
                        orderStatus && orderStatus !== "AWAITING_COLLECTION" ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <span className="font-semibold text-base text-gray-900 block">Awaiting Collection</span>
                      <p className="text-sm text-gray-600 mt-1">Order confirmed and ready for pickup</p>
                    </div>
                  </div>

                  {/* Step 2: Collected */}
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        ["COLLECTED", "IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-orange-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className={`w-1 h-12 transition-all duration-300 ${
                        ["IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <span className="font-semibold text-base text-gray-900 block">Collected</span>
                      <p className="text-sm text-gray-600 mt-1">Package picked up by courier</p>
                    </div>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        ["IN_TRANSIT", "DELIVERED"].includes(orderStatus) ? "bg-blue-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div className={`w-1 h-12 transition-all duration-300 ${
                        orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <span className="font-semibold text-base text-gray-900 block">In Transit</span>
                      <p className="text-sm text-gray-600 mt-1">On the way to destination</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        orderStatus === "DELIVERED" ? "bg-green-500 shadow-lg" : "bg-gray-300"
                      }`}>
                        <Home className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base text-gray-900 block">Delivered</span>
                      <p className="text-sm text-gray-600 mt-1">Package successfully delivered</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Current Location & Map */}
              {orderStatus === "IN_TRANSIT" && currentLocation && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Current Location
                    </h3>
                    <p className="text-blue-800 text-sm">{currentLocation}</p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <TrackParcelMap trackingNumber={trackingNumber} currentLocation={currentLocation} />
                  </div>
                </div>
              )}

              {/* Delivery Confirmation */}
              {orderStatus === "DELIVERED" && (
                <div className="text-center bg-green-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Package Delivered!</h3>
                  <p className="text-green-800">Your package has been successfully delivered. Thank you for choosing our service!</p>
                </div>
              )}

              {/* Live Updates Notice */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-center text-sm text-gray-600">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Live tracking updates enabled. Status will update automatically.
                </p>
              </div>

            </div>
          </Card>
        )}

        {/* No Results Message */}
        {showMap && !orderStatus && !loading && !error && (
          <Card className="p-6 sm:p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Order Found</h3>
            <p className="text-gray-600">
              We couldn't find any order with tracking number "{trackingNumber}". 
              Please check the number and try again.
            </p>
          </Card>
        )}

      </div>
    </div>
  );
}