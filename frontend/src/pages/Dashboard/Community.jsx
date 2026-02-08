import React from 'react';

const Community = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 bg-blue-50 rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Community Coming Soon!
            </h1>

            <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                We are building a collaborative space for students to connect, share ideas, and grow together. Stay tuned for updates!
            </p>

            <div className="mt-8 flex gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
        </div>
    );
};

export default Community;
