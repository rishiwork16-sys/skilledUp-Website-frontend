import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Plus, Search, FileText, ExternalLink, Trash2, Edit, X, Check } from 'lucide-react';
import api from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';

const CareersManagement = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [newJob, setNewJob] = useState({
        title: '',
        location: 'Noida',
        type: 'Full-time',
        experience: 'Fresher',
        salary: 'Not Disclosed',
        description: '',
        requirements: '',
        active: true
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'jobs') {
                const response = await api.get('/careers/admin/jobs');
                setJobs(response.data);
            } else {
                const response = await api.get('/careers/admin/applications');
                setApplications(response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/careers/admin/jobs', newJob);
            setShowCreateModal(false);
            fetchData();
            // Reset form
            setNewJob({
                title: '',
                location: 'Noida',
                type: 'Full-time',
                experience: 'Fresher',
                salary: 'Not Disclosed',
                description: '',
                requirements: '',
                active: true
            });
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Failed to create job");
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await api.delete(`/careers/admin/jobs/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleViewResume = async (applicationId) => {
        try {
            const response = await api.get(`/careers/admin/applications/${applicationId}/resume`);
            const url = response.data.url;
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error fetching resume URL:", error);
            alert("Could not load resume. Please try again.");
        }
    };

    // Filter Logic
    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApplications = applications.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.job?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Careers Management</h1>
                        <p className="text-slate-500 mt-1">Manage job postings and applications</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Post New Job
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'jobs' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <div className="flex items-center gap-2">
                            <Briefcase size={18} />
                            Jobs
                        </div>
                        {activeTab === 'jobs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'applications' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            Applications
                        </div>
                        {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search applications..."}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Loading...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {activeTab === 'jobs' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Location</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Experience</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredJobs.length === 0 ? (
                                            <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No jobs found</td></tr>
                                        ) : (
                                            filteredJobs.map(job => (
                                                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                                                    <td className="px-6 py-4 text-slate-600">{job.location}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
                                                            {job.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{job.experience}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                            {job.active ? 'Active' : 'Closed'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Job"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Applicant</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Job Title</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Applied Date</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Resume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplications.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No applications found</td></tr>
                                        ) : (
                                            filteredApplications.map(app => (
                                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">{app.fullName}</div>
                                                        <div className="text-xs text-slate-500">{app.currentCompany}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{app.jobTitle}</td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        <div>{app.email}</div>
                                                        <div className="text-xs">{app.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {new Date(app.appliedDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleViewResume(app.id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                                                        >
                                                            <FileText size={16} />
                                                            View Resume
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Job Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">Post New Job</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateJob} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newJob.title}
                                        onChange={e => setNewJob({...newJob, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newJob.location}
                                        onChange={e => setNewJob({...newJob, location: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newJob.type}
                                        onChange={e => setNewJob({...newJob, type: e.target.value})}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newJob.experience}
                                        onChange={e => setNewJob({...newJob, experience: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newJob.salary}
                                        onChange={e => setNewJob({...newJob, salary: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows="4"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newJob.description}
                                    onChange={e => setNewJob({...newJob, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Requirements</label>
                                <textarea 
                                    rows="4"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newJob.requirements}
                                    onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Post Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CareersManagement;
