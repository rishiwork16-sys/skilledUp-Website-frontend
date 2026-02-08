import React, { useState } from 'react';

const RegistrationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    background: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formConfig = {
    title: "Book Your Free Masterclass Seat",
    subtitle: "Fill this form to receive joining link, reminders & exclusive resources",
    fields: {
      fullName: { label: "Full Name", placeholder: "Enter your full name" },
      email: { label: "Email Address", placeholder: "you@example.com" },
      mobile: { 
        label: "Mobile Number", 
        placeholder: "10-digit WhatsApp number",
        note: "We'll send class reminders & materials on WhatsApp."
      },
      city: { label: "City", placeholder: "e.g. Bangalore" },
      state: { label: "State", placeholder: "e.g. Karnataka" },
      background: {
        label: "Your Current Background",
        options: [
          "College Student",
          "Recent Graduate",
          "Graduate (Career Gap 2–5 Years)",
          "Working Professional (0–2 Years)",
          "Working Professional (2–5 Years)",
          "Working Professional (5+ Years)",
          "Non-IT, Switching to Data Career"
        ]
      }
    },
    submitCta: "Submit",
    footerText: "By submitting, you agree to receive important updates about the masterclass.",
    successMessage: "🎉 You're registered! Check your email.",
    whatsapp: {
      link: "https://chat.whatsapp.com/HwwEYYKuAXFBEnJk9GMsQo",
      text: "📱 Join WhatsApp Group"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sendOtp = () => {
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
      setErrors(prev => ({ ...prev, mobile: 'Please enter a valid 10-digit mobile number' }));
      return false;
    }
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpInput(true);
    }, 1500);
    
    return true;
  };

  const verifyOtp = () => {
    if (otp === '123456') {
      setIsOtpVerified(true);
      setShowOtpInput(false);
      return true;
    } else {
      alert('Invalid OTP. Please try again.');
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.background) newErrors.background = 'Please select your background';
    if (!isOtpVerified) newErrors.mobile = 'Please verify your mobile number';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isOtpVerified) {
      setErrors(prev => ({ ...prev, mobile: 'Please verify your mobile number first' }));
      return;
    }
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } else {
      setErrors(validationErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      state: '',
      background: ''
    });
    setSubmitted(false);
    setErrors({});
    setIsOtpVerified(false);
    setShowOtpInput(false);
    setOtp('');
  };

  // Success Component
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[80px] px-4 z-50 overflow-y-auto">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-green-100">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center animate-ping opacity-70">
              <span className="text-lg">✨</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">{formConfig.successMessage}</p>
          
          <div className="space-y-4 mb-6">
            <a href={formConfig.whatsapp.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
              <span className="text-xl">📱</span>
              <span className="font-semibold">{formConfig.whatsapp.text}</span>
            </a>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">📧 Check your email</span> for joining link & resources
              </p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-6">{formConfig.footerText}</p>
          
          <div className="flex gap-3">
            <button onClick={resetForm}
              className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300">
              Register Another
            </button>
            <button onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form Component
  const renderField = (name) => {
    const field = formConfig.fields[name];
    
    if (name === 'mobile') {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label} *
          </label>
          <div className="flex gap-3">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`flex-1 px-4 py-3.5 border ${isOtpVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm`}
              disabled={isOtpVerified}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={isVerifying || !/^\d{10}$/.test(formData.mobile) || isOtpVerified}
              className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${isOtpVerified ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' : isVerifying || !/^\d{10}$/.test(formData.mobile) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'}`}>
              {isVerifying ? 'Sending...' : isOtpVerified ? '✓ Verified' : 'Send OTP'}
            </button>
          </div>
          
          {showOtpInput && !isOtpVerified && (
            <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 px-4 py-3.5 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300">
                  Verify
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Demo OTP:</span> 
                <span className="ml-2 font-bold text-green-600">123456</span>
              </p>
            </div>
          )}
          
          {isOtpVerified && (
            <div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <span className="text-xl">✅</span>
              <span className="font-semibold">Mobile number verified!</span>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">{field.note}</p>
          {errors.mobile && <p className="text-sm text-red-500 mt-2">{errors.mobile}</p>}
        </div>
      );
    }

    if (name === 'background') {
      return (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label} *
          </label>
          <select
            name="background"
            value={formData.background}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm bg-white appearance-none">
            <option value="">Select your background</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          {errors.background && <p className="mt-2 text-sm text-red-500">{errors.background}</p>}
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {field.label} *
        </label>
        <input
          type={name === 'email' ? 'email' : 'text'}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 shadow-sm"
        />
        {errors[name] && <p className="mt-2 text-sm text-red-500">{errors[name]}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-white pb-4 mb-2 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {formConfig.title}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {formConfig.subtitle}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {renderField('fullName')}
          {renderField('email')}
          {renderField('mobile')}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>{renderField('city')}</div>
            <div>{renderField('state')}</div>
          </div>
          
          {renderField('background')}

          <div className="pt-4 sticky bottom-0 bg-white border-t border-gray-100 mt-6">
            <button
              type="submit"
              disabled={!isOtpVerified}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 ${isOtpVerified 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {formConfig.submitCta}
            </button>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              {formConfig.footerText}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;