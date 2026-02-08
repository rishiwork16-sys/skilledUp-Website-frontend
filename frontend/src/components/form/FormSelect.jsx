import React from 'react';

const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder = "Select...",
  required = false,
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
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer px-3 sm:px-4 py-2 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;