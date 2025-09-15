
import { Package, User, Truck, Clock } from "lucide-react";
import Stats from "./Stats";
import ShipmentCard from "./ShipmentCard";
import { mockShipments, getShipmentsByStatus, getDriversByStatus } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardOverview = () => {
  const shipmentStats = getShipmentsByStatus();
  const driverStats = getDriversByStatus();
  
  const stats = [
    {
      title: "Total Shipments",
      value: mockShipments.length,
      changeValue: "+8%",
      changeDirection: "up" as "up",
      description: "from last week",
      icon: <Package className="h-4 w-4 text-courier-600" />,
    },
    {
      title: "In Transit",
      value: shipmentStats.in_transit,
      changeValue: "-2%",
      changeDirection: "down" as "down",
      description: "from yesterday",
      icon: <Truck className="h-4 w-4 text-courier-600" />,
    },
    {
      title: "Active Drivers",
      value: driverStats.active + driverStats.on_delivery,
      changeValue: "No change",
      changeDirection: "neutral" as "neutral",
      description: "from last week",
      icon: <User className="h-4 w-4 text-courier-600" />,
    },
    {
      title: "On Time Delivery",
      value: "93%",
      changeValue: "+5%",
      changeDirection: "up" as "up",
      description: "from last month",
      icon: <Clock className="h-4 w-4 text-courier-600" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your courier management dashboard.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Export Data</Button>
          <Button>Create Shipment</Button>
        </div>
      </div>

      <Stats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShipments.slice(0, 3).map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
                <div className="text-center mt-4">
                  <Button variant="link">View all shipments</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Shipment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2 py-3">
                  <span>Pending</span>
                  <div className="w-1/2 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(shipmentStats.pending / mockShipments.length) * 100}%` }}></div>
                  </div>
                  <span className="font-medium">{shipmentStats.pending}</span>
                </div>
                <div className="flex justify-between items-center px-2 py-3">
                  <span>In Transit</span>
                  <div className="w-1/2 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-courier-400 h-2.5 rounded-full" style={{ width: `${(shipmentStats.in_transit / mockShipments.length) * 100}%` }}></div>
                  </div>
                  <span className="font-medium">{shipmentStats.in_transit}</span>
                </div>
                <div className="flex justify-between items-center px-2 py-3">
                  <span>Delivered</span>
                  <div className="w-1/2 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${(shipmentStats.delivered / mockShipments.length) * 100}%` }}></div>
                  </div>
                  <span className="font-medium">{shipmentStats.delivered}</span>
                </div>
                <div className="flex justify-between items-center px-2 py-3">
                  <span>Failed</span>
                  <div className="w-1/2 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${(shipmentStats.failed / mockShipments.length) * 100}%` }}></div>
                  </div>
                  <span className="font-medium">{shipmentStats.failed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
