import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, ShoppingBag, CreditCard, Wallet, AlertCircle } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user, isLoggedIn, addCredits } = useUser();
  const navigate = useNavigate();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [processing, setProcessing] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const userCredits = user?.credits || 0;
  const canUseCredits = userCredits >= totalPrice;

  // Handle checkout
  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Please login to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowPaymentOptions(true);
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (selectedPayment === "wallet" && !canUseCredits) {
      alert("Insufficient credits in wallet!");
      return;
    }

    setProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (selectedPayment === "wallet") {
        // Deduct credits from wallet
        addCredits(-totalPrice);
      }

      // Create order
      const orderData = {
        id: Date.now(),
        items: cartItems,
        total: totalPrice,
        paymentMethod: selectedPayment,
        userId: user?.phone || user?.email,
        userName: user?.firstName + " " + user?.lastName,
        userEmail: user?.email,
        userPhone: user?.phone ? `+91 ${user.phone}` : null,
        date: new Date().toISOString(),
        status: "Processing"
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("skilledup_orders") || "[]");
      localStorage.setItem("skilledup_orders", JSON.stringify([orderData, ...existingOrders]));

      // Clear cart
      clearCart();

      // Show success message
      alert(`Order placed successfully!\nOrder ID: ${orderData.id}\nTotal: ₹${totalPrice}`);

      // Navigate to orders page
      navigate("/orders");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
      setShowPaymentOptions(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any courses to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Courses
              </Link>
              <Link
                to="/free-courses"
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🎁 Explore Free Courses
              </Link>
            </div>
          </div>

          {/* Featured Courses */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Web Development</h3>
                <p className="text-gray-600 mb-4">Master full-stack development with modern technologies</p>
                <Link to="/courses?category=web-development" className="text-blue-600 font-medium hover:underline inline-flex items-center">
                  Explore courses →
                </Link>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Data Science</h3>
                <p className="text-gray-600 mb-4">Learn data analysis, ML, and AI from scratch</p>
                <Link to="/courses?category=data-science" className="text-green-600 font-medium hover:underline inline-flex items-center">
                  Explore courses →
                </Link>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Digital Marketing</h3>
                <p className="text-gray-600 mb-4">Master SEO, social media, and digital advertising</p>
                <Link to="/courses?category=digital-marketing" className="text-purple-600 font-medium hover:underline inline-flex items-center">
                  Explore courses →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {isLoggedIn && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">{userCredits.toLocaleString()} Credits</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Course Image */}
                <div className="md:w-1/4">
                  <div className="relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop"}
                      alt={item.title}
                      className="w-full h-48 md:h-36 object-cover rounded-xl"
                    />
                    {item.isFree && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Details */}
                <div className="md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {item.instructor && (
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            👨‍🏫 {item.instructor}
                          </span>
                        )}
                        {item.category && (
                          <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                            📚 {item.category}
                          </span>
                        )}
                        {item.duration && (
                          <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
                            ⏱️ {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Price & Remove */}
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">
                        {item.price === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `₹${item.price?.toLocaleString() || "0"}`
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Course Description */}
                  {item.description && (
                    <p className="text-gray-700 mt-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Course Features */}
                  {item.features && item.features.length > 0 && (
                    <div className="mt-4">
                      <ul className="flex flex-wrap gap-2">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                            ✓ {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                  }
                }}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{(totalPrice * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-indigo-600">₹{(totalPrice * 1.18).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* User Info if logged in */}
              {isLoggedIn && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Logged in as</p>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.email || (user?.phone ? `+91 ${user.phone}` : "")}
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  processing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                ✅ Secure payment · 100% Refund within 7 days
              </p>

              {/* Continue Shopping */}
              <div className="mt-8 pt-6 border-t">
                <Link
                  to="/courses"
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="text-center p-2 border border-gray-200 rounded-lg">
                  <div className="text-lg">🔒</div>
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="text-center p-2 border border-gray-200 rounded-lg">
                  <div className="text-lg">📞</div>
                  <p className="text-xs text-gray-600">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                <p className="text-gray-600">Total Amount: <span className="font-bold text-indigo-600">₹{(totalPrice * 1.18).toLocaleString()}</span></p>
              </div>

              {/* Payment Options */}
              <div className="space-y-4 mb-6">
                {isLoggedIn && (
                  <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPayment === "wallet" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setSelectedPayment("wallet")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Wallet Balance</p>
                          <p className="text-sm text-gray-600">{userCredits.toLocaleString()} Credits</p>
                        </div>
                      </div>
                      {selectedPayment === "wallet" && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {!canUseCredits && selectedPayment === "wallet" && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Insufficient credits</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addCredits(totalPrice - userCredits + 100);
                            alert("Credits added! Now you can pay with wallet.");
                          }}
                          className="mt-2 w-full text-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          Add {((totalPrice - userCredits) + 100).toLocaleString()} Credits
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPayment === "card" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedPayment("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, MasterCard, RuPay</p>
                      </div>
                    </div>
                    {selectedPayment === "card" && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPayment === "upi" 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => setSelectedPayment("upi")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="text-lg">💳</div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">UPI</p>
                        <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    {selectedPayment === "upi" && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowPaymentOptions(false);
                    setSelectedPayment("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing || !selectedPayment || (selectedPayment === "wallet" && !canUseCredits)}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    processing || !selectedPayment || (selectedPayment === "wallet" && !canUseCredits)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${(totalPrice * 1.18).toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}