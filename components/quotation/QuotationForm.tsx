import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { calculateDistanceSecure } from "@/utils/secureGoogleMaps";
import { 
  sanitizeInput, 
  validateAddress, 
  validateWeight, 
  validateDistance, 
  validateItemValue, 
  validateDescription,
  rateLimitCheck 
} from "@/utils/secureInputValidation";
import { AddressInput } from "./AddressInput";
import { ServiceTypeSelector } from "./ServiceTypeSelector";

interface QuotationFormProps {
  mapsLoaded: boolean;
  onQuotationCalculated: (quotation: any) => void;
}

export const QuotationForm = ({ mapsLoaded, onQuotationCalculated }: QuotationFormProps) => {
  const [formData, setFormData] = useState({
    serviceType: "",
    pickupAddress: "",
    deliveryAddress: "",
    weight: "",
    distance: "",
    itemValue: "",
    description: ""
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [allowManualDistance, setAllowManualDistance] = useState(false);
  
  const { calculatePricing } = useDynamicPricing();

  const calculateDistanceSecurely = async () => {
    if (!formData.pickupAddress || !formData.deliveryAddress) {
      return;
    }

    // Rate limiting check
    if (!rateLimitCheck('distance-calc', 5, 60000)) {
      toast.error('Too many distance calculations. Please wait a moment.');
      return;
    }

    // Validate addresses
    if (!validateAddress(formData.pickupAddress) || !validateAddress(formData.deliveryAddress)) {
      toast.error('Please enter valid addresses');
      return;
    }

    setIsCalculatingDistance(true);
    console.log('Calculating distance between:', formData.pickupAddress, 'and', formData.deliveryAddress);
    
    try {
      const result = await calculateDistanceSecure(
        sanitizeInput(formData.pickupAddress),
        sanitizeInput(formData.deliveryAddress)
      );

      if (result) {
        console.log('Distance calculation successful:', result);
        setFormData(prev => ({ ...prev, distance: result.distance.toString() }));
        toast.success(`Distance calculated: ${result.distance}km`);
        setAllowManualDistance(false);
      } else {
        console.warn('Distance calculation failed, enabling manual input');
        toast.error('Could not calculate distance automatically. Please enter distance manually.');
        setAllowManualDistance(true);
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      toast.error('Failed to calculate distance. Please enter distance manually.');
      setAllowManualDistance(true);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Auto-calculate distance when both addresses are set
  useEffect(() => {
    if (formData.pickupAddress && formData.deliveryAddress && !allowManualDistance) {
      const timeoutId = setTimeout(() => {
        calculateDistanceSecurely();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData.pickupAddress, formData.deliveryAddress, allowManualDistance]);

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input before setting
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Reset quotation when key fields change
    if (['pickupAddress', 'deliveryAddress', 'weight', 'serviceType', 'distance'].includes(field)) {
      onQuotationCalculated(null);
    }

    // Reset manual distance flag when addresses change
    if (['pickupAddress', 'deliveryAddress'].includes(field)) {
      setAllowManualDistance(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.serviceType || !formData.pickupAddress || !formData.deliveryAddress) {
      toast.error("Please fill in all required fields (Service Type, Pickup Address, and Delivery Address)");
      return false;
    }

    if (!validateAddress(formData.pickupAddress)) {
      toast.error("Please enter a valid pickup address");
      return false;
    }

    if (!validateAddress(formData.deliveryAddress)) {
      toast.error("Please enter a valid delivery address");
      return false;
    }

    if (!formData.distance || !validateDistance(formData.distance)) {
      toast.error("Distance is required and must be a valid number between 0.1 and 1000 km");
      return false;
    }

    if (formData.weight && !validateWeight(formData.weight)) {
      toast.error("Please enter a valid weight (0.1 - 1000 kg)");
      return false;
    }

    if (formData.itemValue && !validateItemValue(formData.itemValue)) {
      toast.error("Please enter a valid item value");
      return false;
    }

    if (formData.description && !validateDescription(formData.description)) {
      toast.error("Description must be less than 1000 characters");
      return false;
    }

    return true;
  };

  const calculateQuotation = async () => {
    console.log('Starting quotation calculation with data:', formData);

    // Rate limiting check
    if (!rateLimitCheck('quotation-calc', 10, 60000)) {
      toast.error('Too many quotation requests. Please wait a moment.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsCalculating(true);
    
    try {
      const distance = parseFloat(formData.distance);
      const weight = parseFloat(formData.weight) || 1; // Default to 1kg if not specified
      const itemValue = parseFloat(formData.itemValue) || 0;

      console.log('Calculating pricing with:', {
        distance,
        weight,
        itemValue,
        serviceType: formData.serviceType
      });

      const pricing = await calculatePricing(
        distance,
        undefined,
        formData.serviceType as 'standard' | 'same-day' | 'swift-errand' | 'instant',
        weight,
        itemValue
      );

      console.log('Pricing calculation result:', pricing);

      if (pricing) {
        const quotation = {
          ...pricing,
          distance,
          weight,
          itemValue,
          serviceType: formData.serviceType,
          pickupAddress: formData.pickupAddress,
          deliveryAddress: formData.deliveryAddress,
          description: formData.description
        };
        
        console.log('Final quotation:', quotation);
        onQuotationCalculated(quotation);
        toast.success("Quotation calculated successfully!");
      } else {
        console.error('Pricing calculation returned null');
        toast.error("Failed to calculate pricing. Please try again.");
      }
    } catch (error) {
      console.error('Error calculating quotation:', error);
      toast.error("Failed to calculate quotation. Please check your inputs and try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Quotation Details
        </CardTitle>
        <CardDescription>
          Enter your shipment details to get an instant quote
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ServiceTypeSelector 
          value={formData.serviceType}
          onChange={(value) => handleInputChange('serviceType', value)}
        />

        <AddressInput
          id="pickup-address"
          label="Pickup Address"
          placeholder="Start typing pickup address..."
          value={formData.pickupAddress}
          onChange={(value) => handleInputChange('pickupAddress', value)}
          mapsLoaded={mapsLoaded}
          required
        />

        <AddressInput
          id="delivery-address"
          label="Delivery Address"
          placeholder="Start typing delivery address..."
          value={formData.deliveryAddress}
          onChange={(value) => handleInputChange('deliveryAddress', value)}
          mapsLoaded={mapsLoaded}
          isCalculatingDistance={isCalculatingDistance}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 2.5 (default: 1kg)"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
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
                placeholder={allowManualDistance ? "Enter distance manually" : "Auto-calculated"}
                value={formData.distance}
                onChange={(e) => allowManualDistance ? handleInputChange('distance', e.target.value) : undefined}
                readOnly={!allowManualDistance}
                className={allowManualDistance ? "" : "bg-gray-50"}
                min="0.1"
                max="1000"
                step="0.1"
              />
              {!allowManualDistance && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 px-2"
                  onClick={() => setAllowManualDistance(true)}
                  title="Enter distance manually"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {allowManualDistance 
                ? "Enter the distance manually if auto-calculation failed"
                : "Distance is automatically calculated from your addresses"
              }
            </p>
            {allowManualDistance && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setAllowManualDistance(false);
                  setFormData(prev => ({ ...prev, distance: "" }));
                  if (formData.pickupAddress && formData.deliveryAddress) {
                    calculateDistanceSecurely();
                  }
                }}
              >
                Try Auto-Calculate Again
              </Button>
            )}
          </div>
        </div>

        {formData.serviceType === 'swift-errand' && (
          <div>
            <Label htmlFor="item-value">Item Value (ZAR)</Label>
            <Input
              id="item-value"
              type="number"
              placeholder="e.g., 500"
              value={formData.itemValue}
              onChange={(e) => handleInputChange('itemValue', e.target.value)}
              min="0"
              max="1000000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for Swift Errand service fee calculation
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="description">Item Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your package..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <Button 
          onClick={calculateQuotation} 
          disabled={isCalculating || isCalculatingDistance || !formData.serviceType || !formData.pickupAddress || !formData.deliveryAddress || !formData.distance}
          className="w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black"
        >
          {isCalculating ? 'Calculating...' : 
           isCalculatingDistance ? 'Calculating Distance...' : 
           'Calculate Quote'}
        </Button>

        {(!formData.serviceType || !formData.pickupAddress || !formData.deliveryAddress || !formData.distance) && (
          <p className="text-xs text-gray-500 text-center">
            Please fill in all required fields to enable quote calculation
          </p>
        )}
      </CardContent>
    </Card>
  );
};
import React from "react";

