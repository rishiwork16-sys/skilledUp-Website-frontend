import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const DataAnalyticsPage = () => {
  const [analyticsCourses, setAnalyticsCourses] = useState([
    {
      id: 1,
      category: "Data Analytics",
      mode: "Online/Offline",
      title: "Career Accelerator: Data Analytics & GenAI",
      reviewsCount: 4321,
      rating: 4.7,
      duration: "6 Months",
      price: "₹25,000",
      image: "/images/Career Accelerator_ Data Analytics & GenAI.png",
      description: "Data Analytics Online/Offline",
      url: "/courses/career-accelerator-data-analytics-genai", // ✅ already correct
      skills: ["SQL", "Python", "Power BI", "GenAI", "Statistics"],
      badge: "BESTSELLER",
      badgeColor: "from-blue-500 to-cyan-600",
    },
    {
      id: 2,
      category: "Data Analytics",
      mode: "Online/Offline",
      title: "Career Boost: Data Analytics & GenAI",
      reviewsCount: 2890,
      rating: 4.6,
      duration: "4 Months",
      price: "₹15,000",
      image: "/images/Career Boost_ Data Analytics & GenAI.png",
      description: "Data Analytics Online/Offline",
      url: "/courses/career-boost-data-analytics-genai", // ✅ FIXED
      skills: ["Excel", "SQL", "Power BI", "GenAI", "Dashboard"],
      placement: "Certificate",
      badge: "BESTSELLER",
      badgeColor: "from-purple-500 to-indigo-600",
    },
  ]);

  const staticCourses = [
    { id: 1, slug: "career-accelerator-data-analytics-genai" },
    { id: 2, slug: "career-boost-data-analytics-genai" }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses");
      const backendCourses = response.data
        .filter(c => c.category === "Data Analytics")
        .map(course => ({
          id: course.id,
          category: course.category,
          mode: course.mode || "Online",
          title: course.title,
          reviewsCount: Math.floor(Math.random() * 500) + 50,
          rating: 4.5 + (Math.random() * 0.5),
          duration: course.duration || "6 Months",
          price: `₹${course.price.toLocaleString('en-IN')}`,
          image: course.thumbnailUrl || "/images/course-placeholder.png",
          description: course.description || course.title,
          url: `/courses/data-analytics/${course.slug}`,
          badge: "NEW",
          badgeColor: "from-green-500 to-teal-600"
        }));

      // Merge backend courses ensuring no duplicates by slug
      setAnalyticsCourses(prev => {
        const existingSlugs = new Set(staticCourses.map(s => s.slug));
        const filteredBackend = backendCourses.filter(b => !existingSlugs.has(b.url.split('/').pop()));
        return [...filteredBackend, ...prev];
      });
    } catch (error) {
      console.error("Error fetching analytics courses:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Courses Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-blue-600">Career Path</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {analyticsCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200"
            >
              {/* Course Image with Badge - Now Clickable */}
              <div className="relative h-48">
                <Link to={course.url} className="block h-full">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className={`absolute top-3 left-3 px-2 py-1 bg-gradient-to-r ${course.badgeColor} text-white text-xs font-bold rounded-full`}>
                  {course.badge}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">{course.duration}</span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-gray-900 text-sm">{course.rating}</span>
                    <span className="text-gray-500 text-xs ml-1">/5</span>
                    <span className="text-gray-400 text-xs ml-2">({course.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                  {course.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{course.price}</span>
                    <span className="text-xs text-gray-500 block mt-1">Total Fees • {course.placement || 'Certificate'}</span>
                  </div>

                  <Link
                    to={course.url}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 text-sm flex items-center"
                  >
                    View Details
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Course Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{course.placement || 'Certificate'} Included</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    Hands-on
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataAnalyticsPage;