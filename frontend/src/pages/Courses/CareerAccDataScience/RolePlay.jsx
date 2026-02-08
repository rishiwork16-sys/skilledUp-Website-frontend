import SectionContainer from "./components/SectionContainer";

const defaultRoles = [
  {
    title: "Data Scientist",
    description:
      "Design and implement scalable applications using AI & ML algorithms.",
  },
  {
    title: "Data Analyst",
    description:
      "Develop application for fixing data quality issues and get data insights.",
  },
  {
    title: "AI & ML Engineer",
    description: "Build LLMs and create innovative AI applications.",
  },
  {
    title: "Data Engineer",
    description:
      "Design, build and maintain data infrastructure for large-scale applications.",
  },
  {
    title: "Junior Data Scientist",
    description:
      "Work on analysis, model building & data cleansing to solve business problems.",
  },
  {
    title: "Applied Scientist",
    description: "Develop & deploy ML solutions to solve real-world problems.",
  },
];

const RolePlay = ({ courseTitle, roles } = {}) => {
  const roleCards =
    Array.isArray(roles) && roles.length > 0 ? roles : defaultRoles;

  const headingCourseName =
    typeof courseTitle === "string" && courseTitle.trim()
      ? courseTitle.trim()
      : "DS/GenAI";

  return (
    <SectionContainer bgColor="white">
      <div
        id="role-section"
        style={{
          fontFamily: '"Canva Sans","Inter","Poppins",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        }}
      >
        <h2 className="text-[28px] lg:text-[34px] font-bold text-[#1f2937] mb-6 lg:mb-[35px] text-center lg:text-left">
          What role does {headingCourseName} play?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[35px]">

          {roleCards.map((role, index) => (
            <div
              key={index}
              className="flex gap-[15px] py-[10px]"
            >
              <div className="w-[4px] bg-[#5a42f3] rounded-[4px]" />

              <div>
                <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1f2937]">
                  {role.title || role.role || ""}
                </h3>
                <p className="mt-[6px] text-[14px] lg:text-[15px] leading-[1.4] text-[#374151]">
                  {role.description || ""}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </SectionContainer>
  );
};

export default RolePlay;
