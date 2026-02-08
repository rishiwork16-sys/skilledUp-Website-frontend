import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/iskilledup/",
      icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/iskilledup/",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/iskilledup/",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
    },
    {
      name: "Twitter",
      url: "https://x.com/IskilledUp",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
    }
  ];

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about-us" },
    { name: "Courses", to: "/courses" },
    { name: "Contact", to: "/contact" },
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Terms & Conditions", to: "/terms" }
  ];

  const careerLinks = [
    { name: "Open Positions", to: "/careers" },
    { name: "Internships", to: "/internships" },
    { name: "PPO + Job Guarantee Program", to: "/courses/careerx-data-science-genai" },
    { name: "Certificates", to: "/Certificates" }
  ];

  return (
    <footer className="footer" style={{
      width: '100%',
      background: '#0f0f0f',
      color: '#dcdcdc',
      padding: '60px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div className="footer-container" style={{
        maxWidth: '1400px',
        width: '95%',
        margin: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '50px'
      }}>
        <div className="footer-box" style={{ flex: 1, minWidth: '250px' }}>
          <div className="footer-logo" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/images/skilledUp Logo.png"
                alt="Company Logo"
                style={{
                  height: '45px',
                  width: 'auto',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  padding: '4px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const textFallback = document.createElement('div');
                  textFallback.textContent = 'skilledUp';
                  textFallback.style.fontSize = '26px';
                  textFallback.style.fontWeight = '800';
                  textFallback.style.color = '#fff';
                  e.target.parentNode.appendChild(textFallback);
                }}
              />
            </div>
          </div>
          <p className="footer-desc" style={{ color: '#bbb', lineHeight: '1.6' }}>
            We are a next-gen EdTech company focused on empowering learners with real-world
            job-ready skills. Join us and build a better future with innovation & growth.
          </p>

          <div className="footer-social" style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            {socialLinks.map((social) => (
              <div
                key={social.name}
                className="social-icon"
                onClick={() => window.open(social.url, '_blank')}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#222',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5a34f3';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#222';
                  e.currentTarget.style.color = '#dcdcdc';
                }}
              >
                <img
                  src={social.icon}
                  alt={social.name}
                  style={{ width: '18px', height: '18px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="footer-box" style={{ flex: 1, minWidth: '250px' }}>
          <div className="footer-title" style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
            Quick Links
          </div>
          <div className="footer-links">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bbb',
                  textDecoration: 'none',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#bbb'}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-box" style={{ flex: 1, minWidth: '250px' }}>
          <div className="footer-title" style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
            Careers
          </div>
          <div className="footer-links">
            {careerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bbb',
                  textDecoration: 'none',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#bbb'}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-box" style={{ flex: 1, minWidth: '250px' }}>
          <div className="footer-title" style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
            Contact Us
          </div>
          <div className="footer-links">
            <div style={{ display: 'block', marginBottom: '8px', color: '#bbb' }}>Corporate Address: </div>
            <p className="footer-desc" style={{ color: '#bbb', lineHeight: '1.6' }}>
              E8, Sector 3, Noida, Uttar Pradesh, India <br />(Near Sector 16 Metro Station)
            </p>
            <div style={{ display: 'block', marginBottom: '8px', color: '#bbb' }}>Email: support@skilledup.in</div>
            <div style={{ display: 'block', marginBottom: '8px', color: '#bbb' }}>+91 9810421790</div>
            <div style={{ display: 'block', marginBottom: '8px', color: '#bbb' }}>+91 1204131330</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{
        marginTop: '40px',
        borderTop: '1px solid #333',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#8c8c8c',
        fontSize: '14px'
      }}>
        © {currentYear} skilledUp — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;