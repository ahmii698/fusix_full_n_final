// pages/Services.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import { 
  Code, Smartphone, Cloud, Shield, Database, ShoppingCart, 
  PenTool, Headphones, Globe, Zap, Users, Clock, 
  CheckCircle, ArrowRight, Star, Award, TrendingUp,
  Rocket, Cpu, Palette, BarChart, Briefcase, Lock
} from 'lucide-react';
import SEO from '../SEO';

// Home page ka FeaturesSection component import kar rahe hain (Why Choose Us ke liye)
import FeaturesSection from './sections/FeaturesSection';

import './Services.css';

const Services = () => {
  // --- States for Dynamic Data ---
  const [headerData, setHeaderData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [processData, setProcessData] = useState<any[]>([]);
  const [processHeading, setProcessHeading] = useState<any>(null);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Helper function to get image URL ---
  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/300x250?text=No+Image';
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    if (cleanUrl.startsWith('storage/')) return `${API_URL}/${cleanUrl}`;
    if (cleanUrl.startsWith('uploads/')) return `${API_URL}/uploads/${cleanUrl}`;
    return `${API_URL}/storage/uploads/${cleanUrl}`;
  };

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          headerRes, 
          servicesRes, 
          processRes, 
          techRes,
          featuresRes
        ] = await Promise.all([
          axios.get(`${API_URL}/service-header`),
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/service-3`),
          axios.get(`${API_URL}/technologies/active`),
          axios.get(`${API_URL}/features`)
        ]);

        // Header
        setHeaderData(headerRes.data.data);
        
        // Services (Dashboard wala data)
        setServicesData(servicesRes.data?.data || servicesRes.data || []);
        
        // Process (6 steps)
        setProcessHeading(processRes.data.heading);
        setProcessData(processRes.data.data);
        
        // Technologies
        setTechnologies(techRes.data?.data || techRes.data || []);
        
        // Why Choose Us (Features)
        setFeaturesData(featuresRes.data?.data || featuresRes.data || []);

      } catch (error) {
        console.error("Error fetching services data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Icon Mapping for Services (Database se sirf naam aata hai, icon React mein map karte hain)
  const getServiceIcon = (title: string) => {
    if (!title) return <Code size={48} />;
    const lower = title.toLowerCase();
    if (lower.includes('web')) return <Code size={48} />;
    if (lower.includes('mobile') || lower.includes('app')) return <Smartphone size={48} />;
    if (lower.includes('cloud')) return <Cloud size={48} />;
    if (lower.includes('security') || lower.includes('cyber')) return <Shield size={48} />;
    if (lower.includes('data') || lower.includes('analytic')) return <Database size={48} />;
    if (lower.includes('commerce') || lower.includes('shop')) return <ShoppingCart size={48} />;
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return <PenTool size={48} />;
    if (lower.includes('consult')) return <Headphones size={48} />;
    if (lower.includes('marketing') || lower.includes('digital')) return <Globe size={48} />;
    if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine')) return <Cpu size={48} />;
    if (lower.includes('crm')) return <Briefcase size={48} />;
    if (lower.includes('blockchain')) return <Lock size={48} />;
    return <Code size={48} />;
  };

  // Loading State
  if (loading) {
    return (
      <div className="services-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="services-container">
      <SEO
        title="Our Services | Web & Software Development | Fusix Tech"
        description="Explore Fusix Tech services: web development, custom software, mobile apps and IT solutions tailored to your business."
        path="/services"
      />

      {/* Hero Section (Data from service_header) */}
      {headerData && (
        <section className="services-hero">
          <div className="hero-particles"></div>
          <div className="container">
            <div className="services-hero-content">
              <span className="hero-subtitle">{headerData.top_tagline}</span>
              <h1 className="hero-title">
                {headerData.main_heading_white.split(' For ')[0]}{' '}
                <span className="golden-text">{headerData.main_heading_yellow}</span>{' '}
                {headerData.main_heading_white.split(' For ')[1] ? `For ${headerData.main_heading_white.split(' For ')[1]}` : ''}
              </h1>
              <p className="hero-description">
                {headerData.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid (Data from services table - Dashboard wala) */}
      <section className="services-grid-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Our <span className="golden-text">Services</span></h2>
            <p className="section-description">
              End-to-end solutions tailored to your business needs
            </p>
          </div>

          <div className="services-grid">
            {servicesData.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon-wrapper">
                  <div className="service-icon">
                    {service.image ? (
                      <img 
                        src={getImageUrl(service.image)} 
                        alt={service.title} 
                        style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                      />
                    ) : (
                      getServiceIcon(service.title)
                    )}
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                {/* Features (object/string dono handle) */}
                {service.features && service.features.length > 0 && (
                  <ul className="service-features">
                    {service.features.map((featureItem: any, index: number) => {
                      if (typeof featureItem === 'object' && featureItem !== null) {
                        return (
                          <li key={featureItem.id || index}>
                            <CheckCircle size={14} />
                            <span>{featureItem.feature}</span>
                          </li>
                        );
                      }
                      
                      if (typeof featureItem === 'string') {
                        if (featureItem.includes(',')) {
                          return featureItem.split(',').map((f: string, i: number) => (
                            <li key={`${index}-${i}`}>
                              <CheckCircle size={14} />
                              <span>{f.trim()}</span>
                            </li>
                          ));
                        }
                        return (
                          <li key={index}>
                            <CheckCircle size={14} />
                            <span>{featureItem}</span>
                          </li>
                        );
                      }
                      
                      return null;
                    })}
                  </ul>
                )}
                
                <Link to={`/services/${service.id}`} className="service-link">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section (Data from service_3) */}
      {processHeading && processData.length > 0 && (
        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">{processHeading.section_tag}</span>
              <h2 className="section-title">
                {processHeading.heading_white} <span className="golden-text">{processHeading.heading_yellow}</span>
              </h2>
              <p className="section-description">
                {processHeading.sub_description}
              </p>
            </div>

            <div className="process-grid">
              {processData.map((step) => (
                <div key={step.id} className="process-card">
                  <div className="process-number">{step.step_number}</div>
                  <h3>{step.card_title}</h3>
                  <p>{step.card_description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Section (Data from technologies table - active) */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Technologies</span>
            <h2 className="section-title">Tools & <span className="golden-text">Technologies</span></h2>
            <p className="section-description">
              We work with cutting-edge technologies
            </p>
          </div>

          <div className="tech-grid">
            {technologies.map((tech) => (
              <div key={tech.id} className="tech-card">
                <span className="tech-icon">{tech.icon}</span>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Home page wala FeaturesSection component use kiya */}
      {featuresData.length > 0 && (
        <FeaturesSection features={featuresData} getImageUrl={getImageUrl} />
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Let's discuss how we can help bring your ideas to life</p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;