import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, getMyTasks, getProfile, getMySubmissions, getSignedUrl, uploadFile, submitTask, deleteSubmission } from '../../api/studentService';
import FilePreviewModal from '../../components/FilePreviewModal';
import { useUser } from '../../context/UserContext';
import {
    ArrowLeft,
    FileText,
    Video,
    Link as LinkIcon,
    Calendar,
    Eye,
    Download,
    CheckCircle,
    Upload,
    Loader,
    AlertCircle
} from 'lucide-react';

const StudentViewTask = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewModal, setPreviewModal] = useState({
        isOpen: false,
        fileUrl: '',
        fileType: ''
    });

    // Submission States
    const [submissionFile, setSubmissionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null
    const [submissionMessage, setSubmissionMessage] = useState('');

    const [existingSubmission, setExistingSubmission] = useState(null);

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        try {
            const userId = user?.id || user?.userId;
            if (!userId) return; // Wait for user to be loaded
            // 1. Load Task Details
            const taskData = await getTask(taskId);

            // 2. Verify Lock Status by checking MyTasks
            // (Since getTask is generic, we need to check the schedule)
            const myTasks = await getMyTasks(userId);
            const mySchedule = myTasks.find(t => t.task.id.toString() === taskId);

            if (mySchedule) {
                if (!mySchedule.unlocked) {
                    alert("This task is currently locked.");
                    navigate('/dashboard/tasks');
                    return;
                }
                setTask(taskData);

                // 3. Check for existing submission
                console.log("Checking schedule for submission:", mySchedule);
                if (mySchedule.submitted) {
                    try {
                        console.log("Fetching profile for user:", userId);
                        const profile = await getProfile(userId);
                        console.log("Fetched profile:", profile);

                        if (profile && profile.id) {
                            console.log("Fetching submissions for studentId:", profile.id);
                            const submissions = await getMySubmissions(profile.id);
                            console.log("All submissions:", submissions);

                            const sub = submissions.find(s => s.task.id.toString() === taskId);
                            console.log("Found submission for this task:", sub);

                            if (sub) {
                                setExistingSubmission(sub);
                                setSubmissionStatus('success');
                                setSubmissionMessage('You have already submitted this task.');
                            } else {
                                console.warn("Task is marked submitted but no submission record found in getMySubmissions");
                            }
                        }
                    } catch (err) {
                        console.error("Failed to load existing submission", err);
                    }
                } else {
                    console.log("Task is NOT marked as submitted in schedule");
                }

            } else {
                // Task not found in schedule? Maybe new? Let's just show it or handled by backend?
                // If not in schedule, they shouldn't see it.
                console.warn("Task not found in student schedule");
                setTask(taskData); // Fallback: show it, or block?
            }
        } catch (error) {
            console.error("Failed to load task", error);
            navigate('/dashboard/tasks'); // Redirect on error
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (fileUrl, fileType) => {
        try {
            const signedUrl = await getSignedUrl(fileUrl);
            setPreviewModal({
                isOpen: true,
                fileUrl: signedUrl,
                fileType
            });
        } catch (error) {
            console.error("Failed to get signed URL for preview", error);
        }
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const signedUrl = await getSignedUrl(fileUrl);
            const link = document.createElement('a');
            link.href = signedUrl;
            link.download = fileName || 'download';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to get signed URL for download", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSubmissionFile(e.target.files[0]);
            setSubmissionStatus(null);
        }
    };

    const handleSubmitTask = async () => {
        if (!submissionFile) {
            setSubmissionStatus('error');
            setSubmissionMessage('Please select a file to upload.');
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // 1. Upload File
            const fileUrl = await uploadFile(submissionFile);

            // 2. Get Student ID from User ID (Profile Lookup)
            // Assuming user.id is the Auth User ID
            let studentIdToSend = user?.id;
            try {
                const profile = await getProfile(user?.id);
                if (profile && profile.id) {
                    studentIdToSend = profile.id;
                }
            } catch (err) {
                console.warn("Could not fetch profile, using user.id as fallback", err);
            }

            // 3. Submit Task
            await submitTask({
                studentId: studentIdToSend,
                taskId: taskId,
                submissionFileUrl: fileUrl
            });

            setSubmissionStatus('success');
            setSubmissionMessage('Task submitted successfully!');
            setSubmissionFile(null);

            // Reload task to refresh state
            loadTask();

        } catch (error) {
            console.error("Submission failed", error);
            let errMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit task.";

            // Clean up Feign/Backend error messages
            if (errMsg.includes("Task already submitted")) {
                errMsg = "You have already submitted this task.";
            } else if (errMsg.includes("Task is not unlocked")) {
                errMsg = "This task is not yet unlocked.";
            } else if (errMsg.includes("[")) {
                // Try to extract JSON message from technical error string
                try {
                    const match = errMsg.match(/\{"message":"(.*?)"\}/);
                    if (match && match[1]) {
                        errMsg = match[1];
                    } else if (errMsg.includes("Task already submitted")) { // Fallback check
                        errMsg = "You have already submitted this task.";
                    }
                } catch (e) {
                    // ignore parsing error
                }
            }

            setSubmissionStatus('error');
            setSubmissionMessage(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSubmission = async () => {
        if (!existingSubmission) return;
        if (!window.confirm("Are you sure you want to delete this submission? You will need to re-upload your task.")) return;

        setIsSubmitting(true);
        try {
            await deleteSubmission(existingSubmission.id);
            alert("Submission deleted successfully.");
            setExistingSubmission(null);
            setSubmissionStatus(null);
            setSubmissionMessage('');
            loadTask(); // Reload to reset state fully
        } catch (error) {
            console.error("Failed to delete submission", error);
            const errMsg = error.response?.data?.message || "Failed to delete submission.";
            alert(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-500 flex items-center gap-2"><Loader className="animate-spin" size={20} /> Loading task details...</div></div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Task not found</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard/tasks')}
                        className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                    >
                        <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span>Back to My Tasks</span>
                    </button>
                    <div className="text-sm font-medium text-slate-400">Task Details</div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mb-8">
                    <div className="relative h-32 bg-gradient-to-r from-slate-900 to-indigo-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4">
                            <div className="flex items-center gap-3 mb-2 opacity-90">
                                {task.domain && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/10 text-white shadow-sm">
                                        {task.domain}
                                    </span>
                                )}
                                <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                                    Week {task.weekNo}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 pt-4 pb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{task.title}</h1>
                                <p className="text-slate-500 text-sm">Review the task details and submit your work.</p>
                            </div>

                            {task.deadline && (
                                <div className="flex items-center gap-3 bg-red-50 px-5 py-3 rounded-xl border border-red-100 text-red-700 text-sm font-medium shadow-sm">
                                    <div className="p-1.5 bg-red-100 rounded-lg">
                                        <Calendar size={18} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Due Date</p>
                                        <p className="font-semibold">{new Date(task.deadline).toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <FileText size={18} className="text-slate-400" />
                                <h2 className="font-semibold text-slate-800">Description</h2>
                            </div>
                            <div className="p-6">
                                <div className="text-slate-600 leading-7 whitespace-pre-wrap font-normal">
                                    {task.description || (
                                        <span className="italic text-slate-400">No description provided for this task.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submission Section */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Upload size={18} className="text-slate-400" />
                                <h2 className="font-semibold text-slate-800">Submit Your Work</h2>
                            </div>
                            <div className="p-6">
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50/50 transition-colors">
                                    <input
                                        type="file"
                                        id="task-submission"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="task-submission" className="cursor-pointer flex flex-col items-center">
                                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-slate-700 font-medium text-lg mb-1">
                                            {submissionFile ? submissionFile.name : "Click to upload your solution"}
                                        </span>
                                        <span className="text-slate-400 text-sm">
                                            {submissionFile ? "Click to change file" : "Supported formats: PDF, DOCX, ZIP"}
                                        </span>
                                    </label>
                                </div>

                                {submissionStatus && (
                                    <div className={`mt - 4 p - 4 rounded - xl flex items - center gap - 3 ${submissionStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'} `}>
                                        {submissionStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                        <span className="text-sm font-medium">{submissionMessage}</span>
                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap justify-end gap-3">
                                    {existingSubmission && existingSubmission.submissionFileUrl && (
                                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handlePreview(existingSubmission.submissionFileUrl, 'file')}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 font-medium flex items-center gap-2 transition-colors"
                                                title="View Submission"
                                            >
                                                <Eye size={18} /> View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(existingSubmission.submissionFileUrl, `Submission_${task.title}_${taskId} `)}
                                                className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 font-medium flex items-center gap-2 transition-colors"
                                                title="Download Submission"
                                            >
                                                <Download size={18} /> Download
                                            </button>
                                            <button
                                                onClick={handleDeleteSubmission}
                                                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 font-medium flex items-center gap-2 transition-colors"
                                                title="Delete Submission to Re-upload"
                                            >
                                                {isSubmitting ? <Loader size={18} className="animate-spin" /> : <Upload size={18} className="rotate-45" />} Replace
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleSubmitTask}
                                        disabled={!submissionFile || isSubmitting}
                                        className={`px - 6 py - 2.5 rounded - xl text - white font - medium shadow - lg shadow - indigo - 500 / 20 flex items - center gap - 2 transition - all ${!submissionFile || isSubmitting
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
                                            } `}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader size={18} className="animate-spin" /> Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} /> {existingSubmission ? 'Resubmit Task' : 'Submit Task'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Resources Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <LinkIcon size={18} className="text-slate-400" />
                                    <h2 className="font-semibold text-slate-800">Resources</h2>
                                </div>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    {[task.taskFileUrl, task.videoUrl, task.urlFileUrl].filter(Boolean).length} items
                                </span>
                            </div>
                            <div className="p-4 space-y-3">
                                {task.taskFileUrl && (
                                    <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all duration-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 truncate text-sm">Task Document</p>
                                                <p className="text-xs text-slate-500">PDF/Doc Resource</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handlePreview(task.taskFileUrl, 'file')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors" title="Preview">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleDownload(task.taskFileUrl, 'task-file')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors" title="Download">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {task.videoUrl && (
                                    <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                                                <Video size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 truncate text-sm">Task Video</p>
                                                <p className="text-xs text-slate-500">Video Tutorial</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handlePreview(task.videoUrl, 'video')} className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5">
                                                <Eye size={14} />
                                                Watch
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {task.urlFileUrl && (
                                    <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 border border-transparent hover:border-purple-100 transition-all duration-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                                                <LinkIcon size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 truncate text-sm">External Link</p>
                                                <p className="text-xs text-slate-500">Resource URL</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <a
                                                href={task.urlFileUrl?.startsWith('http') ? task.urlFileUrl : `https://${task.urlFileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-white rounded-lg transition-colors"
                                                title="Open Link"
                                            >
                                                <LinkIcon size={16} />
                                            </a >
                                        </div >
                                    </div >
                                )}

                                {
                                    !task.taskFileUrl && !task.videoUrl && !task.urlFileUrl && (
                                        <div className="py-8 text-center">
                                            <div className="inline-flex p-3 bg-slate-50 rounded-full mb-3">
                                                <FileText size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">No resources attached</p>
                                            <p className="text-xs text-slate-400 mt-1">This task has no files or links.</p>
                                        </div>
                                    )
                                }
                            </div >
                        </div >

                        {/* Status/Info Card */}
                        < div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4" >
                            <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-4">Task Info</h3>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Task ID</span>
                                <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">#{taskId}</span>
                            </div>
                            <div className="w-full h-px bg-slate-100"></div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className="flex items-center gap-1.5 text-emerald-600 font-medium px-2 py-0.5 bg-emerald-50 rounded-full text-xs">
                                    <CheckCircle size={12} />
                                    Active
                                </span>
                            </div>
                        </div >
                    </div >
                </div >
            </div >

            <FilePreviewModal
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, fileUrl: '', fileType: '' })}
                fileUrl={previewModal.fileUrl}
                fileType={previewModal.fileType}
            />
        </div >
    );
};

export default StudentViewTask;
