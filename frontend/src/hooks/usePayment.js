import { useState } from 'react';
import { createPayment, getRazorpayKey, handlePaymentSuccess, handlePaymentFailure, validatePaymentResponse } from '../api/paymentAction.js';
import api from '../api/api';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const processPayment = async (courseId, courseName, amount, userDetails = null) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Create payment order on backend - PASSING userDetails
      const orderData = await createPayment(courseId, userDetails);

      if (!orderData.id) {
        throw new Error('Failed to create payment order');
      }

      // Check for FREE course (amount <= 0)
      if (orderData.amount <= 0) {
        console.log("Course is FREE. Bypassing Razorpay...");
        alert("Free course! Enrolling you directly...");

        // Redirect to dashboard or my-orders
        window.location.href = `/dashboard/my-orders`;
        setLoading(false);
        return;
      }

      // 2. Initialize Razorpay SDK
      const isRazorpayLoaded = await initializeRazorpay();

      if (!isRazorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // 3. Get Razorpay key
      const razorpayKey = getRazorpayKey();

      // 4. Create Razorpay options
      let rzp; // Declare instance variable

      const options = {
        key: razorpayKey,
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || 'INR',
        name: 'SkilledUp Academy',
        description: `Payment for ${courseName}`,
        image: '/images/skilledUp Logo.png',
        order_id: orderData.orderId,
        // REMOVED callback_url to handle response client-side and force close modal
        handler: async (response) => {
            console.log("Razorpay payment success callback received", response);
            if (pollInterval) clearInterval(pollInterval);

            // --- FORCE CLOSE LOGIC START ---
            const forceClose = () => {
                try {
                    if (rzp) rzp.close();
                } catch (e) { console.warn("rzp.close() failed", e); }
    
                try {
                    const rzpElements = document.querySelectorAll('.razorpay-container, .razorpay-backdrop, iframe[name^="razorpay"]');
                    rzpElements.forEach(el => el.remove());
                    document.body.style.overflow = 'auto'; 
                    console.log("Razorpay modal forcibly removed (Enhanced)");
                } catch (e) {
                    console.warn("Force close error:", e);
                }
            };
            
            // Execute immediately
            forceClose();
            // And again after a small delay to catch any lingering elements
            setTimeout(forceClose, 100);
            setTimeout(forceClose, 500);
            // --- FORCE CLOSE LOGIC END ---

            try {
                // Verify payment
                const result = await handlePaymentSuccess(response, courseId);
                if (result.success) {
                    alert('Payment Successful! Redirecting to My Orders...');
                    window.location.href = '/dashboard/my-orders';
                } else {
                    alert(`Payment verification failed: ${result.message}`);
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                alert('Payment completed but verification failed. Please contact support.');
            }
        },
        prefill: {
          name: userDetails?.name || (userDetails?.firstName ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim() : ''),
          email: userDetails?.email || '',
          contact: userDetails?.phone || userDetails?.mobile || '',
        },
        notes: {
          courseId,
          courseName,
        },
        theme: {
          color: '#264f9b',
        },
        modal: {
          ondismiss: async () => {
             if (pollInterval) clearInterval(pollInterval);
             setLoading(false);
             console.log('Payment modal dismissed. Checking status...');
             
             // Check if the order is marked as PAID in backend
             try {
                 const res = await api.get(`/api/payments/order/${orderData.orderId}`);
                 if (res.data && res.data.status === 'PAID') {
                      console.log('Order found as PAID in backend. Redirecting...');
                      alert("Payment detected! Redirecting to My Orders...");
                      window.location.href = '/dashboard/my-orders';
                 }
             } catch (e) {
                 console.warn("Failed to check order status on dismiss", e);
             }
          }
        }
      };

      // 5. Open Razorpay checkout
      rzp = new window.Razorpay(options);
      rzp.open();
      
      // Start Polling
      var pollInterval = setInterval(async () => {
          try {
              const res = await api.get(`/api/payments/order/${orderData.orderId}`);
              if (res.data && res.data.status === 'PAID') {
                  clearInterval(pollInterval);
                  // Force close
                  try { if (rzp) rzp.close(); } catch(e){}
                  try {
                      document.querySelectorAll('.razorpay-container, .razorpay-backdrop, iframe[name^="razorpay"]').forEach(el => el.remove());
                      document.body.style.overflow = 'auto'; 
                  } catch(e){}
                  window.location.href = '/dashboard/my-orders';
              }
          } catch (e) { /* ignore */ }
      }, 3000);

    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error.message);

      // Show user-friendly error message
      let errorMessage = 'Payment failed. ';
      if (error.message.includes('Network Error')) {
        errorMessage += 'Please check your internet connection.';
      } else if (error.message.includes('401')) {
        errorMessage += 'Session expired. Please login again.';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
    error,
  };
};
