import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import courseCategoryService from '../../services/courseCategory.service';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await courseCategoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, slug: category.slug, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await courseCategoryService.updateCategory(editingCategory.id, formData);
            } else {
                await courseCategoryService.createCategory(formData);
            }
            handleCloseModal();
            loadCategories();
        } catch (error) {
            console.error("Failed to save category", error);
            const errorMessage = typeof error.response?.data === 'string' 
                ? error.response.data 
                : (error.response?.data?.message || error.message);
            alert("Failed to save category: " + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await courseCategoryService.deleteCategory(id);
                loadCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert("Failed to delete category");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Course Categories</h1>
                        <p className="text-gray-600">Manage categories for your courses</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Slug</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Description</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No categories found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                                            <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{category.description}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'New Category'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Auto-generated if empty"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CategoryManagement;
