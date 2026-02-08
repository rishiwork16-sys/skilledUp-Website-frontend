import { useState } from "react";
import { useParams } from "react-router-dom";

import HeroSection from "./HeroSection";
import Highlights from "./Highlights";
import Reviews from "./Reviews";
import CareerServices from "./CareerServices";
import ExclusiveDoubtSession from "./ExclusiveDoubtSession";
import FeeAndSchedule from "./FeeAndSchedule";
import Curriculum from "./Curriculum";
import MentorSlider from "../../../components/common/MentorSlider";
import Skills from "./Skills";
import ToolsSlider from "./ToolsSlider";
import RolePlay from "./RolePlay";
import Certificate from "./Certificate";
import StudentsWorkAt from "./StudentsWorkAt";
import FAQ from "./FAQ";
import AssistanceForm from "../../form/AssistanceForm";
import Footer from "../../../components/layout/Footer";

const CareerAccDataScience = () => {
  const { slug } = useParams();

  const getFallbackCourseData = (courseSlug) => {
    const fallbackData = {
      id: 1,
      title: "Career Accelerator: Data Science & GenAI",
      subtitle: "100% Job Guarantee (T&C Apply)",
      description: "Career Accelerator: Data Science & Gen AI is a 9-month online/offline program for beginners and intermediates, offering one-on-one mentorship, performance tracking, and interview prep from day one. With a job guarantee (eligibility-based), the course covers Python, SQL, MySQL, Statistics, ML, NLP, Deep Learning, and Generative AI. Learners gain hands-on experience through real-world projects, building the skills needed for a successful Data Science & AI career.",
      rating: 4.9,
      reviewsCount: 3000,
      price: 50000,
      // originalPrice: 100000,
      // discount: 10,
      duration: "9 Months",
      mode: "Online/Offline (Noida)",
      language: "English/Hindi",
      internship: "Up to 12 Months",
      certifiedBy: "skilledUp",
      image: "/images/Career Accelerator_ Data Science & GenAI.png"
    };

    if (courseSlug === "data-science-bootcamp") {
      return {
        ...fallbackData,
        id: 2,
        title: "Data Science Bootcamp",
        price: 75000,
        duration: "6 Months"
      };
    } else if (courseSlug === "ai-ml-certification") {
      return {
        ...fallbackData,
        id: 3,
        title: "AI & Machine Learning Certification",
        price: 80000,
        duration: "8 Months"
      };
    } else if (courseSlug === "careerx-datascience-genai") {
      return {
        ...fallbackData,
        id: 4,
        title: "CareerX: Data Science & GenAI",
        price: 95000,
        originalPrice: 120000,
        discount: 20
      };
    }

    return fallbackData;
  };

  const [courseData] = useState(getFallbackCourseData(slug || "career-accelerator-data-science-genai"));

  return (
    <>
      <HeroSection courseData={courseData} />
      <Highlights />
      <Reviews />
      <CareerServices />
      <ExclusiveDoubtSession />
      <FeeAndSchedule courseData={courseData} />
      <Curriculum />
      <MentorSlider />
      <Skills />
      <ToolsSlider />
      <RolePlay />
      <Certificate />
      <StudentsWorkAt />
      <FAQ />
      <AssistanceForm />
      <Footer />
    </>
  );
};

export default CareerAccDataScience;