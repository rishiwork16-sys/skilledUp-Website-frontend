import React from 'react';
import Button from '../ui/Button';
import { internshipDomainsList, durationOptions } from '../../constants/internshipDomains';

const Step1Form = ({
  formState,
  onInputChange,
  onSendPhoneOtp,
  onVerifyPhoneOtp,
  onSendEmailOtp,
  onVerifyEmailOtp,
  onContinue,
  onClose,
  categories = [],
  categoriesLoading = false
}) => {
  return (
    <div className="h-full flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-800 mb-0.5">
              Apply for Internship
            </h2>
            <p className="text-gray-500 text-xs mb-0">
              Step 1 of 2 - Personal Information
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-red-500 transition-colors text-gray-500 text-lg"
          >
            ×
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-4">

          {/* NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="First Name"
              required
              value={formState.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
            />
            <Input
              label="Middle Name"
              value={formState.middleName}
              onChange={(e) => onInputChange('middleName', e.target.value)}
            />
            <Input
              label="Last Name"
              required
              value={formState.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-blue-800 text-xs font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>

            {formState.phoneVerified ? (
              <VerifiedField value={formState.phone} />
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formState.phone}
                    maxLength="10"
                    disabled={formState.phoneOtpSent}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <Button size="small" variant="success" onClick={onSendPhoneOtp}>
                    {formState.phoneOtpSent ? 'Resend' : 'Send'}
                  </Button>
                </div>

                {formState.phoneOtpSent && (
                  <OtpBox
                    value={formState.phoneOtp}
                    onChange={(e) => onInputChange('phoneOtp', e.target.value)}
                    onVerify={onVerifyPhoneOtp}
                    text={`OTP sent to ${formState.phone}`}
                  />
                )}
              </>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-blue-800 text-xs font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>

            {formState.emailVerified ? (
              <VerifiedField value={formState.email} />
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={formState.email}
                    disabled={formState.emailOtpSent}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <Button
                    size="small"
                    variant="success"
                    disabled={!formState.phoneVerified}
                    onClick={onSendEmailOtp}
                  >
                    {formState.emailOtpSent ? 'Resend' : 'Send'}
                  </Button>
                </div>

                {formState.emailOtpSent && (
                  <OtpBox
                    value={formState.emailOtp}
                    onChange={(e) => onInputChange('emailOtp', e.target.value)}
                    onVerify={onVerifyEmailOtp}
                    text={`OTP sent to ${formState.email}`}
                  />
                )}
              </>
            )}
          </div>

          {/* DOMAIN + DURATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-blue-800 text-xs font-medium mb-1">
                Select Domain <span className="text-red-500">*</span>
              </label>
              <select
                value={formState.domain}
                onChange={(e) => onInputChange('domain', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading programs...' : 'Select Domain'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <Select
              label="Duration"
              value={formState.duration}
              onChange={(e) => onInputChange('duration', e.target.value)}
              options={durationOptions}
            />
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <Button
          onClick={onContinue}
          variant="primary"
          className="w-full py-2.5 text-sm font-semibold"
          disabled={!formState.phoneVerified || !formState.emailVerified}
        >
          Continue to Step 2 →
        </Button>
      </div>
    </div>
  );
};

/* ================= SMALL HELPERS (NO STYLE CHANGE) ================= */

const Input = ({ label, required, ...props }) => (
  <div>
    <label className="block text-blue-800 text-xs font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-blue-800 text-xs font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
    >
      <option value="">Select</option>
      {options.map((o, i) => (
        <option key={i} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const VerifiedField = ({ value }) => (
  <div className="flex gap-2">
    <input value={value} disabled className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-sm" />
    <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded text-xs font-medium">
      ✓ Verified
    </div>
  </div>
);

const OtpBox = ({ value, onChange, onVerify, text }) => (
  <div className="bg-blue-50 p-3 rounded-lg mt-2 space-y-2">
    <div className="flex gap-2">
      <input
        type="text"
        maxLength="6"
        value={value}
        onChange={onChange}
        className="flex-1 border rounded-lg px-3 py-2 text-center text-sm font-bold"
      />
      <Button size="small" variant="success" onClick={onVerify}>
        Verify
      </Button>
    </div>
    <p className="text-gray-600 text-xs">{text}</p>
  </div>
);

export default Step1Form;
