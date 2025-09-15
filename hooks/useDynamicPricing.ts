import { useState } from 'react';

interface PricingResult {
	base_fee: number;
	distance_fee: number;
	weight_fee: number;
	service_fee: number;
	surge_multiplier: number;
	peak_multiplier: number;
	is_peak_hours: boolean;
	total_amount: number;
	breakdown: {
		base: number;
		distance: number;
		weight: number;
		service: number;
		surge_amount: number;
	};
	custom_pricing?: {
		company_name: string;
		pricing_type: string;
	};
}

export const useDynamicPricing = () => {
	const [pricing, setPricing] = useState<PricingResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);

		const calculatePricing = async (
			distance: number, 
			customerEmail?: string, 
			serviceType: string = 'same-day',
			weight: number = 0,
			purchaseAmount: number = 0
		) => {
			setIsCalculating(true);
			// Mock pricing logic only
			await new Promise(res => setTimeout(res, 500));
			const result = calculateNewPricing(distance, serviceType, weight, purchaseAmount);
			setPricing(result);
			setIsCalculating(false);
			return result;
		};

	const calculateNewPricing = (distance: number, serviceType: string, weight: number, purchaseAmount: number): PricingResult => {
		let baseFee = 0;
		let distanceFee = 0;
		let weightFee = 0;
		let serviceFee = 0;
    
		const isPeakHours = checkPeakHours();
		const peakMultiplier = isPeakHours ? 1.2 : 1.0;

		switch (serviceType) {
			case 'standard':
				// Standard Delivery: Flat R100, weight fee only if above 5kg, no distance/peak surcharge
				baseFee = 100;
				distanceFee = 0; // No distance fee for standard
				weightFee = weight > 5 ? (weight - 5) * 4 : 0; // Only charge for weight above 5kg
				serviceFee = 0;
				// No peak multiplier for standard delivery
				break;

			case 'same-day':
				// Same-Day: R80 base (covers first 10km), R4/km after 10km, weight fee only if above 5kg
				baseFee = 80;
				distanceFee = distance > 10 ? (distance - 10) * 4 : 0;
				weightFee = weight > 5 ? (weight - 5) * 4 : 0; // Fixed: Only charge for weight above 5kg
				serviceFee = 0;
				break;

			case 'swift-errand':
				// Swift Errand: Same as same-day + service fee
				baseFee = 80;
				distanceFee = distance > 10 ? (distance - 10) * 4 : 0;
				weightFee = weight > 5 ? (weight - 5) * 4 : 0;
				serviceFee = purchaseAmount < 1500 ? 150 : purchaseAmount * 0.1;
				break;

			case 'instant':
				// Instant: R80 base (covers first 10km), R5.50/km after 10km, weight fee for all weight
				baseFee = 80;
				distanceFee = distance > 10 ? (distance - 10) * 5.5 : 0;
				weightFee = weight * 4; // Instant charges for all weight
				serviceFee = 0;
				break;

			default:
				baseFee = 80;
				distanceFee = distance * 4;
				weightFee = weight > 5 ? (weight - 5) * 4 : 0;
				serviceFee = 0;
		}

		// Calculate subtotal before peak multiplier
		const subtotal = baseFee + distanceFee + weightFee + serviceFee;
    
		// Apply peak multiplier (except for standard delivery)
		const finalMultiplier = serviceType === 'standard' ? 1.0 : peakMultiplier;
		const totalAmount = subtotal * finalMultiplier;
		const surgeAmount = subtotal * (finalMultiplier - 1);

		return {
			base_fee: baseFee,
			distance_fee: distanceFee,
			weight_fee: weightFee,
			service_fee: serviceFee,
			surge_multiplier: finalMultiplier,
			peak_multiplier: finalMultiplier,
			is_peak_hours: isPeakHours && serviceType !== 'standard',
			total_amount: totalAmount,
			breakdown: {
				base: baseFee,
				distance: distanceFee,
				weight: weightFee,
				service: serviceFee,
				surge_amount: surgeAmount
			}
		};
	};

	const checkPeakHours = (): boolean => {
		const now = new Date();
		const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
		const hour = now.getHours();
    
		// Peak hours: Monday-Friday (1-5), 7-9 AM and 5-7 PM
		const isWeekday = day >= 1 && day <= 5;
		const isMorningPeak = hour >= 7 && hour < 9;
		const isEveningPeak = hour >= 17 && hour < 19;
    
		return isWeekday && (isMorningPeak || isEveningPeak);
	};

	const getSurgeInfo = () => {
		const isPeak = checkPeakHours();
    
		return {
			isPeak,
			peakMessage: isPeak 
				? "⚡ Peak hours pricing is active (20% surcharge)" 
				: "✅ Normal pricing is active"
		};
	};

	return {
		pricing,
		isCalculating,
		calculatePricing,
		getSurgeInfo
	};
};