import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, Truck } from "lucide-react";

export const ServiceTypesInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Types</CardTitle>
        <CardDescription>
          Choose the right service for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Standard Delivery</h4>
              <p className="text-sm text-gray-600">R100 flat fee • 3 days • 5kg included</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Same-Day Delivery</h4>
              <p className="text-sm text-gray-600">R80 base (10km included) + R4/km + R4/kg</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Swift Errand</h4>
              <p className="text-sm text-gray-600">Shopping service • R150 min or 10%</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Instant Delivery</h4>
              <p className="text-sm text-gray-600">R80 base + R5.50/km • Premium</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import React from "react";

