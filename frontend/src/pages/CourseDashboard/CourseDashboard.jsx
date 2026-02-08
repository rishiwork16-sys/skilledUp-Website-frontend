import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  ChevronLeft,
  Menu,
  Award,
  FileText,
  MessageSquare,
  Lock
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import HlsPlayer from '../../components/common/HlsPlayer';
import { useUser } from '../../context/UserContext';
import api from '../../api/api';

const CourseDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Fetch Course Data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/courses/id/${courseId}`);
        setCourse(response.data);

        // Set initial active lesson if available
        if (response.data.modules && response.data.modules.length > 0) {
          const firstModule = response.data.modules[0];
          if (firstModule.videos && firstModule.videos.length > 0) {
            setActiveLesson(firstModule.videos[0]);
            // Optionally fetch first video URL immediately or wait for user interaction
          }
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Fetch Video URL when active lesson changes
  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!activeLesson || !user?.id) return;

      // Reset URL to avoid showing previous video while loading
      setVideoUrl(null);
      setVideoLoading(true);

      try {
        // Using the endpoint /api/courses/play/{videoId}?userId={userId}
        // Note: The controller returns a String (the URL) wrapped in ResponseEntity.ok()
        const response = await api.get(`/api/courses/play/${activeLesson.id}`, {
          params: { userId: user.id }
        });
        setVideoUrl(response.data);
      } catch (err) {
        console.error("Failed to fetch video URL:", err);
        // Handle error (e.g., show forbidden message)
      } finally {
        setVideoLoading(false);
      }
    };

    if (activeLesson) {
      fetchVideoUrl();
    }
  }, [activeLesson, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            {error || "Course not found"}
            <Link to="/orders" className="block mt-4 text-indigo-600 hover:scale-105 transition-transform underline">Back to My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Course Header / Navigation */}
      <div className="bg-white border-b border-gray-200 mt-16 sticky top-16 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/orders"
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex items-center justify-center"
              title="Back to My Orders"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="font-bold text-gray-800 text-lg truncate max-w-md">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Bar could be real if we track progress */}
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700">0%</span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow flex relative container mx-auto px-0 md:px-4 py-0 md:py-6 gap-6 h-[calc(100vh-128px)]">

        {/* Sidebar - Course Content */}
        <div className={`
          fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 z-40
          md:relative md:transform-none md:w-96 md:shadow-none md:border md:border-gray-200 md:rounded-2xl md:flex md:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Course Content</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules && course.modules.map((module, mIndex) => (
              <div key={module.id} className="border-b border-gray-50">
                <button
                  onClick={() => setActiveModule(mIndex === activeModule ? -1 : mIndex)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{module.title}</h4>
                    <p className="text-xs text-gray-500">{module.videos ? module.videos.length : 0} lessons</p>
                  </div>
                  <ChevronLeft
                    size={16}
                    className={`transform transition-transform text-gray-400 ${activeModule === mIndex ? '-rotate-90' : ''}`}
                  />
                </button>

                {activeModule === mIndex && (
                  <div className="bg-gray-50 py-2">
                    {module.videos && module.videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setActiveLesson(video);
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`
                          w-full px-4 py-3 flex items-start gap-3 transition-colors
                          ${activeLesson?.id === video.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-gray-100'}
                        `}
                      >
                        <div className="mt-1">
                          {/* We can check if it's completed if we track progress. For now, just play icon */}
                          <PlayCircle size={16} className={activeLesson?.id === video.id ? 'text-indigo-600' : 'text-gray-400'} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-medium ${activeLesson?.id === video.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                            {video.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button className="w-full py-3 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:shadow-sm transition">
              <Award size={18} className="text-orange-500" />
              Get Certificate
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white md:rounded-2xl shadow-sm border border-gray-100">
          {/* Video Player */}
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {activeLesson ? (
              videoLoading ? (
                <div className="text-white">Loading Video...</div>
              ) : videoUrl ? (
                <HlsPlayer
                  src={videoUrl}
                  autoPlay={true}
                  poster={course.thumbnail}
                />
              ) : (
                <div className="text-center text-white">
                  <PlayCircle size={64} className="opacity-80 mx-auto mb-4" />
                  <p>Video unavailable</p>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="text-white font-medium">Select a lesson to start learning</p>
              </div>
            )}
          </div>

          {/* Lesson Details */}
          {activeLesson && (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1"><BookOpen size={16} /> Module {activeModule + 1}</span>
                <span>•</span>
                <span>{activeLesson.duration}</span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">
                  {activeLesson.description || "No description available."}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CourseDashboard;
