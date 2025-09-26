// declare global {
// 	interface Window {
// 		PaystackPop?: any;
// 	}
// }
// import { useCallback } from "react";

// type PaystackConfig = {
// 	publicKey: string;
// };

// type PaystackPaymentProps = {
// 	email: string;
// 	amount: number;
// 	reference?: string;
// 	firstname?: string;
// 	lastname?: string;
// 	phone?: string;
// 	metadata?: Record<string, any>;
// 	onSuccess: (reference: string) => void;
// 	onClose: () => void;
// };

// type InitPayment = (config: PaystackPaymentProps) => void;

// type UsePaystackPaymentReturn = InitPayment;

// export const usePaystackPayment = (
// 	config: PaystackConfig
// ): UsePaystackPaymentReturn => {
// 	const initializePayment = useCallback<InitPayment>(
// 		({
// 			email,
// 			amount,
// 			reference = "",
// 			firstname = "",
// 			lastname = "",
// 			phone = "",
// 			metadata = {},
// 			onSuccess,
// 			onClose,
// 		}) => {
// 			// Load Paystack script if not already loaded
// 			if (!window.PaystackPop) {
// 				console.log("Loading Paystack script...");
// 				const script = document.createElement("script");
// 				script.src = "https://js.paystack.co/v1/inline.js";
// 				script.async = true;
        
// 				script.onload = () => {
// 					console.log("Paystack script loaded successfully");
// 					initializePaystackPayment();
// 				};
        
// 				script.onerror = () => {
// 					console.error("Failed to load Paystack script");
// 				};
        
// 				document.body.appendChild(script);
// 			} else {
// 				console.log("Paystack script already loaded");
// 				initializePaystackPayment();
// 			}

// 			function initializePaystackPayment() {
// 				if (window.PaystackPop) {
// 					console.log("Initializing Paystack payment with config:", {
// 						key: config.publicKey,
// 						email,
// 						amount,
// 						currency: "ZAR",
// 						reference: reference || generateReference(),
// 					});
          
// 					const handler = window.PaystackPop.setup({
// 						key: config.publicKey,
// 						email,
// 						amount,
// 						currency: "ZAR",
// 						ref: reference || generateReference(),
// 						firstname,
// 						lastname,
// 						phone,
// 						metadata,
// 						callback: function(response: { reference: string }) {
// 							console.log("Payment successful:", response);
// 							onSuccess(response.reference);
// 						},
// 						onClose: function() {
// 							console.log("Payment window closed");
// 							onClose();
// 						},
// 					});
// 					handler.openIframe();
// 				} else {
// 					console.error("PaystackPop is not available");
// 				}
// 			}
// 		},
// 		[config.publicKey]
// 	);

// 	return initializePayment;
// };

// // Generate a random reference
// const generateReference = (): string => {
// 	const date = new Date().getTime();
// 	return `trx-${date}-${Math.floor(Math.random() * 1000000)}`;
// };

// export default usePaystackPayment;