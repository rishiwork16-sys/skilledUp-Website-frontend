import { motion } from "framer-motion";
import ReviewCard from "./components/ReviewCard";

const studentReviews = [
  {
    id: 1,
    name: "Ananya Mehra",
    rating: 5,
    review: "The learning journey built my confidence from the ground up. Practical projects, mentor support, and interview preparation helped me transition smoothly into a real analytics role.",
    avatar: "/images/slider_girl.jpeg",
    company: "Placed at TCS"
  },
  {
    id: 2,
    name: "Rahul Khanna",
    rating: 5,
    review: "Clear concepts, hands-on assignments, and constant guidance made learning stress-free. Mock interviews prepared me well and helped me confidently crack my first analytics role.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at EY"
  },
  {
    id: 3,
    name: "Simran Kaur",
    rating: 5,
    review: "Working on real datasets changed how I think about data. Mentor feedback and structured learning helped me apply skills confidently in a professional environment.",
    avatar: "/images/slider_girl.jpeg",
    company: "Placed at Accenture"
  },
  {
    id: 4,
    name: "Faizan Ali",
    rating: 5,
    review: "The course bridged the gap between theory and industry work. Assignments were practical and mentors were always available. I felt supported throughout my journey.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at HCL"
  },
  {
    id: 5,
    name: "Nitin Arora",
    rating: 5,
    review: "Strong fundamentals, real projects, and focused interview guidance helped me gain confidence. I now feel prepared to handle real analytics tasks at work.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at Cognizant"
  },
  {
    id: 6,
    name: "Apoorva Jain",
    rating: 5,
    review: "Starting from zero, I learned analytics step by step. Hands-on practice and interview preparation helped me secure a role I once thought was out of reach.",
    avatar: "/images/slider_girl.jpeg",
    company: "Placed at Deloitte"
  },
  {
    id: 7,
    name: "Sandeep Malhotra",
    rating: 5,
    review: "The balance of concepts and practical work helped me build a strong portfolio. Mentor guidance made a big difference during interviews and assessments.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at Infosys"
  },
  {
    id: 8,
    name: "Riya Chatterjee",
    rating: 5,
    review: "The learning was intense but rewarding. Real-world tasks and regular feedback improved my thinking and helped me grow into a confident data professional.",
    avatar: "/images/slider_girl.jpeg",
    company: "Placed at Wipro"
  },
  {
    id: 9,
    name: "Harsh Vardhan",
    rating: 5,
    review: "Updated content and practical dashboards made learning enjoyable. The mentors were patient and the placement support helped me prepare effectively.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at Capgemini"
  },
  {
    id: 10,
    name: "Neel Gupta",
    rating: 5,
    review: "The structured learning approach gave clarity and direction. Practice sessions and mock interviews boosted my confidence and readiness for real projects.",
    avatar: "/images/slider_man.jpeg",
    company: "Placed at Tech Mahindra"
  },
];

const StudentReviews = () => {
  return (
    <section className="pt-12 pb-10 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-9xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Student Feedback & Career Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How skilledUp learning translates into skills, confidence, and jobs.
          </p>
        </div>

        {/* ================= SLIDER ================= */}
        <div className="relative overflow-hidden">
          {/* DESKTOP → AUTO SCROLL */}
          <motion.div
            className="hidden md:flex gap-4"
            animate={{ x: [0, -studentReviews.length * 396] }}
            transition={{
              duration: studentReviews.length * 8,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
          >
            {[...studentReviews, ...studentReviews].map((review, index) => (
              <ReviewCard key={`desktop-${review.id}-${index}`} review={review} />
            ))}
          </motion.div>

          {/* MOBILE → MANUAL SWIPE */}
          <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide px-1">
            {studentReviews.map((review) => (
              <ReviewCard key={`mobile-${review.id}`} review={review} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-8 pb-0 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[60%] mx-auto">
          {[
            { number: "30k+", label: "Happy Students" },
            { number: "4.9", label: "Average Rating" },
            { number: "85%", label: "Placement Rate" },
            { number: "100%", label: "PPO Conversion Rate" },
          ].map(({ number, label }, i) => (
            <div
              key={i}
              className="text-center bg-blue-50 rounded-xl px-3 py-4 border border-blue-100 shadow-sm"
            >
              <div className="text-lg md:text-xl font-semibold text-blue-600">
                {number}
              </div>
              <div className="text-[14px] font-semibold text-gray-600 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentReviews;