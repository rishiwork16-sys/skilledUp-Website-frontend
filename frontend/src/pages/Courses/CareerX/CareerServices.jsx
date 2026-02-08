import SectionContainer from "./components/SectionContainer";

const CareerServices = () => {
  const services = [
    { icon: "✨", text: "Career & Placement Support from Day One" },
    { icon: "🔑", text: "Exclusive Access to skilledUp Job Portal" },
    { icon: "🤖", text: "AI-Optimized Resume, LinkedIn & GitHub" },
    { icon: "🎙️", text: "Monthly Mock Interviews with Industry Scenarios" },
    { icon: "👥", text: "1:1 Career Mentorship & Personalized Roadmap" },
    { icon: "💰", text: "Salary Negotiation & Long-Term Career Strategy" },
  ];

  return (
    <SectionContainer bgColor="bg-gray-50">
      <div>
        <h2 className="text-[28px] lg:text-[36px] font-bold mb-[20px] text-center lg:text-left">
          Career Success Ecosystem
        </h2>

        <div className="bg-white p-6 lg:p-[25px] rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[30px]">
          <div className="flex items-center">
            <img
              src="/images/career_eco.jpeg"
              alt="Career Services"
              className="w-full h-[200px] lg:h-[400px] object-cover rounded-[15px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-[15px]">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#f7fbff] border border-[#e2eefc] p-4 lg:p-[18px] rounded-[12px] flex items-center gap-4 lg:gap-[15px]"
              >
                <span className="text-[28px] lg:text-[32px]">{service.icon}</span>
                <p className="m-0 text-sm lg:text-base">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default CareerServices;