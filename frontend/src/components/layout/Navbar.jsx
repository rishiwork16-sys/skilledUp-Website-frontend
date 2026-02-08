// src/components/layout/Navbar.jsx - FIXED COMPACT VERSION
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import logo from "../../assets/skilleduplogo.png";

// ✅ CSS animations के लिए inline styles object
const animationStyles = {
  fadeIn: {
    animation: 'fadeInKeyframe 0.2s ease-out forwards'
  },
  slideDown: {
    animation: 'slideDownKeyframe 0.3s ease-out forwards',
    overflow: 'hidden'
  }
};

export default function Navbar() {
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [masterclassOpen, setMasterclassOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileMasterclassOpen, setMobileMasterclassOpen] = useState(false);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMasterclassCategory, setActiveMasterclassCategory] = useState(null);

  const { cartItems } = useCart();
  const { user, isLoggedIn, addCredits, logout } = useUser();

  const cartCount = cartItems.length;
  const userCredits = user?.credits || 0;
  const profileDropdownRef = useRef(null);
  const coursesDropdownRef = useRef(null);
  const masterclassDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const masterclassMegaMenuRef = useRef(null);

  const location = useLocation();
  const handleLogoClick = () => {
  if (location.pathname === "/") {
    // already home → scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

  // ✅ Dynamic keyframes inject
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes fadeInKeyframe {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideDownKeyframe {
        from {
          opacity: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-height: 1000px;
        }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Course data - COMPACT VERSION
  const courseCategories = [
    {
      id: "data-analytics",
      name: "Data Analytics",
      courses: [
        {
          name: "Data Analytics & GenAI",
          displayName: "Career Accelerator: Data Analytics & GenAI",
          path: "/courses/career-accelerator-data-analytics-genai"
        },
        {
          name: "Data Analytics Boost",
          displayName: "Career Boost: Data Analytics & GenAI",
          path: "/courses/career-boost-data-analytics-genai"
        },
      ]
    },
    {
      id: "data-science-ai",
      name: "Data Science & AI",
      courses: [
        {
          name: "Data Science with GenAI",
          displayName: "CareerX: Data Science & GenAI",
          path: "/courses/careerx-data-science-genai"
        },
        {
          name: "Data Science Accelerator",
          displayName: "Career Accelerator: Data Science & GenAI",
          path: "/courses/career-accelerator-data-science-genai"
        },
      ]
    }
  ];

  // ✅ MASTERCLASS DATA - COMPACT
  const masterclassCategories = [
    {
      id: "all-masterclass",
      name: "Masterclass",
      courses: [
        {
          name: "MySQL & GenAI",
          displayName: "MySQL & GenAI",
          path: "/masterclass/mysql-genai",
        },
        {
          name: "Power BI Advanced",
          displayName: "Power BI Advanced",
          path: "/masterclass/powerbi-advanced",
        },
      ]
    },
  ];

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(event.target) &&
        megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setCoursesOpen(false);
        setActiveCategory(null);
      }
      if (masterclassDropdownRef.current && !masterclassDropdownRef.current.contains(event.target) &&
        masterclassMegaMenuRef.current && !masterclassMegaMenuRef.current.contains(event.target)) {
        setMasterclassOpen(false);
        setActiveMasterclassCategory(null);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle mega menu mouse events
  useEffect(() => {
    const megaMenu = megaMenuRef.current;
    const coursesButton = coursesDropdownRef.current?.querySelector('button');

    const handleMouseLeave = () => {
      setTimeout(() => {
        if (!megaMenu?.matches(':hover') && !coursesButton?.matches(':hover')) {
          setCoursesOpen(false);
          setActiveCategory(null);
        }
      }, 100);
    };

    if (megaMenu) {
      megaMenu.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (megaMenu) {
        megaMenu.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [coursesOpen]);

  // Handle masterclass mega menu
  useEffect(() => {
    const masterclassMegaMenu = masterclassMegaMenuRef.current;
    const masterclassButton = masterclassDropdownRef.current?.querySelector('button');

    const handleMouseLeave = () => {
      setTimeout(() => {
        if (!masterclassMegaMenu?.matches(':hover') && !masterclassButton?.matches(':hover')) {
          setMasterclassOpen(false);
          setActiveMasterclassCategory(null);
        }
      }, 100);
    };

    if (masterclassMegaMenu) {
      masterclassMegaMenu.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (masterclassMegaMenu) {
        masterclassMegaMenu.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [masterclassOpen]);

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleMasterclassCategoryHover = (categoryId) => {
    setActiveMasterclassCategory(categoryId);
  };

  const getActiveCategoryCourses = () => {
    if (!activeCategory && courseCategories.length > 0) {
      return courseCategories[0]?.courses || [];
    }
    const category = courseCategories.find(cat => cat.id === activeCategory);
    return category?.courses || [];
  };

  const getActiveMasterclassCategoryCourses = () => {
    if (!activeMasterclassCategory && masterclassCategories.length > 0) {
      return masterclassCategories[0]?.courses || [];
    }
    const category = masterclassCategories.find(cat => cat.id === activeMasterclassCategory);
    return category?.courses || [];
  };

  // Get user identifier
  const getUserIdentifier = () => {
    if (user?.email) {
      return user.email.substring(0, 15) + (user.email.length > 15 ? "..." : "");
    } else if (user?.phone) {
      return `+91 ${user.phone}`;
    }
    return "";
  };

  // Get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    } else if (user?.phone) {
      return user.phone.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed inset-x-0 top-0 bg-white shadow-lg z-[9999] overflow-visible">
      {/* MAIN CONTAINER - FULL WIDTH */}
      <div className="w-full px-3 sm:px-4 h-[74px]">
        <div className="h-full mx-auto max-w-screen-2xl relative overflow-visible">
          <div className="flex items-center justify-between h-full gap-2">

            {/* Logo - Fixed width */}
            <Link
  to="/"
  onClick={handleLogoClick}
  className="flex items-center gap-2 flex-shrink-0 min-w-[120px] md:ml-6"
>

              <img
                src={logo}
                alt="SkilledUp Logo"
                className="h-7 sm:h-8 w-auto object-contain ml-6"
              />
            </Link>

            {/* Desktop Navigation - FLEXIBLE */}
            <nav className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-2">
              <div className="flex items-center space-x-0.5 lg:space-x-1 max-w-full">

                {/* Courses Mega Menu - FIXED VERSION */}
                <div className="relative" ref={coursesDropdownRef}>
                  <button
                    onMouseEnter={() => {
  setCoursesOpen(false);
  setMasterclassOpen(false); // 👈 CLOSE masterclass
  setActiveMasterclassCategory(null);
  setActiveCategory(courseCategories[0].id);
}}

                    onClick={() => {
                      setCoursesOpen(!coursesOpen);
                      if (!activeCategory && courseCategories.length > 0) {
                        setActiveCategory(courseCategories[0].id);
                      }
                    }}
                    className="flex items-center text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm"
                  >
                    Courses
                    <svg className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${coursesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mega Menu Dropdown - FIXED */}
                  {coursesOpen && (
                    <div
                      ref={megaMenuRef}
                      style={animationStyles.fadeIn}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 w-[95vw] max-w-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 border-t-2 border-t-indigo-500 z-50"
                    >
                      <div className="flex min-h-[350px]">
                        {/* Categories Sidebar - COMPACT */}
                        <div className="w-[180px] bg-gray-50 border-r border-gray-200 py-4">
                          {courseCategories.map((category) => (
                            <div
                              key={category.id}
                              className={`px-3 py-2 cursor-pointer transition-all duration-200 border-l-2 ${activeCategory === category.id ? 'bg-white border-l-indigo-500 font-semibold text-indigo-600' : 'hover:bg-white hover:border-l-indigo-200'}`}
                              onMouseEnter={() => handleCategoryHover(category.id)}
                            >
                              <div className="font-medium text-gray-800 truncate text-sm">{category.name}</div>
                            </div>
                          ))}
                        </div>

                        {/* Courses Panel */}
                        <div className="flex-1 p-4 overflow-y-auto max-h-[350px]">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-900">
                              {activeCategory
                                ? `${courseCategories.find(c => c.id === activeCategory)?.name} Courses`
                                : `${courseCategories[0]?.name} Courses`}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {getActiveCategoryCourses().map((course, index) => (
                              <Link
                                key={index}
                                to={course.path}
                                className="group block p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-150 bg-white"
                                onClick={() => {
                                  setCoursesOpen(false);
                                  setActiveCategory(null);
                                }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                    {course.displayName || course.name}
                                  </h4>
                                  {course.duration && (
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium ml-2 flex-shrink-0">
                                      {course.duration}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mb-2 line-clamp-2">
                                  Hands-on projects & certification with industry experts
                                </div>
                                <div className="flex items-center text-xs text-indigo-600 font-medium group-hover:text-indigo-700">
                                  <span>Explore Course →</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* MASTERCLASS MENU - COMPACT */}
                <div className="relative" ref={masterclassDropdownRef}>
                  <button
                    onMouseEnter={() => {
                      setMasterclassOpen(true);
                      if (!activeMasterclassCategory && masterclassCategories.length > 0) {
                        setActiveMasterclassCategory(masterclassCategories[0].id);
                      }
                    }}
                    onClick={() => {
                      setMasterclassOpen(!masterclassOpen);
                      if (!activeMasterclassCategory && masterclassCategories.length > 0) {
                        setActiveMasterclassCategory(masterclassCategories[0].id);
                      }
                    }}
                    className="flex items-center text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm"
                  >
                    Masterclass
                    <svg className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${masterclassOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* MASTERCLASS DROPDOWN */}
                  {masterclassOpen && (
                    <div
                      ref={masterclassMegaMenuRef}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 w-[95vw] max-w-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 border-t-2 border-t-purple-500 z-50"
                      style={animationStyles.fadeIn}
                    >
                      <div className="flex min-h-[300px]">
                        {/* Categories Sidebar */}
                        <div className="w-[180px] bg-gray-50 border-r border-gray-200 py-4">
                          {masterclassCategories.map((category) => (
                            <div
                              key={category.id}
                              className={`px-3 py-2 cursor-pointer transition-all duration-200 border-l-2 ${activeMasterclassCategory === category.id ? 'bg-white border-l-purple-500 font-semibold text-purple-600' : 'hover:bg-white hover:border-l-purple-200'}`}
                              onMouseEnter={() => handleMasterclassCategoryHover(category.id)}
                            >
                              <div className="font-medium text-gray-800 truncate text-sm">{category.name}</div>
                            </div>
                          ))}
                        </div>

                        {/* Masterclasses Panel */}
                        <div className="flex-1 p-4 overflow-y-auto max-h-[300px]">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-900">
                              Expert Masterclasses
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {getActiveMasterclassCategoryCourses().map((masterclass, index) => (
                              <Link
                                key={index}
                                to={masterclass.path}
                                className="block p-2.5 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-150"
                                onClick={() => {
                                  setMasterclassOpen(false);
                                  setActiveMasterclassCategory(null);
                                }}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors truncate">
                                    {masterclass.displayName || masterclass.name}
                                  </h4>
                                </div>
                                <div className="text-xs text-gray-500 mb-2 line-clamp-1">
                                  Expert-led intensive training
                                </div>
                                <div className="flex items-center text-xs text-purple-600 font-medium">
                                  <span>View Masterclass →</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simple Links - Ultra Compact */}
                <Link to="/internships" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm">Internships</Link>
                <Link to="/b2b" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm">Corporate</Link>
                <Link to="/careers" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm">Careers</Link>

                {/* Resources Dropdown - Compact */}
                <div className="relative" ref={resourcesDropdownRef}>
                  <button
                    onClick={() => {
                      setOpen(!open);
                      setCoursesOpen(false);
                      setMasterclassOpen(false);
                      setActiveCategory(null);
                      setActiveMasterclassCategory(null);
                    }}
                    className="flex items-center text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-2 py-1.5 rounded hover:bg-gray-50 whitespace-nowrap text-sm"
                  >
                    Resources
                    <svg className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {open && (
                    <div
                      style={animationStyles.fadeIn}
                      className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50"
                    >
                      <Link to="/about-us" className="block px-4 py-1.5 hover:bg-gray-50 transition-colors duration-200 truncate text-sm" onClick={() => setOpen(false)}>About Us</Link>
                      <Link to="/faqs" className="block px-4 py-1.5 hover:bg-gray-50 transition-colors duration-200 truncate text-sm" onClick={() => setOpen(false)}>FAQs</Link>
                      <div className="border-t my-1"></div>
                      <Link to="/terms" className="block px-4 py-1.5 hover:bg-gray-50 transition-colors duration-200 truncate text-sm" onClick={() => setOpen(false)}>Terms</Link>
                      <Link to="/privacy" className="block px-4 py-1.5 hover:bg-gray-50 transition-colors duration-200 truncate text-sm" onClick={() => setOpen(false)}>Privacy</Link>
                      <Link to="/contact" className="block px-4 py-1.5 hover:bg-gray-50 transition-colors duration-200 truncate text-sm" onClick={() => setOpen(false)}>Contact</Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Right Side Actions - COMPACT */}
            <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">

              {/* Search - Better Width */}
              <div className="hidden md:block relative min-w-[140px]">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full text-sm"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Cart - Better Sizing */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* WALLET COMPONENT - Better Spacing */}
              {isLoggedIn && (
                <div className="hidden md:block">
                  <WalletDropdown user={user} userCredits={userCredits} addCredits={addCredits} />
                </div>
              )}

              {/* User Profile / Login - Better Width */}
              {isLoggedIn ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 min-w-[80px]"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {getUserInitials()}
                    </div>
                    <div className="hidden lg:block text-left ml-2">
                      <div className="text-xs font-medium truncate max-w-[40px]">Hi, {user?.firstName?.charAt(0) || "U"}</div>
                    </div>
                    <svg className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''} ml-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      style={animationStyles.fadeIn}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {getUserIdentifier()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/my-courses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Courses
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="border-t my-1"></div>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm min-w-[80px] text-center"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle - FIXED */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - COMPLETE FIX */}
      {mobileOpen && (
        <div
          style={animationStyles.slideDown}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg fixed w-full top-[74px] left-0 z-[9998] h-[calc(100vh-74px)] overflow-y-auto"

        >
          <div className="px-4 py-3 space-y-3">
            {/* Search in Mobile */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Courses Dropdown in Mobile */}
            <div className="border-b pb-2">
              <button
                onClick={() => {
  setMobileCoursesOpen(!mobileCoursesOpen);
  setMobileMasterclassOpen(false);
  setMobileResourcesOpen(false);
}}

                className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
              >
                <span>Courses</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileCoursesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileCoursesOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {courseCategories.map((category) => (
                    <div key={category.id} className="border-l border-indigo-200 pl-3">
                      <p className="font-semibold text-gray-800 text-sm mb-2">{category.name}</p>
                      <div className="space-y-1.5">
                        {category.courses.map((course, index) => (
                          <Link
                            key={index}
                            to={course.path}
                            className="block py-1.5 px-2 hover:bg-indigo-50 rounded transition-colors duration-200 text-sm text-gray-700"
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileCoursesOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate">{course.displayName || course.name}</span>
                              {course.duration && (
                                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-1">
                                  {course.duration}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Hands-on projects & certification
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MASTERCLASS MOBILE */}
            <div className="border-b pb-2">
              <button
                onClick={() => {
  setMobileMasterclassOpen(!mobileMasterclassOpen);
  setMobileCoursesOpen(false);
  setMobileResourcesOpen(false);
}}

                className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span>Masterclass</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded font-medium">EXPERT</span>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileMasterclassOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileMasterclassOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {masterclassCategories.map((category) => (
                    <div key={category.id} className="border-l border-purple-200 pl-3">
                      <p className="font-semibold text-gray-800 text-sm mb-2">{category.name}</p>
                      <div className="space-y-1.5">
                        {category.courses.map((masterclass, index) => (
                          <Link
                            key={index}
                            to={masterclass.path}
                            className="block py-1.5 px-2 hover:bg-purple-50 rounded transition-colors duration-200 text-sm text-gray-700"
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileMasterclassOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate">{masterclass.displayName || masterclass.name}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Expert-led intensive training
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link 
                to="/internships" 
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
                onClick={() => setMobileOpen(false)}
              >
                Internships
              </Link>
              <Link 
                to="/b2b" 
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
                onClick={() => setMobileOpen(false)}
              >
                Corporate
              </Link>
              <Link 
                to="/careers" 
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
                onClick={() => setMobileOpen(false)}
              >
                Careers
              </Link>
            </div>

            {/* Resources Mobile */}
            <div className="border-b pb-2">
              <button
                onClick={() => {
  setMobileResourcesOpen(!mobileResourcesOpen);
  setMobileCoursesOpen(false);
  setMobileMasterclassOpen(false);
}}

                className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm font-medium text-gray-800"
              >
                <span>Resources</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileResourcesOpen && (
                <div className="pl-4 space-y-1 mt-2">
                  <Link to="/about-us" className="block py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>About Us</Link>
                  <Link to="/faqs" className="block py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>FAQs</Link>
                  <Link to="/terms" className="block py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Terms</Link>
                  <Link to="/privacy" className="block py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Privacy</Link>
                  <Link to="/contact" className="block py-2 px-2 hover:bg-gray-50 rounded transition-colors duration-200 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Contact</Link>
                </div>
              )}
            </div>

            {/* Wallet & Profile in Mobile */}
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-600 truncate">{getUserIdentifier()}</p>
                    </div>
                  </div>
                </div>

                {/* Wallet Mobile */}
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 mb-3">
                  <p className="text-xs text-gray-600 mb-1">Wallet Balance</p>
                  <p className="text-lg font-bold text-gray-900 mb-2">{userCredits.toLocaleString()} Credits</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (addCredits) {
                          addCredits(500);
                          alert("Added 500 credits!");
                          setMobileOpen(false);
                        }
                      }}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded text-sm font-medium"
                    >
                      + 500
                    </button>
                    <Link
                      to="/refer"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded text-center text-sm font-medium"
                    >
                      Refer
                    </Link>
                  </div>
                </div>

                {/* Mobile Links */}
                <div className="space-y-1">
                  <Link to="/profile" className="block py-2.5 px-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-800" onClick={() => setMobileOpen(false)}>My Profile</Link>
                  <Link to="/my-courses" className="block py-2.5 px-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-800" onClick={() => setMobileOpen(false)}>My Courses</Link>
                  <Link to="/orders" className="block py-2.5 px-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-800" onClick={() => setMobileOpen(false)}>My Orders</Link>
                  <Link to="/settings" className="block py-2.5 px-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-800" onClick={() => setMobileOpen(false)}>Settings</Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left py-2.5 px-2 hover:bg-red-50 text-red-600 rounded text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ✅ COMPACT WALLET DROPDOWN
function WalletDropdown({ user, userCredits, addCredits }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };


  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCredits = (amount) => {
    if (addCredits && typeof addCredits === 'function') {
      addCredits(amount);
      alert(`Added ${amount} credits!`);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-2 py-1 rounded bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs flex items-center gap-1 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="truncate max-w-[50px]">{userCredits.toLocaleString()}</span>
      </button>

      {showDropdown && (
        <div
          style={animationStyles.fadeIn}
          className="absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50"
        >
          <div className="mb-3">
            <p className="font-semibold text-gray-800 text-sm">Wallet Balance</p>
            <p className="text-xl font-bold text-gray-900">{userCredits.toLocaleString()} Credits</p>
            <p className="text-xs text-gray-500">1 Credit = ₹1 Value</p>
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm font-medium text-gray-700">Add Credits</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddCredits(500)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded text-sm"
              >
                + 500
              </button>
              <button
                onClick={() => handleAddCredits(1000)}
                className="bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded text-sm"
              >
                + 1000
              </button>
            </div>

            <Link
              to="/refer"
              onClick={() => setShowDropdown(false)}
              className="block w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 rounded text-center text-sm"
            >
              Refer & Earn
            </Link>
          </div>

          <div className="border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/wallet"
                onClick={() => setShowDropdown(false)}
                className="block text-center border border-gray-300 py-1.5 rounded text-sm"
              >
                Wallet
              </Link>
              <Link
                to="/transactions"
                onClick={() => setShowDropdown(false)}
                className="block text-center border border-gray-300 py-1.5 rounded text-sm"
              >
                Transactions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}