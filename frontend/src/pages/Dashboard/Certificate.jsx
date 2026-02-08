import React, { useEffect, useState } from 'react';
import { getMyEnrollments } from '../../api/studentService';
import { useUser } from '../../context/UserContext';
import api from '../../api/api';

const Certificate = () => {
    const { user } = useUser();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user]);

    const fetchCertificates = async () => {
        try {
            const userId = user?.id || user?.userId || user?.studentId || user?.backendData?.id || user?.backendData?.userId;
            const userPhone = user?.phone || user?.mobile || user?.backendData?.phone || user?.backendData?.mobile;

            console.log("Certificate - Fetching for:", { userId, userPhone });

            let enrollments = [];

            // 1. Try fetching by User ID
            if (userId) {
                try {
                    enrollments = await getMyEnrollments(userId);
                    // Handle wrapped response
                    if (enrollments && !Array.isArray(enrollments) && Array.isArray(enrollments.data)) {
                        enrollments = enrollments.data;
                    }
                } catch (err) {
                    console.error("Certificate - Error fetching by userId:", err);
                }
            }

            // 2. Fallback to phone if no data found and phone exists
            if ((!enrollments || enrollments.length === 0) && userPhone) {
                console.log("Certificate - Fetching by phone fallback:", userPhone);
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
                        console.log("Certificate - Found data via phone fallback");
                        enrollments = phoneData;
                    }
                } catch (err) {
                    console.error("Certificate - Error fetching by phone fallback:", err);
                }
            } else if (!userId && !userPhone) {
                console.error("No userId or phone available for certificates");
            }

            // Filter: Must have a certificate URL
            const validCertificates = enrollments.filter(e => e.certificateUrl);
            setCertificates(validCertificates);
        } catch (error) {
            console.error("Failed to fetch certificates", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url) => {
        // Fix for legacy links pointing to wrong port (8084)
        if (url && url.includes('localhost:8084/api/certificates')) {
            url = url.replace('localhost:8084', 'localhost:8083');
        }
        window.open(url, '_blank');
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Certificates...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Internship Certificates</h1>

            {certificates.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Available</h3>
                    <p className="text-gray-500">
                        Complete an internship or generate an exit request to receive your certificate.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative flex items-center justify-center">
                                <span className="text-white opacity-20 transform scale-150">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white text-xl font-bold tracking-wide">CERTIFIED</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {cert.internshipCategory ? cert.internshipCategory.title : 'Internship'}
                                </h4>
                                <p className="text-sm text-blue-600 font-medium mb-4">
                                    {cert.status}
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="text-gray-700">{cert.duration} Months</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Completed On:</span>
                                        <span className="text-gray-700">
                                            {cert.endDate ? new Date(cert.endDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownload(cert.certificateUrl)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Certificate;
