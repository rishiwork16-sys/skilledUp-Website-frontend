// src/pages/profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
// import { getprofile } from "../../api/authService";
import { getProfile } from "../../api/authService";
import { getStudentProfileByPhone } from "../../api/studentService";

export default function Profile() {
  const { user: contextUser, isLoggedIn, logout, updateUserContext } = useUser();
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [activeTab, setActiveTab] = useState("profile");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    background: "",
    domain: ""
  });


  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };



  // Fetch user data from backend
  const fetchUserProfile = async () => {
    // Helper to map data to form
    const mapToForm = (data) => ({
      name: data.name || data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobile: data.mobile || data.phone || "",
      // Address extraction: Check nested 'address' object first, then flat fields
      city: data.address?.city || data.city || "",
      state: data.address?.state || data.state || "",
      pincode: data.address?.pincode || data.pincode || "",
      country: data.address?.country || data.country || "India",
      background: data.background || "",
      domain: data.domain || ""
    });

    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      let userData = null;

      // 1. Try Primary Profile Fetch
      try {
        const response = await getProfile();
        console.log("Backend user data (primary):", response.data);
        if (response.data && Object.keys(response.data).length > 0) {
          userData = response.data;
        }
      } catch (primaryError) {
        console.warn("Primary profile fetch failed:", primaryError);

        // 2. Try Fallback: Fetch by Phone
        const phone = contextUser?.phone || contextUser?.mobile;
        if (phone) {
          try {
            const phoneResponse = await getStudentProfileByPhone(phone);
            console.log("Backend user data (phone fallback):", phoneResponse);
            // Verify we got an object with actual keys
            if (phoneResponse && typeof phoneResponse === 'object' && Object.keys(phoneResponse).length > 0) {
              userData = phoneResponse;
            }
          } catch (fallbackError) {
            console.error("Phone fallback fetch failed:", fallbackError);
          }
        }
      }

      // 3. Last Resort: Use Context Data
      if (!userData && contextUser) {
        console.log("Using context user as fallback:", contextUser);
        userData = contextUser.backendData || contextUser;
      }

      if (!userData) {
        throw new Error("Could not fetch profile data");
      }

      setBackendUser(userData);
      console.log("Mapping User Data to Form:", userData);
      setFormData(mapToForm(userData));

    } catch (err) {
      console.error("Error fetching profile (all methods):", err);
      // Only show error screen if we have absolutely NO data to show
      if (!contextUser) {
        setError(err.response?.data?.message || err?.message || "Failed to load profile");
      } else {
        // Fallback to minimal view with context data if update fails
        console.log("Error caught, falling back to contextUser for display");
        setBackendUser(contextUser);
        setFormData(mapToForm(contextUser));
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch profile data when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!backendUser) {
      alert("User not found");
      return;
    }

    setSaving(true);

    try {
      // Prepare data according to backend structure
      const updatedData = {
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        address: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country,
          pincode: formData.pincode.trim()
        }
      };

      // TODO: Call backend API to update user
      // For now, just update local state
      setBackendUser(prev => ({
        ...prev,
        ...updatedData,
        address: {
          ...prev.address,
          ...updatedData.address
        }
      }));

      // Also update context if needed
      updateUserContext(backendUser.mobile || backendUser.email, {
        firstName: updatedData.name,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.mobile,
        city: updatedData.address.city,
        state: updatedData.address.state,
        country: updatedData.address.country,
        pincode: updatedData.address.pincode,
        credits: backendUser.walletBalance || 0
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      alert("Please enter current password");
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    setSaving(true);

    try {
      // TODO: Call backend API to change password
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Get full name from backend user
  const getFullName = () => {
    if (backendUser) {
      return `${backendUser.name || ''} ${backendUser.lastName || ''}`.trim();
    }
    return contextUser?.firstName || "User";
  };

  // Get initials
  const getInitials = () => {
    if (backendUser?.name && backendUser?.lastName) {
      return `${backendUser.name.charAt(0)}${backendUser.lastName.charAt(0)}`.toUpperCase();
    } else if (backendUser?.name) {
      return backendUser.name.charAt(0).toUpperCase();
    } else if (backendUser?.email) {
      return backendUser.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get wallet balance
  const getWalletBalance = () => {
    if (backendUser?.walletBalance !== undefined) {
      return backendUser.walletBalance;
    }
    return contextUser?.credits || 0;
  };

  // Get email verification status
  const getEmailStatus = () => {
    if (backendUser?.emailVerified) {
      return { text: "Verified", color: "green", bg: "green-100" };
    }
    return { text: "Not Verified", color: "red", bg: "red-100" };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Recently";
    }
  };

  // Get role display
  const getRoleDisplay = () => {
    if (!backendUser?.role) return "Student";

    const roleMap = {
      "ROLE_STUDENT": "🎓",
      "ROLE_TUTOR": "👨‍🏫 Tutor",
      "ROLE_ADMIN": "⚡ Admin"
    };

    return roleMap[backendUser.role] || backendUser.role;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 border-opacity-50 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-ping h-8 w-8 rounded-full bg-blue-500 opacity-20"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 text-lg font-medium">Loading your profile...</p>
          <p className="mt-2 text-gray-500">Fetching your account details from server</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={fetchUserProfile}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if no user data
  if (!backendUser && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">Please login again to access your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const emailStatus = getEmailStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center mb-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-5 mb-6 lg:mb-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : backendUser?.profileImage ? (
                  <img
                    src={backendUser.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}

              </div>

              {/* Upload Button */}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
    {getRoleDisplay()}
  </div> */}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getFullName()}</h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-2">
                {backendUser?.email && (
                  <div className="flex flex-wrap items-center gap-1 px-3 py-1 rounded-xl text-sm bg-blue-100 text-blue-800 break-all">
                    ✉️ {backendUser.email}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full bg-${emailStatus.bg} text-${emailStatus.color}-800`}>
                      {emailStatus.text}
                    </span>
                  </div>
                )}
                {backendUser?.mobile && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    📱 +91 {backendUser.mobile}
                  </span>
                )}
                {backendUser?.active !== undefined && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${backendUser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {backendUser.active ? '✅ Active' : '❌ Inactive'}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Member since {formatDate(backendUser?.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white p-5 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">₹ {getWalletBalance().toLocaleString()}</p>
              <p className="text-sm opacity-90 mt-2">💳 Available Credits</p>
              <div className="mt-3 flex items-center text-xs opacity-80">
                <span className="mr-2">💰</span>
                <span>Use for courses & services</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${activeTab === "profile"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile Information
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${activeTab === "security"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setActiveTab("security")}
          >
            🔒 Account Security
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "✏️ Edit Profile" : "📋 Profile Details"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isEditing
                      ? "Update your personal information below"
                      : "View and manage your profile information"}
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <span className={`font-medium ${!formData.name ? "text-gray-400 italic" : "text-gray-900"}`}>
                        {formData.name || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <span className={`font-medium ${!formData.lastName ? "text-gray-400 italic" : "text-gray-900"}`}>
                        {formData.lastName || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 pr-12"
                        placeholder="your@email.com"
                        disabled={backendUser?.emailVerified} // Don't allow editing if verified
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className={`text-sm px-2 py-1 rounded-lg ${emailStatus.bg === 'green-100' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {emailStatus.text}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-blue-50 rounded-xl border-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{formData.email || "Not set"}</span>
                        <span className={`text-xs px-2 py-1 rounded-lg ${emailStatus.bg === 'green-100' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {emailStatus.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      disabled
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-green-50 rounded-xl border-2 border-green-100">
                      <span className="font-medium text-gray-900">
                        {formData.mobile ? `+91 ${formData.mobile}` : "Not set"}
                      </span>
                    </div>
                  )}

                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="e.g., Mumbai"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <span className={`font-medium ${!formData.city ? "text-gray-400 italic" : "text-gray-900"}`}>
                        {formData.city || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="e.g., Maharashtra"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <span className={`font-medium ${!formData.state ? "text-gray-400 italic" : "text-gray-900"}`}>
                        {formData.state || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  {isEditing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="USA">🇺🇸 United States</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="Canada">🇨🇦 Canada</option>
                    </select>
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {formData.country === "India" && "🇮🇳"}
                          {formData.country === "USA" && "🇺🇸"}
                          {formData.country === "UK" && "🇬🇧"}
                          {formData.country === "Canada" && "🇨🇦"}
                        </span>
                        <span className="font-medium text-gray-900">{formData.country || "India"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="e.g., 400001"
                      maxLength="6"
                    />
                  ) : (
                    <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl border-2 border-transparent">
                      <span className={`font-medium ${!formData.pincode ? "text-gray-400 italic" : "text-gray-900"}`}>
                        {formData.pincode || "Not set"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      if (backendUser) {
                        setFormData({
                          name: backendUser.name || "",
                          lastName: backendUser.lastName || "",
                          email: backendUser.email || "",
                          mobile: backendUser.mobile || "",
                          city: backendUser.address?.city || "",
                          state: backendUser.address?.state || "",
                          pincode: backendUser.address?.pincode || "",
                          country: backendUser.address?.country || "India",
                          background: "",
                          domain: ""
                        });
                      }
                    }}
                    className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm hover:shadow"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving || !formData.name || !formData.email || !formData.mobile}
                    className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">🔒 Account Security</h2>
              <p className="text-gray-600 mt-1">Manage your password and account security settings</p>
            </div>

            <div className="p-6">
              {/* Change Password Form */}
              <div className="max-w-lg space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <div className="mt-10 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-yellow-600">💡</span> Security Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use a strong password with mix of letters, numbers, and symbols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Don't share your password with anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Change your password regularly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Logout Confirmation</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to logout? You'll need to login again to access your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}