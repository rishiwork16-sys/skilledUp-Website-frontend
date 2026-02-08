import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Send, AlertCircle, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import * as studentService from '../../api/studentService';
import { useUser } from '../../context/UserContext';
import api from '../../api/api';

const ExitLetter = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('exit'); // 'exit' or 'extension'
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
    const [certificateUrl, setCertificateUrl] = useState(null);
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

    // Fetch Enrollments
    useEffect(() => {
        if (user) fetchEnrollments();
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            const userId = user?.id || user?.userId;
            const userPhone = user?.phone || user?.mobile;
            console.log("ExitLetter - Fetching enrollments for:", { userId, userPhone });

            let data = [];

            if (userId) {
                try {
                    const res = await studentService.getMyEnrollments(userId);
                    if (Array.isArray(res)) {
                        data = res;
                    } else if (res?.data && Array.isArray(res.data)) {
                        data = res.data;
                    }
                } catch (_) { }
            }

            if ((!Array.isArray(data) || data.length === 0) && userPhone) {
                try {
                    const byPhone = await api.get('/api/students/my-enrollments-by-phone', {
                        params: { phone: userPhone }
                    });
                    if (Array.isArray(byPhone.data)) {
                        data = byPhone.data;
                    } else if (byPhone.data?.data && Array.isArray(byPhone.data.data)) {
                        data = byPhone.data.data;
                    }
                } catch (_) { }
            }

            // Filter ACTIVE or DELAYED enrollments
            const normalized = Array.isArray(data)
                ? data.map(e => ({
                    ...e,
                    startDate: e.startDate || e.enrolledAt || e.createdAt,
                    internshipCategory: e.internshipCategory || e.category,
                    status: e.status || 'ACTIVE',
                    progress: e.progress || 0
                }))
                : [];
            const active = normalized.filter(e => e.status === 'ACTIVE' || e.status === 'DELAYED');

            if (active.length === 0 && data.length > 0) {
                console.warn("ExitLetter - Found enrollments but none are ACTIVE/DELAYED:", data.map(e => e.status));
            }

            setEnrollments(active.length > 0 ? active : []);
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    // Form States
    const [formData, setFormData] = useState({
        reason: '',
        date: '',
        feedback: '',
        extensionDate: '',
        extensionReason: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEnrollmentId) {
            alert("Please select an internship.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (activeTab === 'exit') {
                const certUrl = await studentService.exitInternship(
                    selectedEnrollmentId,
                    formData.date
                );
                setCertificateUrl(certUrl);
                setSubmitted(true);
            } else {
                // Extension Logic (Placeholder)
                setTimeout(() => {
                    setLoading(false);
                    setSubmitted(true);
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process request. Please try again.");
        } finally {
            if (activeTab === 'exit') setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {activeTab === 'exit' ? 'Internship Completed!' : 'Request Submitted!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {activeTab === 'exit'
                            ? 'You have successfully exited the internship. Your certificate has been generated.'
                            : 'Your request for Internship Extension has been received. We will review it shortly.'}
                    </p>

                    {activeTab === 'exit' && certificateUrl && (
                        <div className="mb-6 animate-fade-in">
                            <a
                                href={certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 shadow-lg shadow-yellow-500/30 transition-all transform hover:scale-105"
                            >
                                <Download size={20} />
                                Download Internship Certificate
                            </a>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({ reason: '', date: '', feedback: '', extensionDate: '', extensionReason: '' });
                            setCertificateUrl(null);
                            fetchEnrollments(); // Refresh list
                        }}
                        className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                    >
                        Head to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Exit Letter & Extension</h1>
                <p className="text-gray-500 mt-1">Manage your internship conclusion or request an extension.</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('exit')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'exit'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <FileText size={18} />
                        Request Exit Letter / Certificate
                    </button>
                    <button
                        onClick={() => setActiveTab('extension')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'extension'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Clock size={18} />
                        Request Extension
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                            <AlertTriangle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Internship Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Internship</label>
                            {enrollments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {enrollments.map((enrollment) => (
                                        <div
                                            key={enrollment.id}
                                            onClick={() => setSelectedEnrollmentId(enrollment.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedEnrollmentId === enrollment.id
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <h3 className="font-semibold text-gray-900">{enrollment.internshipCategory.title}</h3>
                                            <p className="text-sm text-gray-500">Started: {safeDate(enrollment.startDate)}</p>
                                            <div className="mt-2 text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-md w-fit">
                                                {enrollment.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="mb-2">No active internships found.</div>
                                    <button
                                        onClick={fetchEnrollments}
                                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Retry Fetch
                                    </button>
                                </div>
                            )}
                        </div>

                        {activeTab === 'exit' ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3 text-amber-800 text-sm border border-amber-100">
                                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold mb-1">Important Note:</p>
                                        <p>Completing this process will <strong>End your Internship</strong> immediately. Tasks will be locked, and your <strong>Internship Certificate</strong> will be generated.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Exit</label>
                                    <select
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="completion">Internship Completion</option>
                                        <option value="academic">Academic Commitments</option>
                                        <option value="personal">Personal Reasons</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Working Day</label>
                                    <div className="relative">
                                        <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback & Experience</label>
                                    <textarea
                                        rows="4"
                                        required
                                        placeholder="Share your experience with us..."
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                        value={formData.feedback}
                                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-purple-50 p-4 rounded-xl flex items-start gap-3 text-purple-800 text-sm">
                                    <Clock size={20} className="shrink-0 mt-0.5" />
                                    <p>Extensions are subject to approval based on your current performance and project status.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Extension</label>
                                    <textarea
                                        rows="3"
                                        required
                                        placeholder="Why do you need an extension? (e.g., specific project incomplete, want to learn more...)"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                        value={formData.extensionReason}
                                        onChange={(e) => setFormData({ ...formData, extensionReason: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Proposed New End Date</label>
                                    <div className="relative">
                                        <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            value={formData.extensionDate}
                                            onChange={(e) => setFormData({ ...formData, extensionDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || (activeTab === 'exit' && enrollments.length === 0)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all transform active:scale-95 ${activeTab === 'exit'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/30'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                                    } ${loading || (activeTab === 'exit' && enrollments.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        {activeTab === 'exit' ? 'Complete & Get Certificate' : 'Submit Request'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExitLetter;
