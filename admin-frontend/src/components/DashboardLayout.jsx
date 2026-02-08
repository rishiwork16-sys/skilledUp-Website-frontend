import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ClipboardList, Award, MessageSquare, LogOut, User, Users, BookOpen, Clock, LifeBuoy, Zap, Menu, X, Tag, Briefcase } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.role === 'ROLE_ADMIN';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Premium Dark Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Area */}
                <div className="p-8 border-b border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                            <Zap size={24} className="text-white fill-current" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                skilledUp
                            </h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Admin Console</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4 mt-2">
                        {isAdmin ? 'Management' : 'Learning'}
                    </div>

                    {isAdmin ? (
                        <>
                            <NavItem to="/admin" icon={<Home size={20} />} label="Dashboard" active={isActive('/admin')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/students" icon={<Users size={20} />} label="Students" active={isActive('/admin/students')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/programs" icon={<BookOpen size={20} />} label="Programs" active={isActive('/admin/programs')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/courses" icon={<ClipboardList size={20} />} label="Courses" active={isActive('/admin/courses') || isActive('/admin/courses/create')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/courses/categories" icon={<Tag size={20} />} label="Categories" active={isActive('/admin/courses/categories')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/requests" icon={<Clock size={20} />} label="Requests" active={isActive('/admin/requests')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/enquiries" icon={<MessageSquare size={20} />} label="Enquiry" active={isActive('/admin/enquiries')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/careers" icon={<Briefcase size={20} />} label="Careers" active={isActive('/admin/careers')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/admin/support" icon={<LifeBuoy size={20} />} label="Support Tickets" active={isActive('/admin/support')} onClick={() => setIsSidebarOpen(false)} />
                        </>
                    ) : (
                        <>
                            <NavItem to="/dashboard" icon={<Home size={20} />} label="Overview" active={isActive('/dashboard')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/dashboard/tasks" icon={<ClipboardList size={20} />} label="My Tasks" active={isActive('/dashboard/tasks')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/dashboard/certificates" icon={<Award size={20} />} label="Certificates" active={isActive('/dashboard/certificates')} onClick={() => setIsSidebarOpen(false)} />
                            <NavItem to="/dashboard/support" icon={<MessageSquare size={20} />} label="Support" active={isActive('/dashboard/support')} onClick={() => setIsSidebarOpen(false)} />
                        </>
                    )}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
                {/* Glass Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-all">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                            {isAdmin ? 'Overview' : 'My Learning'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            ● System Active
                        </span>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active, onClick }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => {
                navigate(to);
                if (onClick) onClick();
            }}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 font-medium'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <span className={`mr-3 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>
            {label}
            {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-[2px]" />
            )}
        </button>
    )
}

export default DashboardLayout;
