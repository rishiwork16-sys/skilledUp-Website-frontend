import { useState } from "react";
import { createPayment, handlePaymentSuccess, getRazorpayKey } from "../../../api/paymentService";
import SectionContainer from "./components/SectionContainer";
import { useUser } from "../../../context/UserContext";

const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const FeeAndSchedule = ({ courseData, hasAccess }) => {
  const [selectedMode, setSelectedMode] = useState('online');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { user } = useUser();

  const timeSlots = [
    {
      id: 1,
      mode: 'online',
      date: '25 Jan 2026',
      time: '10:00 AM – 01:00 PM',
      app: 'Zoom',
      label: 'online'
    },
    {
      id: 2,
      mode: 'online',
      date: '01 Feb 2026',
      time: '07:00 PM – 10:00 PM',
      app: 'Zoom',
      label: 'online'
    },
    {
      id: 3,
      mode: 'offline',
      date: '25 Jan 2026',
      time: '10:00 AM – 01:00 PM',
      app: 'In-person',
      label: 'offline'
    },
    {
      id: 4,
      mode: 'offline',
      date: '01 Feb 2026',
      time: '07:00 PM – 10:00 PM',
      app: 'In-person',
      label: 'offline'
    },
    {
      id: 5,
      mode: 'hybrid',
      date: '25 Jan 2026',
      time: '10:00 AM – 01:00 PM',
      app: 'Zoom + In-person',
      label: 'hybrid'
    },
    {
      id: 6,
      mode: 'hybrid',
      date: '01 Feb 2026',
      time: '07:00 PM – 10:00 PM',
      app: 'Zoom + In-person',
      label: 'hybrid'
    }
  ];

  const filteredSlots = timeSlots.filter(slot => slot.mode === selectedMode);

  const handleEnrollNow = async () => {
    if (!courseData) {
      alert("Course data is loading. Please wait...");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      if (!user) {
        const shouldLogin = window.confirm(
          'You need to login to enroll in this course. Would you like to login now?'
        );
        if (shouldLogin) {
          window.location.href = `/login?returnUrl=/course/${window.location.pathname.split('/').pop()}`;
        }
        setIsProcessingPayment(false);
        return;
      }

      console.log("Sending course ID to payment API:", courseData.id);

      // 1. Create Order
      const orderData = await createPayment(courseData.id, user, courseData.price);
      console.log("Order created:", orderData);

      // Check if course is FREE
      if (orderData.amount <= 0) {
          console.log("Course is FREE. Bypassing Razorpay...");
          alert("Free course! Enrolling you directly...");
          window.location.href = '/orders'; 
          setIsProcessingPayment(false);
          return;
      }

      const isRazorpayLoaded = await initializeRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const razorpayKey = getRazorpayKey();

      let rzp; // Declare variable to hold instance

      // Fix amount conversion: Backend returns Rupees (1.0), Razorpay expects Paise (100)
      const amountInPaise = Math.round(orderData.amount * 100);

      // 3. FORCE CLOSE & POLLING SETUP
      let pollInterval;
      
      const forceCloseAndRedirect = () => {
          if (pollInterval) clearInterval(pollInterval);
          
          try {
            if (rzp) rzp.close();
          } catch (e) { console.warn(e); }

          try {
            const rzpElements = document.querySelectorAll('.razorpay-container, .razorpay-backdrop, iframe[name^="razorpay"]');
            rzpElements.forEach(el => el.remove());
            document.body.style.overflow = 'auto';
          } catch (e) { console.warn("Force close error:", e); }
          
          window.location.href = '/orders';
      };

      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'SkilledUp Academy',
        description: `Payment for ${courseData.title}`,
        image: '/images/skilledUp Logo.png',
        order_id: orderData.orderId,
        handler: async (response) => {
          console.log("Razorpay payment success callback received", response);
          if (pollInterval) clearInterval(pollInterval);

          // --- FORCE CLOSE LOGIC START ---
          try {
            if (rzp) rzp.close();
          } catch (e) { console.warn(e); }

          try {
            const rzpElements = document.querySelectorAll('.razorpay-container, .razorpay-backdrop, iframe[name^="razorpay"]');
            rzpElements.forEach(el => el.remove());
            document.body.style.overflow = 'auto'; 
            console.log("Razorpay modal forcibly removed from DOM (Enhanced)");
          } catch (e) {
            console.warn("Force close error:", e);
          }
          // --- FORCE CLOSE LOGIC END ---

          alert(`Payment Success! ID: ${response.razorpay_payment_id}. Verifying...`);

          try {
            const result = await handlePaymentSuccess(response, courseData.id);
            console.log("Payment verification result:", result);
            
            if (result.success) {
              alert('Verification Successful! You are now enrolled.');
              window.location.href = '/orders';
            } else {
              console.error("Payment verification returned failure:", result);
              alert(`Payment verification failed: ${result.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert(`Payment completed but verification failed: ${error.message}. Please contact support with Order ID: ${orderData.orderId}`);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          courseId: courseData.id,
          courseName: courseData.title,
        },
        theme: {
          color: '#264f9b',
        },
        modal: {
          ondismiss: async () => {
             if (pollInterval) clearInterval(pollInterval);
             setIsProcessingPayment(false);
             console.log('Payment modal dismissed. Checking status...');
             
             // Check backend one last time
             const isPaid = await checkPaymentStatus(orderData.orderId);
             if (isPaid) {
                 console.log("Order is PAID. Redirecting...");
                 alert("Payment detected! Redirecting to My Orders...");
                 window.location.href = '/orders';
             }
          }
        }
      };

      rzp = new window.Razorpay(options);
      rzp.open();
      
      // Start Polling
      pollInterval = setInterval(async () => {
          console.log("Polling payment status for order:", orderData.orderId);
          const isPaid = await checkPaymentStatus(orderData.orderId);
          if (isPaid) {
              console.log("Payment detected via polling! Force closing...");
              clearInterval(pollInterval);
              forceCloseAndRedirect();
          }
      }, 3000); // Check every 3 seconds

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);

      let errorMessage = 'Payment failed. ';
      if (error.message.includes('Network Error')) {
        errorMessage += 'Please check your internet connection.';
      } else if (error.message.includes('401')) {
        errorMessage += 'Session expired. Please login again.';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <SectionContainer bgColor="#ffffff">
      <div id="course-fee-section">
        <div style={{
          fontFamily: "Arial, sans-serif",
        }}>
          <h2 className="text-[28px] lg:text-[36px] font-bold mb-[20px] lg:mb-[30px] text-center lg:text-left">
            Course Fee & Schedule
          </h2>

          <div
            className="rounded-[20px] p-6 lg:p-[30px] flex flex-col gap-6 lg:gap-[30px]"
            style={{
              minHeight: "3in",
              height: "auto",
              background: "rgb(243, 242, 247)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex flex-col lg:flex-row  items-start gap-8 ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="online"
                  checked={selectedMode === 'online'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="cursor-pointer"
                />
                Online
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="offline"
                  checked={selectedMode === 'offline'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="cursor-pointer"
                />
                Offline
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="hybrid"
                  checked={selectedMode === 'hybrid'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="cursor-pointer"
                />
                Hybrid
              </label>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:w-auto flex-1">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white rounded-[14px] p-5 lg:p-6 cursor-pointer flex flex-col transition hover:border-blue-400 hover:shadow-lg"
                    style={{
                      minHeight: "2in",
                      border: "2px solid #ddd",
                    }}
                  >
                    <div
                      className="text-white text-[14px] mb-4 w-max capitalize"
                      style={{
                        background: slot.mode === 'online' ? "#4a9bff" :
                          slot.mode === 'offline' ? "#4a9bff" : "#4a9bff",
                        padding: "6px 14px",
                        borderRadius: "8px",
                      }}
                    >
                      {slot.label}
                    </div>

                    <ul className="list-none p-0 m-0 text-[10px] lg:text-[16px] leading-[1.7] space-y-0">
                      <li><b>{slot.mode === 'online' ? 'Date:' : 'Start Date:'}</b> {slot.date}</li>
                      <li><b>{slot.mode === 'online' ? 'Time:' : 'Class Timing:'}</b> {slot.time}</li>
                      <li><b>App:</b> {slot.app}</li>
                      <li><b>Mode:</b> {slot.mode === 'online' ? 'Virtual' :
                        slot.mode === 'offline' ? 'In-person' : 'Mixed'}</li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-[35%] text-center lg:text-left lg:pl-4">
                <div className="flex flex-col gap-3">
                  <span className="text-[15px] font-semibold text-gray-600 tracking-wide">
                    Program Fee
                  </span>

                  <div className="flex items-end gap-4 justify-center lg:justify-start">
                    <span className="text-[42px] lg:text-[48px] font-extrabold text-gray-900 leading-none">
                      ₹{(courseData?.price || 0).toLocaleString('en-IN')}
                    </span>

                    {courseData?.originalPrice && courseData.originalPrice > courseData.price && (
                      <span className="text-[18px] text-gray-400 line-through mb-1">
                        ₹{courseData.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {courseData?.discount && courseData.discount > 0 && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0057ff] text-[14px] lg:text-[15px] font-semibold px-4 py-1.5 rounded-full mx-auto lg:mx-0">
                      Flat {courseData.discount}% OFF - Ends Soon
                    </div>
                  )}
                </div>

               
                <button
                  onClick={handleEnrollNow}
                  disabled={isProcessingPayment || hasAccess}
                  className={`mt-[22px] px-[26px] py-[11px] ${hasAccess ? 'bg-green-600 hover:bg-green-700' : 'bg-[#264f9b] hover:bg-[#191917]'} text-white
                     text-[16px] font-semibold rounded-[10px]
                     transition w-full lg:w-auto
                     disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {hasAccess ? (
                    "Already Enrolled"
                  ) : isProcessingPayment ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Enroll Now'
                  )}
                </button>

                {paymentError && (
                  <p className="mt-2 text-red-600 text-sm text-center">
                    {paymentError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mt-[16px] lg:mt-[20px]">
            <img
              src="/images/emi_box4.jpeg"
              alt="No-Cost EMI Options"
              className="
          w-full 
          rounded-[15px] 
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        "
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeeAndSchedule;
