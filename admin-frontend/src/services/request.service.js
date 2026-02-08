import api from './api';

// Extension Requests
const getAllExtensions = async () => {
    const response = await api.get('/requests/extensions');
    return response.data;
};

const getPendingExtensions = async () => {
    const response = await api.get('/requests/extensions/pending');
    return response.data;
};

const reviewExtension = async (requestId, approved, adminResponse) => {
    const response = await api.post(`/requests/extensions/${requestId}/review`, {
        approved
    });
    return response.data;
};

// Exit Requests
const getAllExits = async () => {
    const response = await api.get('/requests/exits');
    return response.data;
};

const getPendingExits = async () => {
    const response = await api.get('/requests/exits/pending');
    return response.data;
};

const reviewExit = async (requestId, approved, adminResponse) => {
    const response = await api.post(`/requests/exits/${requestId}/review`, {
        approved,
        adminResponse
    });
    return response.data;
};

export default {
    getAllExtensions,
    getPendingExtensions,
    reviewExtension,
    getAllExits,
    getPendingExits,
    reviewExit
};
