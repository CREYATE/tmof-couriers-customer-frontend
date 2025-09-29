import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, MapPin } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import debounce from 'lodash/debounce';
import { ServiceTypeSelector } from "./ServiceTypeSelector";

interface QuotationFormProps {
  mapsLoaded: boolean;
  onQuotationCalculated: (quotation: any) => void;
}

export const QuotationForm = ({ mapsLoaded, onQuotationCalculated }: QuotationFormProps) => {
  const [formData, setFormData] = useState({
    serviceType: "T",
    pickupAddress: "",
    deliveryAddress: "",
    weight: "",
    distance: "",
    itemValue: "",
    description: "",
    price: 0,
    includeTrailer: false,
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [localMapsLoaded, setLocalMapsLoaded] = useState(false);
  const [isPickupValid, setIsPickupValid] = useState(false);
  const [isDeliveryValid, setIsDeliveryValid] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  const calculateEstimation = debounce(async () => {
    if (!isPickupValid || !isDeliveryValid || !formData.serviceType) {
      console.log('Skipping estimate due to invalid data:', { isPickupValid, isDeliveryValid, formData });
      setError('Please select valid pickup and delivery addresses');
      return;
    }
    console.log('Sending estimate request:', formData);
    setIsCalculating(true);
    setError('');
    try {
      // Convert frontend service type to backend format
      const convertServiceType = (frontendType: string): string => {
        switch (frontendType) {
          case 'furniture-moving': return 'FURNITURE_MOVING';
          case 'same-day': return 'SAME_DAY';
          case 'swift-errand': return 'SWIFT_ERRAND';
          case 'instant': return 'INSTANT_DELIVERY';
          case 'standard': return 'STANDARD_DELIVERY';
          default: return frontendType.toUpperCase().replace('-', '_');
        }
      };
      
      const backendServiceType = convertServiceType(formData.serviceType);
      
      // For quotation form, we use the public endpoint (no authentication required)
      const response = await axios.post('/api/orders/public/estimate', {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        weight: formData.weight ? parseFloat(formData.weight) : 1.0,
        serviceType: backendServiceType,
        includeTrailer: formData.serviceType === 'furniture-moving' ? formData.includeTrailer : false,
      });

      console.log('Making public estimate request to backend:', {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        weight: formData.weight ? parseFloat(formData.weight) : 1.0,
        serviceType: backendServiceType,
        includeTrailer: formData.serviceType === 'furniture-moving' ? formData.includeTrailer : false,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (response.data.distanceKm == null || response.data.price == null) {
        throw new Error('Invalid estimate response: distance or price is missing');
      }

      const distanceKm = Number(response.data.distanceKm).toFixed(2);
      const price = Number(response.data.price);
      
      // Fallback base fee calculation for older backend versions
      const getBaseFee = (serviceType: string): number => {
        switch (serviceType) {
          case "SAME_DAY":
            return 80.0;
          case "INSTANT_DELIVERY":
            return 100.0;
          case "STANDARD_DELIVERY":
            return 110.0;
          case "FURNITURE_MOVING":
          case "furniture-moving":
            return 450.0;
          case "SWIFT_ERRAND":
            return 150.0;
          default:
            return 50.0;
        }
      };
      
      const baseFee = response.data.baseFee ? Number(response.data.baseFee) : getBaseFee(formData.serviceType);
      const trailerFee = response.data.trailerFee ? Number(response.data.trailerFee) : 0;
      const distanceFee = price - baseFee - trailerFee;

      setEstimatedPrice(price);
      setFormData(prev => ({
        ...prev,
        distance: distanceKm,
        price: price,
      }));
      
      // Create quotation object for display
      const quotation = {
        serviceType: formData.serviceType,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        weight: formData.weight || '1',
        distance: distanceKm,
        itemValue: formData.itemValue || '0',
        description: formData.description,
        price: distanceFee, // Distance/weight fee component
        baseFee: baseFee,   // Base fee component from backend
        trailerFee: trailerFee, // Trailer fee from backend
        includeTrailer: formData.serviceType === 'furniture-moving' ? formData.includeTrailer : false,
        totalCost: price    // Total cost
      };
      
      console.log('Estimate received:', { price, distance: distanceKm });
      onQuotationCalculated(quotation);
      toast.success(`Quote calculated: R${price} for ${distanceKm}km`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to calculate estimate';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Estimate error:', error);
    }
    setIsCalculating(false);
  }, 500);

  // Initialize Google Maps autocomplete
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window === 'undefined' || window.google?.maps?.places) {
        setLocalMapsLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setError('Google Maps API key is missing');
        console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in .env.local');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onerror = () => {
        setError('Failed to load Google Maps API');
        console.error('Failed to load Google Maps script');
      };
      document.head.appendChild(script);

      script.onload = () => {
        if (pickupInputRef.current && deliveryInputRef.current && window.google?.maps?.places) {
          const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'ZA' },
          });
          const deliveryAutocomplete = new window.google.maps.places.Autocomplete(deliveryInputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'ZA' },
          });

          pickupAutocomplete.addListener("place_changed", () => {
            const place = pickupAutocomplete.getPlace();
            if (place.formatted_address) {
              console.log('Pickup selected:', place.formatted_address);
              setFormData(prev => ({ ...prev, pickupAddress: place.formatted_address }));
              setIsPickupValid(true);
            } else {
              setIsPickupValid(false);
            }
          });

          deliveryAutocomplete.addListener("place_changed", () => {
            const place = deliveryAutocomplete.getPlace();
            if (place.formatted_address) {
              console.log('Delivery selected:', place.formatted_address);
              setFormData(prev => ({ ...prev, deliveryAddress: place.formatted_address }));
              setIsDeliveryValid(true);
            } else {
              setIsDeliveryValid(false);
            }
          });
          setLocalMapsLoaded(true);
        } else {
          setError('Google Maps Places API not available');
          console.error('Google Maps Places API not initialized');
        }
      };
    };

    loadGoogleMaps();
  }, []);

  // Auto-calculate when addresses are selected
  useEffect(() => {
    console.log('QuotationForm useEffect triggered:', {
      localMapsLoaded, 
      isPickupValid, 
      isDeliveryValid, 
      serviceType: formData.serviceType,
      includeTrailer: formData.includeTrailer,
      weight: formData.weight
    });
    if (localMapsLoaded && isPickupValid && isDeliveryValid && formData.serviceType) {
      console.log('Conditions met, calling calculateEstimation');
      calculateEstimation();
    } else {
      console.log('Conditions not met for calculation');
    }
  }, [localMapsLoaded, isPickupValid, isDeliveryValid, formData.weight, formData.serviceType, formData.includeTrailer]);

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log('handleInputChange called:', { field, value, currentFormData: formData });
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'pickupAddress') setIsPickupValid(false);
    if (field === 'deliveryAddress') setIsDeliveryValid(false);
    
    // Reset quotation when key fields change
    if (['pickupAddress', 'deliveryAddress', 'weight', 'serviceType', 'includeTrailer'].includes(field)) {
      onQuotationCalculated(null);
      setEstimatedPrice(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.serviceType || !formData.pickupAddress || !formData.deliveryAddress) {
      toast.error("Please fill in all required fields (Service Type, Pickup Address, and Delivery Address)");
      return false;
    }
    return true;
  };

  const handleCalculateQuotation = () => {
    if (validateForm() && isPickupValid && isDeliveryValid) {
      calculateEstimation();
    } else {
      toast.error("Please select valid addresses from the dropdown suggestions");
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
        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        {!localMapsLoaded && <p className="text-gray-500">Loading Google Maps...</p>}
        
        <ServiceTypeSelector 
          value={formData.serviceType}
          onChange={(value) => handleInputChange('serviceType', value)}
        />

        {/* Debug info */}
        <div className="bg-gray-100 p-2 rounded text-xs">
          <strong>Debug:</strong> serviceType: {formData.serviceType}, includeTrailer: {String(formData.includeTrailer)}
        </div>

        {formData.serviceType === 'furniture-moving' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium mb-3 block">Trailer Options</Label>
            <RadioGroup 
              value={formData.includeTrailer ? 'yes' : 'no'} 
              onValueChange={(value) => {
                console.log('RadioGroup onValueChange called:', value);
                handleInputChange('includeTrailer', value === 'yes');
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-trailer" />
                <Label htmlFor="no-trailer" className="text-sm">No trailer needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-trailer" />
                <Label htmlFor="yes-trailer" className="text-sm">Include trailer (+R450)</Label>
              </div>
            </RadioGroup>
            {formData.includeTrailer && (
              <p className="text-xs text-blue-600 mt-2">✓ Trailer included - Additional R450 will be added to your quote</p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="pickup-address">Pickup Address *</Label>
          <Input
            id="pickup-address"
            ref={pickupInputRef}
            placeholder="Start typing pickup address..."
            value={formData.pickupAddress}
            onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
            className={isPickupValid ? "border-green-500" : ""}
            required
          />
          {isPickupValid && <p className="text-xs text-green-600 mt-1">✓ Valid address selected</p>}
        </div>

        <div>
          <Label htmlFor="delivery-address">Delivery Address *</Label>
          <Input
            id="delivery-address"
            ref={deliveryInputRef}
            placeholder="Start typing delivery address..."
            value={formData.deliveryAddress}
            onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
            className={isDeliveryValid ? "border-green-500" : ""}
            required
          />
          {isDeliveryValid && <p className="text-xs text-green-600 mt-1">✓ Valid address selected</p>}
        </div>

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
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              placeholder="Auto-calculated"
              value={formData.distance}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Distance calculated automatically
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="item-value">Item Value (R)</Label>
          <Input
            id="item-value"
            type="number"
            placeholder="e.g., 500 (optional)"
            value={formData.itemValue}
            onChange={(e) => handleInputChange('itemValue', e.target.value)}
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">
            For insurance purposes (optional)
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of items being shipped (optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: {500 - formData.description.length} characters remaining
          </p>
        </div>

        {estimatedPrice !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Estimated Price:</span>
              <span className="text-lg font-bold text-green-900">R{estimatedPrice}</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Distance: {formData.distance}km • Service: {formData.serviceType}
            </div>
          </div>
        )}

        <Button
          onClick={handleCalculateQuotation}
          disabled={isCalculating || !localMapsLoaded}
          className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold"
        >
          {isCalculating ? (
            <>
              <Calculator className="mr-2 h-4 w-4 animate-spin" />
              Calculating Quote...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Get Instant Quote
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Prices are estimates and may vary based on actual conditions
        </p>
      </CardContent>
    </Card>
  );
};

