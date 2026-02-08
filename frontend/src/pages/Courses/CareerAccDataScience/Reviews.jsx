import { useState } from "react";
import SectionContainer from "./components/SectionContainer";
import FormModal from "../../../components/FormModal";
import RegistrationForm from "../../form/formpage";

const Reviews = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <SectionContainer bgColor="white">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[60px] items-center justify-between">
          <div className="flex-[0_0_45%] flex flex-col justify-center">
            <h2 className="text-[32px] sm:text-[38px] lg:text-[44px] font-semibold text-[#222] leading-tight">
              What Our Learners  <span className="text-[#3155F6]">Say</span>
            </h2>

            <p className="mt-[18px] text-[16px] lg:text-[18px] leading-[1.7] text-[#666] max-w-[520px]">
              Placed across product companies, fintech, edtech, services, and startups-our learners are shaping data-driven businesses globally.
            </p>

            <button
              onClick={openForm}
              className="
          mt-[28px]
          inline-flex items-center gap-[12px]
          w-fit
          px-[22px] py-[12px]
          rounded-[8px]
          border-[3px] border-[#2f238f]
          text-[#2f238f]
          font-bold text-[15px] lg:text-[16px]
          transition-all duration-150
          hover:-translate-y-[2px]
          hover:bg-[rgba(47,35,143,0.06)]
        "
            >
              Engage with Industry Experts
            </button>
          </div>

          <div className="flex-[0_0_45%] w-full flex justify-center lg:justify-end">
            <div
              className="
          relative 
          w-full 
          max-w-[1000px] 
          pt-[66%]
          rounded-[16px] 
          overflow-hidden 
          bg-[#f3f3f3]
          shadow-[0_6px_18px_rgba(20,20,30,0.08)]
          border border-black/10
        "
            >
              <img
                src="/images/community.jpeg"
                alt="Community"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      <FormModal isOpen={isFormOpen} onClose={closeForm}>
        <RegistrationForm />
      </FormModal>
    </>
  );
};

export default Reviews;