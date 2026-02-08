// src/components/AuthRoute.jsx - FIXED
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthRoute = ({ children }) => {
  const { isLoggedIn, loading } = useUser();

  console.log("AuthRoute - isLoggedIn:", isLoggedIn, "loading:", loading);

  // ✅ Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping h-8 w-8 rounded-full bg-blue-500 opacity-20"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-700 text-lg font-medium">Checking authentication...</p>
        <p className="mt-2 text-gray-500">Please wait</p>
      </div>
    );
  }

  // ✅ If not logged in, redirect to login
  if (!isLoggedIn) {
    console.log("AuthRoute - Not logged in, redirecting to /login");
    
    // Save current path for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== "/login") {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in, render the children
  console.log("AuthRoute - User is logged in, rendering children");
  return children;
};

export default AuthRoute;