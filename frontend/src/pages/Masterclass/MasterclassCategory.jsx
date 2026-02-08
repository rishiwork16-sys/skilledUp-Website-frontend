// src/pages/Masterclass/MasterclassCategory.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MasterclassCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Only 2 masterclass categories
  const masterclassCategories = [
    {
      id: "data-analytics",
      name: "Data & Analytics",
      icon: "📊",
      description: "Master data analysis, SQL, BI tools, and data visualization",
      count: 2,
      color: "from-[#264f9b] to-[#264f9b]",
      masterclasses: [
        {
          id: 1,
          title: "MySQL & GenAI Masterclass with BigQuery",
          instructor: "Vijay Narayan Singh",
          duration: "2.5 Hours",
          level: "All Levels",
          price: "FREE",
          originalPrice: "₹1,499",
          rating: 4.9,
          reviews: 245,
          seats: 150,
          date: "04th Jan 2025",
          time: "07:00 PM - 08:30 PM",
          description: "Learn MySQL, Google BigQuery, and Generative AI for modern data analytics",
          features: ["Live Session", "Certificate", "Resources", "Q&A"],
          path: "/masterclass/mysql-genai" 
        },
        {
          id: 2,
          title: "Power BI & Generative AI MasterClass",
          instructor: "Vijay Narayan Singh",
          duration: "3 Hours",
          level: "Beginner",
          price: "FREE",
          originalPrice: "₹1,299",
          rating: 4.8,
          reviews: 189,
          seats: 120,
          date: "10th Jan 2025",
          time: "03:00 PM - 06:00 PM",
          description: "Master Power BI for business intelligence and interactive dashboards",
          features: ["Live Demo", "Certificate", "Templates", "Project Files"],
          path: "/masterclass/powerbi-advanced"
        }
      ]
    }
  ];

  // Filter masterclasses based on selected category and search term
  const filteredCategories = selectedCategory === 'all' 
    ? masterclassCategories 
    : masterclassCategories.filter(cat => cat.id === selectedCategory);

  const allMasterclasses = masterclassCategories.flatMap(cat => cat.masterclasses);
  const filteredMasterclasses = searchTerm 
    ? allMasterclasses.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allMasterclasses;

  // Get total masterclass count
  const totalMasterclasses = allMasterclasses.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefefe] to-white font-opensans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#264f9b] via-[#1e3d7a] to-[#152a57] text-[#fefefe] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-canasans">
              Masterclass Categories
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 font-opensans">
              Learn from industry experts through intensive, hands-on masterclasses
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-3 sm:px-0">
  <div className="relative">
    <input
      type="text"
      placeholder="Search masterclasses..."
      className="
        w-full
        px-4 sm:px-6
        py-3 sm:py-4
        rounded-xl sm:rounded-2xl
        text-base sm:text-lg
        text-[#191917]
        focus:outline-none
        focus:ring-4
        focus:ring-[#fefefe]/30
        font-opensans
        pr-12
      "
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Search Icon */}
    <svg
      className="
        w-5 h-5 sm:w-6 sm:h-6
        text-gray-400
        absolute
        right-4 sm:right-6
        top-1/2
        -translate-y-1/2
      "
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</div>


            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-[#fefefe]/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold font-canasans">{totalMasterclasses}</div>
                <div className="text-sm opacity-90 font-opensans">Masterclasses</div>
              </div>
              <div className="bg-[#fefefe]/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold font-canasans">2+</div>
                <div className="text-sm opacity-90 font-opensans">Industry Experts</div>
              </div>
              <div className="bg-[#fefefe]/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold font-canasans">20K+</div>
                <div className="text-sm opacity-90 font-opensans">Participants</div>
              </div>
              <div className="bg-[#fefefe]/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="text-2xl font-bold font-canasans">4.9</div>
                <div className="text-sm opacity-90 font-opensans">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter - Single category only */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 font-opensans ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#264f9b] to-[#1e3d7a] text-[#fefefe] shadow-lg'
                  : 'bg-white text-[#191917] hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Categories
            </button>
            
            {masterclassCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 font-opensans ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#264f9b] to-[#1e3d7a] text-[#fefefe] shadow-lg'
                    : 'bg-white text-[#191917] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs bg-[#fefefe]/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Single Category Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 mb-16">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={category.masterclasses[0]?.path || '#'}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer block no-underline text-inherit"
            >
              <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-3xl bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#191917] font-canasans">{category.name}</h3>
                    <p className="text-gray-600 font-opensans">{category.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {category.masterclasses.map((masterclass) => (
                    <Link
                      key={masterclass.id}
                      to={masterclass.path}
                      className="p-6 border border-gray-200 rounded-xl hover:border-[#264f9b]/30 transition-colors cursor-pointer hover:bg-[#264f9b]/5 block no-underline text-inherit"
                    >
                      {/* ...existing code for masterclass card... */}
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-xl text-[#191917] mb-2 font-canasans">{masterclass.title}</h4>
                          <p className="text-gray-600 mb-3 font-opensans">{masterclass.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-[#264f9b] bg-[#264f9b]/10 px-3 py-1 rounded-full font-opensans">
                              by {masterclass.instructor}
                            </span>
                            <span className="text-sm text-gray-500 font-opensans">
                              📅 {masterclass.date} | ⏰ {masterclass.time}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#191917] mb-2 font-canasans">
                            {masterclass.price === "FREE" ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              <>
                                {masterclass.price}
                                <span className="text-sm text-gray-500 line-through ml-2 font-opensans">
                                  {masterclass.originalPrice}
                                </span>
                              </>
                            )}
                          </div>
                          <span className="text-sm font-bold bg-[#264f9b]/10 text-[#264f9b] px-3 py-1 rounded-full font-opensans">
                            {masterclass.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {masterclass.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-[#264f9b]/10 text-[#264f9b] px-3 py-1 rounded-full font-opensans"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 font-bold font-opensans">{masterclass.rating}</span>
                            <span className="text-gray-500 text-sm ml-1 font-opensans">({masterclass.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 font-opensans">
                          🎟️ {masterclass.seats} seats remaining
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Masterclasses - Only shows when searching */}
        {searchTerm && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#191917] mb-8 font-canasans">
              Search Results ({filteredMasterclasses.length} masterclasses found)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMasterclasses.map((masterclass) => (
                <Link
                  key={masterclass.id}
                  to={masterclass.path}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 block no-underline text-inherit"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#191917] mb-2 font-canasans">{masterclass.title}</h3>
                        <p className="text-gray-600 mb-3 font-opensans">{masterclass.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#191917] font-canasans">
                          {masterclass.price === "FREE" ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <>
                              {masterclass.price}
                              <span className="text-sm text-gray-500 line-through ml-2 font-opensans">
                                {masterclass.originalPrice}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 font-opensans">{masterclass.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#264f9b]/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-[#264f9b] font-canasans">
                            {masterclass.instructor.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium font-opensans">{masterclass.instructor}</div>
                          <div className="text-sm text-gray-500 font-opensans">{masterclass.level}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-bold font-opensans">{masterclass.rating}</span>
                          <span className="text-gray-500 text-sm ml-1 font-opensans">({masterclass.reviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {masterclass.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#264f9b]/10 text-[#264f9b] px-3 py-1 rounded-full font-opensans"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 font-opensans">
                        <div className="font-medium">📅 {masterclass.date}</div>
                        <div>⏰ {masterclass.time}</div>
                      </div>
                      <div className="text-sm text-gray-600 font-opensans">
                        <div className="font-medium">🎟️ {masterclass.seats} seats left</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MasterclassCategory;