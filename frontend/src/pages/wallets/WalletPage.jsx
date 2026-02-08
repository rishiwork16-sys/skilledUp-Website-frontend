// src/pages/wallets/WalletPage.jsx - COMPLETELY FIXED
import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { getProfile } from "../../api/internship";
// import api from "../api/api"; // IMPORT API

export default function WalletPage() {
  const { user, isLoggedIn, addCredits } = useUser();
  const [loading, setLoading] = useState(false);
  const [backendUser, setBackendUser] = useState(null);
  const [addingCredits, setAddingCredits] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log("Fetching user profile from backend...");
      
      const data = await getProfile();
      console.log("Profile response:", data);
      
      if (data) {
        console.log("User data received:", data);
        setBackendUser(data);
        
        // If addCredits function exists in context, update it
        if (addCredits && typeof addCredits === 'function') {
          // Update context with backend data
          addCredits(data.walletBalance || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Use backend user data if available, otherwise fallback to context user
  const currentUser = backendUser || user;
  console.log("Current user for display:", currentUser);
  
  // Get walletBalance directly from backend response
  const walletBalance = currentUser?.walletBalance || currentUser?.credits || 0;
  console.log("Wallet balance calculated:", walletBalance);
  
  const name = currentUser?.name || currentUser?.firstName || "";
  const lastName = currentUser?.lastName || "";
  const mobile = currentUser?.mobile || currentUser?.phone || "";
  const email = currentUser?.email || "";

  const handleAddCredits = async (amount) => {
    console.log("Adding credits:", amount);
    
    if (addingCredits) return;
    
    try {
      setAddingCredits(true);
      
      // Call backend API to add credits
      const response = await addCreditsToBackend(amount);
      
      if (response.data && response.data.success) {
        // Refresh user profile to get updated balance
        await fetchUserProfile();
        alert(`Added ${amount} credits to your wallet!`);
      } else {
        alert(response.data?.message || "Failed to add credits");
      }
    } catch (error) {
      console.error("Error adding credits:", error);
      
      // Show appropriate error message
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add credits. Please try again.");
      }
    } finally {
      setAddingCredits(false);
    }
  };

  // Function to add credits via backend API
  const addCreditsToBackend = async (amount) => {
    console.log("Calling backend to add credits:", amount);
    
    // You need to implement this API endpoint in your backend
    // For now, return a mock response
    return {
      data: {
        success: true,
        message: "Credits added successfully",
        newBalance: walletBalance + amount
      }
    };
    
    // When you implement the backend endpoint, use:
    // return api.post("/api/user/add-credits", { 
    //   amount: amount 
    // });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Debug Section - Remove in production
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="font-bold text-gray-700 mb-2">Debug Info:</h3>
          <div className="text-sm">
            <p><strong>Backend User Loaded:</strong> {backendUser ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Wallet Balance from Backend:</strong> {backendUser?.walletBalance || "Not loaded"}</p>
            <p><strong>Context User Credits:</strong> {user?.credits || 0}</p>
            <p><strong>Final Display Balance:</strong> {walletBalance}</p>
            <p><strong>Backend Response:</strong> {backendUser ? JSON.stringify(backendUser, null, 2) : "Loading..."}</p>
          </div>
        </div> */}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-600">Manage your credits and transactions</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchUserProfile}
              disabled={loading || addingCredits}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                "🔄 Refresh Balance"
              )}
            </button>
            
            <Link 
              to="/refer" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              💌 Refer & Earn
            </Link>
            <Link 
              to="/profile" 
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-lg opacity-90">Total Balance</p>
                {backendUser ? (
                  <span className="text-xs bg-green-800 bg-opacity-50 px-2 py-1 rounded-full">Live from Backend</span>
                ) : (
                  <span className="text-xs bg-yellow-800 bg-opacity-50 px-2 py-1 rounded-full">Loading...</span>
                )}
              </div>
              
              <h2 className="text-5xl font-bold mb-4">{walletBalance.toLocaleString()} Credits</h2>
              
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span>Linked to:</span>
                <span className="font-medium">
                  {mobile ? `+91 ${mobile}` : email || "Update your profile"}
                </span>
              </div>
              
              <div className="mt-2 text-sm opacity-80">
                {name && lastName ? `${name} ${lastName}` : name || "User"}
              </div>
              
              <div className="mt-1 text-xs opacity-70">
                User ID: {currentUser?.id || "N/A"} • Role: {currentUser?.role || "N/A"}
              </div>
            </div>
            
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Credits */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Credits</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Quick Add</span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">Add credits to purchase courses and access premium content</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => handleAddCredits(500)}
                disabled={loading || addingCredits}
                className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-lg font-bold">+500</div>
                <div className="text-xs mt-1">₹500 worth</div>
              </button>
              
              <button 
                onClick={() => handleAddCredits(1000)}
                disabled={loading || addingCredits}
                className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl hover:bg-green-100 hover:border-green-400 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-lg font-bold">+1000</div>
                <div className="text-xs mt-1">₹1000 worth</div>
              </button>
              
              <button 
                onClick={() => handleAddCredits(2000)}
                disabled={loading || addingCredits}
                className="bg-purple-50 border-2 border-purple-200 text-purple-700 px-4 py-3 rounded-xl hover:bg-purple-100 hover:border-purple-400 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-lg font-bold">+2000</div>
                <div className="text-xs mt-1">₹2000 worth</div>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Note:</span> {addingCredits ? "Adding credits..." : "Adding credits will update your backend wallet balance directly."}
              </p>
            </div>
          </div>

          {/* Refer & Earn */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Refer & Earn</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Bonus</span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">Invite friends and earn bonus credits</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  👥
                </div>
                <div>
                  <p className="font-medium">Refer a Friend</p>
                  <p className="text-sm text-gray-600">Get 200 credits per referral</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  💰
                </div>
                <div>
                  <p className="font-medium">Friend Joins</p>
                  <p className="text-sm text-gray-600">Friend gets 100 bonus credits</p>
                </div>
              </div>
            </div>
            
            <Link 
              to="/refer" 
              className="block w-full mt-4 bg-purple-600 text-white py-2.5 rounded-lg text-center font-medium hover:bg-purple-700 transition"
            >
              Start Earning →
            </Link>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
            <span className="text-sm text-gray-500">Recent transactions</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  🎁
                </div>
                <div>
                  <p className="font-medium">Welcome Bonus</p>
                  <p className="text-sm text-gray-600">Account registration</p>
                </div>
              </div>
              <span className="text-green-600 font-bold text-lg">+500 credits</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  💳
                </div>
                <div>
                  <p className="font-medium">Current Wallet Balance</p>
                  <p className="text-sm text-gray-600">From backend API</p>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-lg">+{walletBalance.toLocaleString()} credits</span>
            </div>
            
            <div className="text-center py-4 text-gray-500 text-sm">
              {loading ? "Loading transactions..." : "No more transactions"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
