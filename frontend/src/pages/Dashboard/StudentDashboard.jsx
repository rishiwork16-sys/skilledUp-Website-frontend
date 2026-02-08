import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
// import studentService from '../../services/student.service'; // TODO: Update to use new API structure
import { getMyEnrollments } from '../../api/studentService'; // Assuming this exists or will create
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, Clock } from 'lucide-react';

import api from '../../api/api';

const StudentDashboard = () => {
    const { user } = useUser();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadEnrollments();
        }
    }, [user]);

    const loadEnrollments = async () => {
        try {
            const userId = user?.id || user?.userId || user?.studentId || user?.backendData?.id || user?.backendData?.userId;
            const userPhone = user?.phone || user?.mobile || user?.backendData?.phone || user?.backendData?.mobile;

            console.log("Dashboard - Fetching for:", { userId, userPhone });

            let data = [];

            // 1. Try fetching by User ID
            if (userId) {
                try {
                    data = await getMyEnrollments(userId);
                    // Handle wrapped response
                    if (data && !Array.isArray(data) && Array.isArray(data.data)) {
                        data = data.data;
                    }
                } catch (err) {
                    console.error("Dashboard - Error fetching by userId:", err);
                }
            }

            // 2. Fallback to phone if no data found and phone exists
            if ((!data || data.length === 0) && userPhone) {
                console.log("Dashboard - Fetching by phone fallback:", userPhone);
                try {
                    const response = await api.get('/api/students/my-enrollments-by-phone', {
                        params: { phone: userPhone }
                    });
                    let phoneData = response.data;

                    // Handle wrapped response
                    if (phoneData && !Array.isArray(phoneData) && Array.isArray(phoneData.data)) {
                        phoneData = phoneData.data;
                    }

                    if (Array.isArray(phoneData) && phoneData.length > 0) {
                        console.log("Dashboard - Found data via phone fallback");
                        data = phoneData;
                    }
                } catch (err) {
                    console.error("Dashboard - Error fetching by phone fallback:", err);
                }
            } else if (!userId && !userPhone) {
                console.error("No userId or phone available for dashboard");
            }

            console.log("Dashboard - Enrollments loaded:", data);
            setEnrollments(data || []);
        } catch (error) {
            console.error("Failed to load enrollments", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;

    return (
        <div className="px-4 py-6 md:p-6 max-w-7xl mx-auto font-sans">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.firstName || user?.name}!</h1>
            <p className="text-slate-500 mb-8">Here are your active internship programs.</p>

            {enrollments.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-blue-500" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Internships</h3>
                    <p className="text-slate-500 mb-6">You haven't enrolled in any programs yet.</p>
                    <button onClick={() => navigate('/internships')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                        Browse Programs
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id}
                            onClick={() => navigate('/dashboard/tasks')}
                            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">

                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    {enrollment.internshipCategory?.coverImage ? (
                                        <img 
                                            src={enrollment.internshipCategory.coverImage} 
                                            alt={enrollment.internshipCategory?.title} 
                                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.classList.remove('hidden');
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className={`bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors ${enrollment.internshipCategory?.coverImage ? 'hidden' : ''}`}>
                                        <BookOpen className="text-blue-600" size={24} />
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${enrollment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {enrollment.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {enrollment.internshipCategory?.title || "Internship Program"}
                            </h3>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar size={16} />
                                    <span>Started: {new Date(enrollment.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Clock size={16} />
                                    <span>Duration: {enrollment.duration} Months</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-50 rounded-full h-2 mb-4 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${enrollment.progress || 0}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mb-4">
                                <span>Progress</span>
                                <span className="font-bold text-slate-700">{enrollment.progress || 0}%</span>
                            </div>

                            <button className="w-full py-2.5 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-xl font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                View Tasks <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
