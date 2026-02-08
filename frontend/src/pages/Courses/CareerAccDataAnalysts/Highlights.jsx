import SectionContainer from "./components/SectionContainer";

const Highlights = ({ highlightsData }) => {
  const defaultHighlights = [
    {
      title: "Product (What You Learn)",
      items: [
        "15+ Real-World Projects",
        "Internships (up to 1 year)",
        "Data Domain Community Access",
        "Lifetime Dashboard Access",
        "Blog Writing Platform",
        "Personality Development Sessions",
        "Lifetime access to dashboards & tools"
      ],
    },
    {
      title: "Process (How You Learn)",
      items: [
        "Live weekend classes by experts",
        "Daily 4–5 hours guided self-study",
        "Hands-on tasks after every module",
        "Live doubt-solving & 1:1 mentoring",
        "Personalized learning & progress plans",
        "Monthly mock interviews & assessments",
        "Soft skills & personality training"
      ],
    },
    {
      title: "Placement (Career Outcomes)",
      items: [
        "100% Placement Assistance",
        "Placement During Course",
        "Mock Interviews & On-Demand Career Guidance",
        "Dedicated placement support team",
        "Placement help during course period",
        "Job guarantee available (T&C Apply)"
      ],
    },
  ];

  const highlightsToRender = (highlightsData && highlightsData.length > 0) ? highlightsData : defaultHighlights;

  return (
    <SectionContainer bgColor="#fefefe">
      <div className="bg-white rounded-3xl p-6 lg:p-8">
        {/* Heading with Canva Sans */}
        <h2
          className="text-center text-[24px] lg:text-[32px] font-bold text-[#232833] mb-6 lg:mb-10"
          style={{ fontFamily: '"Canva Sans", "Open Sans", sans-serif' }}
        >
          Key Highlights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
           {highlightsToRender.map((card, i) => (
            <div
              key={i}
              className="
            relative bg-white border border-[#c6c8cc]
            rounded-2xl p-6 lg:p-7 overflow-hidden
            transition hover:-translate-y-2 hover:shadow-2xl
            w-full
          "
            >
              {/* TOP GRADIENT LINE (INSIDE CARD – SAFE) */}
              <div className="
            absolute top-0 left-0
            h-[6px] w-full
            bg-gradient-to-r from-[#264f9b] to-[#3bbdf5]
          " />

              {/* Card title with Canva Sans */}
              <h3
                className="text-lg lg:text-xl font-bold text-[#264f9b] mb-4 lg:mb-5"
                style={{ fontFamily: '"Canva Sans", "Open Sans", sans-serif' }}
              >
                {card.title}
              </h3>

              {/* List items with Open Sans - REDUCED GAP */}
              <ul
                className="list-disc pl-5 text-sm lg:text-[15px] text-[#4e5666] leading-relaxed lg:leading-relaxed"
                style={{ fontFamily: '"Open Sans", "Canva Sans", sans-serif' }}
              >
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