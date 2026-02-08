// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  sendOtp as sendOtpApi,
  loginWithOtp as loginWithOtpApi,
  sendRegisterEmailOtp,
  loginWithEmailOtp as loginWithEmailOtpApi,
  registerUser,
  forgotPassWord,
  resetPassword,
} from "../api/websiteAuthService";
// Adjust path to wherever you export getProfile


export default function Login() {
  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const { user } = useUser();

  const navigate = useNavigate();
  const { registerUser: registerUserContext, login, users, updateUser } = useUser();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    country: "India",
    pincode: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    password: ""
  });


  // Check if user exists
  useEffect(() => {
    if (activeTab === "phone" && phone.length === 10) {
      const userExists = !!users[phone];
      setIsExistingUser(userExists);
    } else if (activeTab === "email" && email.includes('@')) {
      const emailKey = email.toLowerCase();
      const userExists = Object.values(users).some(
        user => user.email && user.email.toLowerCase() === emailKey
      );
      setIsExistingUser(userExists);
    }
  }, [phone, email, activeTab, users]);

  // Cleanup localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem("resetEmail");
    };
  }, []);

  









  const handleResetEmailSubmit = async () => {
    if (!resetEmail || !resetEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Store email in localStorage BEFORE sending OTP
      localStorage.setItem("resetEmail", resetEmail);

      const res = await forgotPassWord(resetEmail);

      // assuming backend returns { message: "OTP sent successfully" }
      alert(res.data.message || "OTP sent successfully to your email");

      setResetStep(2); // move to OTP verification step
    } catch (error) {
      console.error(error);

      const errorMsg =
        error?.response?.data?.message ||
        "Failed to send OTP. Please try again.";

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Validate profile fields
  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email is REQUIRED for registration
    if (!email || !email.includes('@')) {
      newErrors.email = "Valid email is required for registration";
    }

    if (!profileData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!profileData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!profileData.pincode.trim() || !/^\d{6}$/.test(profileData.pincode)) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const sendOtp = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      await sendOtpApi(phone);
      setStep(2);
      alert(`OTP sent to +91 ${phone}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOtpForLogin = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      await sendRegisterEmailOtp(email.toLowerCase().trim());
      setStep(2);
      alert(`OTP sent to ${email}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Send Email OTP for registration
  const sendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrors(prev => ({ ...prev, email: "Valid email is required" }));
      return;
    }

    // Check if email already exists in local context
    const emailKey = email.toLowerCase();
    const emailExists = Object.values(users).some(
      user => user.email && user.email.toLowerCase() === emailKey
    );

    if (emailExists) {
      alert("This email is already registered");
      return;
    }

    try {
      setLoading(true);
      await sendRegisterEmailOtp(email);
      setEmailSent(true);
      alert(`Email verification OTP sent to ${email}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send email OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = activeTab === "email"
        ? await loginWithEmailOtpApi(email, otp)
        : await loginWithOtpApi(phone, otp);
      const data = res.data;

      if (data?.token) {
        const token = data.token;
        localStorage.setItem("token", token);

        const mappedUser = {
          id: data.id || data.userId,
          userId: data.id || data.userId,
          email: data.email,
          phone: activeTab === "phone" ? phone : (data.mobile || ""),
          mobile: activeTab === "phone" ? phone : (data.mobile || ""),
          firstName: data.name || "",
          role: data.role,
          ...data,
        };

        localStorage.setItem("user", JSON.stringify(mappedUser));
        await login(mappedUser, token);
        alert(`Welcome back ${data.name || phone}!`);
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (String(msg).toLowerCase().includes("user not found")) {
        if (activeTab === "phone") {
          localStorage.setItem("pendingMobile", phone);
          setStep(3);
        } else {
          alert("Account not found for this email. Please register using Phone + OTP.");
          setStep(1);
        }
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD FUNCTIONS
  const handleForgotPassword = () => {
    setForgotPasswordMode(true);
    setResetEmail("");
    setResetOtp("");
    setNewPassword("");
    setResetConfirmPassword("");
    setResetStep(1);
  };

  // const handleResetEmailSubmit = () => {
  //   if (!resetEmail || !resetEmail.includes('@')) {
  //     alert("Please enter a valid email address");
  //     return;
  //   }

  //   const emailKey = resetEmail.toLowerCase();
  //   const userExists = Object.values(users).some(
  //     user => user.email && user.email.toLowerCase() === emailKey
  //   );

  //   if (!userExists) {
  //     alert("No account found with this email address");
  //     return;
  //   }

  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setResetStep(2);
  //     alert(`Password reset OTP sent to ${resetEmail}\n\nDemo OTP: 123456`);
  //   }, 800);
  // };

  const handleResetOtpSubmit = () => {
    if (!resetOtp || resetOtp.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }

    // No API call needed here - OTP will be verified when resetting password
    setResetStep(3);
  };

  const handleResetPasswordSubmit = async () => {
    if (!newPassword) {
      alert("Please enter new password");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== resetConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Get email from localStorage
      const storedEmail = localStorage.getItem("resetEmail") || resetEmail;

      if (!storedEmail) {
        alert("Session expired. Please restart the reset process.");
        return;
      }

      // Prepare data in the format expected by backend (matches ResetPasswordRequest DTO)
      const resetData = {
        email: storedEmail,
        otp: resetOtp,
        newPassword: newPassword
      };

      // Call backend API to reset password
      const response = await resetPassword(resetData);

      if (response.status === 200) {
        // Password reset successful
        alert(response.data.message || "Password reset successful! You can now login with your new password.");

        // Clear localStorage
        localStorage.removeItem("resetEmail");

        // Reset state
        setForgotPasswordMode(false);
        setResetStep(1);
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
        setResetConfirmPassword("");

        // Switch to email tab with the reset email pre-filled
        handleTabChange("email");
        setEmail(storedEmail);
        setPassword("");
      }
    } catch (error) {
      console.error("Reset password error:", error);

      const errorMsg = error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to reset password. Please check your OTP.";
      alert(errorMsg);

      // If OTP is invalid, clear it and go back to OTP step
      if (error.response?.status === 400 || error.response?.status === 401) {
        setResetOtp("");
        setResetStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // Call your Spring Boot backend
      const response = await loginWithEmail({
        email: email.toLowerCase().trim(),
        password: password
      });

      console.log("Backend response:", response.data);

      // Your Spring Boot returns user data directly in response object
      const responseData = response.data;

      // Check if login was successful (you have token and email)
      if (responseData.token && responseData.email) {
        const { token, email: userEmail, name, ...otherUserData } = responseData;

        // Store JWT token
        if (token) {
          localStorage.setItem("token", token);
          console.log("JWT Token stored:", token.substring(0, 20) + "...");
        }

        // Map response data to frontend user object
        const mappedUser = {
          id: otherUserData?.id || otherUserData?.userId,
          email: userEmail,
          firstName: name || "", // Your backend returns "name" not "firstName"
          lastName: otherUserData?.lastName || "",
          phone: otherUserData?.phone || otherUserData?.mobile || "",
          credits: otherUserData?.walletBalance || otherUserData?.credits || 0,
          role: otherUserData?.role,
          // Include any other fields from backend
          ...otherUserData
        };

        // Update user context
        login(mappedUser);

        // Show success message
        const welcomeName = name || userEmail?.split('@')[0] || 'User';
        alert(`Welcome back ${welcomeName}!`);

        // Navigate to home
        console.log("Attempting to navigate to home...");
        navigate("/", { replace: true });

        // Force navigation if react-router doesn't work
        setTimeout(() => {
          if (window.location.pathname !== "/") {
            console.log("React Router navigation failed, forcing redirect...");
            window.location.href = "/";
          }
        }, 500);

      } else {
        // Show error message from backend
        alert(responseData.message || "Login failed. No token received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  // Error handler
  const handleLoginError = (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Try to extract message from your backend error format
      if (data && typeof data === 'object') {
        if (data.message) {
          alert(data.message);
          return;
        }
        if (data.error) {
          alert(data.error);
          return;
        }
      }

      switch (status) {
        case 400:
          alert("Bad request. Please check your input.");
          break;
        case 401:
          alert("Invalid email or password.");
          break;
        case 403:
          alert("Access denied.");
          break;
        case 500:
          alert("Server error. Please try again later.");
          break;
        default:
          alert(`Login failed (Status: ${status})`);
      }
    } else if (error.request) {
      alert("Cannot connect to server. Check your internet.");
    } else {
      alert("An error occurred: " + error.message);
    }
  };

  // Handle profile submission for phone registration
  const handleProfileSubmit = async () => {
    if (!validateProfile()) {
      alert("Please fill all required fields correctly");
      return;
    }

    // Email OTP is required for registration
    if (!emailOtp || emailOtp.length !== 6) {
      alert("Please enter the 6-digit OTP sent to your email");
      return;
    }

    try {
      setLoading(true);

      // Prepare registration data for API
      const registrationData = {
        name: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: email.toLowerCase(),
        mobile: phone,
        city: profileData.city.trim(),
        state: profileData.state.trim(),
        country: profileData.country,
        pincode: profileData.pincode.trim()
      };

      // Call registration API with email OTP
      const response = await registerUser(emailOtp, registrationData);

      const data = response.data;
      if (response.status === 200 && data?.token) {
        localStorage.setItem("token", data.token);

        const mappedUser = {
          id: data.id || data.userId,
          userId: data.id || data.userId,
          email: data.email,
          phone: phone,
          mobile: phone,
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          role: data.role,
          ...data,
        };

        await login(mappedUser, data.token);
        registerUserContext(phone, mappedUser);
        alert(`Welcome ${mappedUser.firstName}!`);
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please check your OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (forgotPasswordMode) {
      return "Reset Password 🔑";
    }
    if (step === 1)
      return activeTab === "phone" ? (
        <>
          Welcome to skilled
          <span style={{ color: "#004aad" }}>Up</span>
        </>
      ) : (
        'Login with Email 📧'
      );

    if (step === 2) return 'Verify Your Identity';
    if (step === 3) return 'Complete Your Profile';
    return 'Login';
  };

  const getStepSubtitle = () => {
    if (forgotPasswordMode) {
      if (resetStep === 1) return "Enter your email to reset password";
      if (resetStep === 2) return `Enter OTP sent to ${resetEmail}`;
      if (resetStep === 3) return "Enter your new password";
    }
    if (step === 1) {
      if (activeTab === "phone") {
        return isExistingUser
          ? 'Welcome back! Login to continue'
          : 'Enter your mobile number to get started';
      } else {
        return 'Enter your email and password to login';
      }
    }
    if (step === 2) {
      return activeTab === "phone"
        ? `Enter OTP sent to +91 ${phone}`
        : "";
    }
    if (step === 3) {
      return 'Please provide your details to complete registration';
    }
    return '';
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(1);
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setEmailOtp("");
    setIsExistingUser(false);
    setEmailSent(false);
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      state: "",
      pincode: "",
      password: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex justify-center items-center p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-8">
        {/* Login Method Tabs */}
        {!forgotPasswordMode && (
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-4 text-center font-semibold transition-all ${activeTab === "phone"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => handleTabChange("phone")}
            >
              📱 Phone Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-semibold transition-all ${activeTab === "email"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => handleTabChange("email")}
            >
              📧 Email Login
            </button>
          </div>
        )}

        {/* Progress Indicator for Phone */}
        {!forgotPasswordMode && activeTab === "phone" && !isExistingUser && step !== 3 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${step >= stepNum
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                    }`}>
                    {stepNum}
                  </div>
                  <span className={`text-xs font-medium ${step >= stepNum ? "text-indigo-600" : "text-gray-400"
                    }`}>
                    {stepNum === 1 ? "Phone" : stepNum === 2 ? "OTP" : "Profile"}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
        )}

        {/* Title and Subtitle */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
          {getStepTitle()}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {getStepSubtitle()}
        </p>

        {/* FORGOT PASSWORD FLOW */}
        {forgotPasswordMode ? (
          <div className="space-y-6">
            {resetStep === 1 && (
              <>
                <div className="space-y-4">
                  <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-r border-gray-300">
                      ✉️
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      className="flex-1 px-4 py-3 outline-none"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setResetStep(1);
                      }}
                    >
                      ← Back to Login
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-xl font-semibold ${resetEmail && resetEmail.includes('@') && !loading
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={handleResetEmailSubmit}
                      disabled={loading || !resetEmail || !resetEmail.includes('@')}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {resetStep === 2 && (
              <>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-700">
                      📧 Enter the OTP sent to: <span className="font-semibold">{resetEmail}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      OTP will be verified when you set your new password
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-4 text-center text-xl font-semibold tracking-widest border border-gray-300 rounded-xl outline-none"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() => {
                        setResetStep(1);
                        setResetOtp("");
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-xl font-semibold ${resetOtp.length === 6 && !loading
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={handleResetOtpSubmit}
                      disabled={loading || resetOtp.length !== 6}
                    >
                      {loading ? 'Verifying...' : 'Continue to Set Password'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {resetStep === 3 && (
              <>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="New password (min 6 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() => setResetStep(2)}
                    >
                      ← Back
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-xl font-semibold ${newPassword && resetConfirmPassword && !loading
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={handleResetPasswordSubmit}
                      disabled={loading || !newPassword || !resetConfirmPassword}
                    >
                      {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* NORMAL LOGIN FLOW */
          <>
            {/* Step 1: Phone/Email Input */}
            {step === 1 && (
              <div className="space-y-6">
                {activeTab === "phone" ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-r border-gray-300 font-medium">
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter mobile number"
                          className="flex-1 px-4 py-3 outline-none"
                          value={phone}
                          onChange={handlePhoneChange}
                          maxLength={10}
                        />
                      </div>
                      <button
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${phone.length === 10 && !loading
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        onClick={sendOtp}
                        disabled={loading || phone.length !== 10}
                      >
                        {loading ? 'Sending...' : (isExistingUser ? 'Login' : 'Send OTP')}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-r border-gray-300">
                        ✉️
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 outline-none"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>

                    <button
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${email && !loading
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={sendEmailOtpForLogin}
                      disabled={loading || !email}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                )}

                {/* Welcome Bonus */}
                {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                  {activeTab === "email" ? (
                    <p className="text-gray-700">
                      👋 Login with your registered email
                    </p>
                  ) : isExistingUser ? (
                    <p className="text-gray-700">
                      👋 Welcome back! Quick login with OTP
                    </p>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      🎁 <span className="font-bold">500 Credits</span> welcome bonus on first login!
                    </p>
                  )}
                </div> */}

                {/* Demo Note for Email */}
                {/* {activeTab === "email" && (
                  <p className="text-center text-sm text-gray-500">
                    💡 Demo password: <span className="font-semibold">demo123</span>
                  </p>
                )} */}
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-4 text-center text-xl font-semibold tracking-widest border border-gray-300 rounded-xl outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />

                  <div className="flex justify-between items-center text-sm">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      ← Change
                    </button>
                    <div className="text-gray-600">
                      Didn't receive?{' '}
                      <button
                        className="text-indigo-600 font-semibold hover:underline"
                        onClick={sendOtp}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${otp.length === 6 && !loading
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {isExistingUser ? 'Login →' : 'Continue →'}
                </button>

                {/* <p className="text-center text-sm text-gray-500">
                  💡 Demo: Use <span className="font-semibold">123456</span> as OTP
                </p> */}
              </div>
            )}

            {/* Step 3: Complete Profile (Phone Registration only) */}
            {step === 3 && activeTab === "phone" && (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    👤 Personal Information <span className="text-red-500">*</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                        value={profileData.firstName}
                        onChange={handleProfileInputChange}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                        value={profileData.lastName}
                        onChange={handleProfileInputChange}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Number (from previous step) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number (Verified)
                    </label>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      <span>📱 +91 {phone}</span>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        ✓ Verified
                      </span>
                    </div>
                  </div>

                  {/* Email Section - REQUIRED for registration */}
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      📧 Email Address <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Email is required for registration and important updates.
                    </p>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          className={`flex-1 px-4 py-3 border rounded-lg outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                          value={email}
                          onChange={handleEmailChange}
                          disabled={emailSent}
                        />
                        {!emailSent && (
                          <button
                            className={`px-6 py-3 rounded-lg font-medium ${!email || !email.includes('@')
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            onClick={sendEmailOtp}
                            disabled={!email || !email.includes('@') || loading}
                          >
                            {loading ? 'Sending...' : 'Send OTP'}
                          </button>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mb-2">{errors.email}</p>
                      )}

                      {emailSent && (
                        <>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Enter OTP sent to {email}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              maxLength={6}
                            />
                          </div>
                          <p className="text-center text-sm text-gray-500">
                            💡 The OTP will be verified when you click "Complete Registration"
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📍 Location Details <span className="text-red-500">*</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        value={profileData.city}
                        onChange={handleProfileInputChange}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Maharashtra"
                        className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                        value={profileData.state}
                        onChange={handleProfileInputChange}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
                        value={profileData.country}
                        onChange={handleProfileInputChange}
                      >
                        <option value="India">🇮🇳 India</option>
                        <option value="USA">🇺🇸 USA</option>
                        <option value="UK">🇬🇧 UK</option>
                        <option value="Canada">🇨🇦 Canada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="400001"
                        className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.pincode ? "border-red-500" : "border-gray-300"
                          }`}
                        value={profileData.pincode}
                        onChange={handleProfileInputChange}
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="text-gray-500 hover:text-gray-700 font-medium"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    ← Back
                  </button>

                  <button
                    className={`py-3 px-6 rounded-xl font-semibold transition-all ${emailSent && !loading
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    onClick={handleProfileSubmit}
                    disabled={loading || !emailSent}
                  >
                    {loading ? 'Registering...' : '🎯 Complete Registration'}
                  </button>
                </div>

                {/* Welcome Bonus Reminder */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-gray-800 text-center font-medium">
                    ✨ Complete registration to unlock <span className="font-bold">500 Credits</span> welcome bonus!
                  </p>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    All fields marked with * are required
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 skilledUp. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
