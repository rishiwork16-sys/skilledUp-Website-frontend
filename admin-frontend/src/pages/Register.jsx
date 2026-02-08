import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import authService from '../services/auth.service';
import studentService from '../services/student.service';
import { Layers, ArrowLeft } from 'lucide-react';

const Register = () => {
    // URL Params for pre-selection
    const [searchParams] = useSearchParams();
    const preSelectedDomain = searchParams.get('domain');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        internshipTypeId: preSelectedDomain || '',
        duration: 8 // Default 8 weeks
    });

    // Update if param changes
    useEffect(() => {
        if (preSelectedDomain) {
            setFormData(prev => ({ ...prev, internshipTypeId: preSelectedDomain }));
        }
    }, [preSelectedDomain]);

    // OTP states
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isMobileVerified, setIsMobileVerified] = useState(false);

    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [mobileOtpSent, setMobileOtpSent] = useState(false);

    const [internshipTypes, setInternshipTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadInternshipTypes();
    }, []);

    const loadInternshipTypes = async () => {
        try {
            const types = await studentService.getInternshipTypes();
            setInternshipTypes(types);
        } catch (err) {
            console.error("Failed to load internship types", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmailOtp = async () => {
        if (!formData.email) return setError("Email is required");
        try {
            setLoading(true);
            await authService.sendOtp(formData.email, 'EMAIL');
            setEmailOtpSent(true);
            setSuccessMessage("OTP sent to email");
            setError('');
        } catch (err) {
            setError("Failed to send Email OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyEmailOtp = async () => {
        try {
            setLoading(true);
            await authService.verifyOtp(formData.email, emailOtp, 'EMAIL');
            setIsEmailVerified(true);
            setSuccessMessage("Email Verified!");
            setError('');
        } catch (err) {
            setError("Invalid Email OTP");
        } finally {
            setLoading(false);
        }
    };

    const sendMobileOtp = async () => {
        if (!formData.phone) return setError("Phone is required");
        try {
            setLoading(true);
            await authService.sendOtp(formData.phone, 'MOBILE');
            setMobileOtpSent(true);
            setSuccessMessage("OTP sent to mobile");
            setError('');
        } catch (err) {
            setError("Failed to send Mobile OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyMobileOtp = async () => {
        try {
            setLoading(true);
            await authService.verifyOtp(formData.phone, mobileOtp, 'MOBILE');
            setIsMobileVerified(true);
            setSuccessMessage("Mobile Verified!");
            setError('');
        } catch (err) {
            setError("Invalid Mobile OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isEmailVerified || !isMobileVerified) {
            return setError("Please verify both Email and Mobile to proceed.");
        }

        if (!formData.internshipTypeId) {
            return setError("Please select an Internship Domain.");
        }

        try {
            setLoading(true);
            // Call Public Enrollment (which registers user + creates enrollment + returns token)
            // Expecting response: { enrollment: {...}, token: "jwt_token" }
            const response = await studentService.enrollPublic(formData);

            if (response && response.token) {
                // Auto-login
                authService.logout(); // Clear any old data
                localStorage.setItem('token', response.token);

                // We need to decode the token or fetch user details, but technically just setting the token 
                // and refreshing the app/context should work if specific logic isn't tied to user object immediately.
                // However, to be safe and use existing AuthService flow, we might want to decode or just navigate.
                // Since AuthContext typically checks local storage on mount/reload, a simple navigate might work 
                // if AuthContext listens or if we force a reload.
                // Better approach: use useAuth() login or similar if exposed.
                // But since we are inside a component, we can manualy set it.

                // Because AuthContext might not support setting token directly without user object, 
                // we will rely on full page reload or navigate. 
                // Let's assume navigating to dashboard triggers AuthContext to read from LS.

                // Wait for a brief moment for storage to stick? No, sync.

                // Note: Frontend helper might need updating if enrollPublic returns the wrapper now.

                setSuccessMessage("Registration Successful! Redirecting to Dashboard...");
                setTimeout(() => {
                    window.location.href = '/student/dashboard'; // Force reload/redirect to ensure Context picks up token
                }, 1500);
            } else {
                setSuccessMessage("Registration Successful! Please check your email for the Offer Letter.");
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 py-10 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 bg-white border-b border-slate-100">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </button>

                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Join skilledUp</h2>
                    </div>
                    <p className="text-center text-slate-500 text-sm">Create your student account and apply for an internship</p>
                </div>

                <div className="p-8">
                    {error && <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><span className="font-bold">Error:</span> {error}</div>}
                    {successMessage && <div className="p-4 mb-6 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2"><span className="font-bold">Success:</span> {successMessage}</div>}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Basic Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                <input name="name" type="text" value={formData.name} onChange={handleChange} required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                                <input name="city" type="text" value={formData.city} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="New York"
                                />
                            </div>
                        </div>

                        {/* Email Verification */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <div className="flex gap-2">
                                <input name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isEmailVerified}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder="john@example.com"
                                />
                                {!isEmailVerified && (
                                    <button type="button" onClick={sendEmailOtp} disabled={loading || !formData.email}
                                        className="px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors shadow-lg shadow-blue-500/20">
                                        {emailOtpSent ? 'Resend' : 'Verify'}
                                    </button>
                                )}
                                {isEmailVerified && <span className="flex items-center px-4 font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">Verified</span>}
                            </div>

                            {emailOtpSent && !isEmailVerified && (
                                <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                                    <input type="text" placeholder="Enter Email OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                    <button type="button" onClick={verifyEmailOtp} disabled={loading}
                                        className="px-5 py-2.5 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-lg shadow-emerald-500/20">
                                        Confirm
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Verification */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                            <div className="flex gap-2">
                                <input name="phone" type="text" value={formData.phone} onChange={handleChange} required disabled={isMobileVerified}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder="+1 234 567 890"
                                />
                                {!isMobileVerified && (
                                    <button type="button" onClick={sendMobileOtp} disabled={loading || !formData.phone}
                                        className="px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors shadow-lg shadow-blue-500/20">
                                        {mobileOtpSent ? 'Resend' : 'Verify'}
                                    </button>
                                )}
                                {isMobileVerified && <span className="flex items-center px-4 font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">Verified</span>}
                            </div>

                            {mobileOtpSent && !isMobileVerified && (
                                <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                                    <input type="text" placeholder="Enter Mobile OTP" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                    <button type="button" onClick={verifyMobileOtp} disabled={loading}
                                        className="px-5 py-2.5 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-lg shadow-emerald-500/20">
                                        Confirm
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Internship Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Internship Domain</label>
                                <select name="internshipTypeId" value={formData.internshipTypeId} onChange={handleChange} required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer">
                                    <option value="">Select Domain</option>
                                    {internshipTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                                <select name="duration" value={formData.duration} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer">
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const weeks = 8 + (i * 4);
                                        return (
                                            <option key={weeks} value={weeks}>{weeks} Weeks</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isEmailVerified || !isMobileVerified}
                            className="w-full px-6 py-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.01]"
                        >
                            {loading ? 'Processing...' : 'Complete Registration & Get Offer Letter'}
                        </button>

                    </form>

                    <p className="text-sm text-center text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
