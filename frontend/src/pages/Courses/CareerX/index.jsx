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

const CareerX = () => {
  const { slug } = useParams();

  const getDefaultCourseData = () => ({
    id: 1,
    title: "CareerX: Data Science & GenAI",
    slug: "careerx-data-science-genai",
    price: 100000,
    originalPrice: 100000,
    discount: 10,
    duration: "9 Months",
    mode: "Online / Offline (Noida)",
    description:
      "9-Month Live Data Science & GenAI Program with PPO + Job Guarantee (T&C Apply)",
    image: "/images/CareerX_ Data Science & GenAI.png",
    rating: 4.9,
    reviewsCount: 3000
  });

  const [courseDetails] = useState(getDefaultCourseData());

  if (!courseDetails) return null;

  return (
    <>
      <HeroSection courseDetails={courseDetails} />
      <Highlights />
      <Reviews />
      <CareerServices />
      <ExclusiveDoubtSession />
      <FeeAndSchedule courseDetails={courseDetails} />
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

export default CareerX;
