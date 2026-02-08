import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Plus, Edit, Trash2, Video, Search, Eye, ExternalLink, Filter } from 'lucide-react';
import api from '../../services/api';
import courseCategoryService from '../../services/courseCategory.service';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCourses();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await courseCategoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Attempting to fetch courses...");
            const response = await api.get('/courses');
            console.log("Courses response:", response);

            let data = response.data;
            // Handle case where axios doesn't auto-parse JSON (sometimes happens with proxied responses or specific content-types)
            if (typeof data === 'string') {
                try {
                    console.log("Parsing string response...");
                    data = JSON.parse(data);
                } catch (e) {
                    console.error("Failed to parse response string:", e);
                }
            }

            if (data && Array.isArray(data)) {
                setCourses(data);
            } else {
                console.error("API returned unexpected format:", data);
                setError(`API returned unexpected data format. Type: ${typeof data}. Value: ${JSON.stringify(data).substring(0, 200)}...`);
                setCourses([]);
            }
        } catch (err) {
            console.error("Failed to load courses:", err);
            setError(err.message || "Failed to load courses");
            if (err.response) {
                console.error("Error response:", err.response);
                setError(`Server Error: ${err.response.status} - ${err.response.statusText}`);
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("Network Error: No response from server. Please check if backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course? This will remove all modules and videos as well.")) {
            return;
        }

        try {
            await api.delete(`/admin/courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
            alert("Course deleted successfully");
        } catch (err) {
            console.error("Failed to delete course:", err);
            alert("Failed to delete course: " + (err.response?.data?.message || err.message));
        }
    };

    const handleViewCourse = (slug) => {
        const envBase = import.meta.env.VITE_PUBLIC_SITE_URL;
        const originBase = window.location.origin.includes('admin.')
            ? window.location.origin.replace('admin.', '')
            : window.location.origin;
        const base = (envBase || originBase).replace(/\/$/, '');
        window.open(`${base}/courses/program/${slug}`, '_blank');
    };

    const filteredCourses = selectedCategory === 'All'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    return (
        <DashboardLayout>
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                    <span>{error}</span>
                    <button
                        onClick={loadCourses}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )
            }
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                    <p className="text-gray-500">Manage all your courses and curriculum here.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => navigate('/admin/courses/create')}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={20} /> Create Course
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading courses...</div>
                ) : filteredCourses.length === 0 && selectedCategory === 'All' ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6">Create your first course to get started.</p>
                        <button
                            onClick={() => navigate('/admin/courses/create')}
                            className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-100"
                        >
                            Create Course
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Course</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Price</th>
                                <th className="p-4 font-semibold text-gray-600">Duration</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{course.title}</div>
                                            <div className="text-xs text-gray-500 text-mono mt-1">{course.slug}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                                                {course.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">₹{course.price}</td>
                                        <td className="p-4 text-gray-600">{course.duration}</td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                                                    title="Manage Content"
                                                >
                                                    <Video size={16} /> <span className="hidden xl:inline">Content</span>
                                                </button>

                                                <button
                                                    onClick={() => handleViewCourse(course.slug)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                                                    title="View on Website"
                                                >
                                                    <Eye size={16} /> <span className="hidden xl:inline">View</span>
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                                                    title="Edit Course"
                                                >
                                                    <Edit size={16} /> <span className="hidden xl:inline">Edit</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={16} /> <span className="hidden xl:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No courses found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CourseList;
