import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('course');

  useEffect(() => {
    // Clear payment info from localStorage
    localStorage.removeItem('lastPaymentAttempt');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-white/90 text-lg">Welcome to SkilledUp!</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎉 Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully. You are now enrolled in the course.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    You will receive a confirmation email shortly
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Course access will be granted automatically
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Check "My Orders" for all enrolled courses
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Go to My Orders
              </button>

              <Link
                to="/"
                className="block w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@skilledup.in" className="text-blue-600 hover:underline">
                support@skilledup.in
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Payment processed via Razorpay • Transaction ID: {localStorage.getItem('lastPaymentResponse')?.slice(0, 8) || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
