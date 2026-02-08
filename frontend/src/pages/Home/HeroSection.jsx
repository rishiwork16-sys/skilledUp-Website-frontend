import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#264f9b] text-white py-10 md:py-20 lg:py-28">
      {/* Background Glow Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 md:-top-20 md:-left-20 md:w-60 md:h-60 bg-blue-900 rounded-full blur-2xl md:blur-3xl opacity-20"></div>
        <div className="absolute top-10 right-0 w-48 h-48 md:top-20 md:w-72 md:h-72 bg-blue-800 rounded-full blur-2xl md:blur-3xl opacity-15"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold sm:font-extrabold leading-snug sm:leading-tight"
        >
          Learn Today. <span className="text-white">Lead Tomorrow with skilledUp!</span>
        </motion.h4>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-sky-200 px-2"
        >
          Join skilledUp to turn your career goals into reality. From learning to placement, we guide you every step of the way toward long-term success.
        </motion.p>

        {/* CTA Buttons - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="
            flex flex-col sm:flex-row
            justify-center items-center
            gap-3 sm:gap-4
            mt-6 sm:mt-8
            px-4
          "
        >
          {/* Explore Courses */}
          <button
            className="
              w-auto
              max-w-[260px]
              sm:max-w-none
              min-h-[44px]
              bg-white text-black
              px-6
              py-2.5 sm:py-3
              rounded-lg
              font-semibold
              text-sm sm:text-base
              text-center
              whitespace-nowrap
              hover:bg-gray-200
              transition
              active:scale-95
            "
            onClick={() => window.location.href = "/courses"}
          >
            Explore Courses
          </button>

          {/* Book Free Demo */}
          <button
            className="
              w-auto
              max-w-[260px]
              sm:max-w-none
              min-h-[44px]
              bg-black/30 border border-white
              px-6
              py-2.5 sm:py-3
              rounded-lg
              font-semibold
              text-sm sm:text-base
              text-center
              whitespace-nowrap
              hover:bg-black/40
              transition
              active:scale-95
            "
            onClick={() => navigate("/masterclass")}
          >
            Book Free Demo
          </button>
        </motion.div>

        {/* Auto Slider - Fully Responsive */}
        <div className="relative mt-10 sm:mt-12 md:mt-14 left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="overflow-hidden"
          >
            <motion.div
              className="flex gap-4 sm:gap-5 md:gap-6 min-w-max px-4 sm:px-0"
              initial={{ x: "0%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...Array(2)].map((_, idx) => (
                <div className="flex gap-4 sm:gap-5 md:gap-6 min-w-max" key={idx}>
                  {/* CARD 1 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Job Guarantee & PPO Support</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Assured placement support with access to PPO opportunities through the CareerX program based on performance.</p>
                  </div>

                  {/* CARD 2 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Live Training by Industry Mentors</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Interactive live sessions led by expert mentors to help you master practical, job-ready skills effectively.</p>
                  </div>

                  {/* CARD 3 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Hands-On Real Industry Projects</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Work on real-world case studies and projects that build strong practical experience and showcase your abilities.</p>
                  </div>

                  {/* CARD 4 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Instant Doubt-Solving Support</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Get quick resolution of doubts through live support, ensuring uninterrupted learning and better clarity.</p>
                  </div>

                  {/* CARD 5 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Personality & Career Development</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Develop communication, confidence, and professional skills through structured personality development sessions.</p>
                  </div>

                  {/* CARD 6 */}
                  <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/20 h-[200px] sm:h-[220px] md:h-[250px] w-[280px] sm:w-[320px] md:w-[380px] flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Interview Prep & Mock Sessions</h3>
                    <p className="text-sky-200 text-xs sm:text-sm md:text-base mt-1">Start interview preparation from Day 1 with mock interviews, feedback, and continuous performance tracking.</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile touch indicators */}
        {/* <div className="sm:hidden flex justify-center items-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;