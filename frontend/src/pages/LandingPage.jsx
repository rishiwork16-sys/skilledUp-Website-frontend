import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../api/payment';
import api from '../api/api';
// import { useUser } from '../context/UserContext'; 

const LandingPage = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    // const { user } = useUser(); 
    const user = { id: 1, name: 'Student', email: 'student@example.com', phone: '9999999999' };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/api/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleBuyNow = async (course) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // 1. Create Order
            const orderData = await createOrder(user.id, course.id, course.price);

            // Check if FREE
            if (orderData.amount <= 0 || orderData.status === 'PAID') {
                alert('Free course! Enrolled successfully.');
                navigate('/dashboard/my-orders');
                return;
            }

            // 2. Open Razorpay
            let rzp;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_123456789",
                amount: orderData.amount,
                currency: "INR",
                name: "Internship Platform",
                description: course.title,
                order_id: orderData.orderId,
                handler: async function (response) {
                    console.log("Razorpay success:", response);
                    
                    // --- FORCE CLOSE LOGIC ---
                    try {
                        if (rzp) rzp.close();
                        const rzpElements = document.querySelectorAll('.razorpay-container, .razorpay-backdrop, iframe[name^="razorpay"]');
                        rzpElements.forEach(el => el.remove());
                        document.body.style.overflow = 'auto';
                    } catch (e) { console.warn(e); }

                    // 3. Verify Payment
                    try {
                        await verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
                        alert('Payment Successful!');
                        navigate('/dashboard/my-orders');
                    } catch (err) {
                        alert('Payment Verification Failed');
                        console.error(err);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Could not initiate purchase');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Master New Skills</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our wide range of courses and start your journey today.</p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">Featured Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                <div className="h-48 bg-indigo-100 flex items-center justify-center">
                                    {/* Placeholder image */}
                                    <span className="text-indigo-300 text-6xl font-bold">{course.title.charAt(0)}</span>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h4>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-indigo-600">₹{course.price}</span>
                                        <button
                                            onClick={() => handleBuyNow(course)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
