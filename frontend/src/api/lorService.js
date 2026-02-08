import api from './api';

export const getMyRequests = async (studentId) => {
    try {
        const response = await api.get('/api/lor/requests', {
            params: { studentId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting LOR requests:', error);
        throw error;
    }
};

export const checkEligibility = async (studentId, enrollmentId) => {
    try {
        const response = await api.get('/api/lor/eligibility', {
            params: { studentId, enrollmentId }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking LOR eligibility:', error);
        throw error;
    }
};

export const requestLOR = async (studentId, enrollmentId) => {
    try {
        const response = await api.post('/api/lor/request', {
            studentId,
            enrollmentId
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting LOR:', error);
        throw error;
    }
};

const lorService = {
    getMyRequests,
    checkEligibility,
    requestLOR
};

export default lorService;
