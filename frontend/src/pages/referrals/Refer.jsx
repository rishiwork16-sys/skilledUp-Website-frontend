// src/pages/referrals/Refer.jsx - CREATE THIS
import React from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";

export default function Refer() {
  const { user } = useUser();
  
  const referralCode = user?.phone ? `SKILLEDUP-${user.phone.slice(-4)}` : "SKILLEDUP-XXXX";
  const referralLink = `https://skilledup.com/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refer & Earn Credits</h1>
          <p className="text-gray-600 text-lg">
            Invite friends to SkilledUp and earn bonus credits for both of you!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">200</div>
            <div className="text-gray-700 font-medium">Credits You Get</div>
            <div className="text-sm text-gray-500">Per successful referral</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100</div>
            <div className="text-gray-700 font-medium">Credits Friend Gets</div>
            <div className="text-sm text-gray-500">As welcome bonus</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-700 font-medium">Friends Referred</div>
            <div className="text-sm text-gray-500">Start inviting!</div>
          </div>
        </div>

        {/* Your Referral Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Referral Details</h2>
          
          <div className="space-y-6">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
              <div className="flex">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 bg-gray-50 font-mono font-bold"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    alert("Referral code copied!");
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 font-medium"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Share via</p>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 font-medium">
                  WhatsApp
                </button>
                <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium">
                  Facebook
                </button>
                <button className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 font-medium">
                  Copy Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Share Your Link</h3>
              <p className="text-gray-600">Share your referral link with friends</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Friend Registers</h3>
              <p className="text-gray-600">Friend signs up using your link</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Earn Credits</h3>
              <p className="text-gray-600">Both get bonus credits instantly</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link to="/wallet" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}