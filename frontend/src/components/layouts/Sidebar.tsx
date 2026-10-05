import { Link } from "react-router-dom";
import { 
  Home, Info, Settings, Phone, X, Users, Briefcase, 
  Star, HelpCircle, LogOut, Award, Code, Zap 
} from 'lucide-react';
import './Sidebar.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const Sidebar = ({ isOpen, onClose, darkMode }: Props) => {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"></span>
            <h3>Fusix<span>Tech</span></h3>
          </div>
          <p className="sidebar-subtitle">IT Solutions Provider</p>
        </div>

        <div className="sidebar-profile">
         
          <div className="profile-info">
            <h4>Fusix Tech</h4>
            <p>fusixtech@gmail.com</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section-title">Main Menu</p>
            <Link to="/" onClick={onClose}>
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/about" onClick={onClose}>
              <Info size={20} />
              <span>About Us</span>
            </Link>
            <Link to="/services" onClick={onClose}>
              <Settings size={20} />
              <span>Services</span>
            </Link>
            <Link to="/contact" onClick={onClose}>
              <Phone size={20} />
              <span>Contact</span>
            </Link>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">Quick Links</p>
            <Link to="/team" onClick={onClose}>
              <Users size={20} />
              <span>Our Team</span>
            </Link>
            <Link to="/projects" onClick={onClose}>
              <Briefcase size={20} />
              <span>Projects</span>
            </Link>
            <Link to="/testimonials" onClick={onClose}>
              <Star size={20} />
              <span>Testimonials</span>
            </Link>
            <Link to="/faq" onClick={onClose}>
              <HelpCircle size={20} />
              <span>FAQ</span>
            </Link>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">Other</p>
           
            <Link to="/blog" onClick={onClose}>
              <Code size={20} />
              <span>Blog</span>
            </Link>
           
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <div className="sidebar-footer-info">
            <p>© 2026 TopTech. All rights reserved.</p>
            <p style={{ marginTop: '5px', fontSize: '0.65rem' }}>Version 2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;