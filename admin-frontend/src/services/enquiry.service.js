import api from './api';

const getAllEnquiries = async () => {
    const response = await api.get('/admin/enquiries');
    return response.data;
};

const updateEnquiry = async (id, payload) => {
    const response = await api.put(`/admin/enquiries/${id}`, payload);
    return response.data;
};

export default {
    getAllEnquiries,
    updateEnquiry
};

