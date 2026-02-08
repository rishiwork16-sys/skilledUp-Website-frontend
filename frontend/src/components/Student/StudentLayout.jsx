import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import StudentSidebar from './StudentSidebar';

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <StudentSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">skilledUp</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
