import api from './api';

/* ============================
   GET INTERNSHIPS
============================ */
export const getAllInternships = async () => {
  try {
    const response = await api.get('/api/internships');

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(internship => ({
        id: internship.id,
        name: internship.name,
        title: internship.title || internship.name,
        description: internship.description
      }));
    }

    return [];
  } catch (error) {
    console.error('Error Getting Internships:', error);
    return [];
  }
};

/* ============================
   GET STATES
============================ */
export const getStates = async () => {
  try {
    const response = await api.get('/api/admin/states');
    return response.data;
  } catch (error) {
    console.error('Error Getting States:', error);
    throw error;
  }
};

/* ============================
   EMAIL OTP ✅ FIXED
============================ */
export const sendEmailOtp = async (email) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/send-otp',
      null,
      {
        params: { email } // ✅ DO NOT encodeURIComponent
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error Sending Email OTP:', error);
    throw error;
  }
};

/* ============================
   MOBILE OTP ✅ FIXED
============================ */
export const sendMobileOtp = async (mobile) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/send-mobile',
      null,
      {
        params: { mobile } // ✅ DO NOT encodeURIComponent
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending Mobile OTP:', error);
    throw error;
  }
};

/* ============================
   VERIFY MOBILE OTP ✅ FIXED
============================ */
export const verifyMobileOtp = async (mobile, otp) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/mobile/verify',
      null,
      {
        params: {
          mobile,
          otp
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying mobile OTP:', error);
    throw error;
  }
};

/* ============================
   VERIFY EMAIL OTP ✅ FIXED
============================ */
export const verifyEmailOtp = async (email, otp) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/email/verify',
      null,
      {
        params: {
          email,
          otp
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    throw error;
  }
};

/* ============================
   ENROLL INTERNSHIP
============================ */
export const enrollInternship = async (enrollmentData) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/enroll',
      enrollmentData
    );
    return response.data;
  } catch (error) {
    console.error('Error Enrolling Internship:', error);
    throw error;
  }
};

/* ============================
   VERIFY & ENROLL
============================ */
export const verifyAndEnroll = async (verificationData) => {
  try {
    const response = await api.post(
      '/api/internship-enrollments/verify',
      verificationData
    );
    return response.data;
  } catch (error) {
    console.error('Error in verify and enroll:', error);
    throw error;
  }
};

/* ============================
   USER PROFILE
============================ */
export const getProfile = async () => {
  try {
    const response = await api.get('/api/user/me');
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/* ============================
   ALIASES & CONSTANTS
============================ */
export const getInternshipDomains = getAllInternships;

export const getDurationOptions = () => {
  return [
    { value: '', label: 'Select duration' },
    { value: '1', label: '1 Month' },
    { value: '2', label: '2 Months' },
    { value: '3', label: '3 Months' },
    { value: '4', label: '4 Months' },
    { value: '5', label: '5 Months' },
    { value: '6', label: '6 Months' },
    { value: '7', label: '7 Months' },
    { value: '8', label: '8 Months' },
    { value: '9', label: '9 Months' },
    { value: '10', label: '10 Months' },
    { value: '11', label: '11 Months' },
    { value: '12', label: '12 Months' }
  ];
};
