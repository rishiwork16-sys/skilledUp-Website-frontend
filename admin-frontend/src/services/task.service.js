import api from './api';

const API_URL = '/tasks'; // Base URL is handled by api.js ('/api') + '/tasks' inside the calls if we use api

// REFACTOR: Use 'api' instance instead of raw axios to ensure Auth Headers are sent
// The original file used axios directly with '/api/tasks'.
// 'api' has baseURL '/api'. So we should call '/tasks'.

const taskService = {
    getAllTasks: async () => {
        try {
            const response = await api.get('/tasks');
            return response.data;
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw error;
        }
    },

    getPendingSubmissions: async () => {
        try {
            const response = await api.get('/tasks/submissions/pending');
            return response.data;
        } catch (error) {
            console.error("Error fetching pending submissions:", error);
            throw error;
        }
    },

    createTask: async (taskData) => {
        try {
            const response = await api.post('/tasks', taskData);
            return response.data;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    },

    getTaskById: async (id) => {
        try {
            const response = await api.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching task:", error);
            throw error;
        }
    },

    updateTask: async (id, taskData) => {
        try {
            const response = await api.put(`/tasks/${id}`, taskData);
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    },

    deleteTask: async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    },

    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/tasks/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.url;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },

    uploadFromUrl: async (url) => {
        try {
            const response = await api.post('/tasks/upload-from-url', null, {
                params: { url }
            });
            return response.data.url;
        } catch (error) {
            console.error("Error uploading from URL:", error);
            throw error;
        }
    },

    getSignedUrl: async (fileUrl) => {
        try {
            const response = await api.get('/tasks/preview', {
                params: { fileUrl }
            });
            return response.data.signedUrl;
        } catch (error) {
            console.error("Error getting signed URL:", error);
            throw error;
        }
    },

    deleteFile: async (taskId, fileType) => {
        try {
            await api.delete('/tasks/delete', {
                params: { taskId, fileType }
            });
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
};

export default taskService;
