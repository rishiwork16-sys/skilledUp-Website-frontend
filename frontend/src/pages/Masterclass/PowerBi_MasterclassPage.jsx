// src\pages\Masterclass\PowerBi_MasterclassPage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getBackgrounds, getStates } from "../../legacy_api/home";
import { createInquiry } from "../../legacy_api/maseteclass";

const FAQItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = openIndex === index;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300">
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-center focus:outline-none"
        onClick={() => setOpenIndex(isOpen ? null : index)}
      >
        <h3 className="text-[17px] font-semibold text-gray-900">
          {faq.question}
        </h3>
        <span
          className={`text-purple-600 text-lg transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-[17px] leading-relaxed text-gray-600">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

// Fallback data to show immediately while loading
const FALLBACK_BACKGROUNDS = [
  "Student",
  "Business Analyst",
  "Data Analyst",
  "Manager",
  "Working Professional",
  "Career Switcher",
  "Other",
];

const FALLBACK_STATES = [
  "Delhi",
  "Uttar Pradesh",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
];

export default function PowerBiMasterclassPage() {
  const [openIndex, setOpenIndex] = useState(null);

  // ================= FORM STATES =================
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    stateName: "",
    backgroundName: "",
  });

  const formRef = useRef(null);
  const [backgrounds, setBackgrounds] = useState(FALLBACK_BACKGROUNDS);
  const [states, setStates] = useState(FALLBACK_STATES);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Fetch backgrounds and states on component mount - OPTIMIZED
  useEffect(() => {
    // Set immediate fallback data first
    setBackgrounds(FALLBACK_BACKGROUNDS);
    setStates(FALLBACK_STATES);

    // Then fetch from API in background
    fetchData();
  }, []);

  // Optimized fetch function with Promise.all for parallel loading
  const fetchData = async () => {
    try {
      // Load both in parallel for better performance
      const [backgroundsData, statesData] = await Promise.allSettled([
        getBackgrounds(),
        getStates(),
      ]);

      // Process backgrounds
      if (backgroundsData.status === "fulfilled") {
        const data = backgroundsData.value;
        const processedBackgrounds = processBackgroundsData(data);
        if (processedBackgrounds.length > 0) {
          setBackgrounds(processedBackgrounds);
        }
      }

      // Process states
      if (statesData.status === "fulfilled") {
        const data = statesData.value;
        const processedStates = processStatesData(data);
        if (processedStates.length > 0) {
          setStates(processedStates);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Keep fallback data if API fails
    }
  };

  // Helper function to process backgrounds data
  const processBackgroundsData = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map((bg) => bg.name || bg.backgroundName || bg);
    } else if (data && Array.isArray(data.data)) {
      return data.data.map((bg) => bg.name || bg.backgroundName || bg);
    } else if (data && typeof data === "object") {
      // Try to extract array from object properties
      const keys = Object.keys(data);
      if (keys.length > 0 && Array.isArray(data[keys[0]])) {
        return data[keys[0]].map((bg) => bg.name || bg.backgroundName || bg);
      }
    }
    return [];
  };

  // Helper function to process states data
  const processStatesData = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map((state) => state.name || state.stateName || state);
    } else if (data && Array.isArray(data.data)) {
      return data.data.map((state) => state.name || state.stateName || state);
    } else if (data && typeof data === "object") {
      // Try to extract array from object properties
      const keys = Object.keys(data);
      if (keys.length > 0 && Array.isArray(data[keys[0]])) {
        return data[keys[0]].map(
          (state) => state.name || state.stateName || state
        );
      }
    }
    return [];
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.mobileNumber?.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.stateName?.trim()) {
      newErrors.stateName = "State is required";
    }

    if (!formData.backgroundName?.trim()) {
      newErrors.backgroundName = "Background is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Prepare data according to backend DTO including masterClassId = 2 for Power BI
      const inquiryData = {
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        stateName: formData.stateName.trim(),
        backgroundName: formData.backgroundName.trim(),
        masterClassId: 2, // Hardcoded as requested for Power BI Masterclass
      };

      console.log("Submitting Power BI masterclass inquiry:", inquiryData);

      // Submit to API
      const response = await createInquiry(inquiryData);
      console.log("API Response:", response);

      // Create custom alert/confirm for WhatsApp community link
      const alertBox = document.createElement("div");
      alertBox.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";

      alertBox.innerHTML = `
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          
          <!-- Close Button -->
          <button
            id="close-alert"
            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200
                   flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
            aria-label="Close"
          >
            ✕
          </button>

          <div class="text-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">
              Thank you for registering! 🎉
            </h3>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-start gap-2">
              <span class="text-green-500">✓</span>
              <span class="text-sm">
                Click the button below to join our Masterclass WhatsApp Community and
                stay updated with session links, reminders, and important announcements.
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <button
              id="whatsapp-btn"
              class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600
                     text-white font-bold rounded-xl hover:shadow-lg transition-all
                     flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
                   width="22" height="22" fill="currentColor">
                <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.65.87 5.11 2.34 7.1L4 29l7.07-2.3a11.96 11.96 0 005.94 1.52C22.64 28.22 28 22.84 28 16.01 28 9.38 22.64 3 16.01 3zm6.58 17.14c-.27.77-1.33 1.45-2.21 1.63-.6.12-1.38.22-4.01-.86-3.37-1.4-5.55-4.82-5.72-5.04-.16-.22-1.38-1.84-1.38-3.52 0-1.67.88-2.5 1.19-2.84.31-.34.67-.43.9-.43h.65c.21 0 .48-.08.75.57.27.65.9 2.24.98 2.4.08.16.13.35.02.57-.11.22-.16.35-.32.54-.16.19-.34.43-.49.58-.16.16-.33.33-.14.65.19.32.84 1.38 1.8 2.23 1.24 1.1 2.29 1.45 2.62 1.61.32.16.51.13.7-.08.19-.21.8-.93 1.02-1.25.22-.32.43-.27.72-.16.29.11 1.84.87 2.16 1.03.32.16.54.24.62.38.08.14.08.81-.19 1.58z"/>
              </svg>
              <span>Join WhatsApp Community</span>
            </button>
          </div>

          <p class="text-xs text-gray-500 text-center mt-4 break-all">
            https://chat.whatsapp.com/HyzET2G92y7DiUXNgY3MZH
          </p>
        </div>
      `;

      document.body.appendChild(alertBox);
      // Close on ❌ button
      alertBox.querySelector("#close-alert").onclick = () => {
        document.body.removeChild(alertBox);
      };

      // Close on background click
      alertBox.onclick = (e) => {
        if (e.target === alertBox) {
          document.body.removeChild(alertBox);
        }
      };

      // Add event listeners
      document.getElementById("whatsapp-btn").addEventListener("click", () => {
        window.open(
          "https://chat.whatsapp.com/HyzET2G92y7DiUXNgY3MZH",
          "_blank"
        );
        document.body.removeChild(alertBox);
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        city: "",
        stateName: "",
        backgroundName: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  // Memoized select component to prevent re-renders
  const StateSelect = React.memo(({ value, onChange, error, states }) => (
    <select
      value={value}
      onChange={(e) => onChange("stateName", e.target.value)}
      className={`w-full border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
    >
      <option value="">Select State</option>
      {states.map((state, index) => (
        <option key={index} value={state}>
          {state}
        </option>
      ))}
    </select>
  ));

  const BackgroundSelect = React.memo(
    ({ value, onChange, error, backgrounds }) => (
      <select
        value={value}
        onChange={(e) => onChange("backgroundName", e.target.value)}
        className={`w-full border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
      >
        <option value="">Select Your Background</option>
        {backgrounds.map((background, index) => (
          <option key={index} value={background}>
            {background}
          </option>
        ))}
      </select>
    )
  );

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {/* ================= HERO ================= */}
      <section className="w-full py-6 bg-gradient-to-b from-purple-50/30 to-white">
        <div className="max-w-[1150px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE TEXT */}
          <div className="space-y-6">
            <div className="space-y-0.5">
              <h1 className="text-[25px] leading-tight font-bold">
                Power BI & Generative AI{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Masterclass
                </span>{" "}
              </h1>
            </div>

            {/* tiny stats */}
            <div
              className="
                flex flex-wrap
                items-center
                gap-x-4 gap-y-2
                text-[12px] sm:text-[13px]
                text-gray-600
                mb-6
              "
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                13+ Years of Industry Experience
              </span>

              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Data Expert
              </span>

              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                15K+ Students Trained
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
              <p className="text-[17px] text-gray-700 leading-relaxed">
                The Power BI & Generative AI MasterClass is a high-impact,
                hands-on session designed to help learners understand how modern
                organizations use Power BI and AI to drive data-driven
                decisions. You will learn how Power BI is used for data
                modeling, visualization, and business intelligence, and how
                Generative AI tools can significantly accelerate dashboard
                creation, DAX writing, insights generation, and reporting
                workflows. This session is ideal for anyone looking to upgrade
                BI skills, improve productivity, or build a career in Data
                Analytics, Business Intelligence, or Data Science.
              </p>
            </div>

            {/* tiny foot notes */}
            <div className="flex items-center space-x-4 text-[17px] text-gray-500 mt-6">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  📅
                </span>
                2.5 hours live, hands-on session
              </span>
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  📜
                </span>
                Certificate Included
              </span>
            </div>

            {/* ================= CTA CARD ================= */}
            <div className="mb-6">
              <div className="inline-flex flex-wrap items-center gap-4 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                {/* Schedule Info */}
                <div className="flex items-center gap-2 text-[22px] text-gray-800">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    Live
                  </span>
                  <span>18 Jan 2026 (Wed)</span>
                  <span className="text-gray-400">|</span>
                  <span>7:00 PM – 9:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM CARD */}
          <div className="w-full" ref={formRef}>
            <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200 p-8 transform hover:scale-[1.02] transition-all duration-500">
              <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Book Your Free Seat
                </h3>
                <p className="text-sm text-gray-600">
                  Fill this form to receive the joining link, certificate &
                  resources.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5 text-sm mt-6">
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Full Name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Email Address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      handleInputChange("mobileNumber", e.target.value)
                    }
                    className={`w-full border ${
                      errors.mobileNumber ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Mobile Number"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`w-full border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <StateSelect
                      value={formData.stateName}
                      onChange={handleInputChange}
                      error={errors.stateName}
                      states={states}
                    />
                    {errors.stateName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.stateName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <BackgroundSelect
                    value={formData.backgroundName}
                    onChange={handleInputChange}
                    error={errors.backgroundName}
                    backgrounds={backgrounds}
                  />
                  {errors.backgroundName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.backgroundName}
                    </p>
                  )}
                </div>
                <p className="text-[16px] text-gray-500 text-center pt-2">
                  By submitting, you agree to receive important updates.
                </p>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-4 px-10 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT YOU'LL LEARN ================= */}
      <section className="py-6 border-t border-gray-100 bg-gradient-to-b from-white to-purple-50/20">
        <div className="max-w-[1150px] mx-auto px-4">
          <div className="text-center space-y-0">
            <h2 className="text-[32px] font-bold text-gray-900">
              What You'll Learn
            </h2>
            <p className="text-gray-600 max-w-[500px] mx-auto text-[15px]">
              Transform data into actionable insights with powerful
              visualizations and AI integration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mx-auto mt-6">
            {[
              {
                title: "Power BI Fundamentals",
                desc: "Understand BI concepts, Power BI architecture, data modeling basics, and visualization principles used in real-world analytics.",
              },
              {
                title: "Practical Power BI for Business Analytics",
                desc: "Build interactive dashboards using Power BI visuals, filters, slicers, and business-driven KPIs.",
              },
              {
                title: "DAX Essentials & Optimization",
                desc: "Learn core DAX functions, calculated columns, measures, and performance best practices.",
              },
              {
                title: "Data Modeling & Performance",
                desc: "Design efficient data models, relationships, star schema concepts, and optimization techniques.",
              },
              {
                title: "Generative AI for Power BI",
                desc: "Use GenAI to write DAX formulas faster, generate insights, automate summaries, and enhance reporting productivity.",
              },
              {
                title: "Industry Dashboards & Career Roadmap",
                desc: "Work on real-world BI use cases, understand enterprise analytics workflows, and gain a clear career roadmap for BI & analytics roles.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-[18px] font-bold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO SHOULD JOIN ================= */}
      <section className="py-6 border-t border-gray-100 bg-white">
        <div className="max-w-[1150px] mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-[32px] font-bold text-gray-900">
              Who Should Enroll in This Masterclass
            </h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-[15px]">
              This session is designed for learners and professionals who want
              to build strong, practical skills in Power BI and data
              visualization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto mb-12">
            {[
              {
                title: "Students & Fresh Graduates",
                desc: "Build strong Power BI and data visualization fundamentals to become job-ready and confident for entry-level roles.",
              },
              {
                title: "Data Analytics & BI Aspirants",
                desc: "Gain hands-on experience with real business dashboards, KPIs, and industry-focused Power BI use cases.",
              },
              {
                title: "Working Professionals (Tech & Non-Tech)",
                desc: "Upskill or transition into BI and analytics roles using Power BI and AI-powered insights for smarter decision-making.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-[17px] font-bold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={scrollToForm}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Join The Masterclass
            </button>
          </div>
        </div>
      </section>

      {/* ================= OUR IMPACT / COMMUNITY STATS ================= */}
      <section className="py-2 border-t border-gray-100 bg-gradient-to-b from-white to-purple-50/20">
        <div className="max-w-[1150px] mx-auto px-4">
          <h2 className="text-center text-[32px] font-bold mb-3 text-gray-900">
            Our Impact in the Data & AI Community
          </h2>
          <p className="text-center text-gray-600 text-[15px] max-w-[650px] mx-auto mb-6">
            Empowering professionals worldwide through BI + GenAI-driven
            learning.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-1 md:mt-3">
            {[
              { number: "20,000+", label: "Learners Trained" },
              { number: "5,00,000+", label: "AI-Assisted BI Insights Generated" },
              { number: "500+", label: "Organizations Impacted" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-lg rounded-2xl p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-[42px] text-blue-600 font-bold leading-none mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 text-[16px] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MENTOR SECTION ================= */}
      <section className="py-6 border-t border-gray-100 bg-white">
        <div className="max-w-[1150px] mx-auto px-4">
          <h2 className="text-center text-[32px] font-bold mb-3 text-gray-900">
            Learn from a Power BI Expert
          </h2>
          <p className="text-center text-gray-600 text-[15px] max-w-[650px] mx-auto mb-10">
            Get guidance from an industry professional who has implemented Power
            BI solutions across multiple sectors and trained thousands of
            professionals.
          </p>

          <div className="bg-white border-2 border-gray-200 shadow-xl rounded-3xl p-12 flex flex-col lg:flex-row gap-12 items-center hover:shadow-2xl transition-all duration-500">
            <div className="w-full lg:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-400 to-gray-400 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-2">
                  <img
                    src="/images/vijaysir_masterclass.jpeg"
                    className="rounded-2xl w-[240px] object-cover"
                    alt="Power BI Expert"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 space-y-6">
              <div className="flex flex-col gap-0">
                <h3 className="text-[24px] font-bold text-gray-900">
                  Vijay Narayan Singh
                </h3>
                <p className="text-[14px] text-blue-600 font-bold flex items-center gap-2">
                  Founder & CEO, skilledUp
                  <a
                    href="https://www.linkedin.com/in/ivijaynsingh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Vijay Narayan Singh LinkedIn"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-blue-600 hover:text-blue-700"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764 0-.974.784-1.764 1.75-1.764s1.75.79 1.75 1.764c0 .974-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-3.368-4-3.112-4 0v5.604h-3v-10h3v1.528c1.396-2.586 7-2.777 7 2.476v5.996z" />
                    </svg>
                  </a>
                </p>
              </div>

              <p className="text-[14px] text-gray-700 leading-relaxed">
                A seasoned Data Analytics and Business Intelligence leader with
                over 13 years of industry experience, Vijay Narayan Singh has
                worked across analytics, BI, and AI-driven decision systems in
                leading organizations. He has trained and mentored 15,000+
                students and professionals, enabling successful career
                transitions into Data Analyst, BI Engineer, and Analytics roles.
                His teaching approach combines real-world dashboards, live
                demonstrations, and practical BI workflows, ensuring learners
                gain job-ready Power BI and AI skills with measurable career
                outcomes.
              </p>

              <button
                onClick={scrollToForm}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-6"
              >
                Reserve Your Seat Under His Guidance
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CERTIFICATE SECTION ================= */}
      <section className="py-6 border-t border-gray-100 bg-gradient-to-b from-white to-blue-50/20">
        <div className="max-w-[1150px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-[32px] font-bold leading-snug text-gray-900">
              Earn an Industry-Recognized Certificate on Completion
            </h2>
            <p className="text-[15px] text-gray-600 max-w-[480px]">
              Validate your Power BI & Generative AI expertise with a credential
              trusted by hiring professionals.
            </p>
            <ul className="space-y-4 text-[14px] text-gray-700">
              {[
                "Verified by skilledUp & Industry Experts",
                "Instantly Shareable on LinkedIn & Resume",
                "Recognized by 500+ Hiring Organizations Globally",
                "Strengthens Eligibility for BI, Data Analyst & Analytics Roles",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-400 to-gray-400 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-2xl">
                <img
                  src="/images/powerbicertificate_masterclss.png"
                  className="rounded-xl w-full max-w-[420px]"
                  alt="Certificate"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToForm}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Join the Masterclass
          </button>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-6 border-t border-gray-100 bg-gradient-to-b from-white to-purple-50/20">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-center text-[32px] font-bold mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {[
              {
                question: "What is this masterclass about?",
                answer: "A hands-on session focused on building Power BI dashboards, writing optimized DAX, and using Generative AI to accelerate insights and reporting workflows.",
              },
              {
                question: "Who should enroll in this masterclass?",
                answer: "Students, fresh graduates, data & BI aspirants, working professionals, and career switchers looking to strengthen Power BI and analytics skills.",
              },
              {
                question: "Is prior Power BI experience required?",
                answer: "No. The session starts with fundamentals and progresses to practical and advanced concepts, making it suitable for beginners and intermediates.",
              },
              {
                question: "Will Generative AI be used practically?",
                answer: "Yes. Live demos will show how GenAI helps write DAX faster, generate insights, summarize dashboards, and improve BI productivity.",
              },
              {
                question: "What tools do I need to attend?",
                answer: "Power BI Desktop is required. Setup instructions will be shared before the workshop.",
              },
              {
                question: "Is the session live or recorded?",
                answer: "This is a live, instructor-led masterclass with real-time explanations and demonstrations.",
              },
              {
                question: "What topics will be covered?",
                answer: "Power BI fundamentals, data modeling, DAX essentials, performance optimization, business dashboards, and GenAI-powered BI use cases.",
              },
              {
                question: "Will this help with jobs and interviews?",
                answer: "Yes. The content and bonus resources align with real interview expectations for Data Analyst, BI Engineer, and Analytics roles.",
              },
              {
                question: "Will I receive a certificate?",
                answer: "Yes. Participants receive an industry-recognized certificate verified by skilledUp and industry experts, shareable on LinkedIn and resume.",
              },
              {
                question: "Is the masterclass free and how do I register?",
                answer: "Yes, it's completely free. Seats are limited, so early registration through the official enrollment link is recommended.",
              },
            ].map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-6 border-t border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-[1150px] mx-auto px-4 text-center text-white">
          <h2 className="text-[32px] font-bold mb-4">
            Enroll in the Power BI & GenAI MasterClass
          </h2>
          <p className="text-purple-100 text-[16px] max-w-[500px] mx-auto mb-10">
            Gain hands-on Power BI, DAX, and Generative AI experience, led by
            an industry expert with 13+ years of experience.
          </p>
          <button
            onClick={scrollToForm}
            className="px-10 py-4 bg-white text-blue-600 rounded-full text-sm font-bold shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            Reserve Your Free Seat Today
          </button>
          <p className="text-purple-200 text-[16px] mt-8">
            Limited seats available. Registrations closing soon
          </p>
        </div>
      </section>
    </div>
  );
}