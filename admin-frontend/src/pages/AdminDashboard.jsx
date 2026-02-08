import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import taskService from '../services/task.service';
import studentService from '../services/student.service';
import requestService from '../services/request.service';
import supportService from '../services/support.service';
import categoryService from '../services/category.service';
import { Plus, X, Users, BookOpen, AlertCircle, FileText, Edit, Trash2, TrendingUp, Clock, LogOut, MessageSquare, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [studentStats, setStudentStats] = useState(null);
    const [extensionRequests, setExtensionRequests] = useState([]);
    const [exitRequests, setExitRequests] = useState([]);
    const [supportCount, setSupportCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Task Creation/Edit State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        domain: '',
        weekNo: 1,
        taskFileUrl: '',
        videoUrl: '',
        autoReview: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [submissions, enrollmentsData, tasksData, stats, extensions, exits, openTickets, activeCats] = await Promise.all([
                taskService.getPendingSubmissions(),
                studentService.getAllEnrollments(),
                taskService.getAllTasks(),
                studentService.getStudentStatistics(),
                requestService.getPendingExtensions(),
                requestService.getPendingExits(),
                supportService.getOpenTicketsCount(),
                categoryService.getActiveCategories()
            ]);
            setPendingSubmissions(submissions);
            setEnrollments(enrollmentsData);
            setAllTasks(tasksData);
            setStudentStats(stats);
            setExtensionRequests(extensions);
            setExitRequests(exits);
            setSupportCount(openTickets);
            setCategories(activeCats);

            // Set default domain if categories exist and domain is empty
            if (activeCats && activeCats.length > 0) {
                setNewTask(prev => ({ ...prev, domain: activeCats[0].title }));
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status, score) => {
        try {
            await taskService.reviewSubmission(id, status, score);
            setPendingSubmissions(prev => prev.filter(sub => sub.id !== id));
            alert(`Submission ${status}!`);
        } catch (error) {
            alert("Review failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await taskService.createTask(newTask);
            alert('Task created successfully!');
            setShowModal(false);
            setNewTask({ title: '', description: '', domain: categories.length > 0 ? categories[0].title : '', weekNo: 1, taskFileUrl: '', videoUrl: '', autoReview: false });
            loadData(); // Refresh list
        } catch (error) {
            console.error("Task creation error:", error);
            alert("Failed to create task");
        }
    };

    const handleEditTask = (task) => {
        setIsEditing(true);
        setEditingTaskId(task.id);
        setNewTask({
            title: task.title,
            description: task.description,
            domain: task.domain,
            weekNo: task.weekNo,
            taskFileUrl: task.taskFileUrl || '',
            videoUrl: task.videoUrl || '',
            autoReview: task.autoReview || false
        });
        setShowModal(true);
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await taskService.updateTask(editingTaskId, newTask);
            alert('Task updated successfully!');
            setShowModal(false);
            setIsEditing(false);
            setEditingTaskId(null);
            setNewTask({ title: '', description: '', domain: categories.length > 0 ? categories[0].title : '', weekNo: 1, taskFileUrl: '', videoUrl: '', autoReview: false });
            loadData();
        } catch (error) {
            console.error("Task update error:", error);
            alert("Failed to update task");
        }
    };

    const handleDeleteTask = async (taskId, taskTitle) => {
        if (window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
            try {
                await taskService.deleteTask(taskId);
                alert('Task deleted successfully!');
                loadData(); // Refresh list
            } catch (error) {
                console.error("Task deletion error:", error);
                alert("Failed to delete task");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditingTaskId(null);
        setNewTask({ title: '', description: '', domain: categories.length > 0 ? categories[0].title : '', weekNo: 1, taskFileUrl: '', videoUrl: '', autoReview: false });
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`} style={{ color }}>
                {icon}
            </div>
            <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl shadow-md bg-gradient-to-br`} style={{ backgroundImage: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
                    <div style={{ color }}>{icon}</div>
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time statistics and management control.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/programs')}
                        className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all font-medium whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Create Internship
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Active Students" value={studentStats?.activeStudents || 0} icon={<Users size={32} />} color="#4F46E5" />
                <StatCard title="Completed" value={studentStats?.completedStudents || 0} icon={<CheckCircle size={32} />} color="#10B981" />
                <StatCard title="Support Tickets" value={supportCount} icon={<MessageSquare size={32} />} color="#EC4899" />
                <StatCard title="Pending Reviews" value={pendingSubmissions.length} icon={<FileText size={32} />} color="#F59E0B" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Ext. Requests" value={extensionRequests.length} icon={<Clock size={32} />} color="#8B5CF6" />
                <StatCard title="Exit Requests" value={exitRequests.length} icon={<LogOut size={32} />} color="#EF4444" />
                <StatCard title="Active Tasks" value={allTasks.length} icon={<BookOpen size={32} />} color="#3B82F6" />
                <StatCard title="Total Students" value={studentStats?.totalStudents || 0} icon={<TrendingUp size={32} />} color="#6366F1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Grading Queue */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            Pending Submissions
                        </h2>
                        {pendingSubmissions.length > 0 && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full animate-pulse">
                                {pendingSubmissions.length} New
                            </span>
                        )}
                    </div>

                    <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                        {loading && <div className="text-center py-8 text-slate-400">Loading submissions...</div>}
                        {!loading && pendingSubmissions.length === 0 && (
                            <div className="text-center py-12 flex flex-col items-center">
                                <FileText className="w-12 h-12 text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium">All caught up! No pending reviews.</p>
                            </div>
                        )}
                        {pendingSubmissions.map((sub) => (
                            <div key={sub.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-slate-800">Student #{sub.studentId}</span>
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">ID: {sub.id}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{sub.task?.title || "Unknown Task"}</p>
                                    {sub.submissionFileUrl && (
                                        <a href={sub.submissionFileUrl} target="_blank" rel="noopener noreferrer"
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1">
                                            View Submission &rarr;
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={() => handleReview(sub.id, "APPROVED", 100)} className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors text-center">
                                        Approve
                                    </button>
                                    <button onClick={() => handleReview(sub.id, "REJECTED", 0)} className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors admin-reject-btn text-center">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Enrollments */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Recent Enrollments
                        </h2>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Domain</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {enrollments.length === 0 ? (
                                    <tr><td colSpan="4" className="py-12 text-center text-slate-400">No recent enrollments.</td></tr>
                                ) : (
                                    enrollments.map((enr) => (
                                        <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{enr.student?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                                                    {enr.internshipType?.title}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${enr.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {enr.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">{enr.startDate ? new Date(enr.startDate).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* System Tasks Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        System Task Library
                    </h2>
                    <span className="text-sm text-slate-500 font-medium">Total: {allTasks.length} Tasks</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Task Title</th>
                                <th className="px-6 py-4">Domain</th>
                                <th className="px-6 py-4 text-center">Week</th>
                                <th className="px-6 py-4">Created Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {allTasks.length === 0 ? (
                                <tr><td colSpan="5" className="py-12 text-center text-slate-400">No tasks found. Create one to get started.</td></tr>
                            ) : (
                                allTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                                                {task.domain}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mx-auto">
                                                {task.weekNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-mono">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditTask(task)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteTask(task.id, task.title)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Assignment' : 'New Assignment'}</h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 border border-slate-200 hover:border-slate-300">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={isEditing ? handleUpdateTask : handleCreateTask} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Task Title</label>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                        placeholder="e.g. Build a REST API"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Description</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] text-slate-800 placeholder:text-slate-400"
                                        placeholder="Detailed instructions..."
                                        rows="3"
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Week No</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                            value={newTask.weekNo}
                                            onChange={e => setNewTask({ ...newTask, weekNo: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Domain</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white font-medium text-slate-700"
                                            value={newTask.domain}
                                            onChange={e => setNewTask({ ...newTask, domain: e.target.value })}
                                        >
                                            {categories.length === 0 ? (
                                                <option value="" disabled>No programs available</option>
                                            ) : (
                                                categories.map((cat) => (
                                                    <option key={cat.id} value={cat.title}>
                                                        {cat.title}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Document URL (PDF/Docs)</label>
                                    <input
                                        type="url"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                        value={newTask.taskFileUrl}
                                        onChange={e => setNewTask({ ...newTask, taskFileUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Video Resource URL</label>
                                    <input
                                        type="url"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                        value={newTask.videoUrl || ''}
                                        onChange={e => setNewTask({ ...newTask, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <input
                                        type="checkbox"
                                        id="autoReview"
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        checked={newTask.autoReview || false}
                                        onChange={e => setNewTask({ ...newTask, autoReview: e.target.checked })}
                                    />
                                    <div className="flex flex-col">
                                        <label htmlFor="autoReview" className="text-sm font-semibold text-slate-700 cursor-pointer">Auto-Review Submissions</label>
                                        <span className="text-xs text-slate-500">If enabled, student submissions will be automatically approved with 100% score.</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-[0.98]"
                                    >
                                        {isEditing ? 'Save Changes' : 'Publish Assignment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
