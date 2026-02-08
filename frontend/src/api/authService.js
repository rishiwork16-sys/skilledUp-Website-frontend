import api from "./api";

// EMAIL + PASSWORD LOGIN
export const loginWithEmail = (data) => {
  return api.post("/auth/login", data);
};

// SEND OTP
export const sendOtp = (mobile) => {
  return api.post("api/auth/otp/send", { mobile });
};

// VERIFY OTP
export const verifyOtp = (mobile, otp) => {
  return api.post("api/auth/otp/verify", { mobile, otp });
};

// REGISTER
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// GET USER PROFILE
export const getProfile = () => {
  return api.get("/api/auth/profile");
};
