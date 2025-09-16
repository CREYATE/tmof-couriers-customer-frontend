import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "lucide-react";

interface AddressInputProps {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	mapsLoaded: boolean;
	isCalculatingDistance?: boolean;
	required?: boolean;
}

interface PlaceSuggestion {
	description: string;
	place_id: string;
}

// Mocked address suggestions for now
const MOCK_SUGGESTIONS: PlaceSuggestion[] = [
	{ description: "123 Main St, Cape Town", place_id: "1" },
	{ description: "456 Long St, Johannesburg", place_id: "2" },
	{ description: "789 Beach Rd, Durban", place_id: "3" },
];

export const AddressInput = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	mapsLoaded,
	isCalculatingDistance = false,
	required = false
}: AddressInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const fetchSuggestions = async (input: string) => {
		if (!input || input.length < 3) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}
		setIsLoading(true);
		// Simulate API delay
		setTimeout(() => {
			setSuggestions(MOCK_SUGGESTIONS.filter(s => s.description.toLowerCase().includes(input.toLowerCase())));
			setShowSuggestions(true);
			setIsLoading(false);
		}, 400);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		onChange(newValue);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			if (mapsLoaded) {
				fetchSuggestions(newValue);
			}
		}, 300);
	};

	const handleSuggestionClick = (suggestion: PlaceSuggestion) => {
		onChange(suggestion.description);
		setSuggestions([]);
		setShowSuggestions(false);
	};

	const handleInputBlur = () => {
		setTimeout(() => {
			setShowSuggestions(false);
		}, 200);
	};

	const handleInputFocus = () => {
		if (suggestions.length > 0) {
			setShowSuggestions(true);
		}
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="relative">
			<Label htmlFor={id}>{label} {required && "*"}</Label>
			<div className="relative">
				<Input
					ref={inputRef}
					id={id}
					placeholder={mapsLoaded ? `${placeholder} (Start typing for suggestions)` : "Enter address..."}
					value={value}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					maxLength={500}
					className="relative z-10"
					autoComplete="off"
				/>
				{(isCalculatingDistance || isLoading) && (
					<Navigation className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
				)}
			</div>

			{/* Address Suggestions Dropdown */}
			{showSuggestions && suggestions.length > 0 && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
					{suggestions.map((suggestion, index) => (
						<div
							key={suggestion.place_id || index}
							className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
							onClick={() => handleSuggestionClick(suggestion)}
						>
							<div className="text-sm text-gray-900">
								{suggestion.description}
							</div>
						</div>
					))}
				</div>
			)}

			{mapsLoaded && (
				<p className="text-xs text-gray-500 mt-1">
					📍 Address suggestions are currently mocked. Backend integration coming soon.
				</p>
			)}
		</div>
	);
};
