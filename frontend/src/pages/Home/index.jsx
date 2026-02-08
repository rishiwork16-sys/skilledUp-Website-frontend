// src\pages\Home\index.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import FormModal from "../../components/FormModal";
import RegistrationForm from "../form/formpage";
import Footer from "../../components/layout/Footer";
import MentorSlider from "../../components/common/MentorSlider";


// import { getAllCourses } from "../../api/courses";
// import { getBackgrounds, createInquiry } from "../../api/home";

// Import all the new components
import HeroSection from "./HeroSection";
import StatsAndLogos from "./StatsAndLogos";
import WhyChooseUs from "./WhyChooseUs";
import CoursesSection from "./CoursesSection";
import StudentReviews from "./StudentReviews";
import ImmersiveLearning from "./ImmersiveLearning";
import MasterclassSection from "./MasterclassSection";
import EnterpriseTraining from "./EnterpriseTraining";
import AssistanceForm from "../form/AssistanceForm";

export default function SkilledUpHome() {
  // Cart Context
  const { addToCart } = useCart();

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // ✅ NEW STATE FOR FORM MODAL:
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  // Handle Add to Cart
  const handleAddToCart = (course) => {
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      image: course.img,
      duration: course.duration,
      category: course.category,
      mode: course.mode,
      slug: course.slug
    });

    alert(`${course.title} added to cart!`);
  };

  // Share course function
  const handleShareCourse = (course) => {
    const shareText = `Check out this course on SkilledUp: ${course.title}\n${course.description}\nPrice: ₹${course.price}\nDuration: ${course.duration}`;
    const shareUrl = `${window.location.origin}/courses/${course.slug}`;

    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: shareText,
        url: shareUrl,
      })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        alert('Course link copied to clipboard! You can share it on WhatsApp, Instagram, etc.');
      });
    }
  };

  return (
    <div className="w-full font-sans text-gray-900" style={{ fontFamily: "'Open Sans', 'Canva Sans', sans-serif" }}>
      <HeroSection />
      <StatsAndLogos />
      <WhyChooseUs />
      
      {/* Pass necessary props to CoursesSection */}
      <CoursesSection
        addToCart={handleAddToCart}
        handleShareCourse={handleShareCourse}
        isHomePage={true}
      />
      
      <StudentReviews />
      <ImmersiveLearning openForm={openForm} />
      <MentorSlider />
      <MasterclassSection />
      <EnterpriseTraining />
      <AssistanceForm />
      <Footer />

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <img src={preview.img} className="w-full h-56 object-cover rounded" alt="preview" />
            <h2 className="text-2xl font-bold mt-4 text-gray-900">{preview.title}</h2>
            <p className="text-gray-600 mt-1">{preview.duration} • {preview.mode}</p>
            <p className="mt-3 text-gray-700">{preview.description}</p>

            <div className="mt-6 flex gap-4">
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => {
                  if (preview.url) {
                    window.location.href = preview.url;
                  }
                }}
              >
                Enroll Now
              </button>
              <button
                onClick={() => {
                  handleAddToCart(preview);
                  setPreview(null);
                }}
                className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
              >
                Add to Cart
              </button>
            </div>

            <button
              className="mt-5 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ FORM MODAL */}
      <FormModal isOpen={isFormOpen} onClose={closeForm}>
        <RegistrationForm onClose={closeForm} />
      </FormModal>
    </div>
  );
}