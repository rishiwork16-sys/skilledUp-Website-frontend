import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { LayoutDashboard, LogOut, ListTodo, FileText, Award, Users, FileMinus, User, HelpCircle } from 'lucide-react';

const StudentSidebar = ({ isOpen, onClose }) => {
    const { logout } = useUser();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/tasks', label: 'My Tasks', icon: ListTodo },
        { path: '/dashboard/offer-letter', label: 'Offer Letter', icon: FileText },
        { path: '/dashboard/lor', label: 'LOR (Letter of Recommendation)', icon: FileText },
        { path: '/dashboard/certificate', label: 'Internship Certificate', icon: Award },
        { path: '/dashboard/community', label: 'Community', icon: Users },
        { path: '/dashboard/exit-letter', label: 'Exit Letter/Extension', icon: FileMinus },
        { path: '/dashboard/profile', label: 'Edit Profile', icon: User },
        { path: '/dashboard/support', label: 'Support Ticket', icon: HelpCircle },
    ];

    return (
        <>
            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">skilledUp</h1>
                        <p className="text-sm text-gray-500">Student Portal</p>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                        <span className="sr-only">Close sidebar</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};

export default StudentSidebar;
