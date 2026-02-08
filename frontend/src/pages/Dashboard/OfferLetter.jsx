import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { getMyEnrollments, regenerateOfferLetter } from '../../api/studentService';
import api from '../../api/api';
import { Download, FileText, AlertCircle } from 'lucide-react';

const OfferLetter = () => {
    const { user } = useUser();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadEnrollments();
        }
    }, [user]);

    const loadEnrollments = async () => {
        try {
            const userId = user?.id || user?.userId;
            const userPhone = user?.phone;

            let data = [];

            if (userId) {
                try {
                    data = await getMyEnrollments(userId);
                } catch (_) { }
            }
            if ((!Array.isArray(data) || data.length === 0) && userPhone) {
                try {
                    const response = await api.get('/api/students/my-enrollments-by-phone', {
                        params: { phone: userPhone }
                    });
                    data = response.data;
                } catch (_) { }
            }

            const normalized = Array.isArray(data)
                ? data.map(e => ({
                    ...e,
                    offerLetterUrl: e.offerLetterUrl || e.offerLetterURL || e.offerLetter
                }))
                : [];

            setEnrollments(normalized);
        } catch (error) {
            console.error("Failed to load offer letters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async (enrollmentId) => {
        try {
            const r = window.confirm("Regenerate Offer Letter? This will send a new email.");
            if (!r) return;

            setLoading(true);
            await regenerateOfferLetter(enrollmentId);
            await loadEnrollments();
            alert("Offer Letter regenerated and emailed successfully!");
        } catch (error) {
            console.error("Regeneration failed", error);
            alert("Failed to regenerate offer letter.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading offer letters...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" />
                My Offer Letters
            </h1>

            {enrollments.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
                    <p className="text-gray-500">No offer letters found for your account.</p>
                    <div className="mt-4">
                        <button
                            onClick={loadEnrollments}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Retry Fetch
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">
                                        {enrollment.internshipCategory?.title || "Internship Program"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Joined on: {new Date(enrollment.startDate).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                            {enrollment.duration} Months
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${enrollment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                </div>

                                {enrollment.offerLetterUrl ? (
                                    <a
                                        href={enrollment.offerLetterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm active:transform active:scale-95"
                                    >
                                        <Download size={18} />
                                        Download Offer Letter
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => handleRegenerate(enrollment.id)}
                                        className="flex items-center gap-2 text-amber-700 bg-amber-50 px-5 py-2.5 rounded-lg text-sm border border-amber-200 hover:bg-amber-100 transition-colors"
                                    >
                                        <AlertCircle size={16} />
                                        Generate Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfferLetter;
