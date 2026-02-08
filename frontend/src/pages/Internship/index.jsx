// src/pages/Internship/index.jsx
import React from 'react';
import InternshipHero from './InternshipHero';
import InternshipCategories from './InternshipCategories';
import HowItWorks from './HowItWorks';
import Certificates from './Certificates';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from "../../components/layout/Footer";
import Modal from '../../components/modal/Modal';
import ImageModal from '../../components/modal/ImageModal';
import { useInternshipForm } from '../../hooks/useInternshipForm';

const InternshipProgram = () => {
  const {
    formState,
    activeInterns,
    domainsCount,
    currentSlide,
    isModalOpen,
    isImageModalOpen,
    currentZoom,
    zoomedImageSrc,
    showSuccess,
    formActions,
    sliderActions,
    modalActions,
    imageModalActions,
    categories,
    categoriesLoading
  } = useInternshipForm();

  return (
    <div className="min-h-screen bg-white font-sans">
      <InternshipHero
        activeInterns={activeInterns}
        domainsCount={domainsCount}
        onApplyClick={modalActions.openModal}
      />

      <InternshipCategories onApplyClick={modalActions.openModal} />

      <HowItWorks onApplyClick={modalActions.openModal} />

      <Certificates onImageClick={imageModalActions.openImageModal} />

      <Testimonials
        currentSlide={currentSlide}
        onNextSlide={sliderActions.nextSlide}
        onPrevSlide={sliderActions.prevSlide}
        onGoToSlide={sliderActions.goToSlide}
      />

      <FAQ />

      <div className="bg-blue-800 py-8 px-4 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-blue-100 font-semibold mb-6">
              Join {activeInterns.toLocaleString()}+ students building their careers
            </p>
            <button
              onClick={modalActions.openModal}
              className="bg-white text-blue-800 font-extrabold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Apply Now - It's Free! →
            </button>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {['FREE FOREVER', 'INSTANT ACCESS', 'CERTIFICATES'].map((badge) => (
                <div key={badge} className="bg-white/20 px-4 py-2 rounded-full border border-white/30">
                  <span className="text-white text-xs font-extrabold tracking-wider">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        onClose={modalActions.closeModal}
        showSuccess={showSuccess}
        formState={formState}
        currentStep={formState.currentStep}
        onInputChange={formActions.handleInputChange}
        onSendPhoneOtp={formActions.sendPhoneOtp}
        onVerifyPhoneOtp={formActions.verifyPhoneOtp}
        onSendEmailOtp={formActions.sendEmailOtp}
        onVerifyEmailOtp={formActions.verifyEmailOtp}
        onContinue={formActions.continueToStep2}
        onSubmit={formActions.completeApplication}
        onBackToStep1={() => formActions.setCurrentStep(1)}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        imageSrc={zoomedImageSrc}
        zoom={currentZoom}
        onClose={imageModalActions.closeImageModal}
        onZoomIn={imageModalActions.zoomIn}
        onZoomOut={imageModalActions.zoomOut}
        onResetZoom={imageModalActions.resetZoom}
      />
    </div>
  );
};

export default InternshipProgram;