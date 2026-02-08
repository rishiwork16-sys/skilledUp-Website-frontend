import api from './api';

const getConfig = async () => {
    const response = await api.get('/student/config');
    return response.data;
};

const updateConfig = async (configData) => {
    const response = await api.put('/student/config', configData);
    return response.data;
};

const getOfferLetterTemplate = async () => {
    const response = await api.get('/student/config/offer-letter-template');
    return response.data;
};

const uploadOfferLetterTemplate = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/student/config/offer-letter-template', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export default {
    getConfig,
    updateConfig,
    getOfferLetterTemplate,
    uploadOfferLetterTemplate
};
