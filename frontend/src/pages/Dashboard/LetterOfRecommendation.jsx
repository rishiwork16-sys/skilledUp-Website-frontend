import React, { useState, useEffect } from 'react';

import { useUser } from '../../context/UserContext';
import lorService from '../../api/lorService';
import * as studentService from '../../api/studentService';
import api from '../../api/api';
import {
    CheckCircle, XCircle, Download, FileText, AlertCircle, Loader,
    ChevronLeft, Award, Lock, ArrowRight, Calendar, Clock
} from 'lucide-react';

const LetterOfRecommendation = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [eligibility, setEligibility] = useState(null);
    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');

    const safeDate = (dateString) => {
        try {
            if (!dateString) return new Date().toLocaleDateString();
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return new Date().toLocaleDateString();
            return d.toLocaleDateString();
        } catch {
            return new Date().toLocaleDateString();
        }
    };

    useEffect(() => {
        if (user) {
            fetchEnrollments();
        }
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            setError('');

            const userId = user?.id || user?.userId || user?.studentId || user?.backendData?.id || user?.backendData?.userId;
            const userPhone = user?.phone || user?.mobile || user?.backendData?.phone || user?.backendData?.mobile;

            console.log("LOR - Fetching for:", { userId, userPhone });

            let data = [];

            // 1. Try fetching by User ID
            if (userId) {
                try {
                    const res = await studentService.getMyEnrollments(userId);
                    if (Array.isArray(res)) {
                        data = res;
                    } else if (res?.data && Array.isArray(res.data)) {
                        data = res.data;
                    }
                } catch (err) {
                    console.error("LOR - Error fetching by userId:", err);
                }
            }

            // 2. Fallback to phone if no data found and phone exists
            if ((!Array.isArray(data) || data.length === 0) && userPhone) {
                console.log("LOR - Fetching by phone fallback:", userPhone);
                try {
                    const byPhone = await api.get('/api/students/my-enrollments-by-phone', {
                        params: { phone: userPhone }
                    });
                    if (Array.isArray(byPhone.data)) {
                        data = byPhone.data;
                    } else if (byPhone.data?.data && Array.isArray(byPhone.data.data)) {
                        data = byPhone.data.data;
                    }
                } catch (err) {
                    console.error("LOR - Error fetching by phone fallback:", err);
                }
            }

            const normalized = Array.isArray(data)
                ? data.map(e => ({
                    ...e,
                    startDate: e.startDate || e.enrolledAt || e.createdAt,
                    internshipCategory: e.internshipCategory || e.category,
                    status: e.status || 'ACTIVE',
                    progress: e.progress || 0
                }))
                : [];

            if (normalized.length === 0) {
                setError('No active internship enrollments found.');
            }
            setEnrollments(normalized);
        } catch (err) {
            console.error("LOR - Generic error:", err);
            setError('Failed to load enrollments.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEnrollment = async (enrollment) => {
        setSelectedEnrollment(enrollment);
        setLoading(true);
        setError('');

        try {
            const studentId = enrollment?.student?.id || user?.id || user?.userId || user?.studentId || user?.backendData?.id || user?.backendData?.userId;

            // 1. Check Existing Request
            const requests = await lorService.getMyRequests(studentId);
            const list = Array.isArray(requests)
                ? requests
                : (requests?.data && Array.isArray(requests.data) ? requests.data : []);
            const activeRequest = list.find(r => r.enrollmentId === enrollment.id);

            if (activeRequest) {
                setRequest(activeRequest);
                setEligibility(null);
            } else {
                // 2. Check Eligibility
                setRequest(null);
                const eligibilityData = await lorService.checkEligibility(studentId, enrollment.id);
                setEligibility(eligibilityData);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load LOR details for this internship.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedEnrollment(null);
        setRequest(null);
        setEligibility(null);
        setError('');
    };

    const handleRequestLOR = async () => {
        if (!window.confirm('Are you sure you want to request your Letter of Recommendation?')) return;

        try {
            setLoading(true);
            const newRequest = await lorService.requestLOR(selectedEnrollment.student.id, selectedEnrollment.id);
            setRequest(newRequest);
            alert('LOR Requested & Generated Successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to request LOR: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && enrollments.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="animate-spin text-primary-600" size={40} />
                    <span className="text-gray-600 font-medium">Loading LOR...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Award className="text-primary-600" size={32} />
                        Letter of Recommendation
                    </h1>
                    <p className="text-gray-500 mt-1 text-lg">
                        Unlock your official endorsement upon successful internship completion.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {error && !selectedEnrollment && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                        <AlertCircle size={20} />
                        {error}
                        <button
                            onClick={fetchEnrollments}
                            className="ml-auto px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-sm"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!selectedEnrollment ? (
                    // ================= LIST VIEW =================
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Select an Internship</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    onClick={() => handleSelectEnrollment(enrollment)}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                >
                                    {/* Decorative gradient blob */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-50 rounded-full blur-2xl group-hover:bg-primary-100 transition-colors"></div>

                                    <div className="flex justify-between items-start mb-4 relative z-0">
                                        <div className="p-3 bg-blue-50 text-primary-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <FileText size={24} />
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${enrollment.status === 'ACTIVE'
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                            {enrollment.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-0 group-hover:text-primary-600 transition-colors">
                                        {enrollment.internshipCategory?.title}
                                    </h3>

                                    <div className="space-y-3 relative z-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>Started: {safeDate(enrollment.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>Duration: <span className="font-medium text-gray-700">{enrollment.duration} Months</span></span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                        Check Eligibility <ArrowRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // ================= DETAIL VIEW =================
                    <div className="animate-fade-in">
                        <button
                            onClick={handleBack}
                            className="group mb-6 text-gray-500 hover:text-primary-600 flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Enrollments
                        </button>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]">

                            {/* Loading Overlay */}
                            {loading && (
                                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader className="animate-spin text-primary-600" size={40} />
                                        <span className="text-gray-500 font-medium">Checking eligibility...</span>
                                    </div>
                                </div>
                            )}

                            {/* Header Banner */}
                            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-8 border-b border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-1">Internship Program</div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {selectedEnrollment?.internshipCategory?.title}
                                        </h2>
                                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                                            Enrollment ID: <span className="font-mono text-gray-700">#{selectedEnrollment?.id}</span>
                                        </p>
                                    </div>

                                    {request ? (
                                        <div className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
                                            <CheckCircle size={20} /> {request.requestStatus}
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
                                            <Clock size={20} /> In Progress
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8">
                                {request ? (
                                    // ---------------- SUCCESS STATE ----------------
                                    <div className="text-center py-12 max-w-2xl mx-auto">
                                        <div className="mb-6 relative inline-block">
                                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce-slow">
                                                <Award size={48} />
                                            </div>
                                            <div className="absolute -top-2 -right-2 text-2xl">✨</div>
                                        </div>

                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h3>
                                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                            You have successfully completed the requirements. Your Letter of Recommendation has been generated and is ready for download.
                                        </p>

                                        {request.lorUrl ? (
                                            <a
                                                href={request.lorUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 font-bold text-lg"
                                            >
                                                <Download size={24} />
                                                Download Official LOR
                                            </a>
                                        ) : (
                                            <div className="bg-yellow-50 text-yellow-800 px-6 py-3 rounded-lg inline-flex items-center gap-2">
                                                <Loader className="animate-spin" size={20} /> Generating Document...
                                            </div>
                                        )}

                                        <div className="mt-8 pt-8 border-t border-gray-100 text-gray-400 text-sm">
                                            Reference ID: <span className="font-mono text-gray-600 font-medium select-all">{request.uniqueLorId}</span>
                                        </div>
                                    </div>
                                ) : (
                                    // ---------------- CHECKLIST STATE ----------------
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <CheckCircle className="text-primary-600" /> Eligibility Checklist
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                                            {/* Duration Card */}
                                            <div className={`p-6 rounded-2xl border-2 transition-colors ${(selectedEnrollment.duration >= 24)
                                                ? 'bg-emerald-50/50 border-emerald-100'
                                                : 'bg-white border-gray-100'
                                                }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Duration</span>
                                                    {(selectedEnrollment.duration >= 24)
                                                        ? <div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle size={16} /></div>
                                                        : <div className="bg-gray-100 text-gray-400 p-1 rounded-full"><Clock size={16} /></div>
                                                    }
                                                </div>
                                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                                    {selectedEnrollment.duration}
                                                    <span className="text-lg text-gray-400 font-normal"> / 24 Months</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                                                    <div
                                                        className={`h-2 rounded-full ${selectedEnrollment.duration >= 24 ? 'bg-green-500' : 'bg-primary-500'}`}
                                                        style={{ width: `${Math.min((selectedEnrollment.duration / 24) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Tasks Card */}
                                            <div className={`p-6 rounded-2xl border-2 transition-colors ${(eligibility?.taskStats?.completionPercent >= 95)
                                                ? 'bg-emerald-50/50 border-emerald-100'
                                                : 'bg-white border-gray-100'
                                                }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Tasks Completed</span>
                                                    {(eligibility?.taskStats?.completionPercent >= 95)
                                                        ? <div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle size={16} /></div>
                                                        : <div className="bg-gray-100 text-gray-400 p-1 rounded-full"><Clock size={16} /></div>
                                                    }
                                                </div>
                                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                                    {eligibility?.taskStats?.completionPercent || 0}
                                                    <span className="text-lg text-gray-400 font-normal">%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                                                    <div
                                                        className={`h-2 rounded-full ${(eligibility?.taskStats?.completionPercent >= 95) ? 'bg-green-500' : 'bg-primary-500'}`}
                                                        style={{ width: `${eligibility?.taskStats?.completionPercent || 0}%` }}
                                                    ></div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 text-right">Target: 95%</div>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex flex-col items-center justify-center pt-6 border-t border-gray-100">
                                            {eligibility?.eligible ? (
                                                <div className="text-center w-full max-w-md animate-fade-in-up">
                                                    <div className="mb-4 text-green-700 font-semibold flex items-center justify-center gap-2 bg-green-50 py-2 px-4 rounded-lg">
                                                        <CheckCircle size={18} /> Eligibility Criteria Met
                                                    </div>
                                                    <button
                                                        onClick={handleRequestLOR}
                                                        className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                                    >
                                                        <Award size={24} />
                                                        Request Letter of Recommendation
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center w-full max-w-lg">
                                                    <div className="mb-6 bg-amber-50 border border-amber-100 text-amber-900 p-4 rounded-xl text-left flex gap-4 items-start">
                                                        <div className="bg-white p-2 rounded-full shadow-sm text-amber-500 mt-1">
                                                            <Lock size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg mb-1">Preview Locked</h4>
                                                            <p className="text-amber-800/80 text-sm leading-relaxed">
                                                                {eligibility?.reason}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => alert("Please complete your internship tasks and duration requirements to unlock your Letter of Recommendation.")}
                                                        className="group relative w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:text-gray-500 transition-colors flex items-center justify-center gap-3 active:scale-[0.99]"
                                                    >
                                                        <Lock size={20} className="group-hover:animate-pulse" />
                                                        Download LOR (Locked)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LetterOfRecommendation;
