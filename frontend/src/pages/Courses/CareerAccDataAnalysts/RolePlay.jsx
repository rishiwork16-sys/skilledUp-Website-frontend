import SectionContainer from "./components/SectionContainer";

const RolePlay = () => {
  return (
    <SectionContainer bgColor="white">
      <div
        id="role-section"
        style={{
          fontFamily: '"Canva Sans","Inter","Poppins",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        }}
      >
        <h2 className="text-[28px] lg:text-[34px] font-bold text-[#1f2937] mb-6 lg:mb-[35px] text-center lg:text-left">
          What role does a Data Professional play?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[35px]">

          {[
            {
              title: "junior Data Scientist",
              description:
                "Design and implement scalable applications using  ML algorithms and analyze complet Data to Find hidder Patterns .",
            },
            {
              title: "Data Analyst",
              description:
                "Develop application for fixing data quality issues and get data insights.",
            },
            {
              title: " ML Engineer",
              description:
                "Build Scable Machine Learning Pipeline and create innovative ML applications.",
            },
            {
              title: "Data Engineer",
              description:
                "Design, build and maintain data infrastructure for large-scale applications.",
            },
            {
              title: "Business Analyst",
              description:
                "Analyze business requirements, build analytical models, cleanse data, and deliver actionable insights effectively.",
            },

          ].map((role, index) => (
            <div
              key={index}
              className="flex gap-[15px] py-[10px]"
            >
              {/* LEFT LINE */}
              <div className="w-[4px] bg-[#5a42f3] rounded-[4px]" />

              {/* CONTENT */}
              <div>
                <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1f2937]">
                  {role.title}
                </h3>
                <p className="mt-[6px] text-[14px] lg:text-[15px] leading-[1.4] text-[#374151]">
                  {role.description}
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