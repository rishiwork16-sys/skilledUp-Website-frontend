// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'font-sans font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md',
    secondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    white: 'bg-white text-blue-800 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md' // Add this
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;