import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Clock, Truck, Home } from "lucide-react";

interface ServiceTypeSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

export const ServiceTypeSelector = ({ value, onChange }: ServiceTypeSelectorProps) => {
	return (
		<div>
			<Label htmlFor="service-type">Service Type *</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select service type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="standard">
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4" />
							<div>
								<div className="font-medium">Standard Delivery</div>
								<div className="text-xs text-gray-500">R100 flat fee • 3 days</div>
							</div>
						</div>
					</SelectItem>
					<SelectItem value="same-day">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<div>
								<div className="font-medium">Same-Day Delivery</div>
								<div className="text-xs text-gray-500">By 6 PM today</div>
							</div>
						</div>
					</SelectItem>
					<SelectItem value="swift-errand">
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4" />
							<div>
								<div className="font-medium">Swift Errand</div>
								<div className="text-xs text-gray-500">Shopping service</div>
							</div>
						</div>
					</SelectItem>
					<SelectItem value="instant">
						<div className="flex items-center gap-2">
							<Truck className="h-4 w-4" />
							<div>
								<div className="font-medium">Instant Delivery</div>
								<div className="text-xs text-gray-500">2-3 hours</div>
							</div>
						</div>
					</SelectItem>
					<SelectItem value="furniture-moving">
						<div className="flex items-center gap-2">
							<Home className="h-4 w-4" />
							<div>
								<div className="font-medium">Furniture Moving</div>
								<div className="text-xs text-gray-500">Trailer +R450 optional</div>
							</div>
						</div>
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
