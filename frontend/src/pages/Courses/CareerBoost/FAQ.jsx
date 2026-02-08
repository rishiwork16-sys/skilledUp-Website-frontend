import { useState } from "react";
import SectionContainer from "./components/SectionContainer";

const FAQ = () => {
  const faqData = [
    {
      q: "What topics are covered in this course?",
      a: "The course covers MySQL, BigQuery, Python, Pandas, NumPy, Matplotlib, Seaborn, Power BI, and Data Visualization, with a strong focus on real-world business use cases.",
    },
    {
      q: "Who is eligible to join this program?",
      a: "The program is suitable for students, fresh graduates, and working professionals from both technical and non-technical backgrounds. No prior experience is required.",
    },
    {
      q: "Is prior experience required to enroll?",
      a: "No. The course is beginner-friendly and progresses step by step from fundamentals to advanced concepts.",
    },
    {
      q: "What is the duration and structure of the program?",
      a: "The program runs for 4 months, combining live weekend sessions, hands-on projects, and structured placement preparation.",
    },
    {
      q: "What is the class schedule and learning mode?",
      a: "Classes are conducted through intensive live weekend sessions, making it convenient for both students and working professionals.",
    },
    {
      q: "What if I miss a live class?",
      a: "All live sessions are recorded and available for lifetime access, allowing you to learn at your own pace.",
    },
    {
      q: "Does the course include hands-on projects and mentorship?",
      a: "Yes. Learners work on real-world projects and case studies and receive personalized mentorship with live doubt-solving support throughout the program.",
    },
    {
      q: "What placement and interview support is provided?",
      a: "The program offers 100% placement assistance, including resume building, mock interviews, technical assessments, and career guidance.",
    },
    {
      q: "Will I receive certification after completion?",
      a: "Yes. Learners receive a course completion certificate upon successfully finishing the program.",
    },
    {
      q: "What is the fee and refund policy?",
      a: "The course fee is strictly non-refundable under any circumstances. Once enrolled, fees paid cannot be refunded, transferred, or adjusted.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <SectionContainer bgColor="#f9fafb">
      <div id="faq">
        <h2 className="text-center text-[26px] lg:text-[34px] font-bold text-[#1f2937] mb-[14px]">
          Frequently Asked <span className="text-[#264f9b]">Questions</span>
        </h2>

        <div className="max-w-[900px] mx-auto">
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
                    className="w-full flex justify-between items-center px-[18px] py-[10px] text-left text-[16px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
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
        </div>
      </div>
    </SectionContainer>
  );
};

export default FAQ;