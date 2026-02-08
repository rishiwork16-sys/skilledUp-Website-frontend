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
export const createPayment = async (courseId, userObj = null) => {
    try {
        let user = userObj;
        const allKeys = Object.keys(localStorage);
        const priorityKeys = ['skilledup_current_user', 'user', 'skilledup_student', 'student', 'userData', 'currentUser'];

        // Helper to find ID in any object
        const findId = (obj) => {
            if (!obj || typeof obj !== 'object') return null;
            // 1. Direct matches
            const id = obj.id || obj.userId || obj.studentId || obj.student_id || obj.uid || obj._id;
            if (id) return id;
            // 2. Metadata/nested matches
            if (obj.backendData && obj.backendData.id) return obj.backendData.id;
            if (obj.user && (obj.user.id || obj.user.userId)) return obj.user.id || obj.user.userId;
            // 3. Scan all keys for anything ending in 'Id' or 'id'
            for (const key in obj) {
                if (key.toLowerCase().endsWith('id') && (typeof obj[key] === 'string' || typeof obj[key] === 'number')) {
                    if (obj[key] && obj[key] !== 'null') return obj[key];
                }
            }
            return null;
        };

        let userId = findId(user);
        let userEmail = user?.email || user?.sub;

        // 3. Last Resort: Decode JWT Token
        if ((!userId || !userEmail) && (localStorage.getItem('token') || user?.token)) {
            const token = localStorage.getItem('token') || user?.token;
            if (token && typeof token === 'string' && token.split('.').length === 3) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);

                    // Prioritize explicit ID fields which are usually numeric
                    let distinctId = payload.id || payload.userId || payload.studentId;
                    if (distinctId && !isNaN(distinctId)) {
                        userId = distinctId;
                    } else if (payload.sub && !isNaN(payload.sub)) {
                        userId = payload.sub;
                    }

                    // Also capture email/sub if we haven't found it yet
                    if (!userEmail) userEmail = payload.email || payload.sub;

                } catch (e) {
                    console.error("Failed to decode JWT token:", e);
                }
            }
        }

        // Final attempts to find ID via API
        if (!userId && !userEmail) { // Only force API if WE HAVE NOTHING
            console.log("UserID AND Email missing, attempting API fallback...");
            try {
                const profileRes = await api.get('/api/auth/profile');
                if (profileRes.data) {
                    userId = profileRes.data.id || profileRes.data.userId || profileRes.data.studentId;
                    userEmail = profileRes.data.email;
                }
            } catch (e) {
                console.error("API profile fetch failed:", e);
            }
        }

        // CRITICAL CHECK: We need EITHER userId OR userEmail to proceed
        if (!userId && !userEmail) {
            console.error("User identification failed. All keys:", allKeys);
            let debugInfo = "";
            priorityKeys.slice(0, 2).forEach(k => {
                debugInfo += `\n${k}: ${localStorage.getItem(k)?.substring(0, 100)}`;
            });
            alert("CRITICAL ERROR: Could not find User ID or Email. \nPlease try logging out and logging in again. \nKeys: " + allKeys.slice(0, 5).join(', ') + debugInfo);
            throw new Error("User not identified. Please try logging out and logging in again.");
        }

        // Fetch course details for amount
        const coursesRes = await api.get('/api/courses');
        const course = coursesRes.data.find(c => c.id === courseId);
        // Allow 0 for free courses. Only default to 1 if price is undefined/null.
        const amount = (course && course.price !== undefined && course.price !== null) ? course.price : 1;

        console.log("Creating payment order for userId:", userId, "email:", userEmail, "amount:", amount);

        const response = await api.post('/api/payments/create-order', {
            userId,
            email: userEmail,
            courseId,
            amount
        });

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
