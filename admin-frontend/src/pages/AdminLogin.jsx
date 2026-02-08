import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, logout, user } = useAuth();
    const navigate = useNavigate();

    // Auto-logout if visiting admin login while logged in as student
    useEffect(() => {
        if (user && user.role !== 'ROLE_ADMIN') {
            logout();
        }
    }, [user, logout]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await login(email, password);
            if (data.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                setError('Access Denied. Admin privileges required.');
                logout();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-white">
                        Admin Portal
                    </h1>
                    <p className="text-slate-400">Secure access for administrators</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="flex items-center p-4 text-sm text-red-200 bg-red-900/50 border-l-4 border-red-500 rounded-r-md">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                        Authorized personnel only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
