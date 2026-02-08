import api from './api';

const checkEligibility = async (studentId, enrollmentId) => {
    const response = await api.get(`/lor/check-eligibility`, {
        params: { studentId, enrollmentId }
    });
    return response.data;
};

const requestLOR = async (studentId, enrollmentId) => {
    const response = await api.post(`/lor/request?studentId=${studentId}`, {
        enrollmentId
    });
    return response.data;
};

const getMyRequests = async (studentId) => {
    const response = await api.get(`/lor/my-requests?studentId=${studentId}`);
    return response.data;
};

const getDownloadUrl = async (requestId) => {
    const response = await api.get(`/lor/${requestId}/download`);
    return response.data;
};

export default {
    checkEligibility,
    requestLOR,
    getMyRequests,
    getDownloadUrl
};
