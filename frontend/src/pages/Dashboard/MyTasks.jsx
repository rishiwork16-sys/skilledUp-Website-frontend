import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { getMyTasks } from '../../api/studentService';
import { CheckCircle, Circle, Clock, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTasks = () => {
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const loadTasks = async () => {
        try {
            const userId = user?.id || user?.userId;
            if (!userId) {
                console.error("User ID missing", user);
                setLoading(false);
                return;
            }
            const data = await getMyTasks(userId);
            setTasks(data || []);
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">My Tasks</h1>
                    <p className="text-slate-500">Complete these tasks to progress in your internship.</p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Tasks Assigned</h3>
                    <p className="text-slate-500">Your tasks will appear here once your program is fully initialized.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((taskSchedule, index) => (
                        <div key={taskSchedule.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">

                            <div className="flex-shrink-0">
                                {taskSchedule.submitted ? (
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <Circle size={24} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Task {index + 1}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${taskSchedule.submitted ? 'bg-emerald-50 text-emerald-600' :
                                        taskSchedule.unlocked ? 'bg-blue-50 text-blue-600' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                        {taskSchedule.submitted ? 'COMPLETED' : taskSchedule.unlocked ? 'IN PROGRESS' : 'LOCKED'}
                                    </span>
                                    {taskSchedule.task?.domain && (
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                            {taskSchedule.task.domain}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{taskSchedule.task?.title || "Untitled Task"}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2">{taskSchedule.task?.description}</p>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-3 min-w-[140px] w-full md:w-auto mt-4 md:mt-0">
                                {taskSchedule.deadline && (
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                        <Clock size={14} />
                                        <span>Due: {new Date(taskSchedule.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => !taskSchedule.unlocked ? null : navigate(`/dashboard/tasks/${taskSchedule.task.id}`)}
                                    disabled={!taskSchedule.unlocked}
                                    className={`px-5 py-2 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors ${!taskSchedule.unlocked
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}>
                                    {taskSchedule.unlocked ? 'View Details' : 'Locked'} {taskSchedule.unlocked && <ArrowRight size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
