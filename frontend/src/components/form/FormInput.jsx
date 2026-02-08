import React from 'react';

const FormInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-blue-800 text-xs sm:text-sm font-medium mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed px-3 sm:px-4 py-2 ${className}`}
        {...props}
      />
    </div>
  );
};

export default FormInput;