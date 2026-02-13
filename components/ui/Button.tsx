
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-[#e2136e] hover:bg-[#c0105a] text-white shadow-lg shadow-[#e2136e]/20",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md",
    outline: "border-2 border-[#e2136e] text-[#e2136e] hover:bg-[#e2136e] hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <i className="fas fa-circle-notch fa-spin"></i>
      ) : null}
      {children}
    </button>
  );
};
