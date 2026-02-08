import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Play, Loader2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../api/api';

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("MyOrders mounted. User:", user);
        if (user?.id) {
            loadOrders();
        } else if (user) {
            console.warn("User loaded but ID is missing:", user);
            // Attempt to reload user or handle gracefully
            setLoading(false);
            setError("User identification failed. Please try logging out and back in.");
        } else {
            // User is null (initial load or not logged in)
            // We wait for UserContext to settle. 
            // But if it takes too long, we should probably stop loading.
            const timer = setTimeout(() => {
                if (loading && !user) {
                    setLoading(false);
                    // Don't set error, just show empty or redirect
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Robust check for ID
            let userId = user?.id || user?.userId || user?.studentId || user?.backendData?.userId || user?.backendData?.id;

            if (!userId) {
                try {
                    const email = user?.email || user?.backendData?.email;
                    const phone = user?.phone || user?.mobile || user?.backendData?.mobile || user?.backendData?.phone;
                    if (email) {
                        const res = await api.get('/api/auth/user', { params: { email } });
                        userId = res?.data?.id || res?.data?.userId || userId;
                    }
                    // If still missing, try student profile by phone to derive userId
                    if (!userId && phone) {
                        const profileRes = await api.get('/api/students/profile-by-phone', { params: { phone } });
                        userId = profileRes?.data?.userId || userId;
                    }
                } catch (idErr) {
                    console.warn("MyOrders: Fallback ID resolution failed:", idErr);
                }
            }

            if (!userId) {
                console.warn("MyOrders: User ID missing, cannot fetch orders.");
                setError("User identification failed. Please try logging out and back in.");
                setLoading(false);
                return;
            }

            console.log("Fetching orders for user ID:", userId);
            const ordersRes = await api.get(`/api/payments/user/${userId}`);
            console.log("Orders response:", ordersRes.data);

            // Ensure response is an array
            const paidOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

            if (paidOrders.length > 0) {
                console.log("Fetching courses details...");
                const coursesRes = await api.get('/api/courses');
                const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.data || []);

                const enrichedOrders = paidOrders.map(order => {
                    // Relaxed comparison (==) to handle string/number mismatch
                    const courseData = allCourses.find(c => c.id == order.courseId);
                    return {
                        ...order,
                        courseDetails: courseData
                    };
                });
                setOrders(enrichedOrders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
            setError("Failed to load your enrolled courses. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-8 mt-16">

                {/* DEBUG SECTION - REMOVE BEFORE PRODUCTION */}
                <div className="bg-yellow-100 p-4 mb-4 rounded text-xs font-mono overflow-auto max-h-40">
                    <p><strong>Debug Info:</strong></p>
                    <p>User ID: {user?.id} (Type: {typeof user?.id})</p>
                    <p>Orders Count: {orders.length}</p>
                    <p>Loading: {loading ? 'Yes' : 'No'}</p>
                    <p>Error: {error || 'None'}</p>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Learning</h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                        <p className="text-gray-500">Loading your courses...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600">You haven't enrolled in any courses yet.</h2>
                        <button
                            onClick={() => navigate('/courses')}
                            className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={order.courseDetails?.thumbnailUrl || "/images/course-placeholder.png"}
                                        alt={order.courseDetails?.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Play size={48} className="text-white fill-current" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                            {order.courseDetails?.category || "General"}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                        {order.courseDetails?.title || "Enrolled Course"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Enrolled on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/course-dashboard/${order.courseId}`)}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Play size={18} /> Start Learning
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyOrders;
