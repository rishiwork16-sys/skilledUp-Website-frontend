import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../api/internship';
import { getStudentProfileByPhone } from '../api/studentService';
import api from '../api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('skilledup_users');
    return savedUsers ? JSON.parse(savedUsers) : {};
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendUserData, setBackendUserData] = useState(null);

  // ✅ Function to fetch backend profile - MADE IT PUBLIC
  const fetchBackendProfile = async (currentUserData = null) => {
    try {
      const token = localStorage.getItem('token');

      console.log("Fetching backend profile...");
      let responseData = null;

      if (token) {
        try {
          const profile = await getProfile();
          if (profile) responseData = profile;
        } catch (err) {
          console.warn("Primary profile fetch failed:", err);
        }
      }

      const currentUser = currentUserData || user;
      const phone = currentUser?.phone || currentUser?.mobile;
      const email = currentUser?.email;

      if (!responseData && phone) {
        try {
          console.log("Attempting to fetch profile by phone:", phone);
          responseData = await getStudentProfileByPhone(phone);
          console.log("Phone fallback successful:", responseData);
        } catch (phoneErr) {
          console.error("Phone fallback failed:", phoneErr);
        }
      }

      if (!responseData && email) {
        try {
          console.log("Attempting to fetch auth user by email:", email);
          const res = await api.get('/api/auth/user', { params: { email } });
          responseData = res?.data;
          console.log("Email fallback successful:", responseData);
        } catch (emailErr) {
          console.error("Email fallback failed:", emailErr);
        }
      }

      if (responseData) {
        console.log("Backend profile fetched:", responseData);
        setBackendUserData(responseData);

        // Update local user with backend data
        const currentUser = currentUserData || user;

        if (currentUser) {
          const nameParts = responseData.name?.split(' ') || [];

          console.log('✅ fetchBackendProfile Response:', responseData);
          // alert('DEBUG: Backend Response: ' + JSON.stringify(responseData)); // Uncomment to see on screen

          const userId = responseData.id || responseData.userId || responseData.studentId || currentUser.id || currentUser.userId;

          if (!userId) {
            console.error('User ID missing in backend response', responseData);
          }

          const updatedUser = {
            ...currentUser,
            id: userId, // ✅ Ensure ID is set
            userId: userId, // ✅ Ensure userId is set
            // Map other fields...
            firstName: nameParts[0] || currentUser.firstName || '',
            lastName: nameParts.slice(1).join(' ') || currentUser.lastName || '',
            email: responseData.email || currentUser.email || '',
            phone: responseData.mobile || responseData.phone || currentUser.phone || '',
            credits: responseData.walletBalance || currentUser.credits || 0,
            backendData: responseData
          };

          console.log("UserContext - Updated user with backend ID:", updatedUser);
          setUser(updatedUser);
          localStorage.setItem('skilledup_current_user', JSON.stringify(updatedUser)); // Persist immediately
        }

        return responseData;
      }
    } catch (error) {
      console.error("Error fetching backend profile:", error);
      // If user is not found in backend (404/401), we should clear the session
      if (error.response && (error.response.status === 404 || error.response.status === 401)) {
        console.warn("User no longer exists in backend. Logging out.");
        logout();
      }
      return null;
    }
  };

  // Check for saved user on mount
  useEffect(() => {
    console.log("UserContext - Checking saved user...");

    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('skilledup_current_user');
        const token = localStorage.getItem('token');

        console.log("UserContext - savedUser from localStorage:", savedUser);

        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log("UserContext - User found:", userData);
          setUser(userData);
          setIsLoggedIn(true);

          // Fetch backend data (token preferred, but fallbacks will handle no-token)
          await fetchBackendProfile(userData);
        } else {
          console.log("UserContext - No saved user found");
        }
      } catch (error) {
        console.error("UserContext - Error parsing saved user:", error);
        localStorage.removeItem('skilledup_current_user');
        localStorage.removeItem('token');
      } finally {
        console.log("UserContext - Setting loading to false");
        setLoading(false);
      }
    };

    setTimeout(() => {
      checkAuth();
    }, 300);
  }, []);

  // Find user by phone OR email
  const findUser = (identifier) => {
    if (identifier && identifier.length === 10 && /^\d+$/.test(identifier)) {
      const foundUser = users[identifier];
      return { user: foundUser, type: 'phone' };
    }

    if (identifier && identifier.includes('@')) {
      const emailKey = identifier.toLowerCase();
      const user = Object.values(users).find(
        u => u.email && u.email.toLowerCase() === emailKey
      );
      return { user, type: 'email' };
    }

    return { user: null, type: null };
  };

  // Register user
  const registerUser = (identifier, userData) => {
    setUsers(prev => ({
      ...prev,
      [identifier]: userData
    }));

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('skilledup_current_user', JSON.stringify(userData));

    return true;
  };

  // Login
  const login = async (userData, token = null) => {
    if (!userData) {
      console.error("UserContext - login called without userData");
      return false;
    }

    if (token) {
      localStorage.setItem('token', token);
    }

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('skilledup_current_user', JSON.stringify(userData));

    // If we have a token, fetch backend profile
    if (token || localStorage.getItem('token')) {
      await fetchBackendProfile(userData);
    }

    return true;
  };

  // Logout
  const logout = () => {
    console.log("UserContext - logout called");

    setUser(null);
    setIsLoggedIn(false);
    setBackendUserData(null);

    localStorage.removeItem('skilledup_current_user');
    localStorage.removeItem('skilledup_token');
    localStorage.removeItem('token');

    console.log("UserContext - User logged out");
  };

  // Update user data
  const updateUser = (identifier, updatedData) => {
    setUsers(prev => ({
      ...prev,
      [identifier]: {
        ...prev[identifier],
        ...updatedData
      }
    }));

    if (user && (user.phone === identifier || user.email === identifier)) {
      const updatedUser = {
        ...user,
        ...updatedData
      };

      setUser(updatedUser);
      localStorage.setItem('skilledup_current_user', JSON.stringify(updatedUser));
    }
  };

  // Add credits to user
  const addCredits = (amount) => {
    if (!user) {
      console.error("UserContext - No user to add credits to");
      return;
    }

    const identifier = user.phone || user.email;
    if (!identifier) {
      console.error("UserContext - No identifier for user");
      return;
    }

    const newCredits = (user.credits || 0) + amount;

    setUser(prev => ({
      ...prev,
      credits: newCredits
    }));

    setUsers(prev => ({
      ...prev,
      [identifier]: {
        ...prev[identifier],
        credits: newCredits
      }
    }));

    const updatedUser = { ...user, credits: newCredits };
    localStorage.setItem('skilledup_current_user', JSON.stringify(updatedUser));

    return newCredits;
  };

  // ✅ Make sure this function is properly exported
  const refreshBackendProfile = async () => {
    return await fetchBackendProfile();
  };

  // ✅ MEMOIZE the combined user data
  const combinedUser = React.useMemo(() => {
    if (!user) return null;

    const backend = backendUserData || user.backendData;

    // Robustly find the ID
    const userId = user.id || user.userId || backend?.id || backend?.userId || backend?.studentId;

    // Find the phone
    const userPhone = backend?.mobile || backend?.phone || user.phone || user.mobile || '';

    const nameParts = backend?.name?.split(' ') || [];

    return {
      ...user,
      id: userId,
      userId: userId,
      firstName: nameParts[0] || user.firstName || '',
      lastName: nameParts.slice(1).join(' ') || user.lastName || '',
      email: backend?.email || user.email || '',
      phone: userPhone,
      mobile: userPhone,
      credits: backend?.walletBalance || user.credits || 0,
      backendData: backend,
      // Lift address fields to top level
      city: backend?.address?.city || backend?.city || user.city || "",
      state: backend?.address?.state || backend?.state || user.state || "",
      country: backend?.address?.country || backend?.country || user.country || "India",
      pincode: backend?.address?.pincode || backend?.pincode || user.pincode || ""
    };
  }, [user, backendUserData]);

  // ✅ MEMOIZE the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    user: combinedUser, // Combined data
    users,
    isLoggedIn,
    loading,
    backendUserData,
    registerUser,
    login,
    logout,
    updateUser,
    addCredits,
    findUser,
    refreshBackendProfile,
    getCombinedUserData: () => combinedUser // Return the memoized object
  }), [combinedUser, users, isLoggedIn, loading, backendUserData]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
