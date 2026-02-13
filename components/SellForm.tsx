
import React, { useState, useRef } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SellData, PaymentStatus, LandListing, BuildType } from '../types';
import { generateUniqueCode } from '../utils/codeGenerator';
import { submitListing } from '../services/listingService';

export const SellForm: React.FC = () => {
  const [formData, setFormData] = useState<SellData>({
    landX: '',
    landY: '',
    price: 0,
    buildType: 'Home',
    imageUrl: '',
    sellerBkash: ''
  });
  
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    success: false,
    error: null
  });

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus({ ...status, error: "Image size must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const setBuildType = (type: BuildType) => {
    setFormData(prev => ({ ...prev, buildType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.landX || !formData.landY || !formData.price || !formData.buildType || !formData.sellerBkash) {
      setStatus({ ...status, error: "সবগুলো ঘর পূরণ করুন!" });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const code = generateUniqueCode();
      
      // Professional ID Generation: ID-YEAR-RANDOM (e.g., ID-25-A1B2C)
      const year = new Date().getFullYear().toString().slice(-2);
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const listingId = `ID-${year}-${randomSuffix}`;
      
      const newListing: LandListing = {
        ...formData,
        id: listingId,
        code,
        timestamp: new Date().toISOString()
      };

      await submitListing(newListing);

      setGeneratedCode(code);
      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "অনলাইনে লিস্টিং পোস্ট করতে সমস্যা হয়েছে।" });
    }
  };

  if (status.success && generatedCode) {
    return (
      <div className="bg-white/5 p-8 rounded-2xl border border-[#e2136e]/30 flex flex-col gap-6 animate-in fade-in zoom-in duration-500 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-4xl shadow-inner">
            <i className="fas fa-globe"></i>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Listing Live Online!</h3>
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              আপনার ল্যান্ড লিস্টিং এখন অনলাইনে সবার জন্য দৃশ্যমান। নিচে আপনার ইউনিক কোডটি দেওয়া হলো।
            </p>
          </div>
        </div>

        {formData.imageUrl && (
          <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
            <img src={formData.imageUrl} alt="Property" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-black/40 rounded-xl border border-white/5 p-6 flex flex-col items-center gap-4">
           <span className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">Unique Listing Code</span>
           <div className="text-5xl font-mono font-bold text-[#e2136e] tracking-widest bg-white/5 px-6 py-4 rounded-lg border border-white/10 w-full text-center select-all">
             {generatedCode}
           </div>
        </div>

        <Button onClick={() => {
          setStatus({ ...status, success: false });
          setGeneratedCode(null);
          setFormData({ landX: '', landY: '', price: 0, buildType: 'Home', imageUrl: '', sellerBkash: '' });
        }} className="w-full">
          Sell Another Land
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col gap-6 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Sell Your Land Online</h2>
        <p className="text-gray-400 text-sm">আপনার ল্যান্ড সবার কাছে বিক্রি করতে তথ্যগুলো দিন</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Property Photo</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative h-40 w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#e2136e]/50 transition-all flex flex-col items-center justify-center group"
        >
          {formData.imageUrl ? (
            <>
              <img src={formData.imageUrl} className="w-full h-full object-cover opacity-60" alt="Preview" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-camera text-2xl mb-2"></i>
                <span className="text-xs font-bold">Change Photo</span>
              </div>
            </>
          ) : (
            <>
              <i className="fas fa-image text-3xl text-gray-600 mb-2 group-hover:text-[#e2136e] transition-colors"></i>
              <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">Upload Property Image</span>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Build Type</label>
        <div className="grid grid-cols-3 gap-3">
          {(['Home', 'Farm', 'Build'] as BuildType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBuildType(type)}
              className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center gap-2 font-bold text-xs ${
                formData.buildType === type 
                  ? 'bg-[#e2136e]/20 border-[#e2136e] text-white' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
              }`}
            >
              <i className={`fas ${type === 'Home' ? 'fa-house' : type === 'Farm' ? 'fa-wheat-awn' : 'fa-hammer'}`}></i>
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Land X Code" icon="fa-location-crosshairs" placeholder="e.g. 1250" name="landX" value={formData.landX} onChange={handleChange} />
        <Input label="Land Y Code" icon="fa-location-dot" placeholder="e.g. -450" name="landY" value={formData.landY} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Price (BDT)" icon="fa-coins" type="number" placeholder="Set price" name="price" value={formData.price || ''} onChange={handleChange} />
        <Input label="Seller bKash No" icon="fa-mobile-screen-button" placeholder="017XXXXXXXX" name="sellerBkash" value={formData.sellerBkash} onChange={handleChange} />
      </div>

      {status.error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i>
          {status.error}
        </div>
      )}

      <Button type="submit" isLoading={status.loading} className="w-full">
        Confirm Listing Online
      </Button>
    </form>
  );
};
