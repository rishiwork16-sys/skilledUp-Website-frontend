import SectionContainer from "./components/SectionContainer";

const Curriculum = ({ activeIndex, setActiveIndex }) => {
  const lecturesData = [
    {
      name: "Pre-Recorded Foundations (Analytics & Statistics)",
      Course: [
        "Advanced Excel for Analytics & Automation",
        "Business KPIs, OKRs & North-Star Metrics",
        "Data Visualization with Looker Studio",
        "AI-Powered Analytics & Auto-Insight Tools",
        "Applied Statistics for Data Science",
        "Probability, A/B Testing & Experiments",
        "Bias, Variance & Model Risk Handling",
      ],
    },
    {
      name: "Modern Data Engineering & Analytics",
      Course: [
        "Advanced SQL & Query Optimization",
        "PostgreSQL for Scalable Analytics Systems",
        "BigQuery for Cloud-Scale Data Analysis",
        "Snowflake Cloud Data Warehousing",
        "Dimensional Data Modeling (Star & Snowflake)",
        "ETL / ELT Pipelines & dbt Fundamentals",
        "Power BI Dashboards for Business Decisions",
        "Executive Reporting & Data Storytelling",
      ],
    },
    {
      name: "Programming for Data & AI",
      Course: [
        "Python Programming for Data & AI Systems",
        "Advanced Python Automation & APIs",
        "Data Structures for Scalable ML Systems",
        "NumPy for High-Performance Computing",
        "Pandas for Large-Scale Data Processing",
        "Data Visualization with Matplotlib",
        "Advanced Visuals using Seaborn & Plotly",
      ],
    },
    {
      name: " Advanced Data Analytics & GenAI",
      Course: [
        "Generative AI Tools for Data Analysts",
        "SQL, Excel & Python with AI Copilots",
        "Automated Insights, Narrative Analytics & Reporting",
        "Building Analytics Assistants using LangChain",
        "End-to-End LLM-Powered Analytics Applications",
      ],
    },
    {
      name: " Industry-Grade Capstone Projects",
      Course: [
        "Sales, Marketing & Growth Analytics Project",
        " Product & User Behavior Analytics",
        "Finance, Operations & Supply Chain Analytics",
        " Executive Dashboard & Business Reporting Project",
        " End-to-End Analytics Project (Data → Insight → Decision)"
      ],
    },
    {
      name: "Career, Interview & Placement",
      Course: [
        "Resume, GitHub & Portfolio Optimization",
        "Real-World Industry Project Portfolio",
        "Business Case Studies & Problem Solving",
        "Technical & Managerial Mock Interviews",
        "Placement Support & Career Roadmapping",
      ],
    },
  ];

  return (
    <SectionContainer bgColor="#ffffff">
      <div style={{
        fontFamily: "'Open Sans', 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        {/* ===== SECTION TITLE ===== */}
        <h2
          className="text-center text-[24px] lg:text-[30px] font-bold mb-6 lg:mb-[35px]"
          style={{ color: "#232833" }}
        >
          Course <span style={{ color: "#264f9b" }}>Curriculum</span>
        </h2>

        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-[30px] bg-[#fefefe] p-2 lg:p-[6px] rounded-[12px]"
        >
          {/* LEFT : COURSE LIST - REDUCED HEIGHT AND BOLD TEXT */}
          <div className="w-full lg:w-[45%] border border-[#c6c8cc] rounded-[8px] overflow-hidden self-start">

            {lecturesData.map((course, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative cursor-pointer transition px-3 py-2 lg:px-[16px] lg:py-[10px] border-b border-[#c6c8cc]
                  ${activeIndex === i
                    ? "bg-[#ffffff] border-l-[4px] border-l-[#264f9b]"
                    : "hover:bg-[#fefefe] border-l-[4px] border-l-transparent"}
                  min-h-[40px]`}
              >
                <span className="text-[11px] text-[#818999] font-medium">
                  Course {i + 1}
                </span>

                <h4
                  className={`mt-[2px] text-[13px] lg:text-[13.5px] leading-[1.2] font-semibold
                    ${activeIndex === i ? "text-[#264f9b]" : "text-[#4e5666]"}`}
                >
                  {course.name}
                </h4>

                <span className="absolute right-2 lg:right-[14px] top-1/2 -translate-y-1/2 text-[20px] text-[#818999]">
                  ›
                </span>
              </div>
            ))}
          </div>

          {/* RIGHT : MODULES - COMPACT VERSION */}
          <div className="w-full lg:w-[55%] space-y-1 lg:space-y-2">
            {lecturesData[activeIndex].Course.map((m, i) => (
              <div
                key={i}
                className="px-3 py-2 lg:px-[14px] lg:py-[10px] border border-[#c6c8cc] flex justify-between items-center rounded-[6px] bg-[#ffffff] hover:border-[#3bbdf5] transition min-h-[45px]"
              >
                <span className="text-[12px] lg:text-[12.5px] text-[#232833] leading-snug">
                  Module {i + 1} : {m}
                </span>
                <span className="text-[14px] text-[#818999] flex-shrink-0 ml-2">🔒</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Curriculum;