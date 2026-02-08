import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import enquiryService from '../services/enquiry.service';
import { MessageSquare, RefreshCw } from 'lucide-react';

const EnquiryManagement = () => {
    const [loading, setLoading] = useState(true);
    const [enquiries, setEnquiries] = useState([]);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const loadEnquiries = async () => {
        setLoading(true);
        try {
            const data = await enquiryService.getAllEnquiries();
            setEnquiries(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Failed to load enquiries', e);
            alert('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnquiries();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return enquiries.filter((e) => {
            if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
            if (!q) return true;
            return (
                (e.fullName || '').toLowerCase().includes(q) ||
                (e.email || '').toLowerCase().includes(q) ||
                (e.mobileNumber || '').toLowerCase().includes(q) ||
                (e.city || '').toLowerCase().includes(q) ||
                (e.stateName || '').toLowerCase().includes(q) ||
                (e.courseTitle || '').toLowerCase().includes(q) ||
                String(e.courseId || '').includes(q)
            );
        });
    }, [enquiries, query, statusFilter]);

    const updateStatus = async (id, status) => {
        try {
            await enquiryService.updateEnquiry(id, { status });
            setEnquiries((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
        } catch (e) {
            console.error('Failed to update enquiry', e);
            alert('Failed to update enquiry');
        }
    };

    const addNote = async (id) => {
        const note = window.prompt('Add admin note:');
        if (note === null) return;
        try {
            const updated = await enquiryService.updateEnquiry(id, { adminNotes: note });
            setEnquiries((prev) => prev.map((x) => (x.id === id ? updated : x)));
        } catch (e) {
            console.error('Failed to update note', e);
            alert('Failed to update note');
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <MessageSquare size={22} />
                            Enquiries
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Know More form submissions from students.</p>
                    </div>
                    <button
                        onClick={loadEnquiries}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                <div className="mt-5 flex flex-col md:flex-row gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, email, phone, city, program..."
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-56 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Program</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Background</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-5 py-10 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-5 py-10 text-center text-gray-500">No enquiries found</td>
                                </tr>
                            ) : (
                                filtered.map((e) => (
                                    <tr key={e.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">{e.fullName}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">{e.email}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">{e.mobileNumber}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">{e.city}</td>
                                        <td className="px-5 py-4">
                                            <div className="text-gray-800 font-medium">{e.courseTitle || `Course #${e.courseId || 'N/A'}`}</div>
                                            {e.pagePath ? <div className="text-xs text-gray-500 break-all">{e.pagePath}</div> : null}
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">{e.backgroundName}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">{e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <select
                                                value={e.status}
                                                onChange={(ev) => updateStatus(e.id, ev.target.value)}
                                                className="border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            >
                                                <option value="NEW">NEW</option>
                                                <option value="CONTACTED">CONTACTED</option>
                                                <option value="CLOSED">CLOSED</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => addNote(e.id)}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                            >
                                                Note
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EnquiryManagement;

