export interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: any) => void;
  onClose?: () => void;
}

// Proper global declaration for PaystackPop
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export function payWithPaystack(options: PaystackOptions) {
  console.log('payWithPaystack - Options:', {
    key: options.key.substring(0, 10) + '...',
    email: options.email,
    amount: options.amount,
    currency: options.currency,
    ref: options.ref,
  });

  const launchPaystack = () => {
    if (!window.PaystackPop) {
      console.error('PaystackPop not available on window object');
      if (options.onClose) options.onClose();
      return;
    }

    const handler = window.PaystackPop.setup({
      key: options.key,
      email: options.email,
      amount: options.amount,
      currency: options.currency || 'ZAR',
      ref: options.ref || `TMOF-${Date.now()}`,
      metadata: options.metadata || {},
      callback: (response: any) => {
        console.log('Paystack payment successful:', response);
        options.onSuccess(response);
      },
      onClose: () => {
        console.log('Paystack payment window closed');
        if (options.onClose) options.onClose();
      },
    });
    
    handler.openIframe();
  };

  if (window.PaystackPop) {
    launchPaystack();
  } else {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('Paystack script loaded');
      // Give it a moment to initialize
      setTimeout(launchPaystack, 100);
    };
    script.onerror = (error) => {
      console.error('Failed to load Paystack script:', error);
      if (options.onClose) options.onClose();
    };
    document.body.appendChild(script);
  }
}

// Alternative method for direct Paystack integration (if needed)
export const initializePaystackPayment = async (options: PaystackOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const paystackOptions = {
      ...options,
      onSuccess: (response: any) => {
        console.log('Paystack payment successful:', response);
        options.onSuccess(response);
        resolve();
      },
      onClose: () => {
        console.log('Paystack payment window closed');
        if (options.onClose) options.onClose();
        reject(new Error('Payment window closed by user'));
      },
    };
    
    payWithPaystack(paystackOptions);
  });
};

// Utility function to check if Paystack is loaded
export const isPaystackLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.PaystackPop;
};

// Utility function to get Paystack transaction reference
export const generatePaystackReference = (prefix: string = 'TMOF'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};