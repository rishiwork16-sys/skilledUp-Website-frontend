import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import studentService from '../services/student.service';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudentProfile(id);
            setProfile(data);
        } catch (error) {
            console.error("Failed to load profile", error);
            alert("Failed to load student profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">Loading...</div>
            </DashboardLayout>
        );
    }

    if (!profile) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">Student not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/students')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to Students
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <User size={48} className="text-primary-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                    profile.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                        profile.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {profile.status}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail size={20} />
                                    <span className="text-sm">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={20} />
                                    <span className="text-sm">{profile.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin size={20} />
                                    <span className="text-sm">{profile.city || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar size={20} />
                                    <span className="text-sm">
                                        Joined: {new Date(profile.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Internship Progress */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Internship Progress</h3>

                            {profile.enrollments && profile.enrollments.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.enrollments.map((enrollment, index) => (
                                        <div key={index} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-800 text-md">
                                                    {enrollment.internshipCategory?.title || enrollment.domain || "Internship"}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs rounded-full font-bold ${enrollment.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                    {enrollment.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white p-3 rounded-lg border border-slate-100">
                                                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {enrollment.startDate ? new Date(enrollment.startDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-slate-100">
                                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                                    <p className="text-gray-900 font-semibold mt-1">{enrollment.duration} Months</p>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-slate-100">
                                                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enrollment.progress || 0}%` }}></div>
                                                        </div>
                                                        <span className="text-sm font-bold text-blue-600">{enrollment.progress || 0}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Current Domain</p>
                                        <p className="text-xl font-bold text-blue-600">{profile.currentDomain || 'None'}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Completed Tasks</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {profile.completedTasks || 0} / {profile.totalTasks || 0}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Progress</p>
                                        <p className="text-xl font-bold text-purple-600">
                                            {profile.progressPercentage || 0}%
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Submissions Code</h3>
                            <div className="space-y-4">
                                {(profile.submissions && profile.submissions.length > 0) ? (
                                    profile.submissions.map((sub, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div>
                                                <p className="font-semibold text-slate-800">{sub.task ? sub.task.title : "Unknown Task"}</p>
                                                <p className="text-xs text-slate-500">
                                                    Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {sub.score !== null && (
                                                    <span className="text-sm font-bold text-slate-700">{sub.score}/100</span>
                                                )}
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                    sub.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                                {sub.submissionFileUrl && (
                                                    <a
                                                        href={sub.submissionFileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                                                    >
                                                        View File
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No recent submissions found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
