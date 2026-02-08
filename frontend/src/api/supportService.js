import api from './api';

const getAllTickets = async () => {
    const response = await api.get('/api/support/admin');
    return response.data;
};

const getOpenTickets = async () => {
    const response = await api.get('/api/support/admin/open');
    return response.data;
};

const getTicketById = async (ticketId) => {
    const response = await api.get(`/api/support/admin/${ticketId}`);
    return response.data;
};

const replyToTicket = async (ticketId, reply) => {
    const response = await api.post(`/api/support/admin/${ticketId}/reply`, { reply });
    return response.data;
};

const updateTicketStatus = async (ticketId, status) => {
    const response = await api.put(`/api/support/admin/${ticketId}/status`, { status });
    return response.data;
};

const closeTicket = async (ticketId) => {
    const response = await api.post(`/api/support/admin/${ticketId}/close`);
    return response.data;
};

const getOpenTicketsCount = async () => {
    const response = await api.get('/api/support/admin/count/open');
    return response.data;
};

export default {
    getAllTickets,
    getOpenTickets,
    getTicketById,
    replyToTicket,
    updateTicketStatus,
    closeTicket,
    getOpenTicketsCount,

    // Student Methods
    createTicket: async (ticketData) => {
        const response = await api.post('/api/support/tickets', ticketData);
        return response.data;
    },

    getMyTickets: async (studentId) => {
        const response = await api.get(`/api/support/tickets/my-tickets?studentId=${studentId}`);
        return response.data;
    },

    getChatHistory: async (ticketId) => {
        const response = await api.get(`/api/support/tickets/${ticketId}/messages`);
        return response.data;
    },

    replyToTicketRest: async (ticketId, messageDto) => {
        const response = await api.post(`/api/support/tickets/${ticketId}/reply`, messageDto);
        return response.data;
    },
};
