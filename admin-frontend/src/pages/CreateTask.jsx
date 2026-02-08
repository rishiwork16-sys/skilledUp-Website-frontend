import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import categoryService from '../services/category.service';
import taskService from '../services/task.service';
import {
    Calendar,
    Clock,
    Upload,
    FileText,
    Video,
    Link,
    List,
    AlignLeft,
    Image as ImageIcon,
    ChevronDown,
    Bold,
    Italic,
    Underline
} from 'lucide-react';

const CreateTask = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        try {
            const categories = await categoryService.getActiveCategories();
            const currentCat = categories.find(c => c.id.toString() === categoryId);
            setCategory(currentCat);
        } catch (err) {
            console.error(err);
        }
    };

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        weekNo: 1,
        description: '',
        unlockMode: 'Auto',
        startDate: '',
        deadlineDate: '',
        deadlineTime: '11:59 PM',
        sequentialLock: true,
        taskType: 'Assignment',
        submissionType: 'File Upload',
        maxSize: '20 MB',
        attempts: true,
        reviewMode: 'Auto-Review',
        latePolicy: 'Auto mark as Delayed',
        status: 'Published'
    });

    const convertTimeTo24 = (time12h) => {
        if (!time12h) return '23:59';
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) return alert("Category not loaded");
        setSubmitting(true);

        try {
            const taskPayload = {
                title: formData.title,
                description: formData.description,
                domain: category.title, // Use category title as domain
                weekNo: formData.weekNo,
                taskFileUrl: formData.taskFileUrl || null,
                videoUrl: formData.videoUrl || null,
                urlFileUrl: formData.urlFileUrl || null,
                autoReview: formData.reviewMode === 'Auto-Review',
                isManual: formData.unlockMode === 'Manual',
                startDate: formData.startDate
                    ? new Date(formData.startDate).toISOString()
                    : null,
                deadline: formData.deadlineDate
                    ? new Date(`${formData.deadlineDate}T${convertTimeTo24(formData.deadlineTime)}`).toISOString()
                    : null
            };

            await taskService.createTask(taskPayload);

            alert('Task Created Successfully!');
            navigate('/admin/programs/' + categoryId);
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Failed to create task");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto pb-10">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <span>Admin Panel</span>
                        <span>›</span>
                        <span>Program</span>
                        <span>›</span>
                        <span className="text-indigo-600 font-medium">Create Task</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Create Task</h1>
                    <div className="mt-2 text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-md">
                        Program ID: {categoryId || '1002456'}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Basic Task Information */}
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
                                        placeholder="e.g. Week 1 — Python Fundamentals"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3 pt-2">Task Description</label>
                                <div className="md:col-span-9 border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                                    {/* Toolbar */}
                                    <div className="bg-indigo-50/30 border-b border-indigo-100 px-3 py-2 flex gap-1 items-center flex-wrap">
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><Bold size={16} /></button>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><Italic size={16} /></button>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><Underline size={16} /></button>
                                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><List size={16} /></button>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><AlignLeft size={16} /></button>
                                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><Link size={16} /></button>
                                        <button type="button" className="p-1.5 rounded hover:bg-indigo-100 text-slate-600"><ImageIcon size={16} /></button>
                                    </div>
                                    <textarea
                                        className="w-full p-4 outline-none min-h-[150px] bg-indigo-50/10 text-sm leading-relaxed"
                                        placeholder="Enter detailed instructions here..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Schedule & Automation */}
                    <div className="bg-white/80 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-indigo-50/50 px-6 py-3 border-b border-indigo-100">
                            <h2 className="font-bold text-slate-800">Schedule & Automation</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3">Task Unlock Mode</label>
                                <div className="md:col-span-9 flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="unlockMode" className="text-indigo-600 focus:ring-indigo-500" checked={formData.unlockMode === 'Auto'} onChange={() => setFormData({ ...formData, unlockMode: 'Auto' })} />
                                        <span className="text-slate-700">Auto (Monday Release)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="unlockMode" className="text-indigo-600 focus:ring-indigo-500" checked={formData.unlockMode === 'Manual'} onChange={() => setFormData({ ...formData, unlockMode: 'Manual' })} />
                                        <span className="text-slate-700">Manual</span>
                                    </label>
                                </div>
                            </div>

                            {formData.unlockMode === 'Manual' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        <label className="text-sm font-semibold text-slate-600 md:col-span-3">Task Start Date</label>
                                        <div className="md:col-span-9">
                                            <div className="relative max-w-xs">
                                                <input
                                                    type="date"
                                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-50/30"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        <label className="text-sm font-semibold text-slate-600 md:col-span-3">Task Deadline</label>
                                        <div className="md:col-span-9 flex gap-3">
                                            <div className="relative max-w-xs flex-1">
                                                <input
                                                    type="date"
                                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-50/30"
                                                    value={formData.deadlineDate}
                                                    onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative w-40">
                                                <input
                                                    type="text"
                                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-50/30 text-center"
                                                    value={formData.deadlineTime}
                                                    onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600 md:col-span-3">Sequential Lock</label>
                                <div className="md:col-span-9">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, sequentialLock: !formData.sequentialLock })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${formData.sequentialLock ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${formData.sequentialLock ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                        <span className="text-sm text-slate-500">Previous task must be submitted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Task Content & Resources */}
                    <div className="bg-indigo-50/40 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-indigo-100/50 px-6 py-3 border-b border-indigo-200">
                            <h2 className="font-bold text-slate-800">Task Content & Resources</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Task Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white appearance-none"
                                            value={formData.taskType}
                                            onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                                        >
                                            <option>Assignment</option>
                                            <option>Quiz</option>
                                            <option>Project</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Upload File</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    try {
                                                        const url = await taskService.uploadFile(file);
                                                        setFormData(prev => ({ ...prev, taskFileUrl: url, taskFileName: file.name, taskFileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB' }));
                                                        alert("File uploaded successfully");
                                                    } catch (err) {
                                                        console.error("Upload error details:", err);
                                                        alert("File upload failed. " + (err.response?.data?.message || err.message || "Unknown error. Check console."));
                                                    }
                                                }
                                            }}
                                        />
                                        <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${formData.taskFileUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`}>
                                            <FileText className={formData.taskFileUrl ? "text-emerald-600" : "text-indigo-600"} size={18} />
                                            <span className={`${formData.taskFileUrl ? "text-emerald-700" : "text-indigo-700"} font-medium text-sm truncate`}>
                                                {formData.taskFileName || "Click to upload file"}
                                            </span>
                                            {formData.taskFileSize && <span className="ml-auto text-xs text-indigo-400">{formData.taskFileSize}</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400">Allowed formats: PDF, DOC, PPT, ZIP, MP4. Max 100 MB.</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Upload Video</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    try {
                                                        const url = await taskService.uploadFile(file);
                                                        setFormData(prev => ({ ...prev, videoUrl: url, videoName: file.name }));
                                                        alert("Video uploaded successfully");
                                                    } catch (err) {
                                                        console.error("Video upload error:", err);
                                                        alert("Video upload failed. " + (err.response?.data?.message || err.message || "Unknown error"));
                                                    }
                                                }
                                            }}
                                        />
                                        <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${formData.videoUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}>
                                            <Video className={formData.videoUrl ? "text-emerald-600" : "text-blue-600"} size={18} />
                                            <span className={`${formData.videoUrl ? "text-emerald-700" : "text-blue-700"} font-medium text-sm truncate`}>
                                                {formData.videoName || "Click to upload video"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Video Thumbnail Preview */}
                                    {formData.videoUrl && (
                                        <div className="mt-2 relative rounded-xl overflow-hidden shadow-lg border border-slate-200 group cursor-pointer w-48">
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                                </div>
                                            </div>
                                            <video src={formData.videoUrl} className="w-full h-28 object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Upload from URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="https://example.com/file.pdf"
                                            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                                            value={formData.urlInput || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, urlInput: e.target.value }))}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!formData.urlInput) {
                                                    alert("Please enter a URL");
                                                    return;
                                                }
                                                // Just set the URL directly, do NOT upload/download content
                                                setFormData(prev => ({
                                                    ...prev,
                                                    urlFileUrl: formData.urlInput,
                                                    urlFileName: 'External Link'
                                                }));
                                                alert("Link attached successfully");
                                            }}
                                            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Link size={18} />
                                            Attach Link
                                        </button>
                                    </div>
                                    {formData.urlFileUrl && (
                                        <div className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <FileText className="text-emerald-600" size={18} />
                                            <span className="text-emerald-700 font-medium text-sm truncate flex-1">
                                                {formData.urlFileUrl}
                                            </span>
                                            <span className="text-xs text-emerald-500">✓ Link Attached</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-slate-400">Enter a direct link (e.g. Google Drive, Website, Article) for the studnet to visit.</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Submission Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white appearance-none"
                                            value={formData.submissionType}
                                            onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                                        >
                                            <option>File Upload</option>
                                            <option>Link Submission</option>
                                            <option>Text Entry</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Max Submission Size</label>
                                    <div className="w-32">
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white text-center"
                                            value={formData.maxSize}
                                            onChange={(e) => setFormData({ ...formData, maxSize: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <label className="text-sm font-semibold text-slate-600">Multiple Attempts Allowed</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, attempts: !formData.attempts })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${formData.attempts ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${formData.attempts ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                {/* Inner Box */}
                                <div className="bg-white/50 border border-indigo-100 rounded-xl p-4 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-700">Review & Evaluation Settings</h3>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-500">Review Mode</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none bg-white text-sm"
                                            value={formData.reviewMode}
                                            onChange={(e) => setFormData({ ...formData, reviewMode: e.target.value })}
                                        >
                                            <option>Auto-Review</option>
                                            <option>Manual Review by Mentor</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-500">Late Submission Policy</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none bg-white text-sm"
                                            value={formData.latePolicy}
                                            onChange={(e) => setFormData({ ...formData, latePolicy: e.target.value })}
                                        >
                                            <option>Auto mark as Delayed</option>
                                            <option>Reject</option>
                                            <option>Accept with Penalty</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Section 4: Visibility & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50/50 rounded-xl border border-purple-100 p-6">
                            <h2 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Visibility & Status</h2>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-semibold text-slate-600">Task Status</label>
                                <div className="relative w-40">
                                    <select
                                        className="w-full border border-purple-200 rounded-lg px-4 py-2 outline-none bg-white appearance-none text-purple-700 font-medium"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Published</option>
                                        <option>Draft</option>
                                        <option>Archived</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-purple-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
                            <h2 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Audit Info</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Created By:</span>
                                    <span className="font-medium text-slate-700">Rishi (Admin)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Created Date:</span>
                                    <span className="font-medium text-slate-700">01/01/2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/programs')}
                            className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            {submitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTask;
