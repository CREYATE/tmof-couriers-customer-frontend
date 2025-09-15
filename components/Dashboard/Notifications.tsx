import React from "react";
import { Package, Truck, Clock, CheckCircle, CreditCard } from "lucide-react";

const notifications = [
  { id: 1, type: "order", message: "Order Collected", icon: <Package className="h-5 w-5 text-green-600" /> },
  { id: 2, type: "order", message: "Order In Transit", icon: <Truck className="h-5 w-5 text-orange-500" /> },
  { id: 3, type: "order", message: "Order ETA: 15 minutes", icon: <Clock className="h-5 w-5 text-blue-500" /> },
  { id: 4, type: "order", message: "Order Delivered", icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
  { id: 5, type: "payment", message: "Payment Received", icon: <CreditCard className="h-5 w-5 text-[#ffd215]" /> },
  { id: 6, type: "payment", message: "Payment Failed", icon: <CreditCard className="h-5 w-5 text-red-600" /> },
];

export default function Notifications({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 z-[100] bg-white shadow-lg transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ borderLeft: '4px solid #ffd215' }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-bold text-[#0C0E29]">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
      </div>
      <div className="p-6 space-y-4">
        {notifications.map(n => (
          <div key={n.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 shadow-sm">
            {n.icon}
            <span className="text-[#0C0E29] font-medium">{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
