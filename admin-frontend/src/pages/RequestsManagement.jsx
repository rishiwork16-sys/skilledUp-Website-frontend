import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import requestService from '../services/request.service';
import { Clock, LogOut, CheckCircle, XCircle } from 'lucide-react';

const RequestsManagement = () => {
    const [activeTab, setActiveTab] = useState('extensions');
    const [extensions, setExtensions] = useState([]);
    const [exits, setExits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setLoading(true);
            try {
                const extensionsData = await requestService.getPendingExtensions();
                setExtensions(extensionsData);
            } catch (e) { console.error("Ext error", e); }

            try {
                // Keep exits call but handle fail separately
                const exitsData = []; // await requestService.getAllExits(); // Placeholder if exit service not ready
                setExits(exitsData);
            } catch (e) { console.error("Exit error", e); }
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewExtension = async (id, approved) => {
        if (!window.confirm(`Are you sure you want to ${approved ? 'approve' : 'reject'} this request?`)) return;

        try {
            await requestService.reviewExtension(id, approved);
            alert(`Extension request ${approved ? 'approved' : 'rejected'}!`);
            loadRequests();
        } catch (error) {
            console.error(error);
            alert('Failed to review request');
        }
    };

    const handleReviewExit = async (id, approved) => {
        const response = prompt(`Enter admin response for ${approved ? 'approval' : 'rejection'}:`);
        if (!response) return;

        try {
            await requestService.reviewExit(id, approved, response);
            alert(`Exit request ${approved ? 'approved' : 'rejected'}!`);
            loadRequests();
        } catch (error) {
            alert('Failed to review request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Requests Management</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('extensions')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${activeTab === 'extensions'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <Clock size={20} />
                        Extension Requests ({extensions.filter(e => e.status === 'PENDING').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('exits')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${activeTab === 'exits'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <LogOut size={20} />
                        Exit Requests ({exits.filter(e => e.status === 'PENDING').length})
                    </button>
                </div>

                {/* Extension Requests */}
                {activeTab === 'extensions' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Days</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                                ) : extensions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">No extension requests</td></tr>
                                ) : (
                                    extensions.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{req.studentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{req.taskId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm bg-blue-50 text-blue-800 rounded-lg">
                                                +{req.requestedDays} Days
                                            </td>
                                            <td className="px-6 py-4 text-sm max-w-xs">{req.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {req.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleReviewExtension(req.id, true)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewExtension(req.id, false)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Exit Requests */}
                {activeTab === 'exits' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                                ) : exits.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-8 text-gray-500">No exit requests</td></tr>
                                ) : (
                                    exits.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{req.studentId}</td>
                                            <td className="px-6 py-4 text-sm max-w-md">{req.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {req.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleReviewExit(req.id, true)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewExit(req.id, false)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RequestsManagement;
