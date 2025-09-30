import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, ArrowLeft } from "lucide-react";
import axios from 'axios';
import debounce from 'lodash/debounce';

// Define FormData interface
interface FormData {
  pickupAddress: string;
  deliveryAddress: string;
  weight: string;
  distance: string;
  description: string;
  serviceType: string;
  price: number;
  includeTrailer: boolean;
}

export default function DeliveryStep({ serviceType, onNext }: { serviceType: string; onNext: (data: FormData) => void }) {
  const router = useRouter();
  // Valid service types
  const VALID_SERVICE_TYPES = ['STANDARD', 'SAME_DAY', 'SWIFT_ERRAND', 'FURNITURE_MOVING'];
  // Prioritize serviceType prop, then URL query, then 'STANDARD'
  const queryServiceType = VALID_SERVICE_TYPES.includes(serviceType)
    ? serviceType
    : (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('serviceType') : null) || 'STANDARD';

  const [formData, setFormData] = useState<FormData>(() => {
    // Try to restore form data from localStorage, excluding serviceType
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('deliveryStepFormData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          return {
            pickupAddress: parsed.pickupAddress || "",
            deliveryAddress: parsed.deliveryAddress || "",
            weight: parsed.weight || "",
            distance: parsed.distance || "",
            description: parsed.description || "",
            serviceType: VALID_SERVICE_TYPES.includes(queryServiceType) ? queryServiceType : 'STANDARD',
            price: parsed.price || 0,
            includeTrailer: parsed.includeTrailer || false,
          };
        } catch (error) {
          console.error('Failed to parse saved delivery form data:', error);
        }
      }
    }
    return {
      pickupAddress: "",
      deliveryAddress: "",
      weight: "",
      distance: "",
      description: "",
      serviceType: VALID_SERVICE_TYPES.includes(queryServiceType) ? queryServiceType : 'STANDARD',
      price: 0,
      includeTrailer: false,
    };
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isPickupValid, setIsPickupValid] = useState(false);
  const [isDeliveryValid, setIsDeliveryValid] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  // Synchronize formData.serviceType with queryServiceType
  useEffect(() => {
    if (formData.serviceType !== queryServiceType && VALID_SERVICE_TYPES.includes(queryServiceType)) {
      setFormData((prev: FormData) => ({
        ...prev,
        serviceType: queryServiceType,
      }));
      // Clear localStorage to prevent stale serviceType
      if (typeof window !== 'undefined') {
        localStorage.removeItem('deliveryStepFormData');
      }
    }
  }, [queryServiceType]);

  // Save formData to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryStepFormData', JSON.stringify(formData));
    }
  }, [formData]);

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
      const response = await axios.post('/api/orders/estimate', {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        weight: formData.weight ? parseFloat(formData.weight) : 1.0,
        serviceType: formData.serviceType,
        includeTrailer: formData.includeTrailer,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (response.data.distanceKm == null || response.data.price == null) {
        throw new Error('Invalid estimate response: distance or price is missing');
      }

      const distanceKm = Number(response.data.distanceKm).toFixed(2); // Format to 2 decimal places
      const price = Number(response.data.price); // Convert BigDecimal string to number

      setEstimatedPrice(price);
      setFormData((prev: FormData) => ({
        ...prev,
        distance: distanceKm,
        price: price,
      }));
      console.log('Estimate received:', { price, distance: distanceKm });
      onNext({ ...formData, price, distance: distanceKm });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to calculate estimate';
      setError(errorMessage);
      console.error('Estimate error:', error);
    }
    setIsCalculating(false);
  }, 500);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window === 'undefined' || window.google?.maps?.places) {
        setMapsLoaded(true);
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
              setFormData((prev: FormData) => ({ ...prev, pickupAddress: place.formatted_address }));
              setIsPickupValid(true);
            } else {
              setIsPickupValid(false);
            }
          });

          deliveryAutocomplete.addListener("place_changed", () => {
            const place = deliveryAutocomplete.getPlace();
            if (place.formatted_address) {
              console.log('Delivery selected:', place.formatted_address);
              setFormData((prev: FormData) => ({ ...prev, deliveryAddress: place.formatted_address }));
              setIsDeliveryValid(true);
            } else {
              setIsDeliveryValid(false);
            }
          });
          setMapsLoaded(true);
        } else {
          setError('Google Maps Places API not available');
          console.error('Google Maps Places API not initialized');
        }
      };
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    console.log('DeliveryStep useEffect - serviceType:', serviceType, 'queryServiceType:', queryServiceType, 'formData:', formData, 'isPickupValid:', isPickupValid, 'isDeliveryValid:', isDeliveryValid);
    if (mapsLoaded && isPickupValid && isDeliveryValid && formData.serviceType) {
      calculateEstimation();
    }
  }, [mapsLoaded, isPickupValid, isDeliveryValid, formData.weight, formData.serviceType, formData.includeTrailer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    if (field === 'pickupAddress') setIsPickupValid(false);
    if (field === 'deliveryAddress') setIsDeliveryValid(false);
  };

  const handleProceed = () => {
    onNext(formData);
  };

  return (
    <div className="min-h-screen">
      <Card className="w-full bg-white">
        <CardHeader className="text-center space-y-2 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0C0E29] flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-[#ffd215]" />
            Delivery Details
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600">
            Enter pickup and delivery information to calculate your quote
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm sm:text-base">
              {error}
            </div>
          )}
          {!mapsLoaded && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm sm:text-base">
              Loading Google Maps...
            </div>
          )}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickup-address" className="text-sm font-semibold text-[#0C0E29]">Pickup Address *</Label>
              <Input
                id="pickup-address"
                ref={pickupInputRef}
                placeholder="Start typing pickup address..."
                value={formData.pickupAddress}
                onChange={e => handleInputChange('pickupAddress', e.target.value)}
                className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-address" className="text-sm font-semibold text-[#0C0E29]">Delivery Address *</Label>
              <Input
                id="delivery-address"
                ref={deliveryInputRef}
                placeholder="Start typing delivery address..."
                value={formData.deliveryAddress}
                onChange={e => handleInputChange('deliveryAddress', e.target.value)}
                className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold text-[#0C0E29]">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 2.5 (default: 1kg)"
                  value={formData.weight}
                  onChange={e => handleInputChange('weight', e.target.value)}
                  min="0.1"
                  max="1000"
                  step="0.1"
                  className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use default weight (1kg)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-sm font-semibold text-[#0C0E29]">Distance (km)</Label>
                <Input
                  id="distance"
                  type="text"
                  value={formData.distance}
                  readOnly
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                />
                <p className="text-xs text-gray-500">
                  Distance is calculated automatically
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-[#0C0E29]">Item Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your package..."
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full px-4 py-3 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent resize-none touch-manipulation"
              />
              <p className="text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>
            <div className="bg-[#ffd215]/10 border border-[#ffd215] rounded-xl p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#0C0E29]">
                {isCalculating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ffd215]"></div>
                    Calculating...
                  </div>
                ) : estimatedPrice !== null ? (
                  <div>
                    <span className="text-sm sm:text-base text-gray-600 block mb-1">Estimated Price</span>
                    <span className="text-2xl sm:text-3xl text-[#ffd215]">R{estimatedPrice.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base text-gray-600">Select valid addresses to get an estimate</span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="px-6 py-3 sm:px-8 font-semibold text-base touch-manipulation"
              >
                Back
              </Button>
              <Button
                onClick={handleProceed}
                className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-semibold text-base sm:text-lg py-4 sm:py-5 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                disabled={isCalculating || !estimatedPrice || !isPickupValid || !isDeliveryValid}
              >
                Proceed to Delivery Instructions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}