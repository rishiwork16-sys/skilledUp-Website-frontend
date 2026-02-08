import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";

const categories = [
  "Popular Courses",
  "Data Analytics",
  "Data Science & AI",
  "AI & Machine Learning",
  "Programming & Coding",
  "Software Dev & Engineering",
  "Cloud Computing & DevOps",
  "Cybersecurity & IT Security",
  "Digital Marketing & Growth",
  "UI/UX & Design Thinking",
  "Product Management & Strategy",
  "Career Growth & Development",
  "Skills & Certifications",
];

const filters = ["All", "Online/Offline", "Online", "Offline", "Pre-recorded", "Free Resources"];

const staticCourses = [
  {
    id: 7,
    category: "Data Science & AI",
    mode: "Online/Offline",
    title: "CareerX: Data Science with GenAI",
    duration: "9 Months",
    price: 100000,
    discount: 10,
    reviewsCount: 3245,
    rating: 4.7,
    img: "images/CareerX_ Data Science & GenAI.png",
    url: "/courses/careerx-data-science-genai"
  },
  {
    id: 8,
    category: "Data Science & AI",
    mode: "Online/Offline",
    title: "Career Accelerator: Data Science & GenAI",
    duration: "9 Months",
    price: 50000,
    reviewsCount: 2876,
    rating: 4.6,
    img: "images/Career Accelerator_ Data Science & GenAI.png",
    url: "/courses/career-accelerator-data-science-genai"
  },
  {
    id: 1,
    category: "Data Analytics",
    mode: "Online/Offline",
    title: "Career Accelerator: Data Analytics & GenAI",
    duration: "6 Months",
    price: 25000,
    reviewsCount: 4321,
    rating: 4.7,
    img: "images/Career Accelerator_ Data Analytics & GenAI.png",
    url: "/courses/career-accelerator-data-analytics-genai"
  },
  {
    id: 2,
    category: "Data Analytics",
    mode: "Online/Offline",
    title: "Career Boost: Data Analytics & GenAI",
    duration: "4 Months",
    price: 15000,
    reviewsCount: 2890,
    rating: 4.6,
    img: "images/Career Boost_ Data Analytics & GenAI.png",
    url: "/courses/career-boost-data-analytics-genai"
  },
];

export default function CoursesPage() {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [allCourses, setAllCourses] = useState(staticCourses);
  const [categories, setCategories] = useState(["Popular Courses"]);
  const [selectedCategory, setSelectedCategory] = useState("Popular Courses");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [openCategory, setOpenCategory] = useState("Popular Courses");
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user?.id) {
        try {
          // Fetch from payment service
          const response = await api.get(`/api/payments/user/${user.id}`);
          // Ensure we store course IDs as numbers for comparison
          const enrolledIds = new Set(response.data.map(order => Number(order.courseId)));
          setEnrolledCourses(enrolledIds);
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          setEnrolledCourses(new Set());
        }
      } else {
        setEnrolledCourses(new Set());
      }
    };
    fetchEnrolledCourses();
  }, [user?.id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/courses/categories");
      // Extract category names from the response objects
      const categoryNames = response.data.map(cat => cat.name);
      // Ensure "Popular Courses" is unique and at the top
      const uniqueCategories = Array.from(new Set(["Popular Courses", ...categoryNames]));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories if API fails
      setCategories([
        "Popular Courses",
        "Data Analytics",
        "Data Science & AI",
        "AI & Machine Learning",
        "Programming & Coding",
        "Software Dev & Engineering",
        "Cloud Computing & DevOps",
        "Cybersecurity & IT Security",
        "Digital Marketing & Growth",
        "UI/UX & Design Thinking",
        "Product Management & Strategy",
        "Career Growth & Development",
        "Skills & Certifications",
      ]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses");
      const backendCourses = response.data.map(course => ({
        id: course.id,
        category: course.category || "General",
        mode: course.mode || "Online",
        title: course.title,
        duration: course.duration || "N/A",
        price: course.price,
        discount: course.discount,
        reviewsCount: Math.floor(Math.random() * 1000) + 100, // Mocking since not in DB
        rating: 4.5 + (Math.random() * 0.5), // Mocking
        img: course.thumbnailUrl || "/images/course-placeholder.png",
        url: `/courses/${course.category || "General"}/${course.slug}`,
        isBackend: true
      }));

      // Deduplicate courses based on ID
      const courseMap = new Map();
      [...backendCourses, ...staticCourses].forEach(course => {
        // Prioritize backend courses if duplicates exist
        if (!courseMap.has(course.id) || course.isBackend) {
          courseMap.set(course.id, course);
        }
      });
      
      setAllCourses(Array.from(courseMap.values()));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const filteredCourses = allCourses.filter((c) => {
    // Ensure category strings are clean for comparison
    const currentCategory = c.category ? String(c.category).trim() : "";
    const selected = selectedCategory ? String(selectedCategory).trim() : "";
    
    const categoryMatch = selected === "Popular Courses" ? true : currentCategory === selected;
    const filterMatch = selectedFilter === "All" ? true : c.mode === selectedFilter;
    return categoryMatch && filterMatch;
  });

  const handleAddToCart = (course) => {
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      image: course.img,
      duration: course.duration,
      category: course.category,
      mode: course.mode
    });
    alert(`${course.title} added to cart!`);
  };

  const handleShareCourse = (course) => {
    const shareText = `Check out this course on SkilledUp: ${course.title}\nPrice: ₹${course.price}\nDuration: ${course.duration}`;
    const shareUrl = `${window.location.origin}/course/${course.id}`;

    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        alert('Course link copied to clipboard! You can share it on WhatsApp, Instagram, etc.');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section for Courses Page */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Industry-relevant courses designed by experts to boost your career
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-8 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4">

          {/* MOBILE VIEW - ACCORDION WITH HORIZONTAL SCROLL */}
          <div className="lg:hidden w-full">
            {/* Category Accordion */}
            <div className="flex flex-col gap-3">
              {categories.map((cat) => {
                const isOpen = openCategory === cat;
                let coursesForThisCat = [];

                if (cat === "Popular Courses") {
                  coursesForThisCat = allCourses;
                } else {
                  coursesForThisCat = allCourses.filter(
                    (course) => (course.category ? String(course.category).trim() : "") === String(cat).trim()
                  );
                }

                // Filter courses based on selected filter
                const filteredCoursesForCat = coursesForThisCat.filter((c) => {
                  const filterMatch = selectedFilter === "All" ? true : c.mode === selectedFilter;
                  return filterMatch;
                });

                return (
                  <div key={cat} className="w-full">
                    <button
                      onClick={() => {
                        if (isOpen) {
                          setOpenCategory(null);
                          return;
                        }
                        setOpenCategory(cat);
                        setSelectedCategory(cat);
                      }}
                      className={`w-full flex justify-between items-center rounded-lg px-4 py-4 text-left font-medium transition
                        ${isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-white shadow hover:bg-gray-50 text-gray-800"
                        }
                      `}
                    >
                      <span className="font-semibold">{cat}</span>
                      <span className="ml-2 text-xl">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] mt-3" : "max-h-0"
                        }`}
                    >
                      {isOpen && (
                        <div className="bg-white rounded-xl shadow border pb-4">
                          {/* Filter Buttons Inside Accordion */}
                          <div className="px-4 pt-4 pb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Mode:</h4>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {filters.map((f) => (
                                <button
                                  key={f}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFilter(f);
                                  }}
                                  className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition
                                    ${selectedFilter === f
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-white text-gray-700 hover:bg-gray-100"
                                    }
                                  `}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Courses Horizontal Scroll */}
                          <div className="px-1">
                            {filteredCoursesForCat.length === 0 ? (
                              <div className="text-center py-6 px-4 text-gray-500">
                                No courses found for this category.
                              </div>
                            ) : (
                              <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto pb-6 px-4 snap-x snap-mandatory scroll-smooth"
                                style={{ scrollbarWidth: 'thin' }}
                              >
                                {filteredCoursesForCat.map((c) => (
                                  <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="min-w-[280px] max-w-[280px] snap-start"
                                  >
                                    <article
                                      onClick={() => {
                                        if (c.url) {
                                          navigate(c.url);
                                        }
                                      }}
                                      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
                                    >
                                      {/* Course Image */}
                                      <div className="relative w-full h-40 bg-gray-100">
                                        <img
                                          src={c.img}
                                          alt={c.title}
                                          className="w-full h-full object-contain p-3"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/course-placeholder.png";
                                          }}
                                        />

                                        {c.price > 15000 && (
                                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            BESTSELLER
                                          </div>
                                        )}

                                        <button
                                          onClick={() => handleShareCourse(c)}
                                          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition border border-gray-300"
                                          title="Share this course"
                                        >
                                          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                                          </svg>
                                        </button>
                                      </div>

                                      {/* Course Content */}
                                      <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="font-bold text-sm mb-1 leading-tight line-clamp-2 text-gray-900">
                                          {c.title}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center text-xs text-gray-600 mb-2">
                                          <span className="text-yellow-500 font-bold">{c.rating}</span>
                                          <span className="mx-1 text-yellow-400">★★★★★</span>
                                          <span className="text-gray-500 ml-1">({c.reviewsCount.toLocaleString()})</span>
                                        </div>

                                        {/* Category and Mode */}
                                        <div className="mb-2">
                                          <p className="text-gray-500 text-xs mb-1">{c.category} • {c.mode}</p>
                                        </div>

                                        {/* Price and Duration */}
                                        <div className="flex items-center justify-between mt-auto">
                                          <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-900 text-base">
                                              ₹{c.price === 0 ? "FREE" : c.price.toLocaleString('en-IN')}
                                            </span>

                                          </div>
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {c.duration}
                                          </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-3">
                                          {enrolledCourses.has(Number(c.id)) ? (
                                            <button
                                              onClick={(e) => e.stopPropagation()}
                                              className="flex-1 bg-green-600 text-white py-2 rounded text-xs font-medium cursor-default"
                                            >
                                              Already Enrolled
                                            </button>
                                          ) : (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (c.url) {
                                                  navigate(c.url);
                                                }
                                              }}
                                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition"
                                            >
                                              Enroll Now
                                            </button>
                                          )}

                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!enrolledCourses.has(Number(c.id))) {
                                                handleAddToCart(c);
                                              }
                                            }}
                                            disabled={enrolledCourses.has(Number(c.id))}
                                            className={`flex-1 border py-2 rounded text-xs font-medium transition ${
                                              enrolledCourses.has(Number(c.id))
                                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                                : "border-blue-600 text-blue-600 hover:bg-blue-50"
                                            }`}
                                          >
                                            Add to Cart
                                          </button>
                                        </div>
                                      </div>
                                    </article>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Scroll Indicator */}
                          {/* {filteredCoursesForCat.length > 1 && (
                            <div className="text-center text-xs text-gray-500 mt-2">
                              ← Scroll for more courses →
                            </div>
                          )} */}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP VIEW - ORIGINAL LAYOUT (NO CHANGES) */}
          <aside className="hidden lg:block w-full lg:w-1/4 sticky top-[74px] h-fit self-start z-30">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Category</h3>

            {/* DESKTOP SIDEBAR */}
            <div className="flex flex-col bg-white p-5 rounded-xl shadow border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedFilter("All");
                  }}
                  className={`text-left px-4 py-3 rounded mb-2 font-medium transition ${selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT SIDE (DESKTOP GRID) - NO CHANGES */}
          <div className="hidden lg:flex flex-col lg:w-3/4">
            <div
              className="
    sticky
    top-[74px]
    z-30
    bg-gray-50
    py-3
    mb-6
  "
            >
              <div className="flex flex-wrap gap-3">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-4 py-2 rounded-full border transition text-sm ${selectedFilter === f
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>


            <div className="flex-1 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-600">
                    No courses found.
                  </div>
                ) : (
                  filteredCourses.map((c) => (
                    <article
                      key={c.id}
                      onClick={() => {
                        if (c.url) {
                          navigate(c.url);
                        }
                      }}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
                    >
                      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                        <img
                          src={c.img}
                          alt={c.title}
                          className="max-w-full max-h-full object-contain p-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/course-placeholder.png";
                          }}
                        />

                        {c.price > 15000 && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            BESTSELLER
                          </div>
                        )}

                        <button
                          onClick={() => handleShareCourse(c)}
                          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition border border-gray-300"
                          title="Share this course"
                        >
                          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg mb-1 leading-tight line-clamp-2 text-gray-900">
                          {c.title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="text-yellow-500 font-bold mr-1">{c.rating}</span>
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-500">({c.reviewsCount.toLocaleString()})</span>
                        </div>

                        <div className="mb-3 flex-1">
                          <p className="text-gray-500 text-sm mb-1">{c.category} • {c.mode}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xl">
                              ₹{c.price === 0 ? "FREE" : c.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded">
                            {c.duration}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          {enrolledCourses.has(Number(c.id)) ? (
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-green-600 text-white py-2.5 rounded text-sm font-medium cursor-default"
                            >
                              Already Enrolled
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (c.url) {
                                  navigate(c.url);
                                }
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-medium transition"
                            >
                              Enroll Now
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!enrolledCourses.has(Number(c.id))) {
                                handleAddToCart(c);
                              }
                            }}
                            disabled={enrolledCourses.has(Number(c.id))}
                            className={`flex-1 border py-2.5 rounded text-sm font-medium transition ${
                              enrolledCourses.has(Number(c.id))
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-blue-600 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
