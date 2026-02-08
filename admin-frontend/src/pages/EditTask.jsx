import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FilePreviewModal from '../components/FilePreviewModal';
import taskService from '../services/task.service';
import {
    ArrowLeft,
    FileText,
    Video,
    Link,
    ChevronDown,
    Eye,
    X
} from 'lucide-react';

const EditTask = () => {
    const { categoryId, taskId } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, fileUrl: '', fileType: '' });
    const [formData, setFormData] = useState({
        title: '',
        weekNo: 1,
        description: '',
        domain: '',
        taskFileUrl: '',
        videoUrl: '',
        urlFileUrl: '',
        autoReview: false,
        deadline: '',
        active: true
    });

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        try {
            const task = await taskService.getTaskById(taskId);
            setFormData({
                title: task.title || '',
                weekNo: task.weekNo || 1,
                description: task.description || '',
                domain: task.domain || '',
                taskFileUrl: task.taskFileUrl || '',
                videoUrl: task.videoUrl || '',
                urlFileUrl: task.urlFileUrl || '',
                autoReview: task.autoReview || false,
                deadline: task.deadline ? (() => {
                    const d = new Date(task.deadline);
                    const pad = (n) => n.toString().padStart(2, '0');
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                })() : '',
                active: task.active !== undefined ? task.active : true
            });
        } catch (error) {
            console.error("Failed to load task", error);
            alert("Failed to load task");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const taskPayload = {
                title: formData.title,
                description: formData.description,
                domain: formData.domain,
                weekNo: formData.weekNo,
                taskFileUrl: formData.taskFileUrl || null,
                videoUrl: formData.videoUrl || null,
                urlFileUrl: formData.urlFileUrl || null,
                autoReview: formData.autoReview,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
                active: formData.active
            };

            await taskService.updateTask(taskId, taskPayload);
            alert('Task Updated Successfully!');
            navigate(`/admin/programs/${categoryId}`);
        } catch (error) {
            console.error("Failed to update task", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update task";
            alert(`Failed to update task: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePreview = async (fileUrl, fileType) => {
        try {
            const signedUrl = await taskService.getSignedUrl(fileUrl);
            setPreviewModal({ isOpen: true, fileUrl: signedUrl, fileType });
        } catch (error) {
            alert('Failed to preview file');
        }
    };

    const handleDeleteFile = async (fileType) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            await taskService.deleteFile(taskId, fileType);
            setFormData(prev => ({ ...prev, [`${fileType}Url`]: '' }));
            alert('File deleted successfully');
        } catch (error) {
            alert('Failed to delete file');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-slate-500">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <FilePreviewModal
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, fileUrl: '', fileType: '' })}
                fileUrl={previewModal.fileUrl}
                fileType={previewModal.fileType}
            />
            <div className="max-w-5xl mx-auto pb-10">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/admin/programs/${categoryId}`)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Tasks
                    </button>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <span>Program</span>
                        <span>›</span>
                        <span>Tasks</span>
                        <span>›</span>
                        <span className="text-indigo-600 font-medium">Edit Task</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Edit Task</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white/80 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-indigo-50/50 px-6 py-3 border-b border-indigo-100">
                            <h2 className="font-bold text-slate-800">Basic Task Information</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3">Task Title</label>
                                <div className="md:col-span-9">
                                    <input
                                        type="text"
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-indigo-50/30"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3">Task Week</label>
                                <div className="md:col-span-9">
                                    <div className="relative w-48">
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 custom-select"
                                            value={formData.weekNo}
                                            onChange={(e) => setFormData({ ...formData, weekNo: parseInt(e.target.value) })}
                                        >
                                            {[...Array(52)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3">Deadline</label>
                                <div className="md:col-span-9">
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-indigo-50/30"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3 pt-2">Description</label>
                                <div className="md:col-span-9">
                                    <textarea
                                        className="w-full p-4 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[150px] bg-indigo-50/10"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-indigo-50/40 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-indigo-100/50 px-6 py-3 border-b border-indigo-200">
                            <h2 className="font-bold text-slate-800">Task Resources</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Task File</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white text-sm"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    const url = await taskService.uploadFile(file);
                                                    setFormData(prev => ({ ...prev, taskFileUrl: url }));
                                                    alert("File uploaded successfully");
                                                } catch (err) {
                                                    alert("File upload failed");
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                {formData.taskFileUrl && (
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <FileText className="text-emerald-600" size={18} />
                                        <span className="flex-1 text-emerald-700 font-medium text-sm">File uploaded</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePreview(formData.taskFileUrl, 'file')}
                                            className="p-1.5 hover:bg-emerald-100 rounded transition-colors"
                                            title="Preview File"
                                        >
                                            <Eye size={16} className="text-emerald-600" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFile('taskFile')}
                                            className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                                            title="Delete File"
                                        >
                                            <X size={16} className="text-rose-600" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white text-sm"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const url = await taskService.uploadFile(file);
                                                setFormData(prev => ({ ...prev, videoUrl: url }));
                                                alert("Video uploaded successfully");
                                            } catch (err) {
                                                alert("Video upload failed");
                                            }
                                        }
                                    }}
                                />
                                {formData.videoUrl && (
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <Video className="text-emerald-600" size={18} />
                                        <span className="flex-1 text-emerald-700 font-medium text-sm">Video uploaded</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePreview(formData.videoUrl, 'video')}
                                            className="p-1.5 hover:bg-emerald-100 rounded transition-colors"
                                            title="Preview Video"
                                        >
                                            <Eye size={16} className="text-emerald-600" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFile('video')}
                                            className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                                            title="Delete Video"
                                        >
                                            <X size={16} className="text-rose-600" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Upload from URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/file.pdf"
                                        className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white text-sm"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const url = e.target.value;
                                                if (url) {
                                                    // Just attach the link, do NOT upload/download
                                                    setFormData(prev => ({ ...prev, urlFileUrl: url }));
                                                    alert("Link attached successfully");
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                {formData.urlFileUrl && (
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <Link className="text-emerald-600" size={18} />
                                        <span className="flex-1 text-emerald-700 font-medium text-sm">Link Attached: {formData.urlFileUrl}</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePreview(formData.urlFileUrl, 'file')}
                                            className="p-1.5 hover:bg-emerald-100 rounded transition-colors"
                                            title="Preview File"
                                        >
                                            <Eye size={16} className="text-emerald-600" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFile('urlFile')}
                                            className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                                            title="Delete File"
                                        >
                                            <X size={16} className="text-rose-600" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="text-sm font-semibold text-slate-600">Auto Review</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, autoReview: !formData.autoReview })}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.autoReview ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${formData.autoReview ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-4 pt-4">
                                <label className="text-sm font-semibold text-slate-600">Active Status</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${formData.active ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/programs/${categoryId}`)}
                            className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
                        >
                            {submitting ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditTask;
