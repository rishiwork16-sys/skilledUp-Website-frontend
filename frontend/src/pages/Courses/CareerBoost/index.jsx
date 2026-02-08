import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import FormModal from "../../../components/FormModal";
import RegistrationForm from "../../form/formpage";

import SectionContainer from "./components/SectionContainer";
import HeroSection from "./HeroSection";
import Highlights from "./Highlights";
import Reviews from "./Reviews";
import CareerServices from "./CareerServices";
import ExclusiveDoubtSession from "./ExclusiveDoubtSession";
import FeeAndSchedule from "./FeeAndSchedule";
import Curriculum from "./Curriculum";
// import MentorsSlider from "./MentorsSlider";
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
  // Your existing states
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedMode, setSelectedMode] = useState('online');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Need Assistance form submitted");

    // TEMP SUCCESS (jab tak API ready nahi)
    alert("Thank you! Our expert will contact you shortly.");
  };

  // For Need Assistance form
  const [formData, setFormData] = useState({
    step: 1,
    background: "",
    backgroundName: "",
    courseInterest: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    stateName: ""
  });

  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [showCourseOptions, setShowCourseOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToCourseFee = () => {
    const section = document.getElementById("course-fee-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <HeroSection 
        scrollToCourseFee={scrollToCourseFee}
        openForm={openForm}
      />

      <FormModal isOpen={isFormOpen} onClose={closeForm}>
        <RegistrationForm />
      </FormModal>

      <Highlights />

      <Reviews openForm={openForm} />

      <CareerServices />

      <ExclusiveDoubtSession openForm={openForm} />

      <FeeAndSchedule 
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
      />

      <Curriculum 
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <MentorSlider />

      <Skills 
        showMoreSkills={showMoreSkills}
        setShowMoreSkills={setShowMoreSkills}
      />

      <ToolsSlider />

      <RolePlay />

      <Certificate 
        showCertificate={showCertificate}
        setShowCertificate={setShowCertificate}
      />

      <StudentsWorkAt />

      <FAQ />

      <AssistanceForm 
        formData={formData}
        setFormData={setFormData}
        showBackgroundOptions={showBackgroundOptions}
        setShowBackgroundOptions={setShowBackgroundOptions}
        showCourseOptions={showCourseOptions}
        setShowCourseOptions={setShowCourseOptions}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />

      <Footer />
    </>
  );
};

export default CareerX;