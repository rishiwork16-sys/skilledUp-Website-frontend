import React from 'react';
import Button from '../ui/Button';

const Step2Form = ({ 
  formState, 
  onInputChange, 
  onComplete, 
  onBack, 
  onClose 
}) => {
  const countries = [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-800 mb-0.5">
              Address Details
            </h2>
            <p className="text-gray-500 text-xs mb-0">
              Step 2 of 2 - Complete Your Application
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-red-500 transition-colors text-gray-500 text-lg"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-4">
          {/* Full Address */}
          <div>
            <label className="block text-blue-800 text-xs font-medium mb-1">
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="House No., Street, Area, Landmark"
              rows="2"
              value={formState.fullAddress}
              onChange={(e) => onInputChange('fullAddress', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* City and PIN Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-blue-800 text-xs font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={formState.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-blue-800 text-xs font-medium mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="6-digit PIN"
                value={formState.pinCode}
                onChange={(e) => onInputChange('pinCode', e.target.value)}
                maxLength="6"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* State and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-blue-800 text-xs font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter state"
                value={formState.state}
                onChange={(e) => onInputChange('state', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-blue-800 text-xs font-medium mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formState.country}
                onChange={(e) => onInputChange('country', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value="">Select country</option>
                {countries.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-blue-800 font-medium text-xs mb-2">
              📋 Important Note:
            </h4>
            <ul className="space-y-1 text-gray-700 text-xs">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 text-xs">•</span>
                <span>Fill details carefully for <strong>instant Offer Letter</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 text-xs">•</span>
                <span><strong>100% virtual</strong> internship</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 text-xs">•</span>
                <span><strong>No stipend or fee</strong> involved</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 text-xs">•</span>
                <span>Complete tasks within selected duration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 py-2.5 text-sm"
          >
            ← Back
          </Button>
          
          <Button
            onClick={onComplete}
            variant="primary"
            className="flex-1 py-2.5 text-sm font-semibold"
          >
            Submit →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Form;