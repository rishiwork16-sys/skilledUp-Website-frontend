import api from './api';
import { sendOtp, verifyOtp } from './authService';

/* ============================
   MOBILE OTP
============================ */
export const sendMobileOtp = async (mobile) => {
    try {
        const response = await api.post('/api/auth/send-otp', null, {
            params: { identifier: mobile, type: 'MOBILE' }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending mobile OTP:', error);
        throw error;
    }
};

export const verifyMobileOtp = async (mobile, otp) => {
    try {
        const response = await api.post('/api/auth/verify-otp', null, {
            params: { identifier: mobile, otp, type: 'MOBILE' }
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying mobile OTP:', error);
        throw error;
    }
};

/* ============================
   EMAIL OTP
============================ */
export const sendEmailOtp = async (email) => {
    try {
        const response = await api.post('/api/auth/send-otp', null, {
            params: { identifier: email, type: 'EMAIL' }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending email OTP:', error);
        throw error;
    }
};

export const verifyEmailOtp = async (email, otp) => {
    try {
        const response = await api.post('/api/auth/verify-otp', null, {
            params: { identifier: email, otp, type: 'EMAIL' }
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying email OTP:', error);
        throw error;
    }
};

/* ============================
   ENROLLMENT
============================ */
export const enrollInternship = async (enrollmentData) => {
    try {
        const response = await api.post('/api/student/enrollments/public', enrollmentData);
        return response.data;
    } catch (error) {
        console.error('Error enrolling in internship:', error);
        throw error;
    }
};

/* ============================
   PROFILE
============================ */
export const getProfile = async () => {
    try {
        const response = await api.get('/api/auth/profile');
        return response.data;
    } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
    }
};
