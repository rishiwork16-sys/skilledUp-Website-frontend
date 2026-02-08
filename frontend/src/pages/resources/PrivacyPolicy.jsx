import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();
  
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Privacy Policy Content */}
      <div className="w-full flex justify-center py-10" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
        <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-8 md:p-12 leading-relaxed text-gray-800" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>

          <h1 className="text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
            Privacy Policy
          </h1>

          <Section
            title="Introduction"
            content="This Privacy Policy explains how skilledUp ('Skilledup Technologies Private Limited,' 'we,' or 'our') collects, uses, stores, and protects your personal and sensitive personal data. It applies to your use of our website, services, and all subdomains under www.skilledup.tech. By accessing our Products, you agree to the practices outlined here. For terms governing your use of our platform, refer to our Terms and Conditions."
          />

          <Section
            title="Applicability of the Policy"
            content="This policy governs all information collected when you use skilledUp's systems and services. It does not apply to information gathered by third parties through external links, advertisements, or integrations connected to our platform."
          />

          <Section
            title="Information We Collect"
            content="We collect personal data that you voluntarily provide when creating an account or interacting with our Products. This includes basic profile details, contact information, preferences, uploaded content, feedback, and updates you share. We may also receive information from third-party platforms you use to log in, and from publicly available or legally permitted background records."
          />

          <Section
            title="Processing Your Personal Data"
            content="Your data is processed to enable account creation, service access, assessments, report generation, customer support, participation in events or surveys, and delivery of personalized content. With your permission, we may use your information to connect you with job opportunities or career-related services."
          />

          <Section
            title="Consent"
            content="We process your data based on lawful grounds such as your consent, contractual requirements, or our legitimate interest in providing services. You may withdraw your consent or deactivate your account at any time through your profile settings or by contacting us."
          />

          <Section
            title="Data Storage and Organization"
            content="Your data is stored securely using industry-standard systems including AWS databases, ElasticSearch, Sentry, New Relic, S3 storage, and Google Analytics. These systems help manage user information, logs, performance, and analytics in a structured and protected environment."
          />

          <Section
            title="Your Rights"
            content="You have the right to access, correct, delete, restrict, or object to the processing of your Personal Data. You may also request a machine-readable copy of your data or withdraw your consent if it was the basis for processing. While you may delete your information anytime, certain residual data may remain in system logs for a limited period."
          />

          <Section
            title="Retention"
            content="We retain your data for as long as your account remains active. Once deleted, associated information is removed from our systems, with remaining logs purged within one year."
          />

          <Section
            title="Passive Data Collection"
            content="We automatically collect technical information such as IP addresses, browser details, device information, and website usage patterns through cookies and tracking technologies. This helps us improve platform performance and user experience."
          />

          <Section
            title="Cookies"
            content="Cookies are used to enhance navigation, personalize content, analyze usage, and support site functionality. You can choose to disable cookies in your browser settings, though some services may not function properly without them."
          />

          <Section
            title="Disclosure of Personal Data"
            content="We may share your information with employees, trusted partners, service providers, or hiring partners strictly for operational or career-related purposes. Data may also be shared during organizational changes or if required by legal obligations. All disclosures follow applicable laws and privacy safeguards."
          />

          <Section
            title="Data Security"
            content="We use encryption, secure servers, and regular security audits to protect your data. While we take significant measures to safeguard your information, you are also responsible for maintaining the confidentiality of your login credentials."
          />

          <Section
            title="Integration with Third-Party Sites"
            content="Our platform may include links to external sites for additional resources or services. We are not responsible for the content or practices of these third-party websites, and we recommend reviewing their respective privacy policies before interacting with them."
          />

          <Section
            title="Third-Party Ad Networks"
            content="We may work with external ad networks that display targeted ads based on your visits or browsing patterns. These networks use their own tracking technologies, governed by their independent privacy policies."
          />

          <Section
            title="Anonymized Information"
            content="We may use anonymized or aggregated data for analytics, reporting, and improving our Products. This data does not identify you individually."
          />

          <Section
            title="Age Restrictions"
            content="Our services are intended for individuals aged 18 or above. If we discover that data has been collected from a minor, we will delete it promptly."
          />

          <Section
            title="Updates"
            content="We may revise this Privacy Policy periodically to reflect changes in technology, legal obligations, or our practices. Your continued use of our services indicates acceptance of the updated policy."
          />

          <Section
            title="Grievance"
            content="If you have concerns, complaints, or requests related to this Privacy Policy, you may contact our Grievance Officer, Ms. Deepa Vishnani, at deepa@skilledup.tech. We aim to respond and resolve issues within 30 days."
          />

          <Section
            title="Contact"
            content="This Privacy Policy should be read alongside any agreements you enter into with skilledUp, as well as our Terms of Service. By using our Products, you acknowledge and agree to the collection and processing of your data as described in this policy."
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

/* ---- Reusable Section component ---- */
function Section({ title, content }) {
  const formatContent = (text) => {
    // Convert email addresses to mailto links
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(emailRegex);

    return parts.map((part, index) => {
      if (emailRegex.test(part)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
            style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className="mb-4"
      style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
    >
      {/* Question (FAQ-style) */}
      <h2 className="text-[15px] md:text-[16px] font-semibold text-gray-900 mb-1">
        {title}
      </h2>

      {/* Answer (FAQ-style) */}
      <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed">
        {formatContent(content)}
      </p>
    </div>
  );
}
