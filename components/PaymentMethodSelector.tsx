import React from 'react';
const PaymentMethodSelector = ({ selectedMethod, onMethodSelect, walletBalance, orderTotal, canOrderWithoutPayment, disabled }: any) => (
  <div className="mb-4">
    <div className="font-semibold mb-2">Select Payment Method</div>
    <button type="button" disabled={disabled} className={`mr-2 px-4 py-2 rounded ${selectedMethod === 'wallet' ? 'bg-[#ffd215] text-black' : 'bg-gray-200'}`} onClick={() => onMethodSelect('wallet')}>
      Wallet (Balance: R{walletBalance})
    </button>
    <button type="button" disabled={disabled} className={`px-4 py-2 rounded ${selectedMethod === 'paystack' ? 'bg-[#ffd215] text-black' : 'bg-gray-200'}`} onClick={() => onMethodSelect('paystack')}>
      Paystack
    </button>
    {canOrderWithoutPayment && <div className="text-xs text-gray-500 mt-2">You can order without payment</div>}
  </div>
);
export default PaymentMethodSelector;
