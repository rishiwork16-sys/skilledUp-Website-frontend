import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { ArrowLeft, Plus, Video, Trash2, ChevronDown, ChevronRight, Upload } from 'lucide-react';
import api from '../../services/api';

const CourseContent = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]); // This would normally come from GET /courses/{id}
    const [loading, setLoading] = useState(false);

    // Modal States
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState(null);

    // Forms
    const [moduleTitle, setModuleTitle] = useState('');
    const [videoForm, setVideoForm] = useState({
        title: '',
        description: '',
        file: null
    });
    const [uploading, setUploading] = useState(false);

    // Mock Load - Replace with API call to get Course + Modules
    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/courses/${courseId}`);
            setModules(response.data.modules || []);
        } catch (error) {
            console.error('Error fetching course details:', error);
            // alert('Failed to load course content'); // Suppress initial alert if just expired
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/admin/courses/${courseId}/modules`, {
                title: moduleTitle,
                description: ""
            });
            setModules([...modules, response.data]);
            setModuleTitle('');
            setShowModuleModal(false);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || error.message || 'Unknown error';
            alert('Failed: ' + msg);
        }
    };

    const handleUploadVideo = async (e) => {
        e.preventDefault();
        if (!videoForm.file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', videoForm.file);
        formData.append('title', videoForm.title);
        formData.append('description', videoForm.description);

        try {
            await api.post(`/admin/courses/modules/${activeModuleId}/videos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            alert('Video uploaded successfully!');
            setShowVideoModal(false);
            setVideoForm({ title: '', description: '', file: null });
            fetchCourseDetails(); // Refresh to show new video
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <DashboardLayout>
            <button
                onClick={() => navigate('/admin/courses')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft size={18} /> Back to Courses
            </button>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Course Content</h1>
                <button
                    onClick={() => setShowModuleModal(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 font-medium"
                >
                    <Plus size={18} /> Add Module
                </button>
            </div>

            <div className="space-y-4">
                {modules.map((module) => (
                    <div key={module.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">{module.title}</h3>
                            <button
                                onClick={() => {
                                    setActiveModuleId(module.id);
                                    setShowVideoModal(true);
                                }}
                                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                                <Upload size={14} /> Add Video
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {module.videos && module.videos.length > 0 ? (
                                module.videos.map(video => (
                                    <div key={video.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                                                <Video size={16} />
                                            </div>
                                            <span className="font-medium text-gray-700">{video.title}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic text-center py-2">No videos yet</p>
                            )}
                        </div>
                    </div>
                ))}
                {modules.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No modules created. Click "Add Module" to start.
                    </div>
                )}
            </div>

            {/* Module Modal */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Module</h2>
                        <form onSubmit={handleAddModule}>
                            <input
                                autoFocus
                                type="text"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                                placeholder="Module Title"
                                value={moduleTitle}
                                onChange={e => setModuleTitle(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModuleModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Add Module</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Upload Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Upload Video</h2>
                        <form onSubmit={handleUploadVideo} className="space-y-4">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                                placeholder="Video Title"
                                value={videoForm.title}
                                onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                            />
                            <textarea
                                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                                placeholder="Description"
                                value={videoForm.description}
                                onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                            />
                            <input
                                type="file"
                                accept="video/*"
                                onChange={e => setVideoForm({ ...videoForm, file: e.target.files[0] })}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowVideoModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
                                >
                                    {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CourseContent;
