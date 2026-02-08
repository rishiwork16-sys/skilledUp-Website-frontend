import api from "./api";

/* ============================
   EMAIL + PASSWORD LOGIN
============================ */
// export const loginWithEmail = (data) => {
//   return api.post("api/auth/login", data);
// };

export const loginWithEmail = (data) => {
  return api.post("api/auth/login", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};



/* ============================
   MOBILE OTP
============================ */

// SEND OTP (ONLY SEND)
export const sendOtp = (mobile) => {
  return api.post("api/auth/otp/send", { mobile });
};

// VERIFY OTP (CHECK USER EXISTENCE HERE)
export const verifyOtp = (mobile, otp) => {
  return api.post("api/auth/otp/verify", { mobile, otp });
};

/* ============================
   EMAIL OTP (REGISTER FLOW)
============================ */

// SEND EMAIL OTP
export const sendRegisterEmailOtp = (email) => {
  return api.post(`api/auth/register/send-otp?email=${email}`);
};

// VERIFY EMAIL OTP + REGISTER USER
export const registerUser = (otp, data) => {
  return api.post(`api/auth/register/verify?otp=${otp}`, data);
};


export const getProfile = () =>{
  return api.get(`/api/user/me`);
};

export const forgotPassWord =(email)=> {
  return api.post(`api/auth/forgot/send-email?email=${email}`);
}

export const resetPassword = (data) => {
  return api.post("api/auth/reset-password", data);
};



