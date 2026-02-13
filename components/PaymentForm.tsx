
import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PaymentData, PaymentStatus } from '../types';
import { ADMIN_NUMBER, MIN_AMOUNT } from '../constants';
import { submitPayment } from '../services/paymentService';

interface OrderSummary {
  productNo: string;
  amount: number;
  time: string;
  username: string;
}

interface PaymentFormProps {
  initialData?: { productNo: string; amount: number } | null;
  onCancel?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ initialData, onCancel }) => {
  const [formData, setFormData] = useState<PaymentData>({
    username: '',
    amount: initialData?.amount || 10,
    trx: '',
    productNo: initialData?.productNo || ''
  });
  
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    success: false,
    error: null
  });

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync with initialData if it changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        amount: initialData.amount,
        productNo: initialData.productNo
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.amount || !formData.trx || !formData.productNo) {
      setStatus({ ...status, error: "সবগুলো ঘর পূরণ করুন!" });
      return;
    }

    if (formData.amount < MIN_AMOUNT) {
      setStatus({ ...status, error: `সর্বনিম্ন পরিমাণ ${MIN_AMOUNT} টাকা!` });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      await submitPayment(formData);
      
      setOrderSummary({
        productNo: formData.productNo,
        amount: formData.amount,
        username: formData.username,
        time: new Date().toLocaleString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true,
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      });

      setStatus({ loading: false, success: true, error: null });
      setFormData({ username: '', amount: initialData?.amount || 10, trx: '', productNo: initialData?.productNo || '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
    }
  };

  if (status.success && orderSummary) {
    return (
      <div className="bg-white/5 p-8 rounded-2xl border border-[#e2136e]/30 flex flex-col gap-6 animate-in fade-in zoom-in duration-500 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-4xl shadow-inner">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Order Received!</h3>
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              Your order has been submitted successfully. A moderator will verify it shortly. After verification, you will receive your product.
            </p>
          </div>
        </div>

        <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          <div className="bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 flex justify-between">
            <span>Order Summary</span>
            <span className="text-[#e2136e]">Verified Transaction</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Product No</span>
              <span className="font-mono font-bold text-white">{orderSummary.productNo}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Player</span>
              <span className="text-white">{orderSummary.username}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order Time</span>
              <span className="text-white/80">{orderSummary.time}</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-gray-400 font-bold">Total Price</span>
              <span className="text-xl font-bold text-[#e2136e]">{orderSummary.amount} BDT</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => setStatus({ ...status, success: false })} className="w-full">
            Confirm and Finish
          </Button>
          <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            Thank you for supporting Arif SMP
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col gap-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {initialData && (
        <button 
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{initialData ? 'Market Checkout' : 'Submit Payment'}</h2>
        <p className="text-gray-400 text-sm">টাকা পাঠানোর পর নিচের তথ্যগুলো দিন</p>
      </div>

      <div className="bg-[#e2136e]/10 border border-[#e2136e]/20 p-4 rounded-xl flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#e2136e] uppercase font-bold tracking-widest">Pay to (Personal)</p>
          <div className="flex items-center gap-3">
            <p className="text-xl font-mono font-bold tracking-wider">{ADMIN_NUMBER}</p>
            <button 
              type="button"
              onClick={handleCopy}
              className={`transition-all p-1.5 rounded-md flex items-center gap-2 text-xs font-bold ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#e2136e] hover:bg-[#e2136e] hover:text-white'}`}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Send Money Only</p>
        </div>
        <div className="flex gap-2">
            <span className="bg-[#e2136e] text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">bKash</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input 
          label="Minecraft Username" 
          icon="fa-user" 
          placeholder="e.g. ArifGamer_HD" 
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input 
          label="Product No" 
          icon="fa-box" 
          placeholder="Enter Product or Package No" 
          name="productNo"
          value={formData.productNo}
          onChange={handleChange}
          readOnly={!!initialData}
          className={initialData ? 'opacity-50 cursor-not-allowed bg-black/20' : ''}
        />
        <Input 
          label="Amount (Tk)" 
          icon="fa-money-bill-wave" 
          type="number" 
          placeholder="Min 10 Tk" 
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          readOnly={!!initialData}
          className={initialData ? 'opacity-50 cursor-not-allowed bg-black/20' : ''}
        />
        <Input 
          label="Transaction ID" 
          icon="fa-key" 
          placeholder="সেন্ড মানি করার পর প্রাপ্ত TrxID" 
          name="trx"
          value={formData.trx}
          onChange={handleChange}
        />
      </div>

      {status.error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i>
          {status.error}
        </div>
      )}

      <Button type="submit" isLoading={status.loading} className="w-full">
        Confirm Purchase
      </Button>
    </form>
  );
};
