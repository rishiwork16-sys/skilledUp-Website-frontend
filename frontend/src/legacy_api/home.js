// api.js
import api from "./api";

export const getBackgrounds = async () => {
  try {
    const response = await api.get(`/api/admin/backgrounds`);
    return response.data;
  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    throw error;
  }
};


export const createInquiry = async (data) => {
  try {
    const response = await api.post(`/api/student-inquiries`, data);
    return response.data;
    
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
};












// Add this function to your api/home.js file
export const getStates = async () => {
  try {
    const response = await api.get('/api/admin/states');
    return response.data;
  } catch(error) {
    console.error("Error Getting States");
    throw error;
  }
}
