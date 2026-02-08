import { useState } from "react";
import SectionContainer from "./components/SectionContainer";

const FAQ = ({ faqData: faqDataProp } = {}) => {
  const [faqActiveIndex, setFaqActiveIndex] = useState(null);

  const defaultFaqData = [
    {
      q: "Who can apply for this program?",
      a: "The program is open to final-year students, graduates, and working professionals from any academic background. Both beginners and intermediate learners are welcome.",
    },
    {
      q: "Is prior technical or coding experience required?",
      a: "No prior experience is required. The program starts from core fundamentals and gradually advances to industry-level Data Science and Generative AI concepts.",
    },
    {
      q: "What topics and tools are covered in the program?",
      a: "The curriculum includes Python, SQL, MySQL, Statistics, Data Visualization, Machine Learning, Deep Learning, NLP, Generative AI, and tools like Excel, Power BI, Looker Studio, and MongoDB, with real-world applications.",
    },
    {
      q: "What is the duration and learning structure of the program?",
      a: "This is a 9-month Career Accelerator program designed for deep skill development, combining live weekend sessions, real-world projects, and guided self-learning.",
    },
    {
      q: "What is the mode of learning and class schedule?",
      a: "The program is available in both online and offline modes, with live interactive weekend classes led by industry experts. All sessions are recorded for revision.",
    },
    {
      q: "How much daily time commitment is expected?",
      a: "Learners are expected to dedicate 4–5 hours per day for guided self-learning, assignments, and hands-on practice to achieve optimal outcomes.",
    },
    {
      q: "What kind of projects and internships are included?",
      a: "Learners work on 20+ real-world, industry-aligned projects and may receive internship opportunities of up to one year, based on eligibility and performance.",
    },
    {
      q: "What placement and job support is provided?",
      a: "The program offers structured job assistance, including resume building, interview preparation, and access to hiring opportunities. A job guarantee is available subject to meeting defined eligibility and performance criteria.",
    },
    {
      q: "Will I receive certification and lifetime access?",
      a: "Yes. Learners receive a program completion certificate and lifetime access to course content, recorded sessions, and learning resources.",
    },
    {
      q: "What is the refund policy?",
      a: "The course fee is strictly non-refundable under any circumstances. All refund, job guarantee, and eligibility conditions are governed by the official Terms & Conditions published by skilledUp.",
    },
  ];

  const faqData =
    Array.isArray(faqDataProp) && faqDataProp.length > 0
      ? faqDataProp
      : defaultFaqData;

  return (
    <SectionContainer bgColor="#f9fafb">
      <div id="faq">
        <h2 className="text-center text-[26px] lg:text-[34px] font-bold text-[#1f2937] mb-[14px]">
          Frequently Asked <span className="text-[#264f9b]">Questions</span>
        </h2>

        <div className="max-w-[900px] mx-auto">
          <div className="space-y-0">
            {faqData.map((item, index) => {
              const isOpen = faqActiveIndex === index;
              const question = item?.q ?? item?.question ?? "";
              const answer = item?.a ?? item?.answer ?? "";

              return (
                <div
                  key={index}
                  className="bg-white border border-[#e5e7eb] rounded-[10px] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setFaqActiveIndex(isOpen ? null : index)
                    }
                    className="w-full flex justify-between items-center
                       px-[18px] py-[10px]
                       text-left text-[16px] font-medium text-gray-800
                       hover:bg-gray-50 transition-colors"
                  >
                    {question}
                    <span
                      className={`text-[18px] text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-[18px] pb-[10px] text-[15px] text-gray-600 leading-[1.6]">
                      {answer}
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
