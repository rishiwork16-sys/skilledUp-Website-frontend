import api from './api';

const createCategory = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

const getAllCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

const getActiveCategories = async () => {
    const response = await api.get('/categories/active');
    return response.data;
};

const getCategoryById = async (categoryId) => {
    // Implementing basic fetch logic if endpoint exists, or rely on caller
    // For now, keeping consistent with source but noted the comment
    return null;
};

const updateCategory = async (categoryId, categoryData) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
};

const deleteCategory = async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
};

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/students/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.url;
};

export default {
    createCategory,
    getAllCategories,
    getActiveCategories,
    updateCategory,
    deleteCategory,
    uploadImage
};
