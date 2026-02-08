import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const DataScienceAIPage = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      category: "Data Science & AI",
      mode: "Online / Offline",
      title: "CareerX: Data Science & GenAI",
      reviewsCount: 4321,
      rating: 4.7,
      duration: "9 Months",
      price: "₹1,00,000",
      image: "/images/CareerX_ Data Science & GenAI.png",
      description:
        "Flagship job-guarantee program covering Data Science, Machine Learning & Generative AI.",
      url: "/courses/careerx-data-science-genai",
      skills: ["Python", "SQL", "ML", "GenAI", "Statistics"],
      badge: "FLAGSHIP",
      badgeColor: "from-blue-600 to-indigo-600",
    },
    {
      id: 2,
      category: "Data Science & AI",
      mode: "Online / Offline",
      title: "Career Accelerator: Data Science & GenAI",
      reviewsCount: 2890,
      rating: 4.6,
      duration: "9 Months",
      price: "₹50,000",
      image: "/images/Career Accelerator_ Data Science & GenAI.png",
      description:
        "Accelerated program focused on ML, Deep Learning & real-world AI projects.",
      url: "/courses/career-accelerator-data-science-genai",
      skills: ["Python", "ML", "Deep Learning", "AI", "Projects"],
      badge: "POPULAR",
      badgeColor: "from-purple-500 to-pink-600",
    },
  ]);

  const staticCourses = [
    { id: 1, slug: "careerx-data-science-genai" },
    { id: 2, slug: "career-accelerator-data-science-genai" }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses");
      const backendCourses = response.data
        .filter(c => c.category === "Data Science & AI")
        .map(course => ({
          id: course.id,
          category: course.category,
          mode: course.mode || "Online / Offline",
          title: course.title,
          reviewsCount: Math.floor(Math.random() * 500) + 50,
          rating: 4.5 + (Math.random() * 0.5),
          duration: course.duration || "9 Months",
          price: `₹${course.price.toLocaleString('en-IN')}`,
          image: course.thumbnailUrl || "/images/course-placeholder.png",
          description: course.description || course.title,
          url: `/courses/data-science-ai/${course.slug}`,
          skills: ["Python", "ML", "AI", "GenAI"],
          badge: "NEW",
          badgeColor: "from-green-500 to-teal-600"
        }));

      // Merge backend courses ensuring no duplicates by slug
      setCourses(prev => {
        const existingSlugs = new Set(staticCourses.map(s => s.slug));
        const filteredBackend = backendCourses.filter(b => !existingSlugs.has(b.url.split('/').pop()));
        return [...filteredBackend, ...prev];
      });
    } catch (error) {
      console.error("Error fetching data science courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Data Science & AI Programs
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Build industry-ready expertise in Data Science, Machine Learning &
          Generative AI with structured, outcome-driven programs.
        </p>
      </div>

      {/* ================= COURSES ================= */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Link to={course.url} className="block h-full">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Badge */}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r ${course.badgeColor} text-white text-xs font-bold rounded-full`}
                >
                  {course.badge}
                </div>

                {/* Duration */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <span className="text-white text-sm font-semibold">
                    {course.duration} • {course.mode}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {course.rating}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">/5</span>
                  <span className="text-gray-400 text-xs ml-2">
                    ({course.reviewsCount} learners)
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {course.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-xl font-extrabold text-gray-900">
                      {course.price}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      Total Program Fee
                    </span>
                  </div>

                  <Link
                    to={course.url}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 text-sm flex items-center"
                  >
                    View Details
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataScienceAIPage;