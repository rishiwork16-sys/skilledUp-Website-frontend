import { useState } from "react";
import SectionContainer from "./components/SectionContainer";

const Certificate = () => {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <SectionContainer bgColor="#f3f4f6">
      <div id="certificate-section">
        <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-[40px] items-center">
          <div>
            <h2 className="text-[32px] lg:text-[42px] font-bold text-[#1f2937] mb-6 lg:mb-[25px]">
              Certificate Overview
            </h2>

            <h3 className="text-[18px] lg:text-[20px] font-semibold text-[#1f2937] mb-6 lg:mb-[20px]">
              Receive an industry-recognized certificate from skilledUp that validates your skills, hands-on experience, and job readiness upon successful course completion.
            </h3>

            <ul className="space-y-[5px]">
              {[
                "Industry-aligned skill validation",
                "Project-based learning recognition",
                "Employer-ready credential",
                "Shareable digital certificate",
                "Career & placement value"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-[10px] text-[20px] text-[#374151] leading-[1.5]">
                  <span className="mt-[3px] text-[#264f9b] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <img
              src="/images/careerx_certificate.png"
              alt="Certificate"
              className="w-full max-w-[500px] mx-auto cursor-zoom-in"
              onClick={() => setShowCertificate(true)}
            />
            <div
              className="mt-[10px] text-[16px] lg:text-[18px] text-[#2563eb] font-semibold cursor-pointer"
              onClick={() => setShowCertificate(true)}
            >
              Click to Zoom
            </div>
          </div>
        </div>

        {showCertificate && (
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-[99999] p-4"
            onClick={() => setShowCertificate(false)}
          >
            <div
              className="w-full max-w-[576px] h-[576px] bg-white rounded-[10px] relative p-[8px] shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="absolute top-[6px] right-[10px] text-[22px] font-bold text-[#2563eb] cursor-pointer z-[100000]"
                onClick={() => setShowCertificate(false)}
              >
                ✕
              </span>

              <img
                src="../images/CareerX.png"
                alt="Certificate Zoom"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default Certificate;