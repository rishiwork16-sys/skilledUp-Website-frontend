// src/api/paymentService.js
import api from "./api";

/* ============================
   CREATE PAYMENT ORDER
   Endpoint: POST /api/payments/create
============================ */

export const createPayment = async (courseId) => {
  try {
    console.log('💰 Creating payment for course ID:', courseId);
    
    const response = await api.post('/api/payments/create', {
      courseId: courseId
    });
    
    console.log('✅ Payment API response:', response.data);
    
    // Your Payment entity fields:
    const payment = response.data;
    console.log('💳 Payment object received:', payment);
    
    // The amount is in 'amount' field, not 'gatewayAmount'!
    const razorpayOrderId = payment.razorpayOrderId;
    const amountInPaise = payment.amount; // This is the field name in your entity
    
    console.log('🔍 razorpayOrderId:', razorpayOrderId);
    console.log('🔍 amount (paise):', amountInPaise);
    console.log('🔍 amount in ₹:', amountInPaise / 100);
    
    if (!razorpayOrderId) {
      console.error('❌ Missing razorpayOrderId in response:', payment);
      throw new Error('Invalid response from payment server: Missing order ID');
    }
    
    if (!amountInPaise) {
      console.error('❌ Missing amount in response:', payment);
      throw new Error('Invalid response from payment server: Missing amount');
    }
    
    // Return in the format Razorpay expects
    return {
      id: razorpayOrderId,        // Razorpay order_id
      amount: amountInPaise,      // Amount in paise (from 'amount' field)
      currency: "INR",            // Assuming INR
      receipt: `receipt_${payment.id || courseId}`,
      status: "created"
    };
  } catch (error) {
    console.error('🚨 Payment creation failed:', error);
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      
      if (error.response.status === 401) {
        throw new Error('Session has expired. Please login again.');
      } else if (error.response.status === 404) {
        throw new Error('Course not found.');
      } else if (error.response.status === 400) {
        throw new Error('Invalid request. Please try again.');
      } else if (error.response.status === 403) {
        throw new Error('You do not have permission to create payment.');
      }
    }
    
    if (error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};


/* ============================
   GET PAYMENT BY ID
   Endpoint: GET /api/payments/{paymentId}
============================ */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get payment:', error);

    if (error.response?.status === 404) {
      throw new Error('Payment not found.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to view this payment.');
    }

    throw new Error('Failed to fetch payment details.');
  }
};

/* ============================
   GET PAYMENT STATUS
   Endpoint: GET /api/payments/{paymentId}/status
============================ */
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error('Failed to get payment status:', error);

    if (error.response?.status === 404) {
      throw new Error('Payment not found.');
    }

    throw new Error('Failed to fetch payment status.');
  }
};

/* ============================
   GET USER PAYMENTS
   Endpoint: GET /api/payments/user
============================ */
export const getUserPayments = async () => {
  try {
    const response = await api.get('/api/payments/user');
    return response.data;
  } catch (error) {
    console.error('Failed to get user payments:', error);
    throw new Error('Failed to fetch your payment history.');
  }
};

/* ============================
   GET PAYMENT DETAILS (COMPREHENSIVE)
   Endpoint: GET /api/payments/{paymentId}/details
============================ */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}/details`);
    return response.data;
  } catch (error) {
    console.error('Failed to get payment details:', error);

    if (error.response?.status === 404) {
      throw new Error('Payment details not found.');
    }

    throw new Error('Failed to fetch payment details.');
  }
};

/* ============================
   SIMULATED VERIFICATION (FOR FRONTEND ONLY)
   Note: Actual verification happens via Razorpay webhook on backend
============================ */
export const simulatePaymentVerification = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  try {
    console.log('🔍 Simulating payment verification (frontend only)');
    console.log('Order ID:', razorpayOrderId);
    console.log('Payment ID:', razorpayPaymentId);
    console.log('Signature:', razorpaySignature ? 'Present' : 'Missing');
    
    // Since verification happens via webhook, just return success
    // The actual verification will be done by your backend webhook
    return {
      verified: true,
      message: 'Payment verification initiated. Status will be updated via webhook.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId
    };
  } catch (error) {
    console.error('Payment verification simulation failed:', error);
    throw error;
  }
};

/* ============================
   CHECK ENROLLMENT
   Endpoint: GET /api/enrollments/check/{courseId}
============================ */
export const checkEnrollment = async (courseId) => {
  try {
    const response = await api.get(`/api/enrollments/check/${courseId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { enrolled: false };
    }
    throw error;
  }
};

/* ============================
   GET RAZORPAY KEY FROM ENVIRONMENT
============================ */
export const getRazorpayKey = () => {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || "";
};

/* ============================
   HANDLE PAYMENT SUCCESS
   This is called when Razorpay payment succeeds
============================ */
export const handlePaymentSuccess = async (response, courseId) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
    
    console.log('✅ Payment Success Response:', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature ? 'Present' : 'Missing'
    });
    
    // Store payment info locally
    localStorage.setItem('lastPaymentResponse', JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
      timestamp: new Date().toISOString()
    }));
    
    // In a real implementation, you might want to:
    // 1. Call a backend endpoint to confirm payment
    // 2. Redirect to success page
    // 3. Show success message
    
    return {
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Payment successful! You will be enrolled shortly.'
    };
    
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
    throw error;
  }
};

/* ============================
   HANDLE PAYMENT FAILURE
============================ */
export const handlePaymentFailure = async (error) => {
  console.error('💥 Payment failed:', error);
  
  let errorMessage = 'Payment failed. ';
  if (error.error?.description) {
    errorMessage += error.error.description;
  } else if (error.error?.reason) {
    errorMessage += error.error.reason;
  } else if (error.error?.code) {
    errorMessage += `Error code: ${error.error.code}`;
  } else {
    errorMessage += 'Please try again or use a different payment method.';
  }
  
  return {
    success: false,
    error: errorMessage
  };
};

/* ============================
   VALIDATE PAYMENT RESPONSE
============================ */
export const validatePaymentResponse = (response) => {
  const requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
  
  for (const field of requiredFields) {
    if (!response[field]) {
      throw new Error(`Missing required field in payment response: ${field}`);
    }
  }
  
  return true;
};

export default {
  createPayment,
  getPaymentById,
  getPaymentStatus,
  getUserPayments,
  getPaymentDetails,
  simulatePaymentVerification,
  checkEnrollment,
  getRazorpayKey,
  handlePaymentSuccess,
  handlePaymentFailure,
  validatePaymentResponse
};
