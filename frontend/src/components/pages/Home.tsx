import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { API_URL } from '../../../config';
import { Calendar } from 'lucide-react';

import SEO from '../SEO';

// Components
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import { HeroScrollDemo } from '../demo/HeroScrollDemo';
import FeaturesSection from './sections/FeaturesSection';
import StatsSection from './sections/StatsSection';
import ProcessSection from './sections/ProcessSection';
import TeamSection from './sections/TeamSection';
import PricingSection from './sections/PricingSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FaqSection from './sections/FaqSection';
import ContactSection from './sections/ContactSection';
import NewsletterSection from './sections/NewsletterSection';
import AppointmentModal from './modals/AppointmentModal';
import PlanModal from './modals/PlanModal';
import TestimonialModal from './modals/TestimonialModal';
import NewsletterModal from './modals/NewsletterModal';
import LoadingScreen from '../common/LoadingScreen';

import './Home.css';

const Home = () => {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  
  // All data states
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [faqImage, setFaqImage] = useState('');

  // Helper function to get image URL
  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/300x250?text=No+Image';
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    if (cleanUrl.startsWith('storage/')) return `${API_URL}/${cleanUrl}`;
    if (cleanUrl.startsWith('uploads/')) return `${API_URL}/uploads/${cleanUrl}`;
    return `${API_URL}/storage/uploads/${cleanUrl}`;
  };

  // Fetch FAQ Image
  const fetchFaqImage = async () => {
    try {
      const response = await axios.get(`${API_URL}/faq_images`);
      const imageData = response.data?.data || response.data;
      if (imageData) {
        const firstImage = Array.isArray(imageData) ? imageData[0] : imageData;
        if (firstImage && firstImage.image_url) {
          setFaqImage(getImageUrl(firstImage.image_url));
        }
      }
    } catch (error) {
      console.error('Error fetching FAQ image:', error);
    }
  };

  // OPTIMIZED: Pehle sirf 2 important API calls (jo immediately chahiye)
  useEffect(() => {
    const fetchCriticalData = async () => {
      try {
        // Sirf ye 2 API calls pehle karo (jo hero section ke liye chahiye)
        const [servicesRes, companyInfoRes] = await Promise.all([
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/company-info`)
        ]);
        
        setServices(servicesRes.data?.data || servicesRes.data || []);
        setCompanyInfo(companyInfoRes.data?.data || companyInfoRes.data || null);
        
        // Page open ho gaya - loading screen hatado
        setLoading(false);
        setIsPageLoading(false);
        
        // Force scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        
      } catch (error) {
        console.error('Error fetching critical data:', error);
        setLoading(false);
        setIsPageLoading(false);
      }
    };
    
    fetchCriticalData();
  }, []);

  // BACKGROUND: Baqi API calls background mein load karo (page dikhne ke baad)
  useEffect(() => {
    if (!isPageLoading && !loading) {
      const fetchRemainingData = async () => {
        try {
          const [
            teamRes, testimonialsRes, pricingRes, faqsRes,
            featuresRes, processStepsRes, statisticsRes
          ] = await Promise.all([
            axios.get(`${API_URL}/team`),
            axios.get(`${API_URL}/testimonials`),
            axios.get(`${API_URL}/pricing`),
            axios.get(`${API_URL}/faqs`),
            axios.get(`${API_URL}/features`),
            axios.get(`${API_URL}/process-steps`),
            axios.get(`${API_URL}/statistics`)
          ]);
          
          setTeam(teamRes.data?.data || teamRes.data || []);
          setTestimonials(testimonialsRes.data?.data || testimonialsRes.data || []);
          setPricing(pricingRes.data?.data || pricingRes.data || []);
          setFaqs(faqsRes.data?.data || faqsRes.data || []);
          setFeatures(featuresRes.data?.data || featuresRes.data || []);
          setProcessSteps(processStepsRes.data?.data || processStepsRes.data || []);
          setStatistics(statisticsRes.data?.data || statisticsRes.data || []);
          
          // FAQ image bhi background mein fetch karo
          await fetchFaqImage();
          
        } catch (error) {
          console.error('Error fetching remaining data:', error);
        }
      };
      
      fetchRemainingData();
    }
  }, [isPageLoading, loading]);

  // Show Newsletter Modal on page load
  useEffect(() => {
    if (!isPageLoading && !loading) {
      const timer = setTimeout(() => {
        setShowNewsletterModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPageLoading, loading]);

  // Force scroll to top on every render
  useEffect(() => {
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // ✅ document.title hata diya - ab title SEO component se aayega
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    if (!isPageLoading && !loading) {
      const timer = setTimeout(() => {
        const elements = document.querySelectorAll(
          ".services-section, .features-section, .stats-section, .process-section, .testimonials-section, .contact-section, .faq-section, .service-card, .feature-card, .stat-card, .process-card, .testimonial-card, .team-card, .pricing-card, .faq-item"
        );

        elements.forEach(el => el.classList.add("hidden-element"));

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible-element");
              }
            });
          },
          { threshold: 0.1, rootMargin: "50px" }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isPageLoading, loading, services, companyInfo]);

  // ✅ SEO - loading screen ke saath bhi render hoga
  const seoTags = (
    <SEO
      title="Fusix Tech | Innovative IT Solutions & Software Development"
      description="Fusix Tech provides web development, software development and IT solutions to grow your business. Get a free consultation today."
      path="/"
    />
  );

  // Loading screen
  if (isPageLoading || loading) {
    return (
      <>
        {seoTags}
        <LoadingScreen />
      </>
    );
  }

  return (
    <div className="home-container" style={{ overflowX: 'hidden' }} ref={heroRef}>
      {seoTags}
      
      {/* Newsletter Modal */}
      <NewsletterModal 
        show={showNewsletterModal} 
        onClose={() => setShowNewsletterModal(false)} 
      />
      
      {/* Other Modals */}
      <AppointmentModal 
        show={showAppointmentModal} 
        onClose={() => setShowAppointmentModal(false)} 
      />
      
      <PlanModal 
        show={showPlanModal} 
        plan={selectedPlan} 
        onClose={() => {
          setShowPlanModal(false);
          setSelectedPlan(null);
        }} 
      />
      
      <TestimonialModal 
        show={showTestimonialModal} 
        onClose={() => setShowTestimonialModal(false)} 
      />

      {/* SECTIONS - Hero comes first */}
      <div id="hero-top" className="hero-top-anchor"></div>
      <HeroSection />
      <ServicesSection services={services} getImageUrl={getImageUrl} />
      <HeroScrollDemo />
      <FeaturesSection features={features} getImageUrl={getImageUrl} />
      <StatsSection statistics={statistics} />
      <ProcessSection processSteps={processSteps} />
      <TeamSection team={team} getImageUrl={getImageUrl} />
      <PricingSection pricing={pricing} onSelectPlan={(plan) => {
        setSelectedPlan(plan);
        setShowPlanModal(true);
      }} />
      <TestimonialsSection 
        testimonials={testimonials} 
        onAddTestimonial={() => setShowTestimonialModal(true)} 
      />
      <FaqSection faqs={faqs} faqImage={faqImage} />
      <ContactSection 
        companyInfo={companyInfo} 
        onBookAppointment={() => setShowAppointmentModal(true)} 
      />
      <NewsletterSection />
      
      {/* Floating Appointment Button */}
      <button
        onClick={() => setShowAppointmentModal(true)}
        className="floating-appointment-btn"
        style={{
          position: 'fixed',
          bottom: 'clamp(15px, 5vw, 30px)',
          right: 'clamp(15px, 5vw, 30px)',
          width: 'clamp(45px, 12vw, 56px)',
          height: 'clamp(45px, 12vw, 56px)',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #FFD700, #FFA500)',
          border: 'none',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 215, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
        }}
        title="Book Appointment"
      >
        <Calendar size={24} color="#000000" />
      </button>
    </div>
  );
};

export default Home;