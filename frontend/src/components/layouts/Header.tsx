import { Menu, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../assets/fusix.jpg';

interface Props {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ darkMode, setDarkMode, setSidebarOpen }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`header ${darkMode ? 'dark' : ''} ${scrolled ? 'scrolled' : ''}`}>
      {/* DESKTOP LAYOUT */}
      {!isMobile && (
        <div className="header-container desktop-container">
          {/* Left Section */}
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
              <Menu size={24} />
            </button>
            <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={logo} alt="FusixTech Logo" className="logo-image" style={{ height: '70px', width: 'auto', borderRadius: '12px' }} />
              <h2 className="logo" style={{ margin: 0, fontSize: '1.8rem' }}>Fusix<span>Tech</span></h2>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/portfolio" className="nav-link">Portfolio</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
          </nav>

          {/* Right Section - Only Social Icons */}
          <div className="header-right">
            <div className="social-icons">
              <a href="https://www.facebook.com/FusixTech" target="_blank" rel="noopener noreferrer" className="social-icon"><Facebook size={18} /></a>
              <a href="https://x.com/FusixTech" target="_blank" rel="noopener noreferrer" className="social-icon"><Twitter size={18} /></a>
              <a href="https://www.instagram.com/fusixtech/" target="_blank" rel="noopener noreferrer" className="social-icon"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/company/fusix-tech/" target="_blank" rel="noopener noreferrer" className="social-icon"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE LAYOUT */}
      {isMobile && (
        <div className="header-container mobile-container">
          {/* Top Row */}
          <div className="mobile-top-row">
            <div className="header-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
                <Menu size={24} />
              </button>
              <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={logo} alt="FusixTech Logo" className="logo-image" style={{ height: '50px', width: 'auto', borderRadius: '10px' }} />
                <h2 className="logo" style={{ margin: 0, fontSize: '1.3rem' }}>Fusix<span>Tech</span></h2>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mobile-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/portfolio" className="nav-link">Portfolio</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;