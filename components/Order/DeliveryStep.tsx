import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, MapPin } from "lucide-react";

export default function DeliveryStep({ onNext }: { onNext: () => void }) {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    weight: "",
    distance: "",
    description: ""
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [allowManualDistance, setAllowManualDistance] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // Mocked price calculation
  const calculateEstimation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Simple mock: base 100 + 10 * distance + 5 * weight
      const distance = parseFloat(formData.distance) || 0;
      const weight = parseFloat(formData.weight) || 1;
      const price = 100 + 10 * distance + 5 * weight;
      setEstimatedPrice(Math.round(price));
      setIsCalculating(false);
    }, 800);
  };

  useEffect(() => {
    if (formData.pickupAddress && formData.deliveryAddress && formData.distance) {
      calculateEstimation();
    } else {
      setEstimatedPrice(null);
    }
    // eslint-disable-next-line
  }, [formData.pickupAddress, formData.deliveryAddress, formData.distance, formData.weight]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Delivery Details
        </CardTitle>
        <CardDescription>
          Enter your delivery details to get an instant estimate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pickup-address">Pickup Address *</Label>
          <Input
            id="pickup-address"
            placeholder="Start typing pickup address..."
            value={formData.pickupAddress}
            onChange={e => handleInputChange('pickupAddress', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="delivery-address">Delivery Address *</Label>
          <Input
            id="delivery-address"
            placeholder="Start typing delivery address..."
            value={formData.deliveryAddress}
            onChange={e => handleInputChange('deliveryAddress', e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 2.5 (default: 1kg)"
              value={formData.weight}
              onChange={e => handleInputChange('weight', e.target.value)}
              min="0.1"
              max="1000"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use default weight (1kg)
            </p>
          </div>
          <div>
            <Label htmlFor="distance">Distance (km) *</Label>
            <div className="relative">
              <Input
                id="distance"
                type="number"
                placeholder={allowManualDistance ? "Enter distance manually" : "Auto-calculated (mocked)"}
                value={formData.distance}
                onChange={e => handleInputChange('distance', e.target.value)}
                min="0.1"
                max="1000"
                step="0.1"
              />
              {/* In real app, add auto-calc logic here */}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {allowManualDistance 
                ? "Enter the distance manually if auto-calculation failed"
                : "Distance is currently manual. Auto-calc coming soon."
              }
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Item Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your package..."
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>
        <div className="bg-[#ffd215] rounded-lg p-4 text-black font-bold text-center mb-4">
          {isCalculating ? 'Calculating...' : estimatedPrice !== null ? `Estimated Price: R${estimatedPrice}` : 'Fill in all details to get an estimate'}
        </div>
  <Button onClick={onNext} className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full">Proceed to Delivery Instructions</Button>
      </CardContent>
    </Card>
  );
}
