import { motion } from "framer-motion";
// import SectionContainer from "./components/SectionContainer";

const defaultMentors = [
  {
    id: 1,
    name: "Vijay Narayan Singh",
    role: "Founder & CEO – skilledUp | Ex-Paytm, EXL",
    image: "/images/vijaysir.png",
    workExp: "13+",
    teachExp: "7+",
    bio: "13+ years' experience in data science, analytics strategy, leadership, and mentoring learners into successful careers.",
  },
  {
    id: 2,
    name: "Aman Chauhan",
    role: "CTO – skilledUp",
    image: "/images/amansir-photo.jpg",
    workExp: "3+",
    teachExp: "3+",
    bio: "Lead data science and engineering expert skilled in Python, SQL, ML, AI, and mentoring learners into job-ready roles.",
  },
  // {
  //   id: 3,
  //   name: "Shabyasachi Thakur",
  //   role: "CBO & Industry Expert – skilledUp",
  //   image: "/images/sabya.png",
  //   workExp: "15+",
  //   teachExp: "7+",
  //   bio: "Senior industry leader with 15+ years of experience driving fintech growth, public policy initiatives, and AI-led transformations.",
  // },
  {
    id: 4,
    name: "Utkarsh Keshari",
    role: "Lead Software Engineer – skilledUp",
    image: "/images/utkarsh.jpeg",
    workExp: "1+",
    teachExp: "1+",
    bio: "Hands-on software engineer building scalable web applications and mentoring learners with real-world development practices.",
  },
];

const MentorCard = ({ mentor }) => (
  <div className="w-[320px] sm:w-[360px] md:w-[380px] flex-shrink-0
    bg-white/10 backdrop-blur-lg border border-white/20
    rounded-2xl p-6 flex flex-col">

    <div className="text-center flex flex-col flex-grow">

      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
        <img
          src={mentor.imageUrl || mentor.image || "/images/course-placeholder.png"}
          alt={mentor.name || "Mentor"}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-bold text-white">
        {mentor.name}
      </h3>

      <p className="text-gray-300 text-sm mt-1 mb-4">
        {mentor.role}
      </p>

      <div className="flex justify-center mt-2 mb-4">
        <img
          src="/images/skilledUp Logo.png"
          alt="skilledUp"
          className="h-6 md:h-7 object-contain rounded-lg bg-white px-1 py-0.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {mentor.workExpYears != null ? `${mentor.workExpYears}+` : mentor.workExp}
          </div>
          <div className="text-xs text-gray-300">
            Years Work Experience
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {mentor.teachExpYears != null ? `${mentor.teachExpYears}+` : mentor.teachExp}
          </div>
          <div className="text-xs text-gray-300">
            Years Teaching Experience
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {mentor.about || mentor.bio}
      </p>

    </div>
  </div>
);

const MentorsSlider = ({ mentors } = {}) => {
  const list = Array.isArray(mentors) ? mentors : defaultMentors;
  if (!list.length) return null;
  return (
    <section className="py-6 bg-gradient-to-br from-black to-gray-900 text-white overflow-hidden">
      <div className="max-w-9xl mx-auto px-4">
    
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">
            Your Mentors for Career Success
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get hands-on guidance from practitioners who know what employers expect.
          </p>
        </div>
    
        {/* ================= SLIDER ================= */}
        <div className="relative overflow-hidden">
    
          {/* ===== DESKTOP: AUTO SCROLL ===== */}
          <motion.div
            className="hidden md:flex gap-8"
            animate={{ x: [0, -list.length * 396] }}
            transition={{
              duration: list.length * 9,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
          >
            {[...list, ...list].map((mentor, index) => (
              <MentorCard key={`desktop-${mentor.id || mentor.imageKey || mentor.name || index}-${index}`} mentor={mentor} />
            ))}
          </motion.div>
    
          {/* ===== MOBILE: MANUAL SWIPE ===== */}
          <div className="md:hidden flex gap-6 overflow-x-auto scrollbar-hide px-1">
            {list.map((mentor, index) => (
              <MentorCard key={`mobile-${mentor.id || mentor.imageKey || mentor.name || index}`} mentor={mentor} />
            ))}
          </div>
    
        </div>
      </div>
    </section>
  );
};

export default MentorsSlider;
