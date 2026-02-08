import api from './api';

const getInternshipCertificateTemplate = async () => {
    const response = await api.get('/certificates/config/internship-template');
    return response.data;
};

const uploadInternshipCertificateTemplate = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/certificates/config/internship-template', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const getLorTemplate = async () => {
    const response = await api.get('/certificates/config/lor-template');
    return response.data;
};

const uploadLorTemplate = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/certificates/config/lor-template', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export default {
    getInternshipCertificateTemplate,
    uploadInternshipCertificateTemplate,
    getLorTemplate,
    uploadLorTemplate
};
