"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, Truck, X, AlertTriangle } from "lucide-react";
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
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
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

  const handleCancelRefund = () => {
    setShowCancellationPolicy(true);
  };

  const handleCloseCancellationPolicy = () => {
    setShowCancellationPolicy(false);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    router.push(`/orders/track-parcel?trackingNumber=${trackingNumber}`);
  };

  const renderOrders = (orders: Order[], title: string) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-3">{title}</h2>
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
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg cursor-pointer transition-all duration-200 border border-gray-200 bg-white" onClick={() => handleOrderClick(order)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">{order.customerName || "Customer"}</h3>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
                    <span className="font-medium">{order.trackingNumber}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 text-[#ffd215] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">From</p>
                      <p className="text-sm text-gray-600">{order.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 text-[#ffd215] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">To</p>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
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
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order History</h1>
          <Button
            type="button"
            onClick={() => router.push("/orders/create/order-type")}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex items-center gap-2 font-medium px-6 py-2"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light" onClick={handleCloseModal}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 pr-8">Order Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="font-semibold text-lg text-gray-900">{selectedOrder.customerName || "Customer"}</span>
                <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
                  <span className="text-gray-700">{selectedOrder.trackingNumber}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">From: </span>
                    <span className="text-gray-700">{selectedOrder.pickupAddress}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">To: </span>
                    <span className="text-gray-700">{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-[#ffd215] flex-shrink-0" />
                  <span className="text-gray-700">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Total: </span>
                      <span className="text-gray-700 font-semibold">R{selectedOrder.price}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Recipient: </span>
                      <span className="text-gray-700">{selectedOrder.recipientName} ({selectedOrder.recipientPhone})</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Service Type: </span>
                      <span className="text-gray-700">{selectedOrder.serviceType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {selectedOrder.status === "IN_TRANSIT" && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 font-medium"
                  onClick={() => alert("Reschedule logic here")}
                >
                  Reschedule
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1 font-medium"
                  onClick={() => alert("Cancel logic here")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1 font-medium"
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}
                >
                  <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                </Button>
              </div>
            )}
            {["AWAITING_COLLECTION", "PAID"].includes(selectedOrder.status) && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1 font-medium"
                  onClick={handleCancelRefund}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-white inline" /> Cancel & Refund
                </Button>
                <Button
                  type="button"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1 font-medium"
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}
                >
                  <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                </Button>
              </div>
            )}
            {["COLLECTED"].includes(selectedOrder.status) && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  className="bg-[#ffd215] hover:bg-[#e5bd13] text-black flex-1 font-medium"
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber)}
                >
                  <Truck className="h-4 w-4 mr-2 text-black inline" /> Track
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancellationPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseCancellationPolicy}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">TMOF COURIERS – Cancellation Policy</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                onClick={handleCloseCancellationPolicy}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">Important Notice</p>
                    <p className="text-sm text-yellow-700">
                      At TMOF COURIERS, we value our customers and strive to provide reliable and efficient delivery services. 
                      We also understand that plans may change, which is why we have a clear and fair cancellation policy in place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. General Policy</h3>
                  <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                    <li>All cancellations must be communicated to TMOF COURIERS via our official booking channels (Website, WhatsApp line, or direct call).</li>
                    <li>Cancellations are only confirmed once you receive an acknowledgment from us.</li>
                    <li>A <strong>30% cancellation fee</strong> applies to all services if a booking is canceled after confirmation but before dispatch of a driver.</li>
                    <li>If a driver has already been dispatched, the <strong>full base fee</strong> will apply, plus any distance already traveled.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Service-Specific Conditions</h3>
                  
                  <div className="grid gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Same Day Delivery</h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>Cancellation before dispatch: 30% of base fee (R24)</li>
                        <li>After dispatch: Full base fee (R80) + R4.00/km for distance already traveled</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Instant Delivery</h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>Cancellation before dispatch: 30% of base fee (R30)</li>
                        <li>After dispatch: Full base fee (R100) + R7.00/km for distance already traveled</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Standard Delivery</h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>Cancellation before dispatch: 30% of base fee (R33)</li>
                        <li>After dispatch: Full base fee (R110)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Movers Service</h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>Cancellation before dispatch: 30% of base fee (R135)</li>
                        <li>After dispatch: Full base fee (R450) + R25/km for distance already traveled</li>
                        <li>If a trailer was requested, a <strong>non-refundable trailer booking fee of R450</strong> applies once confirmed</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Swift Errand (Runner)</h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>Cancellation before dispatch: 30% of service fee (minimum R45)</li>
                        <li>After dispatch: Full service fee (R150 minimum, or 5% of purchase value if higher) + applicable Instant Delivery charges</li>
                        <li>If purchases have already been made on behalf of the client, the full item cost will be charged in addition to courier fees</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Refunds</h3>
                  <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                    <li>Refunds (where applicable) will be processed within <strong>7 business days</strong>.</li>
                    <li>Refunds will exclude the cancellation fee or any costs already incurred by TMOF COURIERS.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Force Majeure</h3>
                  <p className="text-sm text-gray-700">
                    In the event of delays or cancellations due to unforeseen circumstances beyond our control 
                    (e.g., extreme weather, strikes, accidents), TMOF COURIERS reserves the right to reschedule 
                    or cancel the booking without penalty to the client.
                  </p>
                </section>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleCloseCancellationPolicy}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Handle actual cancellation logic here
                    alert('Cancellation request submitted. We will contact you shortly.');
                    handleCloseCancellationPolicy();
                    setSelectedOrder(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  Proceed with Cancellation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AllOrders;