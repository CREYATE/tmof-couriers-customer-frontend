import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Clock, Truck } from "lucide-react";

interface QuoteDisplayProps {
  quotation: any;
}

export const QuoteDisplay = ({ quotation }: QuoteDisplayProps) => {
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'standard': return <Package className="h-5 w-5" />;
      case 'same-day': return <Clock className="h-5 w-5" />;
      case 'swift-errand': return <Package className="h-5 w-5" />;
      case 'instant': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getServiceTypeDescription = (type: string) => {
    switch (type) {
      case 'standard': return 'R100 flat fee • 3 days • 5kg included';
      case 'same-day': return 'R80 base (10km included) + R4/km + R4/kg';
      case 'swift-errand': return 'Shopping service • R150 min or 10%';
      case 'instant': return 'R80 base + R5.50/km • Premium';
      default: return '';
    }
  };

  if (!quotation) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No Quote Yet</h3>
          <p className="text-sm text-gray-400">
            Fill in the form to get your instant quote
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#ffd215]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#0C0E29]">
          {getServiceTypeIcon(quotation.serviceType)}
          Your Instant Quote
        </CardTitle>
        <CardDescription>
          {getServiceTypeDescription(quotation.serviceType)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Fee:</span>
            <span>R{quotation.base_fee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Distance Fee:</span>
            <span>R{quotation.distance_fee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Weight Fee:</span>
            <span>R{quotation.weight_fee?.toFixed(2) || '0.00'}</span>
          </div>
          {quotation.service_fee > 0 && (
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span>R{quotation.service_fee?.toFixed(2)}</span>
            </div>
          )}
          {quotation.peak_multiplier > 1 && (
            <div className="flex justify-between text-orange-600">
              <span>Peak Hours (20%):</span>
              <span>+R{((quotation.total_amount / quotation.peak_multiplier) * 0.2).toFixed(2)}</span>
            </div>
          )}
          <hr className="border-[#ffd215]" />
          <div className="flex justify-between font-bold text-lg text-[#0C0E29]">
            <span>Total Amount:</span>
            <span>R{quotation.total_amount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-md">
          <p><strong>Route Details:</strong></p>
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="break-words"><strong>From:</strong> {quotation.pickupAddress}</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="break-words"><strong>To:</strong> {quotation.deliveryAddress}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p><strong>Distance:</strong> {quotation.distance}km</p>
            <p><strong>Weight:</strong> {quotation.weight}kg</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import React from "react";

