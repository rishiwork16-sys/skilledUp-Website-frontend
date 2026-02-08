import api from './api';

/**
 * Get Razorpay Key from environment or backend
 */
export const getRazorpayKey = () => {
    return import.meta.env.VITE_RAZORPAY_KEY_ID || "";
};

/**
 * Create a payment order on the backend
 */
export const createPayment = async (courseId, user = null, amount = null) => {
    try {
        // Fetch current user details from localStorage if needed, 
        // but backend usually gets it from the JWT token
        const currentUser = user || JSON.parse(localStorage.getItem('skilledup_current_user'));
        const userId = currentUser?.id || currentUser?.userId;

        // Use provided amount or fetch from backend
        let finalAmount = amount;
        
        if (finalAmount === null || finalAmount === undefined) {
             const coursesRes = await api.get('/api/courses');
             const course = coursesRes.data.find(c => c.id === courseId);
             finalAmount = course?.price || 1; // Default to 1 for testing if not found
        }

        const response = await api.post('/api/payments/create-order', {
            userId,
            courseId,
            amount: finalAmount
        });

        // Response usually contains { id: "order_...", amount: 100, currency: "INR" }
        return response.data;
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error;
    }
};

/**
 * Validate Razorpay response before sending to backend
 */
export const validatePaymentResponse = (response) => {
    if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
        throw new Error("Invalid payment response from Razorpay");
    }
};

/**
 * Handle successful payment by verifying with backend
 */
export const handlePaymentSuccess = async (response, courseId) => {
    try {
        const verificationData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
        };

        const res = await api.post('/api/payments/verify', verificationData);

        // Check if backend confirmed payment
        if (res.data && res.data.status === 'PAID') {
            return { success: true, data: res.data };
        }

        return { success: false, message: "Payment verification failed" };
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};

/**
 * Handle payment failure (logging, etc.)
 */
export const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
};
