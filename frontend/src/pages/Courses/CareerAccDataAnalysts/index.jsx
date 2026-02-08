import { useState } from "react";
import { Link } from "react-router-dom";
import SectionContainer from "./components/SectionContainer";
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


const CareerAccDataAnalysts = () => {
  const [courseData] = useState({
    id: 3,
    title: "Career Accelerator: Data Analytics",
    price: 50000,
    currency: "INR",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <HeroSection 
        openForm={openForm}
        closeForm={closeForm}
        isFormOpen={isFormOpen}
      />
      
      <Highlights />
      
      <Reviews openForm={openForm} />
      
      <CareerServices />
      
      <ExclusiveDoubtSession openForm={openForm} />
      
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

export default CareerAccDataAnalysts;