import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const AllCoursesPage = () => {
  const [categories, setCategories] = useState([
    {
      title: "Data Analytics",
      description:
        "Master SQL, Power BI, Excel and real-world data analytics skills.",
      path: "/courses/data-analytics", // ✅ DIRECT CATEGORY PAGE
      courseCount: 2,
      gradient: "from-blue-500 to-indigo-600",
      icon: "📊",
    },
    {
      title: "Data Science & AI",
      description:
        "Learn Machine Learning, AI, GenAI and advanced data science.",
      path: "/courses/data-science-ai", // ✅ DIRECT CATEGORY PAGE
      courseCount: 2,
      gradient: "from-purple-500 to-pink-600",
      icon: "🤖",
    },
  ]);

  useEffect(() => {
    fetchCourseCounts();
  }, []);

  const fetchCourseCounts = async () => {
    try {
      const response = await api.get("/api/courses");
      const allCourses = response.data;

      setCategories(prev => prev.map(cat => {
        const backendCount = allCourses.filter(c => c.category === cat.title).length;
        // Static count is 2 for each, so we add backend count
        return {
          ...cat,
          courseCount: 2 + backendCount
        };
      }));
    } catch (error) {
      console.error("Error fetching course counts:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          Explore Our Courses
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose a learning path designed to build real-world, job-ready skills.
        </p>
      </div>

      {/* ================= CATEGORY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <Link
            key={category.title}
            to={category.path}
            className="group relative block rounded-3xl overflow-hidden transition-transform duration-300 hover:-translate-y-2"
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-90`}
            />

            {/* Glow Effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} blur-xl opacity-0 group-hover:opacity-40 transition duration-300`}
            />

            {/* Content */}
            <div className="relative bg-white/90 backdrop-blur rounded-3xl p-8 md:p-10 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl">{category.icon}</div>
                <span className="text-sm font-semibold px-4 py-1 rounded-full bg-gray-100 text-gray-700">
                  {category.courseCount} Courses
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {category.title}
              </h2>

              <p className="text-gray-600 mb-8">
                {category.description}
              </p>

              <div className="inline-flex items-center gap-2 font-semibold text-blue-600 group-hover:text-indigo-600 transition">
                Explore Courses
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCoursesPage;
