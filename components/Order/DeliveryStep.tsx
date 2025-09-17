import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator } from "lucide-react";
import axios from 'axios';
import debounce from 'lodash/debounce';

export default function DeliveryStep({ serviceType, onNext }: { serviceType: string; onNext: (data: any) => void }) {
  const router = useRouter();
  const queryServiceType = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('serviceType') || serviceType || 'STANDARD';
  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    weight: "",
    distance: "",
    description: "",
    serviceType: queryServiceType,
    price: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);
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
      const response = await axios.post('/api/orders/estimate', {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        weight: formData.weight || 1.0,
        serviceType: formData.serviceType,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setEstimatedPrice(response.data.price);
      setFormData(prev => ({
        ...prev,
        distance: response.data.distanceKm.toString(),
        price: response.data.price,
      }));
      console.log('Estimate received:', { price: response.data.price, distance: response.data.distanceKm });
      onNext({ ...formData, price: response.data.price, distance: response.data.distanceKm });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to calculate estimate');
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
  }, [mapsLoaded, isPickupValid, isDeliveryValid, formData.weight, formData.serviceType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'pickupAddress') setIsPickupValid(false);
    if (field === 'deliveryAddress') setIsDeliveryValid(false);
  };

  const handleProceed = () => {
    onNext({ ...formData });
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Delivery Details
        </CardTitle>
        <CardDescription>
          Select your delivery details to get an instant estimate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {!mapsLoaded && <p>Loading Google Maps...</p>}
        <div>
          <Label htmlFor="pickup-address">Pickup Address *</Label>
          <Input
            id="pickup-address"
            ref={pickupInputRef}
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
            ref={deliveryInputRef}
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
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="text"
              value={formData.distance}
              readOnly
              placeholder="Auto-calculated"
            />
            <p className="text-xs text-gray-500 mt-1">
              Distance is calculated automatically
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
          {isCalculating ? 'Calculating...' : estimatedPrice !== null ? `Estimated Price: R${estimatedPrice}` : 'Select valid addresses to get an estimate'}
        </div>
        <Button
          onClick={handleProceed}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black w-full"
          disabled={isCalculating || !estimatedPrice || !isPickupValid || !isDeliveryValid}
        >
          Proceed to Delivery Instructions
        </Button>
      </CardContent>
    </Card>
  );
}