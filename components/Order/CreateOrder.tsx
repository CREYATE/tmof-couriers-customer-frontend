import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, CheckCircle, CreditCard } from "lucide-react";

const orderTypes = [
	{ value: "document", label: "Document Delivery", icon: <Package className="mr-2 h-4 w-4" /> },
	{ value: "parcel", label: "Parcel Delivery", icon: <Package className="mr-2 h-4 w-4" /> },
	{ value: "furniture", label: "Furniture Moving (Gauteng only)", icon: <Truck className="mr-2 h-4 w-4" /> },
];

const CreateOrder = ({ onCreateOrder }: { onCreateOrder?: (orderData: any) => void }) => {
	const [step, setStep] = useState(1);
	const [orderType, setOrderType] = useState("");
	const [region, setRegion] = useState("");
	const [deliveryDetails, setDeliveryDetails] = useState({
		pickup: "",
		dropoff: "",
		recipient: "",
		phone: "",
		instructions: "",
	});
	const [price, setPrice] = useState<number | null>(null);
	const [trackingNumber, setTrackingNumber] = useState<string>("");

	// Step 1: Order Type
	const handleOrderTypeNext = () => {
		if (!orderType) return;
		if (orderType === "furniture" && region !== "gauteng") return;
		setStep(2);
	};

	// Step 2: Delivery Details
	const handleDeliveryNext = () => {
		if (!deliveryDetails.pickup || !deliveryDetails.dropoff || !deliveryDetails.recipient || !deliveryDetails.phone) return;
		setPrice(250 + (orderType === "furniture" ? 200 : 0)); // Mock pricing
		setStep(3);
	};

	// Step 3: Payment
	const handlePaymentNext = () => {
		setTrackingNumber("TMOF-" + Math.random().toString(36).slice(2, 10).toUpperCase());
		setStep(4);
		if (onCreateOrder) {
			onCreateOrder({
				order_type: orderType,
				region,
				...deliveryDetails,
				price,
				tracking_number: trackingNumber,
			});
		}
	};

	// Step 4: Confirmation
	const handleNewOrder = () => {
		setStep(1);
		setOrderType("");
		setRegion("");
		setDeliveryDetails({ pickup: "", dropoff: "", recipient: "", phone: "", instructions: "" });
		setPrice(null);
		setTrackingNumber("");
	};

	return (
		<Card className="max-w-xl mx-auto mt-8 shadow-lg">
			<CardHeader>
				<CardTitle>
					{step === 1 && "Order Type"}
					{step === 2 && "Delivery Details"}
					{step === 3 && "Payment"}
					{step === 4 && "Order Created"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{step === 1 && (
					<div className="space-y-6">
						<div>
							<label className="block font-semibold mb-2">Select Region</label>
							<Select value={region} onValueChange={setRegion}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choose region" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gauteng">Gauteng</SelectItem>
									<SelectItem value="western_cape">Western Cape</SelectItem>
									<SelectItem value="kwazulu_natal">KwaZulu-Natal</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="block font-semibold mb-2">Type of Order</label>
							<div className="grid grid-cols-1 gap-3">
								{orderTypes.map(type => (
									<button
										key={type.value}
										className={`flex items-center px-4 py-3 rounded border ${orderType === type.value ? "border-[#ffd215] bg-gray-50" : "border-gray-200 bg-white"} font-semibold text-left`}
										onClick={() => setOrderType(type.value)}
										disabled={type.value === "furniture" && region !== "gauteng"}
									>
										{type.icon}
										{type.label}
									</button>
								))}
							</div>
						</div>
						<Button className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black" onClick={handleOrderTypeNext} disabled={!orderType || (orderType === "furniture" && region !== "gauteng")}>Next</Button>
					</div>
				)}
				{step === 2 && (
					<form className="space-y-4" onSubmit={e => { e.preventDefault(); handleDeliveryNext(); }}>
						<Input placeholder="Pickup Address" value={deliveryDetails.pickup} onChange={e => setDeliveryDetails(d => ({ ...d, pickup: e.target.value }))} />
						<Input placeholder="Dropoff Address" value={deliveryDetails.dropoff} onChange={e => setDeliveryDetails(d => ({ ...d, dropoff: e.target.value }))} />
						<Input placeholder="Recipient Name" value={deliveryDetails.recipient} onChange={e => setDeliveryDetails(d => ({ ...d, recipient: e.target.value }))} />
						<Input placeholder="Recipient Phone" value={deliveryDetails.phone} onChange={e => setDeliveryDetails(d => ({ ...d, phone: e.target.value }))} />
						<Textarea placeholder="Special Instructions (optional)" value={deliveryDetails.instructions} onChange={e => setDeliveryDetails(d => ({ ...d, instructions: e.target.value }))} />
						<div className="flex justify-between gap-2">
							<Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
							<Button type="submit" className="bg-[#ffd215] hover:bg-[#e5bd13] text-black">Proceed to Payment</Button>
						</div>
					</form>
				)}
				{step === 3 && (
					<div className="space-y-6 text-center">
						<CreditCard className="mx-auto h-10 w-10 text-[#ffd215] mb-2" />
						<div className="text-lg font-semibold">Order Price</div>
						<div className="text-3xl font-bold mb-2">R{price}</div>
						<div className="text-gray-500 mb-4">Mock payment page. Click below to complete your order.</div>
						<div className="flex justify-between gap-2">
							<Button variant="outline" onClick={() => setStep(2)}>Back</Button>
							<Button className="bg-[#ffd215] hover:bg-[#e5bd13] text-black" onClick={handlePaymentNext}>Complete Order</Button>
						</div>
					</div>
				)}
				{step === 4 && (
					<div className="space-y-6 text-center">
						<CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
						<div className="text-lg font-semibold">Order Created!</div>
						<div className="text-gray-700">Your tracking number:</div>
						<div className="text-2xl font-bold text-[#ffd215]">{trackingNumber}</div>
						<Button className="mt-4 bg-[#ffd215] hover:bg-[#e5bd13] text-black" onClick={handleNewOrder}>Create Another Order</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CreateOrder;
