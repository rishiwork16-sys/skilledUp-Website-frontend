import { useState } from "react";
import SectionContainer from "./components/SectionContainer";

const FAQ = () => {
  const faqData = [
    {
      q: "What is the duration and learning mode of the course?",
      a: "The program is a 6-month intensive course delivered through live, interactive weekend sessions, available in both online and offline modes.",
    },
    {
      q: "Who can apply for this program?",
      a: "The course is suitable for beginners, final-year students, graduates, and working professionals, including learners from non-technical backgrounds.",
    },
    {
      q: "Is prior experience in Data Analytics or AI required?",
      a: "No prior experience is required. The curriculum supports absolute beginners as well as intermediate learners.",
    },
    {
      q: "What skills and technologies will I learn?",
      a: "You will gain hands-on expertise in Python, SQL, MySQL, BigQuery, Power BI, Looker Studio, Machine Learning, and Generative AI, along with strong analytical and problem-solving skills.",
    },
    {
      q: "What topics are covered in the curriculum?",
      a: "The course covers databases, Python programming, data visualization, analytics tools, Machine Learning, and GenAI applications, aligned with real-world business scenarios.",
    },
    {
      q: "What kind of projects and internships are included?",
      a: "Learners work on 15+ real-world, industry-based projects and may receive internship opportunities of up to one year, based on performance and project completion.",
    },
    {
      q: "Will I get lifetime access to course content?",
      a: "Yes. Learners receive lifetime access to recorded sessions, learning materials, dashboards, and resources via the student dashboard.",
    },
    {
      q: "Is interview preparation and mock interviewing included?",
      a: "Yes. Interview preparation starts from Day 1, including resume building, hiring simulations, and monthly mock interviews.",
    },
    {
      q: "What makes this course different from other platforms?",
      a: "skilledUp focuses on live mentor-led training, real-world projects, continuous mentorship, and career support, rather than only recorded content.",
    },
    {
      q: "What is the refund policy?",
      a: "The course fee is strictly non-refundable under any circumstances. Once enrolled, fees paid cannot be refunded, transferred, or adjusted.",
    },
  ];

  const FAQAccordion = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
      <div className="space-y-0">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="bg-white border border-[#e5e7eb] rounded-[10px] overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center
                       px-[18px] py-[10px]
                       text-left text-[16px] font-medium text-gray-800
                       hover:bg-gray-50 transition-colors"
              >
                {item.q}
                <span
                  className={`text-[18px] text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="px-[18px] pb-[10px] text-[15px] text-gray-600 leading-[1.6]">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <SectionContainer bgColor="#f9fafb">
      <div id="faq">
        <h2 className="text-center text-[26px] lg:text-[34px] font-bold text-[#1f2937] mb-[14px]">
          Frequently Asked <span className="text-[#264f9b]">Questions</span>
        </h2>

        <div className="max-w-[900px] mx-auto">
          <FAQAccordion />
        </div>
      </div>
    </SectionContainer>
  );
};

export default FAQ;