import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";

export default function TermsConditions() {
  const currentYear = new Date().getFullYear();
  
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Terms & Conditions Content */}
      <div className="w-full flex justify-center py-10" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 md:p-12 leading-relaxed text-gray-800" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>

          <h1 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
            Terms & Conditions
          </h1>

          <p className="mb-6" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
            These Terms & Conditions ("Terms") govern your access to and use of the platform, programs,
            and services offered by SkilledUp Technologies Private Limited ("skilledUp," "we," "our," or "us").
            By using our platform or services, you agree to be bound by these Terms along with our Privacy
            Policy and any other policies referenced herein. If you do not agree with these Terms, please
            discontinue use of our services.
          </p>

          <Section
            title="1. Acceptance of Terms & Updates"
            content="By accessing the skilledUp website, mobile applications, WhatsApp groups, emails, SMS, phone communication, or any platform managed by skilledUp, you agree to comply with these Terms. We may update the Terms periodically, and continued use of our services implies acceptance of the revised version."
          />

          <Section
            title="2. Services & Usage"
            content="skilledUp provides training programs designed for students and working professionals. We may modify, suspend, or discontinue services at our discretion. You are responsible for maintaining accurate account information, keeping your login credentials secure, and ensuring your devices, software, and internet connection meet access requirements. Upon registration, you are granted a limited, non-transferable, revocable license to use the platform for personal learning purposes."
          />

          <Section
            title="3. Registration & Account Responsibilities"
            content="You must provide accurate personal details during registration and must not impersonate others or create misleading accounts. You are responsible for all activities under your account unless you notify skilledUp of unauthorized access."
          />

          <Section
            title="4. Internship Eligibility"
            content={`Learners or applicants who wish to apply for an internship must submit their application exclusively through the official skilledUp website at https://skilledup.tech/internship. Applicants may be required to provide personal information such as full name, email address, phone number, residential address, educational qualifications, and any additional details requested in the application form. All internship programs offered by skilledUp are fully virtual and do not require any in-person interaction or human intervention beyond automated processing and communication. We also provide Summer and Winter Internship opportunities exclusively for undergraduate students. For Summer Internship applicants referred by colleges, universities, or recognized foundations, skilledUp may collect and verify documents such as Aadhar, PAN, and bank details for identity verification and stipend processing. All information collected during the internship application process is used strictly for application assessment, communication, verification, eligibility checks, and administrative purposes in accordance with this Privacy Policy.`}
          />

          <Section
            title="5. Use of User Data"
            content="By sharing personal data, you confirm ownership or necessary permissions. skilledUp processes data according to its Privacy Policy. While we use reasonable security measures, we are not liable for failures beyond our control."
          />

          <Section
            title="6. Third-Party Services"
            content="Our services may use third-party tools or contain external links. skilledUp is not responsible for third-party content, services, or data handling practices."
          />

          <Section
            title="7. Acceptable Use Policy"
            content={`You agree not to engage in unlawful, harmful, or disruptive activities including but not limited to:\nHarassing other users\nSharing or redistributing study materials\nHacking, bypassing security, or disrupting platform operations\nCopying, modifying, or reverse-engineering platform content\nViolation may lead to suspension or termination of your account.`}
          />

          <Section
            title="8. Intellectual Property"
            content="All content on the platform; including designs, code, documents, videos, and branding is owned by skilledUp or licensed to us. Unauthorized copying, distribution, or commercial use is strictly prohibited. You retain ownership of your uploaded content but grant skilledUp permission to use it for service delivery and improvements."
          />

          <Section
            title="9. Feedback"
            content="Any feedback, suggestions, or reviews you provide may be used by skilledUp for any purpose without obligation or compensation."
          />

          <Section
            title="10. Support"
            content="For technical or academic assistance, contact support@skilledup.tech. Advice provided by the support team does not constitute legal or professional warranties."
          />

          <Section
            title="11. Termination of Services"
            content="skilledUp may suspend or terminate your account for violations of these Terms, fraudulent activity, or misuse of the platform. Termination does not waive our right to enforce previous breaches."
          />

          <Section
            title="12. Disclaimer of Warranties"
            content="All services are provided on an 'as is' and 'as available' basis. skilledUp does not guarantee uninterrupted, error-free service or recognition of certificates by third-party institutions."
          />

          <Section
            title="13. Limitation of Liability"
            content="To the maximum extent permitted by law, skilledUp is not liable for indirect or consequential damages. Direct liability, if any, is limited to INR 500."
          />

          <Section
            title="14. Indemnity"
            content="You agree to indemnify and hold skilledUp harmless from claims arising out of misuse of the platform, violation of laws, or infringement of third-party rights."
          />

          <Section
            title="15. Payment Terms"
            content="All course fees must be paid in full at the time of registration unless otherwise approved. Payments are processed through third-party gateways; skilledUp does not store payment details and is not liable for gateway misuse or failures."
          />

          <Section
            title="16. Pause Policy"
            content="Courses cannot be paused. Recordings of missed sessions will be available, but live interactions cannot be recreated once the program ends."
          />

          <Section
            title="17. Pre-Placement Offer (CareerX Program)"
            content="Learners enrolled in the CareerX: Data Science & GenAI program are eligible for the Pre-Placement Offer and Job Guarantee only if they are graduates, maintain at least 95% attendance in all live sessions, submit all assignments on time with a minimum score of 70%, and clear all graded examinations with at least a 70% score. They are also required to actively participate in all placement activities conducted across India. If a learner rejects any interview opportunity or job offer, the PPO and Job Guarantee benefits will be revoked, and the learner will be shifted to the standard Job Assistance program."
          />

          <Section
            title="18. Job Guarantee Policy (If Applicable)"
            content="To qualify for the job guarantee, learners must be graduates, maintain 95% attendance in live sessions, submit at least 90% of assignments on time with a minimum score of 60%, clear all graded examinations with at least 60%, participate actively in all placement activities across India, and not reject more than five interview opportunities. If all these conditions are met and the learner is not placed within 90 days of completing the course, the program fee excluding GST will be refunded."
          />

          <Section
            title="19. Batch Transfer Policy"
            content="A batch transfer within the program duration may be requested for a fee of 25% of the current course fee + 18% GST."
          />

          <Section
            title="20. Refund Policy"
            content="skilledUp follows a strict no-refund policy. Exceptions: A one-time batch transfer request is allowed within 7 days of purchase. Under the CareerX: Data Science & GenAI Program, a refund of INR 5,000 may be granted only if the learner is not selected in any interview conducted under the program. Once selected, no refund is applicable."
          />

          <Section
            title="21. NDNC Consent"
            content="By registering, you authorize skilledUp to contact you via call, SMS, or email—even if your number is listed under DND/DNC—for up to 365 days."
          />

          <Section
            title="22. Copyright Infringement"
            content={`If you believe your copyrighted material has been misused, submit a written notice to:\nSkilledUp Technologies Pvt. Ltd.\nE8, 2nd Floor, Sector 3, Noida, Uttar Pradesh 201301\nEmail: support@skilledup.tech`}
          />

          <Section
            title="23. Miscellaneous"
            content="If any provision is deemed invalid, the remaining Terms remain enforceable. Failure to enforce any right does not constitute a waiver. Terms are personal and cannot be transferred without written consent. By using the platform, you confirm you are 18+, or using services under guardian supervision."
          />

          <Section
            title="24. Contact & Grievance Redressal"
            content="For queries, complaints, or reporting violations, contact: Grievance Officer: Deepa Vishnani Email: deepa@skilledup.tech"
          />

          {/* Inline CSS for global font application */}
          <style jsx global>{`
            body {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
            
            p, span, div, button, a, input, textarea, select {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
          `}</style>
        </div>
      </div>

          {/* Footer */}
    <Footer />
    </div>
  );
}

//* ---- Reusable Section component ---- */
function Section({ title, content }) {
  const formatContent = (text) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
            style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
          >
            {part}
          </a>
        );
      }

      // Convert email addresses to mailto links
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      const emailParts = part.split(emailRegex);

      if (emailParts.length > 1) {
        return emailParts.map((emailPart, emailIndex) => {
          if (emailRegex.test(emailPart)) {
            return (
              <a
                key={`${index}-${emailIndex}`}
                href={`mailto:${emailPart}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
                style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
              >
                {emailPart}
              </a>
            );
          }
          return emailPart;
        });
      }

      return part;
    });
  };

  return (
    <div
      className="mb-4"
      style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
    >
      {/* Question (same style as FAQ) */}
      <h2 className="text-[15px] md:text-[16px] font-semibold text-gray-900 mb-1">
        {title}
      </h2>

      {/* Answer (same style as FAQ) */}
      <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed">
        {formatContent(content)}
      </p>
    </div>
  );
}
