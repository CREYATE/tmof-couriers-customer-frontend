"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, Home } from "lucide-react";
import TrackParcelMap from "@/components/Maps/GoogleMapComponent";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

export default function TrackParcelPage() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("trackingNumber") || "";
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [showMap, setShowMap] = useState(!!initialTracking);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    console.log('JWT in localStorage:', jwt);
    if (trackingNumber) {
      fetchOrderStatus(trackingNumber);
      connectWebSocket(trackingNumber);
    }

    return () => {
      if (client) {
        client.deactivate();
        console.log('WebSocket disconnected for trackingNumber:', trackingNumber);
      }
    };
  }, [trackingNumber]);

  const fetchOrderStatus = async (tracking: string) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.log('Sending track request with JWT:', jwt);
      const response = await axios.get(`/api/orders/track/${tracking}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setOrderStatus(response.data.status);
      setCurrentLocation(response.data.currentLocation);
      console.log('Fetched order status:', response.data);
    } catch (error: any) {
      console.error('Track error:', error.response?.data || error.message);
      setOrderStatus(null);
      setCurrentLocation(null);
    }
  };

  const connectWebSocket = (tracking: string) => {
    const jwt = localStorage.getItem('jwt');
    console.log('WebSocket connecting with JWT:', jwt);
    const newClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        newClient.subscribe(`/topic/order/${tracking}`, (message) => {
          const update = JSON.parse(message.body);
          setOrderStatus(update.status);
          setCurrentLocation(update.currentLocation);
          console.log('Real-time update:', update);
          if (update.status === 'DELIVERED') {
            newClient.deactivate();
            console.log('WebSocket disconnected due to DELIVERED status');
          }
        });
      },
      onWebSocketError: (error) => console.error('WebSocket error:', error),
      onStompError: (frame) => console.error('STOMP error:', frame),
    });
    newClient.activate();
    setClient(newClient);
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
            onClick={() => setShowMap(true)}
            disabled={!trackingNumber}
          >
            Track
          </Button>
        </div>
        {showMap && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between gap-0 w-full max-w-xl mx-auto">
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus !== 'AWAITING_COLLECTION' ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Awaiting Collection</span>
              </div>
              <div className={`h-1 w-8 mx-2 ${orderStatus !== 'AWAITING_COLLECTION' ? 'bg-green-500' : 'bg-gray-300'}`} style={{ opacity: orderStatus !== 'AWAITING_COLLECTION' ? 1 : 0.5 }} />
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus === 'COLLECTED' || orderStatus === 'IN_TRANSIT' || orderStatus === 'DELIVERED' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Collected</span>
              </div>
              <div className={`h-1 w-8 mx-2 ${orderStatus === 'IN_TRANSIT' || orderStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`} style={{ opacity: orderStatus === 'IN_TRANSIT' || orderStatus === 'DELIVERED' ? 1 : 0.5 }} />
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus === 'IN_TRANSIT' || orderStatus === 'DELIVERED' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">In Transit</span>
              </div>
              <div className={`h-1 w-8 mx-2 ${orderStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`} style={{ opacity: orderStatus === 'DELIVERED' ? 1 : 0.5 }} />
              <div className="flex flex-col items-center flex-1">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center ${orderStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="mt-2 font-semibold text-sm">Delivered</span>
              </div>
            </div>
            {orderStatus === 'IN_TRANSIT' && currentLocation && (
              <TrackParcelMap trackingNumber={trackingNumber} currentLocation={currentLocation} />
            )}
            {orderStatus === 'DELIVERED' && (
              <div className="text-center mt-4">
                <p className="text-green-500 font-semibold">Parcel has been delivered!</p>
              </div>
            )}
            <div className="text-center mt-4">
              <p className="text-gray-700 font-semibold">{orderStatus ? `Status: ${orderStatus}` : 'No order found for this tracking number'}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}