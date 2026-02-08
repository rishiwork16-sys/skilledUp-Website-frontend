import api from './api';

// Get all students with filters
const getAllStudents = async (status, city, search) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (city) params.append('city', city);
    if (search) params.append('search', search);

    const response = await api.get(`/admin/students?${params.toString()}`);
    return response.data;
};

// Get student profile
const getStudentProfile = async (studentId) => {
    const response = await api.get(`/admin/students/${studentId}/profile`);
    return response.data;
};

// Update student status
const updateStudentStatus = async (studentId, status) => {
    const response = await api.put(`/admin/students/${studentId}/status`, { status });
    return response.data;
};

// Toggle block student
const toggleBlockStudent = async (studentId) => {
    const response = await api.put(`/admin/students/${studentId}/block`);
    return response.data;
};

// Change student domain
const changeStudentDomain = async (studentId, newDomain) => {
    const response = await api.put(`/admin/students/${studentId}/domain`, { newDomain });
    return response.data;
};

// Get student statistics
const getStudentStatistics = async () => {
    const response = await api.get('/admin/students/stats');
    return response.data;
};

// Get all enrollments
const getAllEnrollments = async () => {
    const response = await api.get('/students/all-enrollments');
    return response.data;
};

// Public Enrollment
const enrollPublic = async (request) => {
    const response = await api.post('/student/enrollments/public', request);
    return response.data;
};

// Get Internship Types (Active Categories)
const getInternshipTypes = async () => {
    const response = await api.get('/categories/active');
    return response.data;
};

// Get my enrollments
const getMyEnrollments = async (userId) => {
    const response = await api.get(`/students/my-enrollments?userId=${userId}`);
    return response.data;
};

// Get my tasks
const getMyTasks = async (studentId) => {
    const response = await api.get(`/students/tasks?studentId=${studentId}`);
    return response.data;
};

// Helper: Get Student Profile by ID (Public/Student access)
const getProfile = async (userId) => {
    const response = await api.get(`/students/profile?userId=${userId}`);
    return response.data;
};

// Submit Task
const submitTask = async (submissionData) => {
    const response = await api.post('/students/tasks/submit', submissionData);
    return response.data;
};

// Regenerate Offer Letter
const regenerateOfferLetter = async (enrollmentId) => {
    const response = await api.post(`/students/enrollments/${enrollmentId}/offer-letter`);
    return response.data;
};

export default {
    getAllStudents,
    getStudentProfile,
    updateStudentStatus,
    toggleBlockStudent,
    changeStudentDomain,
    getStudentStatistics,
    getAllEnrollments,
    enrollPublic,
    getInternshipTypes,
    getMyEnrollments,
    getMyTasks,
    getMySubmissions: async (studentId) => {
        const response = await api.get(`/students/submissions?studentId=${studentId}`);
        return response.data;
    },
    submitTask,
    regenerateOfferLetter,
    getProfile,

    // Document & Certificate Methods
    getOfferLetter: async (studentId) => {
        // In a real app, this might fetch a signed URL or binary blob
        // For now, we'll hit the preview endpoint which returns a PDF
        const response = await api.post('/certificates/preview', { studentName: "Student Name" }, { responseType: 'blob' });
        return response.data;
    },

    getCertificate: async (studentId) => {
        // This would ideally check eligibility first
        const response = await api.post('/certificates/preview', { studentName: "Student Name" }, { responseType: 'blob' });
        return response.data;
    },

    getExitLetter: async (studentId) => {
        const response = await api.post('/certificates/exit-letter/preview', { studentName: "Student Name" }, { responseType: 'blob' });
        return response.data;
    },

    getRecommendationLetter: async (studentId) => {
        // Ideally pass real score or calculate on backend
        const response = await api.post('/certificates/recommendation/preview', { studentName: "Student Name", score: "96" }, { responseType: 'blob' });
        return response.data;
    },

    getTask: async (taskId) => {
        const response = await api.get(`/tasks/${taskId}`);
        return response.data;
    },

    deleteSubmission: async (submissionId) => {
        await api.delete(`/tasks/submissions/${submissionId}`);
    },

    getSignedUrl: async (fileUrl) => {
        const response = await api.get('/tasks/preview', {
            params: { fileUrl }
        });
        return response.data.signedUrl;
    },

    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/tasks/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    },

    // Exit Internship
    exitInternship: async (exitRequest) => {
        const response = await api.post('/students/exit', exitRequest);
        return response.data;
    }
};
