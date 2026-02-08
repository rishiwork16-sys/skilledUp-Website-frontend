import api from "./api";

export const createInquiry = async (inquiryData) => {
  try {
    const response = await api.post('/api/master-class-inquiries', inquiryData);
    return response.data;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
};
