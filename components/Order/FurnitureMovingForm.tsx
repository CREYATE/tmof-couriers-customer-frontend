import React, { useState, useEffect } from "react";
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

interface FurnitureOrderData {
  // Addresses
  pickupAddress: string;
  deliveryAddress: string;
  
  // Building Details - Pickup
  pickupBuildingName: string;
  pickupFloor: number;
  pickupUnitNumber: string;
  pickupHasElevator: boolean;
  pickupParkingAccess: string; // close, medium, far
  
  // Building Details - Delivery
  deliveryBuildingName: string;
  deliveryFloor: number;
  deliveryUnitNumber: string;
  deliveryHasElevator: boolean;
  deliveryParkingAccess: string;
  
  // Move Type
  moveType: "apartment" | "office" | "house" | "storage";
  
  // Furniture & Items
  furnitureDescription: string;
  estimatedVolume: string; // small_load, medium_load, large_load, full_house
  hasFragileItems: boolean;
  requiresDisassembly: boolean;
  
  // Services
  packingRequired: boolean;
  needsPackingMaterials: boolean;
  storageRequired: boolean;
  requiresInsurance: boolean;
  
  // Scheduling
  preferredDate: string;
  preferredTime: string;
  isFlexibleTiming: boolean;
  
  // Additional Info
  specialInstructions: string;
  
  // Contact Info
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  
  // Calculated
  distance?: number;
  price?: number;
}

interface FurnitureMovingFormProps {
  orderData: Partial<FurnitureOrderData>;
  onNext: (data: FurnitureOrderData) => void;
  onBack: () => void;
}

export default function FurnitureMovingForm({ orderData, onNext, onBack }: FurnitureMovingFormProps) {
  const [formData, setFormData] = useState<FurnitureOrderData>({
    // Initialize with existing data or defaults
    pickupAddress: orderData.pickupAddress || "",
    deliveryAddress: orderData.deliveryAddress || "",
    pickupBuildingName: orderData.pickupBuildingName || "",
    pickupFloor: orderData.pickupFloor || 0,
    pickupUnitNumber: orderData.pickupUnitNumber || "",
    pickupHasElevator: orderData.pickupHasElevator || false,
    pickupParkingAccess: orderData.pickupParkingAccess || "close",
    deliveryBuildingName: orderData.deliveryBuildingName || "",
    deliveryFloor: orderData.deliveryFloor || 0,
    deliveryUnitNumber: orderData.deliveryUnitNumber || "",
    deliveryHasElevator: orderData.deliveryHasElevator || false,
    deliveryParkingAccess: orderData.deliveryParkingAccess || "close",
    moveType: orderData.moveType || "apartment",
    furnitureDescription: orderData.furnitureDescription || "",
    estimatedVolume: orderData.estimatedVolume || "medium_load",
    hasFragileItems: orderData.hasFragileItems || false,
    requiresDisassembly: orderData.requiresDisassembly || false,
    packingRequired: orderData.packingRequired || false,
    needsPackingMaterials: orderData.needsPackingMaterials || false,
    storageRequired: orderData.storageRequired || false,
    requiresInsurance: orderData.requiresInsurance || false,
    preferredDate: orderData.preferredDate || "",
    preferredTime: orderData.preferredTime || "",
    isFlexibleTiming: orderData.isFlexibleTiming || false,
    specialInstructions: orderData.specialInstructions || "",
    recipientName: orderData.recipientName || "",
    recipientPhone: orderData.recipientPhone || "",
    recipientEmail: orderData.recipientEmail || "",
  });

  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate distance and price when addresses change
  useEffect(() => {
    if (formData.pickupAddress && formData.deliveryAddress && 
        formData.pickupAddress !== formData.deliveryAddress) {
      calculatePricing();
    }
  }, [formData.pickupAddress, formData.deliveryAddress, formData.estimatedVolume, 
      formData.packingRequired, formData.requiresDisassembly]);

  const calculatePricing = async () => {
    try {
      setCalculating(true);
      
      // Mock distance calculation (replace with Google Maps API)
      const mockDistance = Math.floor(Math.random() * 50) + 5; // 5-55 km
      
      // Furniture moving pricing logic
      let basePrice = 800; // Base price for furniture moving
      let distancePrice = mockDistance * 25; // R25 per km
      
      // Volume multiplier
      const volumeMultipliers = {
        small_load: 0.6,    // Small apartment/few items
        medium_load: 1.0,   // 2-3 bedroom apartment
        large_load: 1.8,    // Large house/4+ bedrooms
        full_house: 2.5     // Entire house move
      };
      
      // Floor charges (per floor above ground)
      const pickupFloorCharge = Math.max(0, formData.pickupFloor) * (formData.pickupHasElevator ? 50 : 100);
      const deliveryFloorCharge = Math.max(0, formData.deliveryFloor) * (formData.deliveryHasElevator ? 50 : 100);
      
      // Service charges
      const packingCharge = formData.packingRequired ? 500 : 0;
      const disassemblyCharge = formData.requiresDisassembly ? 300 : 0;
      const parkingCharges = (
        (formData.pickupParkingAccess === 'far' ? 200 : formData.pickupParkingAccess === 'medium' ? 100 : 0) +
        (formData.deliveryParkingAccess === 'far' ? 200 : formData.deliveryParkingAccess === 'medium' ? 100 : 0)
      );
      
      const totalPrice = Math.round(
        (basePrice + distancePrice) * volumeMultipliers[formData.estimatedVolume as keyof typeof volumeMultipliers] +
        pickupFloorCharge + deliveryFloorCharge + packingCharge + disassemblyCharge + parkingCharges
      );
      
      setFormData(prev => ({
        ...prev,
        distance: mockDistance,
        price: totalPrice
      }));
      
    } catch (error) {
      console.error("Error calculating pricing:", error);
    } finally {
      setCalculating(false);
    }
  };

  const updateFormData = (field: keyof FurnitureOrderData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext(formData);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <TmofSpinner show={loading} />
      
      <Card className="p-8 shadow-lg">
        <div className="space-y-10">
          {/* Move Type */}
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

          {/* Addresses */}
          <section>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Addresses
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="pickupAddress" className="text-base font-medium">Pickup Address *</Label>
                <Input
                  id="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                  placeholder="Enter full pickup address"
                  className={`h-12 ${errors.pickupAddress ? "border-red-500" : ""}`}
                />
                {errors.pickupAddress && <p className="text-red-500 text-sm mt-2">{errors.pickupAddress}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="deliveryAddress" className="text-base font-medium">Delivery Address *</Label>
                <Input
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                  placeholder="Enter full delivery address"
                  className={`h-12 ${errors.deliveryAddress ? "border-red-500" : ""}`}
                />
                {errors.deliveryAddress && <p className="text-red-500 text-sm mt-2">{errors.deliveryAddress}</p>}
              </div>
            </div>
          </section>

          {/* Pickup Location Details */}
          <section>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Pickup Location Details
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
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
                <Label htmlFor="pickupFloor" className="text-base font-medium">Floor Number</Label>
                <Input
                  id="pickupFloor"
                  type="number"
                  min="0"
                  value={formData.pickupFloor}
                  onChange={(e) => updateFormData('pickupFloor', parseInt(e.target.value) || 0)}
                  placeholder="0 for ground floor"
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
            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="pickupElevator"
                  checked={formData.pickupHasElevator}
                  onCheckedChange={(checked: boolean) => updateFormData('pickupHasElevator', !!checked)}
                />
                <Label htmlFor="pickupElevator" className="text-base">Elevator available at pickup</Label>
              </div>
            </div>
          </section>

          {/* Delivery Location Details */}
          <section>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Delivery Location Details
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
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
                <Label htmlFor="deliveryFloor" className="text-base font-medium">Floor Number</Label>
                <Input
                  id="deliveryFloor"
                  type="number"
                  min="0"
                  value={formData.deliveryFloor}
                  onChange={(e) => updateFormData('deliveryFloor', parseInt(e.target.value) || 0)}
                  placeholder="0 for ground floor"
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
            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="deliveryElevator"
                  checked={formData.deliveryHasElevator}
                  onCheckedChange={(checked: boolean) => updateFormData('deliveryHasElevator', !!checked)}
                />
                <Label htmlFor="deliveryElevator" className="text-base">Elevator available at delivery</Label>
              </div>
            </div>
          </section>

          {/* Furniture & Volume */}
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
              
              <div className="space-y-3">
                <Label htmlFor="estimatedVolume" className="text-base font-medium">Estimated Load Size</Label>
                <Select value={formData.estimatedVolume} onValueChange={(value) => updateFormData('estimatedVolume', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small_load">Small Load - Few items/Studio apartment</SelectItem>
                    <SelectItem value="medium_load">Medium Load - 1-2 bedroom apartment</SelectItem>
                    <SelectItem value="large_load">Large Load - 3-4 bedroom house</SelectItem>
                    <SelectItem value="full_house">Full House - 5+ bedroom house</SelectItem>
                    <SelectItem value="small_office">Small Office - 1-5 desks</SelectItem>
                    <SelectItem value="medium_office">Medium Office - 6-15 desks</SelectItem>
                    <SelectItem value="large_office">Large Office - 16+ desks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Scheduling */}
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

          {/* Contact Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="recipientName">Contact Person *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => updateFormData('recipientName', e.target.value)}
                  placeholder="Full name"
                  className={errors.recipientName ? "border-red-500" : ""}
                />
                {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
              </div>
              <div>
                <Label htmlFor="recipientPhone">Phone Number *</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => updateFormData('recipientPhone', e.target.value)}
                  placeholder="e.g., +27 12 345 6789"
                  className={errors.recipientPhone ? "border-red-500" : ""}
                />
                {errors.recipientPhone && <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>}
              </div>
              <div>
                <Label htmlFor="recipientEmail">Email Address</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => updateFormData('recipientEmail', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </section>

          {/* Special Instructions */}
          <section>
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                placeholder="Any special handling requirements, access codes, parking instructions, etc."
                rows={3}
              />
            </div>
          </section>

          {/* Price Estimation */}
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
                <div className="flex items-center mt-2">
                  <TmofSpinner show={true} />
                  <span className="ml-2 text-sm">Calculating...</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                *Final price may vary based on actual volume and services required
              </p>
            </section>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || calculating}
            className="bg-[#ffd215] hover:bg-[#e5bd13] text-black px-8"
          >
            Continue to Payment
          </Button>
        </div>
      </Card>
    </div>
  );
}