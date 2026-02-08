import { useState } from "react";
import FormModal from "../../../components/FormModal";
import RegistrationForm from "../../form/formpage";
import SectionContainer from "./components/SectionContainer";

const ExclusiveDoubtSession = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <SectionContainer bgColor="#F5F6FB">
      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-[80px]">
        <div className="relative w-full lg:w-[520px] flex-shrink-0">
          <div className="relative flex flex-col gap-6 lg:gap-[42px] items-center lg:items-start">
            <img
              src="https://mljar.com/_next/static/media/studio-app.9b399ea7.jpg"
              alt="Doubt Solving Session"
              className="w-full lg:w-[4in] h-[2.2in] rounded-[18px] bg-[#fefefe] object-cover border border-[#c6c8cc] shadow-[0_12px_34px_rgba(0,0,0,0.14)]"
            />

            <img
              src="https://daxg39y63pxwu.cloudfront.net/images/Deep%20Learning%20Image%20Classification%20in%20Python%20with%20CNN/Neural%20Network%20Image%20Classification_Data_Pre-Processing.png"
              alt="Learning Session"
              className="w-full lg:w-[4in] h-[2.2in] rounded-[18px] bg-[#fefefe] object-cover border border-[#c6c8cc] shadow-[0_12px_34px_rgba(0,0,0,0.14)] hidden lg:block"
            />
          </div>

          <img
            src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202005/SE-1-3-Online-Study-May11-3.jpeg?size=1200:675"
            alt="Online Study"
            className="absolute top-1/2 left-1/2 w-[5in] h-[2.2in] -translate-x-1/2 -translate-y-1/2 rounded-[18px] object-cover border border-[#c6c8cc] bg-[#fefefe] shadow-[0_18px_44px_rgba(0,0,0,0.18)] z-[5] hidden lg:block"
          />
        </div>

        <div className="flex-1 max-w-[580px] text-center lg:text-left">
          <h2 className="text-[28px] lg:text-[32px] font-bold text-[#232833] leading-[1.25] tracking-[-0.2px]">
            Personalized <span className="text-[#264f9b]">Doubt-Solving Assistance</span>
          </h2>

          <p className="mt-[12px] text-[15px] text-[#4e5666] leading-[1.6] font-normal">
            Get direct, one-to-one doubt clarification from subject-matter experts whenever you need support.
          </p>

          <button
            onClick={openForm}
            className="mt-[22px] px-[26px] py-[11px] bg-[#264f9b] text-white text-[16px] font-semibold rounded-[10px] transition hover:bg-[#191917]"
          >
            Talk to an Expert
          </button>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm}>
        <RegistrationForm />
      </FormModal>
    </SectionContainer>
  );
};

export default ExclusiveDoubtSession;