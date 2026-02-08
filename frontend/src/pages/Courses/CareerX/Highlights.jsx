import SectionContainer from "./components/SectionContainer";

const Highlights = ({ highlightsData }) => {
  const defaultHighlights = [
    {
      title: "Product (What You Learn)",
      items: [
        "9-Month Live Data Science & GenAI Program",
        "205+ Hours of Live Weekend Training",
        "20+ Industry-Grade Real-World Projects",
        "Job-Aligned Curriculum for Data & AI",
        "Hands-On Internships & Practical Exposure",
        "Lifetime Access to Learning Dashboard",
        "Access to Data & AI Professional Network"
      ],
    },
    {
      title: "Process (How You Learn)",
      items: [
        "Live Online & Offline Classroom Sessions",
        "Structured, High-Discipline Learning Path",
        "Live Doubt-Solving with Expert Mentors",
        "8–10 Hours Daily Guided Self-Learning",
        "Monthly Mock Interviews & Skill Reviews",
        "Personality & Communication Training",
        "Interview Preparation from Day One"
      ],
    },
    {
      title: "Placement (Career Outcomes)",
      items: [
        "Placement Support During Course Duration",
        "Pre-Placement Offer (PPO) Opportunities",
        "Job Guarantee Program (T&C Apply)",
        "₹5 LPA Minimum Package for Eligibility",
        "Dedicated Placement & Interview Team",
        "Hiring Partnerships Across Industries",
        "Direct Hiring if Timeline Is Missed"
      ],
    },
  ];

  const highlightsToRender = (highlightsData && highlightsData.length > 0) ? highlightsData : defaultHighlights;

  return (
    <SectionContainer bgColor="#fefefe">
      <div className="bg-white rounded-3xl p-6 lg:p-8">
        <h2 className="text-center text-[24px] lg:text-[32px] font-bold text-[#232833] mb-6 lg:mb-10">
          Key Highlights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {highlightsToRender.map((card, i) => (
            <div
              key={i}
              className="relative bg-white border border-[#c6c8cc] rounded-2xl p-6 lg:p-7 overflow-hidden transition hover:-translate-y-2 hover:shadow-2xl w-full"
            >
              <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-[#264f9b] to-[#3bbdf5]" />

              <h3 className="text-lg lg:text-xl font-bold text-[#264f9b] mb-4 lg:mb-5">
                {card.title}
              </h3>

              <ul className="list-disc pl-5 text-sm lg:text-[15px] text-[#4e5666] leading-relaxed lg:leading-relaxed">
                {card.items.map((item, idx) => (
                  <li key={idx} className="mb-1 lg:mb-1.5 last:mb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Highlights;