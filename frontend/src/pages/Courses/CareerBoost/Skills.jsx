import SectionContainer from "./components/SectionContainer";

const Skills = ({ showMoreSkills, setShowMoreSkills, skills }) => {
  const defaultSkills = [
    "Python", "SQL", "Statistics",
    "Power BI", "Excel",
    "Numpy", "Pandas", "Matplotlib", "Seaborn",
    "Plotly", "GenAi Tools",
    "PostgreSQL", "BigQuery",
    "Cloud",
  ];

  const allSkills = (skills && skills.length > 0) ? skills : defaultSkills;
  const displayedSkills = showMoreSkills ? allSkills : allSkills.slice(0, 8);

  return (
    <SectionContainer bgColor="white">
      <div>
        {/* Headline with Canva Sans */}
        <h2
          className="text-[20px] sm:text-[22px] lg:text-[28px] font-bold mb-4 sm:mb-5 lg:mb-[25px] text-[#1f2937]"
          style={{ fontFamily: '"Canva Sans", "Open Sans", sans-serif' }}
        >
          Skills Covered in This Course
        </h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[25px]">
          {displayedSkills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-[8px] sm:gap-[10px] p-3 sm:p-4 lg:p-[15px_18px] bg-white
               border border-[#e5e7eb] rounded-[4px] sm:rounded-[6px]
               shadow-[0_2px_6px_rgba(0,0,0,0.06)] sm:shadow-[0_3px_8px_rgba(0,0,0,0.08)]"
            >
              <span className="w-[4px] sm:w-[6px] h-[32px] sm:h-[40px] bg-[#0049ad] rounded-[2px] sm:rounded-[3px]" />
              {/* Skill text with Open Sans */}
              <span
                className="text-xs sm:text-sm lg:text-base"
                style={{ fontFamily: '"Open Sans", "Canva Sans", sans-serif' }}
              >
                {skill}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center my-4 sm:my-5 lg:my-[15px]">
          {/* Button text with Open Sans */}
          <button
            onClick={() => setShowMoreSkills(!showMoreSkills)}
            className="text-[14px] sm:text-[15px] text-[#0049ad] font-semibold"
            style={{ fontFamily: '"Open Sans", "Canva Sans", sans-serif' }}
          >
            {showMoreSkills ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Skills;