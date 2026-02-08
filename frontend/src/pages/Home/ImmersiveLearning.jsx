import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ImmersiveLearning = ({ openForm }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleFeatureClick = () => {
    if (!isVideoPlaying) {
      setIsVideoPlaying(true);
    }
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Immersive Learning Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn by doing. Build real skills through hands-on training that prepares you for real jobs from day one.
          </p>
        </div>

        <div className="pt-0 pb-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-0 pb-0 mb-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <button
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition duration-300 cursor-pointer hover:bg-blue-100 w-full text-left"
                onClick={handleFeatureClick}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Personalized Learning & 1:1 Mentorship</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Learn at your own pace with a clear learning path made for your career goals. Get regular mentor support, personal feedback, and progress tracking to keep you focused and confident.
                  </p>
                </div>
              </button>

              <button
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition duration-300 cursor-pointer hover:bg-gray-100 w-full text-left"
                onClick={handleFeatureClick}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Real-World Assignments & Industry Projects</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Work on practical assignments and live projects based on real company problems. Learn through live sessions, instant doubt clearing, group activities, and peer learning; just like a real work environment.
                  </p>
                </div>
              </button>

              <button
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition duration-300 cursor-pointer hover:bg-blue-100 w-full text-left"
                onClick={handleFeatureClick}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Interview Preparation from Day One</h3>
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Interview training starts from the first week. Practice mock interviews, technical rounds, aptitude tests, and communication skills regularly so you feel fully prepared for real interviews.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <button
                  onClick={openForm}
                  className="bg-blue-600 text-white py-3 px-10 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md text-base"
                >
                  Know More
                </button>
              </div>
            </div>
          </div>

          <div className="relative lg:-translate-y-[10%]">
            <div className="bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl p-6 aspect-video flex items-center justify-center shadow-xl border border-gray-200">
              <div className="text-center w-full max-w-2xl">
                <div className="relative inline-block w-full">
                  <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-600 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <img
                      src="/images/immer.png"
                      alt="Immersive Learning Preview"
                      className="w-full h-80 object-cover rounded-xl shadow-2xl relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveLearning;