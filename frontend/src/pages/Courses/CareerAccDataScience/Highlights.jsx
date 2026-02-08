import SectionContainer from "./components/SectionContainer";

const Highlights = ({ highlightsData }) => {
  const defaultHighlights = [
    {
      title: "Product (What You Learn)",
      items: [
        "Industry-ready Data Science & GenAI",
        "9-month structured learning journey",
        "205+ live mentor-led weekend sessions",
        "20+ real-world industry projects",
        "Python, SQL, ML & GenAI tool stack",
        "Lifetime access to dashboards & tools",
        "Peer learning & expert community access"
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
        "Interview prep starts from Day 1",
        "Resume & portfolio development",
        "Internship options up to 1 year",
        "Real interview & hiring simulations",
        "Dedicated placement support team",
        "Placement help during course period",
        "Job guarantee available (T&C Apply)"
      ],
    },
  ];

  const highlightsToRender = highlightsData && highlightsData.length > 0 ? highlightsData : defaultHighlights;

  return (
    <SectionContainer bgColor="#fefefe">
      <div className="bg-white rounded-3xl p-6 lg:p-8">
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
              <div className="
            absolute top-0 left-0
            h-[6px] w-full
            bg-gradient-to-r from-[#264f9b] to-[#3bbdf5]
          " />

              <h3
                className="text-lg lg:text-xl font-bold text-[#264f9b] mb-4 lg:mb-5"
                style={{ fontFamily: '"Canva Sans", "Open Sans", sans-serif' }}
              >
                {card.title}
              </h3>

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