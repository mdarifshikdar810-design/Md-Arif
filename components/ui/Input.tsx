
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e2136e]">
            <i className={`fas ${icon}`}></i>
          </div>
        )}
        <input 
          className={`w-full bg-white/5 border border-white/10 rounded-lg py-3 ${icon ? 'pl-10' : 'px-4'} pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#e2136e]/50 focus:border-[#e2136e] transition-all placeholder:text-gray-600 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
