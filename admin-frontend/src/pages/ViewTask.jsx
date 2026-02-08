import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FilePreviewModal from '../components/FilePreviewModal';
import taskService from '../services/task.service';
import {
    ArrowLeft,
    Edit2,
    FileText,
    Video,
    Link as LinkIcon,
    Calendar,
    CheckCircle,
    Eye,
    Download
} from 'lucide-react';

const ViewTask = () => {
    const { categoryId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewModal, setPreviewModal] = useState({
        isOpen: false,
        fileUrl: '',
        fileType: ''
    });

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        try {
            const data = await taskService.getTaskById(taskId);
            setTask(data);
        } catch (error) {
            console.error("Failed to load task", error);
            alert("Failed to load task");
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (fileUrl, fileType) => {
        try {
            const signedUrl = await taskService.getSignedUrl(fileUrl);
            setPreviewModal({
                isOpen: true,
                fileUrl: signedUrl,
                fileType
            });
        } catch (error) {
            console.error("Failed to generate signed URL", error);
            alert("Failed to preview file");
        }
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const signedUrl = await taskService.getSignedUrl(fileUrl);
            const link = document.createElement('a');
            link.href = signedUrl;
            link.download = fileName || 'download';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to generate signed URL", error);
            alert("Failed to download file");
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

    if (!task) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <p className="text-slate-500">Task not found</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/admin/programs/${categoryId}`)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Tasks
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <span>Program</span>
                                <span>›</span>
                                <span>Tasks</span>
                                <span>›</span>
                                <span className="text-indigo-600 font-medium">View Task</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800">{task.title}</h1>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/programs/${categoryId}/tasks/${taskId}/edit`)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-500/20">
                            <Edit2 size={18} />
                            Edit Task
                        </button>
                    </div>
                </div>

                {/* Task Details */}
                <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50/50 px-6 py-3 border-b border-indigo-100">
                        <h2 className="font-bold text-slate-800">Task Information</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Domain</label>
                                <p className="mt-1 text-slate-800">{task.domain}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Week</label>
                                <p className="mt-1 text-slate-800">Week {task.weekNo}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Deadline</label>
                                <div className="mt-1 flex items-center gap-2 text-slate-800">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>
                                        {task.deadline
                                            ? new Date(task.deadline).toLocaleString()
                                            : 'No deadline set'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Created Date</label>
                                <div className="mt-1 flex items-center gap-2 text-slate-800">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>
                                        {task.createdAt
                                            ? new Date(task.createdAt).toLocaleString()
                                            : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600">Description</label>
                            <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-slate-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-3 block">Uploaded Resources</label>
                            <div className="space-y-3">
                                {task.taskFileUrl && (
                                    <div className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-xl hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <FileText className="text-indigo-600" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-indigo-900 font-semibold">Task File</p>
                                                <p className="text-indigo-600 text-xs">Document Resource</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePreview(task.taskFileUrl, 'file')}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
                                                <Eye size={16} />
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => handleDownload(task.taskFileUrl, 'task-file')}
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-sm">
                                                <Download size={16} />
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {task.videoUrl && (
                                    <div className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Video className="text-blue-600" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-blue-900 font-semibold">Video Resource</p>
                                                <p className="text-blue-600 text-xs">Video Tutorial</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePreview(task.videoUrl, 'video')}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                                                <Eye size={16} />
                                                Watch
                                            </button>
                                            <button
                                                onClick={() => handleDownload(task.videoUrl, 'video-resource')}
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm">
                                                <Download size={16} />
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {task.urlFileUrl && (
                                    <div className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <LinkIcon className="text-purple-600" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-purple-900 font-semibold">URL Resource</p>
                                                <p className="text-purple-600 text-xs">External Link</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={task.urlFileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm">
                                                <LinkIcon size={16} />
                                                Open Link
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {!task.taskFileUrl && !task.videoUrl && !task.urlFileUrl && (
                                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-slate-500 text-sm">No resources uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Auto Review</label>
                                <div className="mt-1 flex items-center gap-2">
                                    {task.autoReview ? (
                                        <span className="text-emerald-600 flex items-center gap-1">
                                            <CheckCircle size={16} /> Enabled
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">Disabled</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600">Status</label>
                                <p className="mt-1">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${task.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {task.active ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Preview Modal */}
            <FilePreviewModal
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, fileUrl: '', fileType: '' })}
                fileUrl={previewModal.fileUrl}
                fileType={previewModal.fileType}
            />
        </DashboardLayout>
    );
};

export default ViewTask;
