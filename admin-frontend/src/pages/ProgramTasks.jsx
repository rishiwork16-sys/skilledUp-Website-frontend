
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Trash2,
    Eye,
    Edit2
} from 'lucide-react';
import categoryService from '../services/category.service';
import taskService from '../services/task.service';

const ProgramTasks = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [categoryId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch category details to match domain
            const categories = await categoryService.getActiveCategories();
            const currentCat = categories.find(c => c.id.toString() === categoryId);
            setCategory(currentCat);

            if (currentCat) {
                // Fetch all tasks and filter
                const allTasks = await taskService.getAllTasks();
                const filteredTasks = allTasks.filter(t => t.domain === currentCat.title);

                // Transform to match UI expectation if keys differ
                const transformedTasks = filteredTasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    week: `Week ${t.weekNo}`,
                    type: 'Assignment', // Default for now, fetch if available
                    deadline: t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No Deadline',
                    status: t.active ? 'Published' : 'Draft',
                    submissions: 0, // Placeholder as we don't have submission stats yet
                    totalStudents: 0 // Placeholder
                }));

                setTasks(transformedTasks);
            }
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await taskService.deleteTask(taskId);
                // Reload data to reflect changes
                loadData();
            } catch (error) {
                console.error("Failed to delete task", error);
                alert("Failed to delete task");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Published': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-100';
            case 'Scheduled': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Assignment': return <FileText size={16} className="text-indigo-500" />;
            case 'Quiz': return <CheckCircle size={16} className="text-purple-500" />;
            case 'Project': return <Clock size={16} className="text-blue-500" />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/programs')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Programs
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                <span>Program Management</span>
                                <span>›</span>
                                <span>{category?.title || 'Program'}</span>
                                <span>›</span>
                                <span className="text-indigo-600 font-medium">Tasks & Curriculum</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800">Program Tasks</h1>
                            <p className="text-slate-500 mt-1">Manage curriculum, assignments, and quizzes for this program.</p>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/programs/${categoryId}/create-task`)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            <Plus size={20} /> Create New Task
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{tasks.length}</div>
                            <div className="text-sm text-slate-500 font-medium">Total Tasks</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">0%</div>
                            <div className="text-sm text-slate-500 font-medium">Avg. Completion</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">0</div>
                            <div className="text-sm text-slate-500 font-medium">Pending Review</div>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Filters */}
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                                <Filter size={16} /> Filter
                            </button>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                                <Calendar size={16} /> This Week
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Task Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                            {task.week.includes('Week') ? task.week.replace("Week ", "W") : 'T'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-800">{task.title}</div>
                                                            <div className="text-xs text-slate-500">{task.week}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        {getTypeIcon(task.type)}
                                                        {task.type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-slate-500 flex items-center gap-1.5"><AlertCircle size={14} className="text-rose-400" /> Due {task.deadline}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-2">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white"></div>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            {task.submissions}/{task.totalStudents}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/programs/${categoryId}/tasks/${task.id}/view`)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            title="View Task"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/admin/programs/${categoryId}/tasks/${task.id}/edit`)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Edit Task"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(task.id)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Delete Task"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                                No tasks found for this program. Create one to get started.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProgramTasks;
