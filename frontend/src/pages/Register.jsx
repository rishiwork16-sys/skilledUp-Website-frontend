import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const navigate = useNavigate();
    const { login } = useUser();
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900">Create a new account</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm mb-2"
                        placeholder="Full Name"
                        onChange={handleChange}
                    />
                    <input
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm mb-2"
                        placeholder="Email address"
                        onChange={handleChange}
                    />
                    <input
                        name="phone"
                        type="text"
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm mb-2"
                        placeholder="Phone Number"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {submitting ? 'Redirecting...' : 'Continue'}
                    </button>
                </form>
                <div className="text-center">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Login / Register with OTP</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
