import React, { useState } from 'react';
import HeroSection from './HeroSection';
import MissionSection from './MissionSection';
import VisionSection from './VisionSection';
import DifferencesSection from './DifferencesSection';
import TeamSection from './TeamSection';
import Footer from '../../../components/layout/Footer';
import ContactForm from './ContactForm';

const AboutUs = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setShowForm(false);
  };

  return (
    <div className="font-sans font-open-sans">
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <DifferencesSection />
      <TeamSection />
      <Footer />
      
      <ContactForm 
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AboutUs;