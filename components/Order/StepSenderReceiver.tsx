"use client";
import React, { useState } from 'react';
import TmofSpinner from '@/components/ui/TmofSpinner';

type Contact = { name: string; phone: string };
type Props = {
  sender: Contact;
  setSender: (val: Contact) => void;
  receiver: Contact;
  setReceiver: (val: Contact) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepSenderReceiver({ sender, setSender, receiver, setReceiver, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);

  function handleNext() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <TmofSpinner show={loading} />
      <h2 className="font-bold text-xl sm:text-2xl text-[#0C0E29] mb-6">Sender & Receiver Details</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sender Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sender Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
                placeholder="Enter sender name" 
                value={sender.name} 
                onChange={e => setSender({ ...sender, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sender Phone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
                placeholder="Enter sender phone number" 
                value={sender.phone} 
                onChange={e => setSender({ ...sender, phone: e.target.value })} 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Receiver Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Receiver Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
                placeholder="Enter receiver name" 
                value={receiver.name} 
                onChange={e => setReceiver({ ...receiver, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Receiver Phone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent text-base sm:text-lg touch-manipulation" 
                placeholder="Enter receiver phone number" 
                value={receiver.phone} 
                onChange={e => setReceiver({ ...receiver, phone: e.target.value })} 
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-xl font-semibold text-lg transition-colors touch-manipulation" 
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="flex-1 bg-[#ffd215] hover:bg-[#e5bd13] text-black px-6 py-4 rounded-xl font-semibold text-lg transition-colors touch-manipulation shadow-lg hover:shadow-xl" 
          onClick={handleNext}
          disabled={!sender.name || !sender.phone || !receiver.name || !receiver.phone}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
