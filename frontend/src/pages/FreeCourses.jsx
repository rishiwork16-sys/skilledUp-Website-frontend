import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const FreeCoursesPlatform = () => {
  // State for courses data
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Courses', count: 0, icon: '📚' },
    { id: 'web-dev', name: 'Web Development', count: 0, icon: '💻' },
    { id: 'data-science', name: 'Data Science', count: 0, icon: '📊' },
    { id: 'mobile-dev', name: 'Mobile Development', count: 0, icon: '📱' },
    { id: 'design', name: 'UI/UX Design', count: 0, icon: '🎨' },
    { id: 'marketing', name: 'Digital Marketing', count: 0, icon: '📈' },
    { id: 'business', name: 'Business', count: 0, icon: '💼' }
  ];

  // How It Works steps
  const howItWorks = [
    {
      id: 1,
      title: 'Browse Courses',
      description: 'Explore our extensive catalog of free courses across various domains and technologies',
      icon: '🔍'
    },
    {
      id: 2,
      title: 'Enroll Instantly',
      description: 'Sign up and enroll in any course with just one click - no payment required ever',
      icon: '📝'
    },
    {
      id: 3,
      title: 'Learn at Your Pace',
      description: 'Access course materials 24/7 and learn according to your own schedule and speed',
      icon: '⏱️'
    },
    {
      id: 4,
      title: 'Get Certified',
      description: 'Complete courses and earn verified certificates to showcase your skills',
      icon: '🏆'
    }
  ];

  // FAQ Data
  const faqData = [
    {
      id: 1,
      question: 'Are these courses really free?',
      answer: 'Yes, all courses on our platform are completely free with no hidden charges or subscription fees. We believe in making quality education accessible to everyone.'
    },
    {
      id: 2,
      question: 'Do I get a certificate after completion?',
      answer: 'Absolutely! You will receive a verified certificate upon successful completion of any course. These certificates can be shared on LinkedIn and added to your resume.'
    },
    {
      id: 3,
      question: 'Can I access courses on mobile?',
      answer: 'Yes, our platform is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers. Learn anywhere, anytime.'
    },
    {
      id: 4,
      question: 'How long do I have access to the courses?',
      answer: 'You get lifetime access to all courses you enroll in. Learn at your own pace without any time restrictions and revisit materials whenever you need.'
    }
  ];

  // Sample courses data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const coursesData = [
        {
          id: 1,
          title: 'Complete React Developer Course',
          description: 'Learn React from basics to advanced concepts with hands-on projects and real-world applications',
          category: 'web-dev',
          duration: '12 hours',
          level: 'Beginner',
          students: 15420,
          rating: 4.8,
          instructor: 'Sarah Johnson',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: true,
          isNew: true
        },
        {
          id: 2,
          title: 'Python for Data Science',
          description: 'Master Python programming and data analysis with real-world datasets and machine learning basics',
          category: 'data-science',
          duration: '15 hours',
          level: 'Intermediate',
          students: 8920,
          rating: 4.7,
          instructor: 'Michael Chen',
          image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: true,
          isNew: false
        },
        {
          id: 3,
          title: 'UI/UX Design Fundamentals',
          description: 'Learn design principles and create stunning user interfaces with modern design tools',
          category: 'design',
          duration: '10 hours',
          level: 'Beginner',
          students: 12450,
          rating: 4.9,
          instructor: 'Emma Wilson',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: false,
          isNew: true
        },
        {
          id: 4,
          title: 'Flutter Mobile Development',
          description: 'Build cross-platform mobile apps with Flutter and Dart for iOS and Android',
          category: 'mobile-dev',
          duration: '18 hours',
          level: 'Intermediate',
          students: 7560,
          rating: 4.6,
          instructor: 'David Park',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: true,
          isNew: false
        },
        {
          id: 5,
          title: 'Digital Marketing Mastery',
          description: 'Learn SEO, social media marketing, content strategy and digital advertising',
          category: 'marketing',
          duration: '14 hours',
          level: 'Beginner',
          students: 10340,
          rating: 4.5,
          instructor: 'Lisa Rodriguez',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: false,
          isNew: false
        },
        {
          id: 6,
          title: 'Business Fundamentals',
          description: 'Essential business concepts for entrepreneurs and managers with case studies',
          category: 'business',
          duration: '8 hours',
          level: 'Beginner',
          students: 6820,
          rating: 4.4,
          instructor: 'Robert Taylor',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isFeatured: false,
          isNew: true
        }
      ];

      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter courses based on category and search query
  useEffect(() => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
  }, [selectedCategory, searchQuery, courses]);

  // Enroll in a course
  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      // Show success message
      alert('Successfully enrolled in the course!');
    } else {
      alert('You are already enrolled in this course!');
    }
  };

  // Toggle FAQ
  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-xs font-medium">{rating}</span>
      </div>
    );
  };

  // Render course level badge
  const renderLevelBadge = (level) => {
    let bgColor = '';
    let textColor = '';
    
    switch(level.toLowerCase()) {
      case 'beginner':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'intermediate':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'advanced':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {level}
      </span>
    );
  };

  // Simple navigation handler for links (replaces Link component)
  const handleNavigation = (path) => {
    // You can implement your navigation logic here
    console.log(`Navigating to: ${path}`);
    // window.location.href = path; // Uncomment if you want to navigate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-6 tracking-tight" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Learn Without Limits, For Free</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
            Access high-quality courses from industry experts. Build in-demand skills and advance your career - completely free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => handleNavigation('/learn')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
            >
              Start Learning Today
            </button>
            <button 
              onClick={() => {
                document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-blue-600" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>250+</div>
              <div className="text-gray-600 mt-2 font-medium" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Free Courses</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>50K+</div>
              <div className="text-gray-600 mt-2 font-medium" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Active Students</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>100+</div>
              <div className="text-gray-600 mt-2 font-medium" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Expert Instructors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>24/7</div>
              <div className="text-gray-600 mt-2 font-medium" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Lifetime Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Find Your Perfect Course</h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              Search through our extensive collection of free courses and start learning today
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter - Centered and Attractive */}
        <section className="mb-16" id="courses-section">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              Explore courses across different domains and find what interests you the most
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map(category => (
              <button
                key={category.id}
                className={`flex flex-col items-center justify-center px-5 py-4 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 shadow-sm hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                style={{ minWidth: '130px', fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="font-bold text-sm">{category.name}</span>
                <span className={`text-xs mt-1 ${
                  selectedCategory === category.id ? 'bg-white bg-opacity-20' : 'bg-blue-100 text-blue-600'
                } px-2 py-1 rounded-full`}>
                  {category.id === 'all' ? courses.length : courses.filter(c => c.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Courses - Centered Text and Smaller Cards */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              {selectedCategory === 'all' ? 'All Courses' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              Discover amazing free courses to boost your skills and career
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-7 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {course.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
                          NEW
                        </span>
                      )}
                      {course.isFeatured && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      {renderLevelBadge(course.level)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-base font-black text-gray-900 mb-2 leading-tight" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{course.title}</h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{course.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="flex items-center mr-3">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {renderRating(course.rating)}
                      </div>
                      <div className="text-xs text-gray-600 font-medium" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>By {course.instructor}</div>
                    </div>
                    
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className={`w-full py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                        enrolledCourses.includes(course.id)
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
                      disabled={enrolledCourses.includes(course.id)}
                    >
                      {enrolledCourses.includes(course.id) ? '✓ Enrolled' : 'Enroll for Free'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>No courses found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300"
                style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* How It Works Section - Improved Design */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              Getting started with free learning has never been easier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div 
                key={step.id}
                className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-xl text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-800"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-black" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
                  {index + 1}
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-black mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-black to-gray-900 rounded-xl p-8 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Why Choose FreeCourses?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
                Discover the benefits of learning with our platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg">
                  🔓
                </div>
                <h3 className="text-lg font-black mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Completely Free</h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Access all courses without any cost. No hidden fees or subscriptions ever.</p>
              </div>
              
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg">
                  👨‍🏫
                </div>
                <h3 className="text-lg font-black mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Expert Instructors</h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Learn from industry professionals with years of real-world experience.</p>
              </div>
              
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg">
                  📱
                </div>
                <h3 className="text-lg font-black mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Lifetime Access</h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Once enrolled, you have lifetime access to all course materials and updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
              Get answers to the most common questions about our platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {faqData.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
                  activeFAQ === faq.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(faq.id)}
                  style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}
                >
                  <span className="text-base font-bold text-gray-900 pr-4" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 ${
                      activeFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-6 pb-4 transition-all duration-300 ${
                    activeFAQ === faq.id ? 'block' : 'hidden'
                  }`}
                >
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========================Footer======================= */}

    <Footer />
    </div>
  );
};

export default FreeCoursesPlatform;