
export interface PaystackOptions {
  key: string; // Your public key
  email: string;
  amount: number; // In kobo (NGN) or cents (ZAR)
  currency?: string; // 'NGN' or 'ZAR'
  ref?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: any) => void;
  onClose?: () => void;
}

export function payWithPaystack(options: PaystackOptions) {
  console.log('payWithPaystack - Options:', {
    key: options.key.substring(0, 10) + '...', // Mask key for logging
    email: options.email,
    amount: options.amount,
    currency: options.currency,
    ref: options.ref,
  });
  // Ensure Paystack script is loaded
  if (!(window as any).PaystackPop) {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => launchPaystack(options);
    document.body.appendChild(script);
  } else {
    launchPaystack(options);
  }
}

function launchPaystack(options: PaystackOptions) {
  const handler = (window as any).PaystackPop.setup({
    key: options.key,
    email: options.email,
    amount: options.amount,
    currency: options.currency || 'ZAR',
    ref: options.ref || `TMOF-ORDER-${Date.now()}`, // Match backend format
    metadata: options.metadata || {},
    callback: (response: any) => {
      console.log('payWithPaystack - Payment success:', response);
      options.onSuccess(response);
    },
    onClose: () => {
      console.log('payWithPaystack - Payment popup closed');
      if (options.onClose) options.onClose();
    },
  });
  handler.openIframe();
}