import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import Footer from "../../components/layout/Footer";
import { useUser } from "../../context/UserContext";
import { usePayment } from "../../hooks/usePayment";

/* =======================
   IMPORT COURSES (NEW STRUCTURE)
======================= */
import CareerX from "./CareerX";
import CareerAccDataScience from "./CareerAccDataScience";
import CareerAccDataAnalysts from "./CareerAccDataAnalysts";
import CareerBoost from "./CareerBoost";

/* =======================
   IMPORT RICH UI COMPONENTS (From CareerAccDataScience)
======================= */
import HeroSection from "./CareerAccDataScience/HeroSection";
import Highlights from "./CareerAccDataScience/Highlights";
import Reviews from "./CareerAccDataScience/Reviews";
import CareerServices from "./CareerAccDataScience/CareerServices";
import ExclusiveDoubtSession from "./CareerAccDataScience/ExclusiveDoubtSession";
import FeeAndSchedule from "./CareerAccDataScience/FeeAndSchedule";
import Curriculum from "./CareerAccDataScience/Curriculum";
import Skills from "./CareerAccDataScience/Skills";
import ToolsSlider from "./CareerAccDataScience/ToolsSlider";
import RolePlay from "./CareerAccDataScience/RolePlay";
import Certificate from "./CareerAccDataScience/Certificate";
import StudentsWorkAt from "./CareerAccDataScience/StudentsWorkAt";
import FAQ from "./CareerAccDataScience/FAQ";
import MentorSlider from "../../components/common/MentorSlider";
import AssistanceForm from "../form/AssistanceForm";

/* =======================
   COURSE MAP
======================= */
const courseComponents = {
  "careerx-data-science-genai": CareerX,
  "career-accelerator-data-science-genai": CareerAccDataScience,
  "career-accelerator-data-analytics-genai": CareerAccDataAnalysts,
  "career-boost-data-analytics-genai": CareerBoost,
};

const CourseDetailWrapper = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { processPayment, loading: paymentLoading } = usePayment();
  const [hasAccess, setHasAccess] = useState(false);

  const CourseComponent = courseComponents[courseId];

  useEffect(() => {
    if (!CourseComponent && courseId) {
      fetchCourseDetails();
    }
    if (user && courseId) {
      checkAccess();
    }
  }, [courseId, CourseComponent, user]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      setCourse(response.data);
      if (user && response.data?.id) checkAccess(response.data.id);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async (forcedCourseId = null) => {
    const cid = forcedCourseId || course?.id;
    if (!user || !cid) return;

    try {
      const response = await api.get("/api/payments/access", {
        params: {
          userId: user.id || user.userId,
          courseId: cid
        }
      });
      setHasAccess(response.data === true);
    } catch (error) {
      console.error("Error checking course access:", error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      alert("Please login to enroll in this course");
      window.location.href = "/login"; // Original redirect for unauthenticated users
      return;
    }

    if (!course) return;

    try {
      await processPayment(
        course.id,
        course.title,
        course.price,
        user // Pass the complete user object containing the ID
      );
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  if (CourseComponent) {
    return <CourseComponent />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (course) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSection courseData={course} />
        <Highlights highlightsData={course.keyHighlights} />
        <Reviews />
        <CareerServices />
        <ExclusiveDoubtSession />
        <FeeAndSchedule courseData={course} hasAccess={hasAccess} />
        <Curriculum courseData={course} />
        {Array.isArray(course?.mentors) && course.mentors.length > 0 ? (
          <MentorSlider mentors={course.mentors} />
        ) : null}
        <Skills skills={course.skills} />
        {Array.isArray(course?.toolsCovered) && course.toolsCovered.length > 0 ? (
          <ToolsSlider tools={course.toolsCovered} />
        ) : null}
        {Array.isArray(course?.careerOpportunities) &&
        course.careerOpportunities.length > 0 ? (
          <RolePlay
            courseTitle={course.title}
            roles={course.careerOpportunities}
          />
        ) : null}
        {typeof course?.certificateUrl === "string" &&
        course.certificateUrl.trim() ? (
          <Certificate certificateUrl={course.certificateUrl} />
        ) : null}
        <StudentsWorkAt />
        {Array.isArray(course?.faqs) && course.faqs.length > 0 ? (
          <FAQ faqData={course.faqs} />
        ) : null}
        <AssistanceForm />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Course Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The requested course does not exist.
      </p>
      <Link
        to="/courses"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Browse All Courses
      </Link>
    </div>
  );
};

export default CourseDetailWrapper;
