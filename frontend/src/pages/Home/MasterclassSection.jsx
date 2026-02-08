import { Link } from "react-router-dom";

const MasterclassSection = () => {
  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  skilled<span className="text-blue-600">Up </span>
                  Builds Skills
                </h4>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">That Get You Hired</p>
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Masterclass
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 leading-relaxed">Designed for Real Growth</p>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 leading-relaxed">
                  Feeling stuck in your career? Learn in-demand skills through expert-led
                  masterclasses designed by industry professionals. Gain practical knowledge,
                  real-world insights, and skills that truly make a difference.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-0">
                  <Link
                    to="/masterclass"
                    className="inline-flex items-center justify-center w-fit sm:w-auto max-w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 sm:px-8 py-2.5 rounded-lg shadow-lg transition-colors duration-300 text-base sm:text-lg whitespace-nowrap"
                  >
                    Explore Masterclasses
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-3 mt-0 pt-0 border-t border-gray-200">
                <div className="text-center py-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    5+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Masterclasses
                  </div>
                </div>

                <div className="text-center py-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    20K+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Participants
                  </div>
                </div>

                <div className="text-center py-2 col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    4.9<span className="text-lg align-top">★</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative h-full min-h-[400px] flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h5 className="text-xl md:text-2xl font-bold mb-4">
                    Industry Experts. Real Experience. Real Results
                  </h5>

                  <p className="text-lg opacity-90 max-w-md mx-auto">
                    Gain practical knowledge from professionals actively working in the industry and stay ahead with skills companies value.
                  </p>

                  <div className="absolute top-8 left-8 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-12 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Industry-Led Expert Instructors</h4>
            <p className="text-gray-600">Learn directly from experienced professionals who bring real-world industry insights, practical knowledge, and proven strategies into every masterclass.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Live, Interactive Masterclasses</h4>
            <p className="text-gray-600">Attend instructor-led live sessions with real-time discussions, Q&A, and hands-on demonstrations; designed to keep learning engaging and practical.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Career-Focused Skill Development</h4>
            <p className="text-gray-600">Build in-demand skills to fast-track career growth, enhance job readiness, and unlock new opportunities across data, analytics, and technology-driven roles.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;