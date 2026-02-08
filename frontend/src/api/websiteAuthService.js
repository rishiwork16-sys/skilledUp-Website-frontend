import api from "./api";

export const loginWithEmail = (data) => {
  return api.post("/api/auth/login", data);
};

export const register = (data) => {
  const payload = {
    name: data?.name,
    email: (data?.email || "").toLowerCase().trim(),
    mobile: data?.mobile,
    password: data?.password,
    emailVerified: data?.emailVerified === true,
    mobileVerified: data?.mobileVerified === true,
  };
  return api.post("/api/auth/register", payload);
};

export const sendOtp = (mobile) => {
  return api.post("/api/auth/send-otp", null, {
    params: { identifier: mobile, type: "MOBILE" },
  });
};

export const loginWithOtp = (mobile, otp) => {
  return api.post("/api/auth/login/otp2", null, {
    params: { identifier: mobile, otp, type: "MOBILE" },
  });
};

export const loginWithEmailOtp = (email, otp) => {
  return api.post("/api/auth/login/otp2", null, {
    params: { identifier: (email || "").toLowerCase().trim(), otp, type: "EMAIL" },
  });
};

export const sendRegisterEmailOtp = (email) => {
  return api.post("/api/auth/send-otp", null, {
    params: { identifier: email, type: "EMAIL" },
  });
};

export const registerUser = async (emailOtp, data) => {
  const email = (data?.email || "").toLowerCase().trim();
  await api.post("/api/auth/verify-otp", null, {
    params: { identifier: email, otp: emailOtp, type: "EMAIL" },
  });

  const payload = {
    name: data?.name,
    email,
    mobile: data?.mobile,
    emailVerified: true,
    mobileVerified: true,
  };
  return api.post("/api/auth/register", payload);
};

export const forgotPassWord = (email) => {
  return api.post("/api/auth/send-otp", null, {
    params: { identifier: email, type: "EMAIL" },
  });
};

export const resetPassword = (data) => {
  return api.post("/api/auth/reset-password", data);
};

export const getProfile = () => {
  return api.get("/api/auth/profile");
};
