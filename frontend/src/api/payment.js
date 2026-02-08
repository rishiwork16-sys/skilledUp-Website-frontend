import api from './api';

export const createOrder = async (userId, courseId, amount) => {
    try {
        const response = await api.post('/api/payments/create-order', { userId, courseId, amount });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyPayment = async (orderId, paymentId, signature) => {
    try {
        const response = await api.post('/api/payments/verify', { orderId, paymentId, signature });
        return response.data;
    } catch (error) {
        throw error;
    }
};
