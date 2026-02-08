import React, { useEffect } from 'react';
import Step1Form from '../form/Step1Form';
import Step2Form from '../form/Step2Form';

const Modal = ({
  isOpen,
  onClose,
  showSuccess,
  formState,
  currentStep, // This prop is no longer used directly, but kept for now as it's not explicitly removed in the diff. The new logic uses formState.currentStep.
  onInputChange,
  onSendPhoneOtp,
  onVerifyPhoneOtp,
  onSendEmailOtp,
  onVerifyEmailOtp,
  onContinue, // Renamed from onContinueToStep2
  onSubmit, // Renamed from onCompleteApplication
  onBackToStep1,
  categories = [],
  categoriesLoading = false
}) => {

  // 🔒 Lock / Unlock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ Success redirect
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      window.location.href = '/orders';
    }, 5000);

    let seconds = 5;
    const countdown = setInterval(() => {
      seconds--;
      const el = document.getElementById('countdown');
      if (el) el.textContent = seconds;
      if (seconds <= 0) clearInterval(countdown);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [showSuccess]);

  // ❗ return AFTER hooks
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md flex flex-col rounded-xl shadow-2xl overflow-hidden h-[90vh] sm:h-auto sm:max-h-[90vh]">
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-green-600 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting to your orders in <span id="countdown" className="font-bold text-blue-600">5</span> seconds...
            </p>
          </div>
        ) : (
          <>
            {formState.currentStep === 1 && (
              <Step1Form
                formState={formState}
                onInputChange={onInputChange}
                onSendPhoneOtp={onSendPhoneOtp}
                onVerifyPhoneOtp={onVerifyPhoneOtp}
                onSendEmailOtp={onSendEmailOtp}
                onVerifyEmailOtp={onVerifyEmailOtp}
                onContinue={onContinue}
                onClose={onClose}
                categories={categories}
                categoriesLoading={categoriesLoading}
              />
            )}

            {formState.currentStep === 2 && (
              <Step2Form
                formState={formState}
                onInputChange={onInputChange}
                onComplete={onSubmit}
                onBack={onBackToStep1}
                onClose={onClose}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
