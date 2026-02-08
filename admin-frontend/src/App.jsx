import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

// Admin Pages
import StudentManagement from './pages/StudentManagement';
import StudentProfile from './pages/StudentProfile';
import ProgramsManagement from './pages/ProgramsManagement';
import RequestsManagement from './pages/RequestsManagement';
import SupportTickets from './pages/SupportTickets';
import EnquiryManagement from './pages/EnquiryManagement';
import CareersManagement from './pages/Careers/CareersManagement';
import CreateTask from './pages/CreateTask';
import ProgramTasks from './pages/ProgramTasks';
import ViewTask from './pages/ViewTask';
import EditTask from './pages/EditTask';

// Course Pages
import CourseList from './pages/Courses/CourseList';
import CourseCreate from './pages/Courses/CourseCreate';
import CourseEdit from './pages/Courses/CourseEdit';
import CourseContent from './pages/Courses/CourseContent';
import CategoryManagement from './pages/Courses/CategoryManagement';

const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/admin/login" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/admin/login" />} />
                    <Route path="/login" element={<Navigate to="/admin/login" />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/admin/*" element={
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <Routes>
                                <Route path="students" element={<StudentManagement />} />
                                <Route path="students/:id" element={<StudentProfile />} />
                                <Route path="programs" element={<ProgramsManagement />} />
                                <Route path="programs/:categoryId" element={<ProgramTasks />} />
                                <Route path="programs/:categoryId/create-task" element={<CreateTask />} />
                                <Route path="programs/:categoryId/tasks/:taskId/view" element={<ViewTask />} />
                                <Route path="programs/:categoryId/tasks/:taskId/edit" element={<EditTask />} />

                                {/* Course Management Routes */}
                                <Route path="courses" element={<CourseList />} />
                                <Route path="courses/categories" element={<CategoryManagement />} />
                                <Route path="courses/create" element={<CourseCreate />} />
                                <Route path="courses/:courseId/edit" element={<CourseEdit />} />
                                <Route path="courses/:courseId/content" element={<CourseContent />} />

                                <Route path="requests" element={<RequestsManagement />} />
                                <Route path="enquiries" element={<EnquiryManagement />} />
                                <Route path="careers" element={<CareersManagement />} />
                                <Route path="support" element={<SupportTickets />} />
                            </Routes>
                        </PrivateRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/admin/login" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
