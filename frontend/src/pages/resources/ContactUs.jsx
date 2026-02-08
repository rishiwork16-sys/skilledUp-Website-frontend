import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../../components/layout/Footer";

const mapLink =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110313.33698615402!2d77.20514132956062!3d28.58109199632933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce53c42b12e99%3A0xa7c8afdc1efe92ac!2sskilledUp!5e0!3m2!1sen!2sin!4v1618823364698!5m2!1sen!2sin"


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [hoverStates, setHoverStates] = useState({
    contactItem: Array(4).fill(false),
    submitBtn: false,
    faqItem: Array(4).fill(false),
  });

  const currentYear = new Date().getFullYear();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleMouseEnter = (type, index = null) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: index !== null ? 
        prev[type].map((_, i) => i === index ? true : false) : 
        true
    }));
  };

  const handleMouseLeave = (type, index = null) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: index !== null ? 
        prev[type].map((_, i) => i === index ? false : false) : 
        false
    }));
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  

  // Inline Styles
  const styles = {

    
    contactUs: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#333333',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
      lineHeight: '1.6',
    },
    
    // Common Container
    container: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 15px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },

    // Common Headings
    h1: {
      fontSize: '3.5rem',
      fontWeight: '900',
      margin: '0 0 15px 0',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      lineHeight: '1.2',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    h2: {
      fontSize: '2.2rem',
      fontWeight: '800',
      textAlign: 'center',
      margin: '0 0 30px 0',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      lineHeight: '1.3',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: '700',
      margin: '0 0 12px 0',
      lineHeight: '1.4',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },

    // Hero Section
    heroSection: {
  background: '#000000', // pure black
  color: '#ffffff',
  padding: '60px 0',
  textAlign: 'center',
  fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
},
    heroContent: {
  maxWidth: '800px',
  margin: '0 auto',
  fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
},

    canvasText: {
  fontSize: '2.8rem',        // 🔽 30% reduced from 4rem
  fontWeight: '900',
  margin: '0 0 15px 0',
  color: '#ffffff',          // ✅ solid white text
  textTransform: 'uppercase',
  letterSpacing: '3px',      // slightly reduced for balance
  lineHeight: '1.1',
  fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
},

    heroSubtitle: {
  fontSize: '1.05rem',
  fontWeight: '400',
  opacity: '0.9',
  margin: '0',
  color: '#e2e8f0',
  fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
},

    // Contact Info Section
    contactInfoSection: {
      padding: '50px 0',
      backgroundColor: '#f8fafc',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactItem: {
      textAlign: 'center',
      padding: '25px 15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactItemHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(30, 64, 175, 0.15)',
      borderColor: '#3b82f6',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactIcon: {
      fontSize: '2.2rem',
      marginBottom: '15px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactItemH3: {
      fontSize: '1.2rem',
      fontWeight: '700',
      margin: '0 0 12px 0',
      color: '#1e40af',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactItemP: {
      fontSize: '0.95rem',
      lineHeight: '1.5',
      color: '#64748b',
      margin: '0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },

    // Contact Form Section
    contactFormSection: {
      padding: '50px 0',
      backgroundColor: 'white',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    formContainer: {
      maxWidth: '650px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    formHeader: {
      textAlign: 'center',
      marginBottom: '30px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    formHeaderH2: {
      fontSize: '2rem',
      fontWeight: '800',
      margin: '0 0 10px 0',
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    formHeaderP: {
      fontSize: '1rem',
      color: '#64748b',
      margin: '0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    contactForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    formRow: {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
},

    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    label: {
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '6px',
      color: '#374151',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    input: {
  width: "100%",
  maxWidth: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
},

    textarea: {
  width: "100%",
  maxWidth: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  resize: "none",
  boxSizing: "border-box",
},

    submitBtn: {
      padding: '12px 35px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      alignSelf: 'flex-start',
      marginTop: '10px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    submitBtnHover: {
      backgroundColor: '#1e3a8a',
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 8px rgba(30, 64, 175, 0.25)',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },

    // Map Section
    mapSection: {
      padding: '50px 0',
      backgroundColor: '#f1f5f9',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapPlaceholder: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapContent: {
      textAlign: 'center',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapContentH3: {
      fontSize: '1.3rem',
      fontWeight: '600',
      margin: '0 0 8px 0',
      color: '#1e293b',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapContentP: {
      fontSize: '0.95rem',
      color: '#64748b',
      margin: '0 0 20px 0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapIframe: {
      width: '100%',
      height: '300px',
      backgroundColor: '#e2e8f0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #cbd5e1',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    mapFallback: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.9rem',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },

    // FAQ Section
    faqSection: {
      padding: '50px 0',
      backgroundColor: '#000000',
      color: 'white',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    faqGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    faqItem: {
      padding: '25px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #333333',
      transition: 'all 0.3s ease',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    faqItemHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    faqItemH3: {
      fontSize: '1.1rem',
      fontWeight: '600',
      margin: '0 0 12px 0',
      color: '#3b82f6',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
    faqItemP: {
      fontSize: '0.95rem',
      lineHeight: '1.5',
      color: '#d1d5db',
      margin: '0',
      fontFamily: "'Canva Sans', 'Open Sans', sans-serif",
    },
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <h1 style={styles.canvasText}>Contact Us</h1>
            <p style={styles.heroSubtitle}>
              We'd love to hear from you. Reach out for inquiries, guidance, or partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section style={styles.contactInfoSection}>
        <div style={styles.container}>
          <h2 style={styles.h2}>CONTACT INFORMATION</h2>
          <div style={styles.contactGrid}>
            {[
              {
                icon: '📍',
                title: 'Our Office',
                content: 'E8, Sector 3, Noida, Uttar Pradesh, India (Near Sector 16 Metro Station)'
              },
              {
                icon: '📞',
                title: 'Phone Number',
                content: '+91 9810421790\n+91 1204131330',
                // content: '+91 1204131330\n+91 9810421790'
              },
              {
                icon: '✉️',
                title: 'Email Address',
                content: 'support@skilledup.tech'
              },
              {
                icon: '🕒',
                title: 'Working Hours',
                content: '10 AM - 7 PM'
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.contactItem,
                  ...(hoverStates.contactItem[index] ? styles.contactItemHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('contactItem', index)}
                onMouseLeave={() => handleMouseLeave('contactItem', index)}
              >
                <div style={styles.contactIcon}>{item.icon}</div>
                <h3 style={styles.contactItemH3}>{item.title}</h3>
                <p style={styles.contactItemP}>
                  {item.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
<section style={styles.contactFormSection}>
  <div style={styles.container}>
    <div style={styles.formContainer}>
      
      <div style={styles.formHeader}>
        <h2 style={styles.formHeaderH2}>SEND US A MESSAGE</h2>
        <p style={styles.formHeaderP}>
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.contactForm}>
        
        {/* Row */}
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Message *</label>
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <button type="submit" style={styles.submitBtn}>
          SEND MESSAGE
        </button>

      </form>
    </div>
  </div>
</section>


      {/* Map Section */}
      <section style={styles.mapSection}>
        <div style={styles.container}>
          <h2 style={styles.h2}>FIND US HERE</h2>
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapContent}>
              <h3 style={styles.mapContentH3}>OUR LOCATION</h3>
              <p style={styles.mapContentP}>E8, Sector 3, Noida, Uttar Pradesh, India (Near Sector 16 Metro Station)</p>
              <a
  href={mapLink}
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: "none" }}
>
  <div style={styles.mapIframe}>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110313.33698615402!2d77.20514132956062!3d28.58109199632933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce53c42b12e99%3A0xa7c8afdc1efe92ac!2sskilledUp!5e0!3m2!1sen!2sin!4v1618823364698!5m2!1sen!2sin%22"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
  />
</div>


</a>

            </div>
          </div>
        </div>
      </section>

          {/* Footer */}
    <Footer />

      {/* Global font styles */}
      <style jsx global>{`
        * {
          font-family: 'Canva Sans', 'Open Sans', sans-serif;
        }
        
        body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label, a {
          font-family: 'Canva Sans', 'Open Sans', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;