import api from './api';

/* ============================
   ENROLLMENT APIs
============================ */
export const getMyEnrollments = async (userId) => {
    try {
        const response = await api.get('/api/students/my-enrollments', {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting enrollments:', error);
        throw error;
    }
};

export const getEnrollmentById = async (enrollmentId) => {
    try {
        const response = await api.get(`/api/students/enrollments/${enrollmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting enrollment:', error);
        throw error;
    }
};

export const regenerateOfferLetter = async (enrollmentId) => {
    try {
        const response = await api.post(`/api/students/enrollments/${enrollmentId}/offer-letter`);
        return response.data;
    } catch (error) {
        console.error('Error regenerating offer letter:', error);
        throw error;
    }
};

export const exitInternship = async (enrollmentId, lastWorkingDay) => {
    try {
        const response = await api.post('/api/students/exit', {
            enrollmentId,
            lastWorkingDay
        });
        return response.data;
    } catch (error) {
        console.error('Error exiting internship:', error);
        throw error;
    }
};

/* ============================
   TASK APIs
============================ */
export const getMyTasks = async (studentId) => {
    try {
        const response = await api.get('/api/tasks/my-tasks', {
            params: { studentId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await api.get(`/api/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting task:', error);
        throw error;
    }
};

export const submitTask = async (submissionData) => {
    try {
        const response = await api.post('/api/tasks/submit', submissionData);
        return response.data;
    } catch (error) {
        console.error('Error submitting task:', error);
        throw error;
    }
};

export const getMySubmissions = async (studentId) => {
    try {
        const response = await api.get('/api/tasks/my-submissions', {
            params: { studentId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
};

/* ============================
   STUDENT PROFILE
============================ */
export const getStudentProfile = async (userId) => {
    try {
        const response = await api.get('/api/students/profile', {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting student profile:', error);
        throw error;
    }
};

export const getStudentProfileByPhone = async (phone) => {
    try {
        const response = await api.get('/api/students/profile-by-phone', {
            params: { phone }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting student profile by phone:', error);
        throw error;
    }
};

/* ============================
   INTERNSHIP CATEGORIES
============================ */
export const getInternshipCategories = async () => {
    try {
        const response = await api.get('/api/categories'); // Changed from /active to get all
        return response.data;
    } catch (error) {
        console.error('Error fetching internship categories:', error);
        throw error;
    }
};

/* ============================
   FILE & UTILITY APIs
============================ */
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await api.post('/api/students/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.url; // Expecting file URL
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const getSignedUrl = async (fileUrl) => {
    try {
        // If it's already a full URL (temporarily), just return it or implement backend signing
        // For now returning as is if not implemented backend
        // const response = await api.get('/api/storage/signed-url', { params: { url: fileUrl } });
        // return response.data.url;
        return fileUrl; // Temporary bypass until backend storage service is ready
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
};

export const deleteSubmission = async (submissionId) => {
    try {
        await api.delete(`/api/tasks/submissions/${submissionId}`);
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
};

// Aliases for compatibility
export const getTask = getTaskById;
export const getProfile = getStudentProfile;
