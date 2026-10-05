import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  darkMode: boolean;
}

const Footer = ({ darkMode }: Props) => {
  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">Fusix<span>Tech</span></h3>
            <p className="footer-description">
              Monotonectally synergize granular markets and front markets. 
              Collaboratively visualize strategic infomediaries after multimedia 
              based models.
            </p>
            <div className="social-links" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <a href="https://www.facebook.com/FusixTech" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,215,0,0.1)',
                transition: 'all 0.3s ease',
                color: '#FFD700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <Facebook size={18} />
              </a>
              <a href="https://x.com/FusixTech" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,215,0,0.1)',
                transition: 'all 0.3s ease',
                color: '#FFD700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/fusixtech/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,215,0,0.1)',
                transition: 'all 0.3s ease',
                color: '#FFD700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/fusix-tech/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,215,0,0.1)',
                transition: 'all 0.3s ease',
                color: '#FFD700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-links">
              <li><Link to="/services/web">Web Development</Link></li>
              <li><Link to="/services/mobile">Mobile Apps</Link></li>
              <li><Link to="/services/cloud">Cloud Solutions</Link></li>
              <li><Link to="/services/security">Cyber Security</Link></li>
              <li><Link to="/services/consulting">IT Consulting</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <ul className="contact-info">
              <li>
                <MapPin size={18} />
                <span>Rua fernao de magalhaes cerro alagoa apt L11 lote 20,Albuferira Portugal,8200-129</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+351 920 348 944</span>
              </li>
              <li>
                <Mail size={18} />
                <span>fusixtech@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 TopTech. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;