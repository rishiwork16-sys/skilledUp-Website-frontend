import React, { useState, useRef, useEffect } from 'react';
import Footer from "../../components/layout/Footer";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  // Sample blog data with generic content
  const blogPosts = [
    {
      id: 1,
      title: "Effective Communication Strategies for Project Managers",
      category: "product-management",
      excerpt: "Learn how to establish clear communication channels across teams and stakeholders to ensure project success.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 2,
      title: "Brand Identity: Exploring Different Logo Design Types",
      category: "ui-ux",
      excerpt: "Discover various logo design styles including wordmarks, pictorial marks, and abstract logos.",
      image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 3,
      title: "Modern Typography: Minimalist Fonts for Clean Designs",
      category: "ui-ux",
      excerpt: "Explore minimalist font families that create clean, modern interfaces and enhance user experience.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 4,
      title: "Top Remote Career Opportunities for 2024",
      category: "general",
      excerpt: "Discover high-paying remote job opportunities across various industries and essential skills.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 5,
      title: "Digital Marketing: Understanding SEO and Local Optimization",
      category: "digital-marketing",
      excerpt: "Comprehensive guide to search engine optimization strategies and geographic targeting.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 6,
      title: "Managing Unexpected Tasks in Project Workflows",
      category: "product-management",
      excerpt: "Strategies for handling unplanned work while maintaining project timelines and team productivity.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 7,
      title: "Digital Platform Growth Strategies",
      category: "digital-marketing",
      excerpt: "Analysis of successful digital platform growth strategies and implementation methods.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 8,
      title: "Integrating AI in Educational Environments",
      category: "digital-marketing",
      excerpt: "How artificial intelligence is transforming educational methodologies and enhancing learning.",
      image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 9,
      title: "Data-Driven Approaches to Product Development",
      category: "product-management",
      excerpt: "Leveraging user data and analytics to inform product decisions and drive sustainable growth.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 10,
      title: "Maximizing User-Generated Content for Brand Growth",
      category: "digital-marketing",
      excerpt: "Strategies to encourage and leverage user-generated content for brand authenticity.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 11,
      title: "Understanding Machine Learning Fundamentals",
      category: "data-science",
      excerpt: "Introduction to core machine learning concepts and their practical applications.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 12,
      title: "Responsive Design Principles for Modern Web",
      category: "ui-ux",
      excerpt: "Essential principles for creating optimal viewing experiences across all devices.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'product-management', name: 'Product Management' },
    { id: 'ui-ux', name: 'UI UX' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'data-analytics', name: 'Data Analytics' },
    { id: 'python', name: 'Python' },
    { id: 'general', name: 'General' }
  ];

  // Filter posts based on selected category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentSlide(0);
  };

  // Handle slider navigation
  const handleSlideChange = (direction) => {
    const totalSlides = Math.ceil(filteredPosts.length / 3);
    
    if (direction === 'next') {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    } else {
      setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange('next');
    }, 5000);
    
    return () => clearInterval(interval);
  }, [filteredPosts.length]);

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Handle navigation
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="font-['Canva_Sans','Open_Sans',sans-serif] min-h-screen bg-white text-black">
      {/* Header Section */}
      <header className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Digital Insights Blog
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Explore the latest trends, strategies, and innovations in technology and digital business
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <section className="bg-white sticky top-0 z-50 shadow-md py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-black hover:border-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Slider */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 relative">
            Featured Insights
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-14 h-1 bg-blue-600 rounded"></span>
          </h2>
          
          <div className="overflow-hidden rounded-lg mb-6">
            <div 
              className="flex transition-transform duration-400 ease-in-out"
              ref={sliderRef}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {filteredPosts.map(post => (
                <div key={post.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 flex flex-col h-[380px]">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start">
                        {formatCategoryName(post.category)}
                      </span>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        <a 
                          href={post.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-black hover:text-blue-600 transition-colors duration-300"
                        >
                          {post.title}
                        </a>
                      </h3>
                      <div className="w-10 h-0.5 bg-blue-600 rounded mb-3"></div>
                      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors duration-300 self-start"
                      >
                        Continue Reading →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slider Controls */}
          <div className="flex justify-center items-center gap-5">
            <button 
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              onClick={() => handleSlideChange('prev')}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(filteredPosts.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              onClick={() => handleSlideChange('next')}
              aria-label="Next slide"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 relative">
            Latest Articles
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-14 h-1 bg-blue-600 rounded"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start">
                    {formatCategoryName(post.category)}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-blue-600 transition-colors duration-300"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <div className="w-10 h-0.5 bg-blue-600 rounded mb-3"></div>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors duration-300 self-start"
                  >
                    Continue Reading →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-12 md:py-16 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with Our Latest Insights
            </h2>
            <p className="text-gray-300 mb-8">
              Get the latest articles, industry trends, and expert perspectives delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="flex-grow px-4 py-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

          {/* Footer */}
    <Footer />
    </div>
  );
};

export default BlogPage;