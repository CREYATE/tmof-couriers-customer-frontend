import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Building2, MapPin, Calculator, Truck } from "lucide-react";
import TmofSpinner from "@/components/ui/TmofSpinner";
import axios from 'axios';
import debounce from 'lodash/debounce';

interface FurnitureOrderData {
  pickupAddress: string;
  deliveryAddress: string;
  pickupBuildingName: string;
  pickupUnitNumber: string;
  deliveryBuildingName: string;
  deliveryUnitNumber: string;
  moveType: "apartment" | "office" | "house" | "storage";
  furnitureDescription: string;
  hasFragileItems: boolean;
  needsPackingMaterials: boolean;
  storageRequired: boolean;
  requiresInsurance: boolean;
  includeTrailer: boolean;
  preferredDate: string;
  preferredTime: string;
  isFlexibleTiming: boolean;
  specialInstructions: string;
  clientPhone?: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  deliveryNotes?: string;
  distance?: number;
  price?: number;
}

interface FurnitureMovingFormProps {
  orderData: Partial<FurnitureOrderData>;
  onNext: (data: FurnitureOrderData) => void;
  onBack: () => void;
}

const restrictedAreas = ['Hammanskraal', 'Carletonville', 'Vereeniging'];

export default function FurnitureMovingForm({ orderData, onNext, onBack }: FurnitureMovingFormProps) {
  const [formData, setFormData] = useState<FurnitureOrderData>({
    pickupAddress: orderData.pickupAddress || "",
    deliveryAddress: orderData.deliveryAddress || "",
    pickupBuildingName: orderData.pickupBuildingName || "",
    pickupUnitNumber: orderData.pickupUnitNumber || "",
    deliveryBuildingName: orderData.deliveryBuildingName || "",
    deliveryUnitNumber: orderData.deliveryUnitNumber || "",
    moveType: orderData.moveType || "apartment",
    furnitureDescription: orderData.furnitureDescription || "",
    hasFragileItems: orderData.hasFragileItems || false,
    needsPackingMaterials: orderData.needsPackingMaterials || false,
    storageRequired: orderData.storageRequired || false,
    requiresInsurance: orderData.requiresInsurance || false,
    includeTrailer: orderData.includeTrailer || false,
    preferredDate: orderData.preferredDate || "",
    preferredTime: orderData.preferredTime || "",
    isFlexibleTiming: orderData.isFlexibleTiming || false,
    specialInstructions: orderData.specialInstructions || "",
    clientPhone: orderData.clientPhone || "",
    recipientName: orderData.recipientName || "",
    recipientPhone: orderData.recipientPhone || "",
    recipientEmail: orderData.recipientEmail || "",
    deliveryNotes: orderData.deliveryNotes || "",
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('furnitureMovingFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isPickupValid, setIsPickupValid] = useState(false);
  const [isDeliveryValid, setIsDeliveryValid] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window === 'undefined' || window.google?.maps?.places) {
        setMapsLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in .env.local');
        setMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapsLoaded(true);
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
              updateFormData('pickupAddress', place.formatted_address);
              setIsPickupValid(true);
            } else {
              setIsPickupValid(false);
            }
          });

          deliveryAutocomplete.addListener("place_changed", () => {
            const place = deliveryAutocomplete.getPlace();
            if (place.formatted_address) {
              const addressComponents = place.address_components || [];
              const isRestricted = addressComponents.some((component: google.maps.GeocoderAddressComponent) =>
                restrictedAreas.some(area => component.long_name.toLowerCase().includes(area.toLowerCase()))
              );
              if (isRestricted) {
                setErrors(prev => ({
                  ...prev,
                  deliveryAddress: `Delivery to ${place.formatted_address} is not allowed. Restricted areas: ${restrictedAreas.join(', ')}.`
                }));
                setIsDeliveryValid(false);
              } else {
                updateFormData('deliveryAddress', place.formatted_address);
                setIsDeliveryValid(true);
              }
            } else {
              setIsDeliveryValid(false);
            }
          });
          setMapsLoaded(true);
        } else {
          console.error('Google Maps Places API not initialized');
          setMapsLoaded(true);
        }
      };
    };

    loadGoogleMaps();
  }, []);

  const calculatePricingAPI = debounce(async () => {
    if (!isPickupValid || !isDeliveryValid) {
      return;
    }

    try {
      setCalculating(true);

      const response = await axios.post('/api/orders/estimate', {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        serviceType: 'FURNITURE_MOVING',
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

      const distanceKm = Number(response.data.distanceKm);
      const finalPrice = Number(response.data.price); // Use backend price directly

      setFormData(prev => ({
        ...prev,
        distance: distanceKm,
        price: finalPrice,
      }));
    } catch (error) {
      console.error("Error calculating pricing:", error);
      calculatePricingMock();
    } finally {
      setCalculating(false);
    }
  }, 500);

  const calculatePricingMock = () => {
    try {
      setCalculating(true);

      const mockDistance = Math.floor(Math.random() * 50) + 5;
      let basePrice = 450;
      let distancePrice = mockDistance * 25;
      const trailerCharge = formData.includeTrailer ? 450 : 0;
      
      const totalPrice = Math.round(basePrice + distancePrice + trailerCharge);
      
      setFormData(prev => ({
        ...prev,
        distance: mockDistance,
        price: totalPrice,
      }));
    } catch (error) {
      console.error("Error calculating pricing:", error);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (mapsLoaded && formData.pickupAddress && formData.deliveryAddress &&
        formData.pickupAddress !== formData.deliveryAddress) {
      if (isPickupValid && isDeliveryValid) {
        calculatePricingAPI();
      } else {
        calculatePricingMock();
      }
    }
  }, [mapsLoaded, isPickupValid, isDeliveryValid, formData.pickupAddress, formData.deliveryAddress, formData.includeTrailer]);

  const updateFormData = (field: keyof FurnitureOrderData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'pickupAddress') setIsPickupValid(false);
    if (field === 'deliveryAddress') {
      setIsDeliveryValid(false);
      const lowerCaseValue = value.toLowerCase();
      if (restrictedAreas.some(area => lowerCaseValue.includes(area.toLowerCase()))) {
        setErrors(prev => ({
          ...prev,
          deliveryAddress: `Delivery to ${value} is not allowed. Restricted areas: ${restrictedAreas.join(', ')}.`,
        }));
      } else if (errors.deliveryAddress?.includes('Restricted areas')) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.deliveryAddress;
          return newErrors;
        });
      }
    }

    if (errors[field] && field !== 'deliveryAddress') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = "Pickup address is required";
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";
    if (!formData.furnitureDescription.trim()) newErrors.furnitureDescription = "Please describe the furniture to be moved";
    if (!formData.recipientName.trim()) newErrors.recipientName = "Recipient name is required";
    if (!formData.recipientPhone.trim()) newErrors.recipientPhone = "Recipient phone is required";
    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
    if (restrictedAreas.some(area => formData.deliveryAddress.toLowerCase().includes(area.toLowerCase()))) {
      newErrors.deliveryAddress = `Delivery to ${formData.deliveryAddress} is not allowed. Restricted areas: ${restrictedAreas.join(', ')}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !formData.price) {
      setErrors(prev => ({ ...prev, price: "Price calculation is required" }));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('furnitureMovingFormData');
      }
      onNext(formData);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <TmofSpinner show={loading} />
      {!mapsLoaded && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm sm:text-base mb-6">
          Loading Google Maps for address suggestions...
        </div>
      )}
      <div className="text-center mb-6 sm:mb-10 pt-0 sm:pt-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0C0E29] mb-2 flex items-center justify-center gap-2">
          <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-[#ffd215]" />
          Furniture Moving Service
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Complete the details for your furniture moving requirements</p>
      </div>
      <div className="space-y-6 sm:space-y-10">
        <section>
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Type of Move
          </h3>
          <RadioGroup
            value={formData.moveType}
            onValueChange={(value) => updateFormData('moveType', value)}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="apartment" id="apartment" />
                <Label htmlFor="apartment" className="text-base">Apartment Moving</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="office" id="office" />
                <Label htmlFor="office" className="text-base">Office Moving</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="house" id="house" />
                <Label htmlFor="house" className="text-base">House Moving</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="storage" id="storage" />
                <Label htmlFor="storage" className="text-base">Storage Moving</Label>
              </div>
            </div>
          </RadioGroup>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Pickup Location Details
          </h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="pickupAddress" className="text-base font-medium">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                ref={pickupInputRef}
                value={formData.pickupAddress}
                onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                placeholder={mapsLoaded ? "Start typing pickup address..." : "Enter full pickup address"}
                className={`h-12 ${errors.pickupAddress ? "border-red-500" : ""}`}
              />
              {errors.pickupAddress && <p className="text-red-500 text-sm mt-2">{errors.pickupAddress}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="pickupBuildingName" className="text-base font-medium">Building/Complex Name</Label>
                <Input
                  id="pickupBuildingName"
                  value={formData.pickupBuildingName}
                  onChange={(e) => updateFormData('pickupBuildingName', e.target.value)}
                  placeholder="e.g., Sandton City Apartments"
                  className="h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="pickupUnitNumber" className="text-base font-medium">Unit/Office Number</Label>
                <Input
                  id="pickupUnitNumber"
                  value={formData.pickupUnitNumber}
                  onChange={(e) => updateFormData('pickupUnitNumber', e.target.value)}
                  placeholder="e.g., 12A, Office 205"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Delivery Location Details
          </h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="deliveryAddress" className="text-base font-medium">Delivery Address *</Label>
              <Input
                id="deliveryAddress"
                ref={deliveryInputRef}
                value={formData.deliveryAddress}
                onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                placeholder={mapsLoaded ? "Start typing delivery address..." : "Enter full delivery address"}
                className={`h-12 ${errors.deliveryAddress ? "border-red-500" : ""}`}
              />
              {errors.deliveryAddress && <p className="text-red-500 text-sm mt-2">{errors.deliveryAddress}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="deliveryBuildingName" className="text-base font-medium">Building/Complex Name</Label>
                <Input
                  id="deliveryBuildingName"
                  value={formData.deliveryBuildingName}
                  onChange={(e) => updateFormData('deliveryBuildingName', e.target.value)}
                  placeholder="e.g., Rosebank Towers"
                  className="h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="deliveryUnitNumber" className="text-base font-medium">Unit/Office Number</Label>
                <Input
                  id="deliveryUnitNumber"
                  value={formData.deliveryUnitNumber}
                  onChange={(e) => updateFormData('deliveryUnitNumber', e.target.value)}
                  placeholder="e.g., 8B, Suite 301"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6">Furniture & Items Description</h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="furnitureDescription" className="text-base font-medium">Describe furniture/items to be moved *</Label>
              <Textarea
                id="furnitureDescription"
                value={formData.furnitureDescription}
                onChange={(e) => updateFormData('furnitureDescription', e.target.value)}
                placeholder="e.g., 3-seater sofa, dining table with 6 chairs, queen bed, wardrobe, TV unit, boxes..."
                rows={4}
                className={`${errors.furnitureDescription ? "border-red-500" : ""}`}
              />
              {errors.furnitureDescription && <p className="text-red-500 text-sm mt-2">{errors.furnitureDescription}</p>}
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6">Scheduling</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="preferredDate" className="text-base font-medium">Preferred Date *</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => updateFormData('preferredDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`h-12 ${errors.preferredDate ? "border-red-500" : ""}`}
              />
              {errors.preferredDate && <p className="text-red-500 text-sm mt-2">{errors.preferredDate}</p>}
            </div>
            <div className="space-y-3">
              <Label htmlFor="preferredTime" className="text-base font-medium">Preferred Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => updateFormData('preferredTime', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00 - Early Morning</SelectItem>
                  <SelectItem value="10:00">10:00 - Mid Morning</SelectItem>
                  <SelectItem value="13:00">13:00 - Afternoon</SelectItem>
                  <SelectItem value="15:00">15:00 - Mid Afternoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6">Trailer Option</h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="noTrailer"
                    name="trailerOption"
                    checked={!formData.includeTrailer}
                    onChange={() => updateFormData('includeTrailer', false)}
                    className="w-4 h-4 text-[#ffd215] bg-gray-100 border-gray-300 focus:ring-[#ffd215] focus:ring-2"
                  />
                  <Label htmlFor="noTrailer" className="text-base font-medium">No Trailer</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="includeTrailer"
                    name="trailerOption"
                    checked={formData.includeTrailer}
                    onChange={() => updateFormData('includeTrailer', true)}
                    className="w-4 h-4 text-[#ffd215] bg-gray-100 border-gray-300 focus:ring-[#ffd215] focus:ring-2"
                  />
                  <Label htmlFor="includeTrailer" className="text-base font-medium">Include Trailer</Label>
                </div>
              </div>
              {formData.includeTrailer && (
                <div className="bg-[#ffd215] text-black px-4 py-2 rounded-lg font-bold text-lg">
                  +R450
                </div>
              )}
            </div>
            {formData.includeTrailer && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Trailer included:</strong> Additional space for larger items and bulk loads. Perfect for house moves and office relocations.
                </p>
              </div>
            )}
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="text-base font-medium">Contact Person *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => updateFormData('recipientName', e.target.value)}
                  placeholder="Full name"
                  className={`h-12 ${errors.recipientName ? "border-red-500" : ""}`}
                />
                {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone" className="text-base font-medium">Phone Number *</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => updateFormData('recipientPhone', e.target.value)}
                  placeholder="e.g., +27 12 345 6789"
                  className={`h-12 ${errors.recipientPhone ? "border-red-500" : ""}`}
                />
                {errors.recipientPhone && <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail" className="text-base font-medium">Email Address</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => updateFormData('recipientEmail', e.target.value)}
                  placeholder="email@example.com"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-base font-medium">Client Phone (if different)</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone || ''}
                  onChange={(e) => updateFormData('clientPhone', e.target.value)}
                  placeholder="e.g., +27 12 345 6789"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialInstructions" className="text-base font-medium">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                placeholder="Any special handling requirements, access codes, parking instructions, etc."
                rows={3}
                className="h-24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes" className="text-base font-medium">Delivery Notes</Label>
              <Textarea
                id="deliveryNotes"
                value={formData.deliveryNotes || ''}
                onChange={(e) => updateFormData('deliveryNotes', e.target.value)}
                placeholder="e.g. Call on arrival, leave at reception, etc."
                rows={3}
                maxLength={1000}
                className="h-24"
              />
              <p className="text-xs text-gray-500">{(formData.deliveryNotes || '').length}/1000 characters</p>
            </div>
          </div>
        </section>
        {formData.distance && formData.price && (
          <section className="bg-[#ffd215]/10 rounded-lg p-6 border border-[#ffd215]">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Price Estimation
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-2xl font-bold">{formData.distance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Total</p>
                <p className="text-2xl font-bold text-green-600">R{formData.price?.toLocaleString()}</p>
              </div>
            </div>
            {calculating && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ffd215]"></div>
                <span className="ml-2 text-sm">Calculating real-time pricing...</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              *Price includes distance calculation using Google Maps. Final price may vary based on actual requirements.
            </p>
          </section>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 py-3 sm:px-8 font-semibold text-base touch-manipulation"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || calculating}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black px-6 py-3 sm:px-8 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}