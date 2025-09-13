"use client";
import React from 'react';

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
  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl text-[#ffd215]">Sender & Receiver Details</h2>
      <div className="flex flex-col gap-4">
        <input type="text" className="input" placeholder="Sender Name" value={sender.name} onChange={e => setSender({ ...sender, name: e.target.value })} />
        <input type="text" className="input" placeholder="Sender Phone" value={sender.phone} onChange={e => setSender({ ...sender, phone: e.target.value })} />
        <input type="text" className="input" placeholder="Receiver Name" value={receiver.name} onChange={e => setReceiver({ ...receiver, name: e.target.value })} />
        <input type="text" className="input" placeholder="Receiver Phone" value={receiver.phone} onChange={e => setReceiver({ ...receiver, phone: e.target.value })} />
      </div>
      <div className="flex gap-4">
        <button className="bg-gray-200 px-6 py-2 rounded font-bold" onClick={onBack}>Back</button>
        <button className="bg-[#ffd215] px-6 py-2 rounded font-bold" onClick={onNext}>Proceed to Payment</button>
      </div>
    </div>
  );
}
