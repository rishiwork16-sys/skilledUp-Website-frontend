import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import studentService from '../services/student.service';
import { Users, Search, Eye, Ban } from 'lucide-react';

const StudentManagement = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        city: '',
        search: ''
    });

    useEffect(() => {
        loadStudents();
    }, [filters]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAllStudents(
                filters.status || null,
                filters.city || null,
                filters.search || null
            );
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            await studentService.updateStudentStatus(studentId, newStatus);
            alert('Status updated successfully!');
            loadStudents();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleBlockToggle = async (studentId) => {
        if (window.confirm('Are you sure you want to toggle block status?')) {
            try {
                await studentService.toggleBlockStudent(studentId);
                alert('Block status updated!');
                loadStudents();
            } catch (error) {
                alert('Failed to update block status');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Management</h1>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="DELAYED">Delayed</option>
                                <option value="TERMINATED">Terminated</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                placeholder="Filter by city..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8">No students found</td></tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{student.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.city || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                className="text-sm border rounded px-2 py-1"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="DELAYED">Delayed</option>
                                                <option value="TERMINATED">Terminated</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/students/${student.id}`)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View Profile"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockToggle(student.id)}
                                                    className={`${student.blocked ? 'text-red-600' : 'text-gray-600'} hover:text-red-800`}
                                                    title={student.blocked ? 'Unblock' : 'Block'}
                                                >
                                                    <Ban size={18} />
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
        </DashboardLayout>
    );
};

export default StudentManagement;
