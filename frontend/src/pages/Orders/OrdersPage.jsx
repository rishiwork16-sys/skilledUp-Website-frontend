import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getMyEnrollments } from "../../api/studentService";
import api from "../../api/api";
import { useUser } from "../../context/UserContext";

const OrdersPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internshipOrders, setInternshipOrders] = useState([]);
  const [courseOrders, setCourseOrders] = useState([]);

  // Safe date formatter
  const formatDate = (dateString) => {
    try {
      if (!dateString) return new Date().toISOString().split('T')[0];
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
      return date.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  };

  // Fetch Internships
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Robust ID check
        let storedUser = null;
        try {
          const keys = ['skilledup_current_user', 'user', 'skilledup_student', 'student', 'userData'];
          for (const k of keys) {
            const v = localStorage.getItem(k);
            if (v) { storedUser = JSON.parse(v); break; }
          }
        } catch (e) {}
        let userId = user?.id || user?.userId || user?.studentId || user?.backendData?.id || user?.backendData?.userId || storedUser?.id || storedUser?.userId;
        const userPhone = user?.phone || user?.mobile || user?.backendData?.phone || user?.backendData?.mobile || storedUser?.phone || storedUser?.mobile;
        const userEmail = user?.email || user?.backendData?.email || storedUser?.email;

        console.log("OrdersPage: Fetching orders for userId:", userId, "phone:", userPhone);

        if (!userId && userPhone) {
          try {
            const profileRes = await api.get('/api/students/profile-by-phone', { params: { phone: userPhone } });
            userId = profileRes?.data?.userId || userId;
          } catch (e) { console.warn("OrdersPage: profile-by-phone fallback failed", e); }
        }

        if (!userId && userEmail) {
          try {
            const res = await api.get('/api/auth/user', { params: { email: userEmail } });
            userId = res?.data?.id || res?.data?.userId || userId;
          } catch (e) { console.warn("OrdersPage: auth user by email fallback failed", e); }
        }

        if (!userId && !userPhone) {
          console.warn("OrdersPage: User not fully identified yet.");
          setLoading(false);
          return;
        }

        // --- Fetch Internships ---
        let internshipData = [];
        if (userId) {
          try {
            const res = await getMyEnrollments(userId);
            internshipData = Array.isArray(res) ? res : (res?.data || []);
          } catch (err) { console.error("Error fetching internships by ID:", err); }
        }

        // Fallback to phone if no ID-based results found
        if ((!internshipData || internshipData.length === 0) && userPhone) {
          try {
            const res = await api.get('/api/students/my-enrollments-by-phone', { params: { phone: userPhone } });
            internshipData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          } catch (err) { console.error("Error fetching internships by phone:", err); }
        }

        const mappedInternships = (Array.isArray(internshipData) ? internshipData : []).map(internship => ({
          id: `INT-${internship.id}`,
          date: formatDate(internship.enrolledAt || internship.createdAt),
          courseName: `Internship in ${internship.internshipCategory?.title || 'Unknown'}`,
          courseImage: internship.internshipCategory?.coverImage || "/images/courses/mock-internship.jpg",
          instructor: "SkilledUp Mentors",
          price: 0,
          status: internship.status === 'COMPLETED' ? 'completed' : 'in-progress',
          progress: internship.progress || 0,
          category: "Internship",
          rating: 5.0,
          sessions: 0,
          duration: internship.duration ? `${internship.duration} Weeks` : "Flexible",
          nextSession: null,
          certificateIssued: internship.status === 'COMPLETED',
          certificateId: null,
          isInternship: true,
          raw: internship
        }));
        setInternshipOrders(mappedInternships);

        // --- Fetch Course Orders ---
        let mappedCourses = [];
        if (userId) {
          try {
            // Use api.get directly to avoid ambiguity if service is missing
            const paymentsRes = await api.get(`/api/payments/user/${userId}`);
            const paidOrders = paymentsRes.data || [];

            if (paidOrders.length > 0) {
              const coursesRes = await api.get('/api/courses');
              const allCourses = coursesRes.data || [];

              mappedCourses = paidOrders
                .filter(order => allCourses.some(c => c.id == order.courseId))
                .map(order => {
                const course = allCourses.find(c => c.id == order.courseId);
                return {
                  id: `ORD-${order.orderId || order.id}`,
                  date: formatDate(order.createdAt),
                  courseName: course ? course.title : "Unknown Course",
                  courseImage: course?.thumbnailUrl || "/images/course-placeholder.png",
                  instructor: "SkilledUp Instructor",
                  price: order.amount || 0,
                  status: 'in-progress',
                  progress: 0,
                  category: course?.category || "General",
                  rating: 4.5,
                  sessions: course?.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0,
                  duration: course?.duration || "Self-paced",
                  nextSession: null,
                  certificateIssued: false,
                  certificateId: null,
                  isInternship: false,
                  courseId: order.courseId
                };
              });
            }
          } catch (e) {
            console.error("Error fetching course orders:", e);
          }
        }
        setCourseOrders(mappedCourses);

      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.phone, userLoading]);

  const orders = [...internshipOrders, ...courseOrders];

  // Filter orders based on active tab and search
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(order => {
        if (activeTab === "completed") return order.status === "completed";
        if (activeTab === "in-progress") return order.status === "in-progress";
        if (activeTab === "upcoming") return order.status === "upcoming";
        return true;
      });
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.courseName.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.category.toLowerCase().includes(term) ||
        order.instructor.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchTerm, internshipOrders, courseOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      "completed": { color: "bg-green-100 text-green-800", text: "Completed" },
      "in-progress": { color: "bg-blue-100 text-blue-800", text: "In Progress" },
      "upcoming": { color: "bg-yellow-100 text-yellow-800", text: "Upcoming" }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config[status]?.color || "bg-gray-100 text-gray-800"}`}>
        {config[status]?.text || status}
      </span>
    );
  };

  // Course category badge
  const CategoryBadge = ({ category }) => {
    const colors = {
      "Data Science": "bg-purple-100 text-purple-800",
      "Web Development": "bg-indigo-100 text-indigo-800",
      "Marketing": "bg-pink-100 text-pink-800",
      "Data Analytics": "bg-blue-100 text-blue-800",
      "Programming": "bg-amber-100 text-amber-800",
      "Design": "bg-rose-100 text-rose-800",
      "Business": "bg-emerald-100 text-emerald-800",
      "AI/ML": "bg-cyan-100 text-cyan-800",
      "Internship": "bg-teal-100 text-teal-800"
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[category] || "bg-gray-100 text-gray-800"}`}>
        {category}
      </span>
    );
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    inProgress: orders.filter(o => o.status === "in-progress").length,
    upcoming: orders.filter(o => o.status === "upcoming").length,
    totalSpent: orders.reduce((sum, order) => sum + order.price, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage all your course purchases</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/courses"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("in-progress")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "in-progress" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "completed" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Completed ({stats.completed})
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "upcoming" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Upcoming ({stats.upcoming})
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by course name, ID, instructor..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Course Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={order.status} />
                        <CategoryBadge category={order.category} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.courseName}</h3>
                      <p className="text-sm text-gray-600">by {order.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Course Progress</span>
                      <span className="font-medium">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${order.status === "completed" ? "bg-green-500" : order.status === "in-progress" ? "bg-blue-500" : "bg-yellow-500"}`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{order.sessions} sessions • {order.duration}</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {order.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Assignments</p>
                      <p className="font-medium">{order.assignmentsCompleted}/{order.totalAssignments} completed</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-medium">{order.duration}</p>
                    </div>
                  </div>

                  {/* Next Session */}
                  {order.nextSession && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Next Session</p>
                          <p className="text-sm text-gray-700">{order.nextSession}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Status */}
                  {order.certificateIssued ? (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Certificate Issued</p>
                            <p className="text-xs text-gray-700">ID: {order.certificateId}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">Complete course to get certificate</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status === "in-progress" && (
                      <>
                        <Link
                          to={order.isInternship ? `/dashboard` : `/course-dashboard/${order.courseId}`}
                          className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        >
                          {order.isInternship ? "Go to Dashboard" : "Start Learning"}
                        </Link>
                        {!order.isInternship && (
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Schedule
                          </button>
                        )}
                        {order.isInternship && (
                          <Link to="/dashboard/tasks" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Tasks
                          </Link>
                        )}
                      </>
                    )}

                    {order.status === "upcoming" && (
                      <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                        {order.isInternship ? "Application Pending" : "Start Course"}
                      </button>
                    )}

                    {order.status === "completed" && (
                      <>
                        {!order.isInternship && (
                          <Link
                            to={`/course-review/${order.id}`}
                            className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                          >
                            Leave Review
                          </Link>
                        )}
                        {order.isInternship && (
                          <Link
                            to="/dashboard"
                            className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                          >
                            View Dashboard
                          </Link>
                        )}
                        <Link
                          to={order.isInternship ? `/dashboard` : `/certificate/${order.certificateId}`}
                          className="flex-1 py-2 border border-green-600 text-green-600 text-center rounded-lg font-medium hover:bg-green-50 transition-all duration-200"
                        >
                          View Certificate
                        </Link>
                      </>
                    )}

                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Learning Summary</h4>
                <p className="text-gray-600">
                  You're making great progress! {stats.inProgress} course{stats.inProgress !== 1 ? 's' : ''} in progress
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                  <p className="text-sm text-gray-600">Active Learning</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Enrolled</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Need help with your orders?</h4>
              <p className="text-gray-600">Our support team is here to assist you 24/7</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/contact"
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Contact Support
              </Link>
              <Link
                to="/faqs"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
