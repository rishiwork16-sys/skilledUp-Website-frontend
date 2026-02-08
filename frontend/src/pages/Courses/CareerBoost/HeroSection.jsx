import { Link } from "react-router-dom";
import SectionContainer from "./components/SectionContainer";

const HeroSection = ({ scrollToCourseFee, openForm }) => {
  return (
    <section
      className="relative overflow-hidden bg-[#e0f0ff]"
      style={{
        minHeight: "5.9in",
        background:
          "radial-gradient(circle at 10% 0%,#e0f0ff,#e0f0ff 40%),linear-gradient(135deg,#e0f0ff,#e0f0ff)",
      }}
    >
      {/* MAIN CONTENT */}
      <div className="relative z-10 h-full w-full max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.8fr_1.1fr] gap-8 lg:gap-5 pt-6 lg:pt-10">
        {/* LEFT */}
        <div className="">
          <h1
            className="text-[1.4rem] sm:text-[1.2rem] lg:text-[1.8rem] leading-tight sm:leading-tight lg:leading-tight font-bold text-[#232833] mb-0 -mb-0"
          >
            Career Boost: Data Analytics &{" "}
            <span className="text-[#264f9b]">GenAI</span>
          </h1>

          <h4
            className="text-[#264f9b] font-semibold text-[1rem] sm:text-[1.05rem] lg:text-[1.1rem] mt-0 leading-tight"
          >
            100% Job Assistance
          </h4>

          <p className="mt-4 max-w-xl text-[0.9rem] sm:text-[0.95rem] lg:text-[0.98rem] leading-[1.6] lg:leading-[1.65] text-[#4e5666]">
            Career Boost: Data Analytics & Gen AI is a comprehensive, placement-focused program available both online and offline, designed for beginners and intermediate learners. Guided by an experienced data professional, the program offers personalized mentorship, regular progress assessments, and a structured curriculum that builds industry-ready skills. Participants gain hands-on experience with essential tools and technologies including MySQL, Python, NumPy, Pandas, Matplotlib, Seaborn, Power BI, and Gen AI. Through real-world projects, learners develop practical expertise, ensuring they are fully prepared for a successful career in data analytics and AI.
          </p>

          <div className="flex items-center gap-3 mt-3 lg:mt-2 text-sm text-[#4e5666]">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <p>4.9 / 5 · 3000+ Learners</p>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-fit">
            <button
              onClick={scrollToCourseFee}
              className="px-5 py-2 rounded-lg bg-[#264f9b] text-white font-semibold text-sm text-center hover:opacity-90 transition"
            >
              Apply Now
            </button>

            <Link
              to="#"
              className="px-5 py-2 rounded-lg border border-[#c6c8cc] text-[#264f9b] font-semibold text-sm text-center hover:bg-[#264f9b] hover:text-white transition"
            >
              Download Brochure
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE - ADJUSTED POSITION */}
        <div className="flex justify-center lg:justify-end items-start mt-0 lg:mt-[0.5in]">
          <div
            className="w-full max-w-[500px] sm:w-[5.4in] h-auto sm:h-[3in] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <img
              src="/images/Career Boost_ Data Analytics & GenAI.png"
              alt="Career Boost Data Analytics with GenAI"
              className="w-full h-auto sm:h-full object-contain sm:object-cover"
            />
          </div>
        </div>
      </div>

      {/* META STRIP - MOBILE RESPONSIVE */}
      <div className="relative z-20 px-4 mt-8 sm:mt-13 mb-8 sm:mb-12">
        <div className="mx-auto w-full max-w-[1350px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            ["Duration", "4 Months"],
            ["Mode", "Online/Offline (Noida)"],
            ["Language", "English/Hindi"],
            ["Internship", "Up to 12 Months"],
            ["Certified by", "skilledUp"],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="bg-white px-4 py-4 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl border border-[#c6c8cc] text-center shadow-sm"
            >
              <span className="block text-xs sm:text-sm text-[#818999] tracking-wide">
                {label}
              </span>
              <span className="block mt-1 text-sm sm:text-base font-semibold text-[#232833]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;