import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatsAndLogos = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // run once on mount
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-black via-gray-600 to-blue-900 text-white py-12 md:py-20">
      <div className="absolute inset-0 bg-[url('/images/pattern.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: "15+", label: "Courses" },
            { num: "20+", label: "Industry Mentors" },
            { num: "5000+", label: "Placed Students" },
            { num: "67%", label: "Avg Salary Hike" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="bg-white/20 backdrop-blur-xl border border-white/50 rounded-3xl p-6 text-center"
            >
              <h3 className="text-xl sm:text-3xl font-bold">{item.num}</h3>
              <p className="mt-1 text-xs sm:text-sm opacity-80">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-center mt-10 text-sm sm:text-lg font-medium">
          Trusted By Leading Companies
        </h3>

        {/* Logos */}
        <div className="relative overflow-hidden mt-8">
          <motion.div
        key={isMobile ? "mobile" : "desktop"} // 🔥 forces restart
        className="flex gap-12 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: isMobile ? 8 : 25, // make mobile clearly faster
          repeat: Infinity,
          ease: "linear",
        }}
      >
            {[...Array(2)].map((_, i) => (
              <div className="flex gap-12 items-center" key={i}>
                {[
                  "/images/IndusInd_Bank_SVG_Logo.svg",
                  "/images/swiggy-1.svg",
                  "/images/Tata_Consultancy_Services_old_logo.svg",
                  "/images/Wipro_Primary_Logo_Color_RGB.svg",
                  "/images/Genpact_logo.svg",
                  "/images/Axis_Bank_logo.svg",
                  "/images/PwC_2025_Logo.svg",
                  "/images/Uber_logo_2018.svg",
                ].map((src, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-xl min-w-[150px] flex items-center justify-center"
                  >
                    <img
                      src={src}
                      className="h-10 md:h-12 object-contain opacity-90"
                      alt="logo"
                    />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsAndLogos;
