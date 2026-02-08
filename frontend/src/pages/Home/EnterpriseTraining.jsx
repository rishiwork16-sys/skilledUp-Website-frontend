import { useNavigate } from "react-router-dom";

const EnterpriseTraining = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Enterprise Training Solutions by skilledUp
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Empower your workforce with customized, outcome-driven learning programs built for organizational growth and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Customized Curriculum for Your Business</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Role-based, industry-aligned training programs tailored to your organization's goals, skill gaps, and technology roadmap.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Learn from Industry Experts</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Sessions led by certified subject matter experts and industry veterans with hands-on, real-world experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Advanced Enterprise Reporting</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Track learning progress, skill adoption, and performance impact with detailed analytics and actionable insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Job-Ready Workforce Post Training</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Employees gain practical, immediately applicable skills to improve efficiency, innovation, and business results.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                onClick={() => navigate("/b2b")}
                className="
                  w-full sm:w-auto
                  bg-gradient-to-r from-blue-600 to-blue-700
                  hover:from-blue-700 hover:to-blue-800
                  text-white font-semibold
                  py-2.5 sm:py-3
                  px-6 sm:px-8
                  rounded-lg
                  transition-all duration-300
                  transform hover:scale-105
                  shadow-lg
                  text-sm sm:text-base
                "
              >
                Schedule a Free Demo
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-1.5 sm:p-2 flex items-center justify-center shadow-xl relative overflow-hidden">
              <div className="w-full h-full">
                <img
                  src="/images/enterprice.png"
                  alt="Enterprise Training Solutions"
                  className="w-full h-auto object-cover rounded-2xl"
                  style={{
                    minHeight: "clamp(230px, 30vh, 400px)",
                    maxHeight: "clamp(300px, 60vh, 500px)",
                    height: "auto"
                  }}
                />
              </div>

              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-full"></div>
                <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="pt-8 pb-0 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-full sm:max-w-[80%] md:max-w-[60%] mx-auto">
          {[
            { number: "20+", label: "Enterprise Clients" },
            { number: "40k", label: "Professionals Trained" },
            { number: "97%", label: "Satisfaction Rate" },
            { number: "45%", label: "Productivity Gain" },
          ].map(({ number, label }, i) => (
            <div
              key={i}
              className="text-center bg-blue-50 rounded-xl px-2 sm:px-3 py-3 sm:py-4 border border-blue-100 shadow-sm"
            >
              {/* Stat Number */}
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-600 leading-tight">
                {number}
              </div>

              {/* Stat Label */}
              <div className="text-xs sm:text-[13px] md:text-[14px] font-semibold text-gray-600 leading-snug mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnterpriseTraining;