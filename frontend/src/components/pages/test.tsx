import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../services/api';
import { SplineSceneBasic } from "../../demo";
import ProcessBalls from '../common/ProcessBalls';
import { HeroScrollDemo } from '../demo/HeroScrollDemo';

import { 
  ChevronLeft, ChevronRight, Star, MapPin, Phone, 
  Mail, Send, Check, Facebook, Twitter, Instagram, Linkedin,
  ArrowRight, Code, Smartphone, Cloud, Shield, Database, 
  ShoppingCart, PenTool, Headphones, Globe, Palette, 
  Cpu, Rocket, Users, Clock, TrendingUp, Zap, Award,
  Coffee, Heart, Briefcase, Target, BarChart, Layers,
  Play, Pause, Volume2, VolumeX, ExternalLink, Download, X,
  Calendar, Clock as ClockIcon, Trophy, Award as AwardIcon, Briefcase as BriefcaseIcon, Users as UsersIcon,
  Activity, PieChart, Layers as LayersIcon, Sparkles, Crown, Gem
} from 'lucide-react';

import './Home.css';

const Home = () => {
  const location = useLocation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // ✅ NEWSLETTER MODAL - SHOWS ON EVERY PAGE REFRESH
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [modalNewsletterEmail, setModalNewsletterEmail] = useState('');
  const [modalNewsletterStatus, setModalNewsletterStatus] = useState('');
  const [modalNewsletterError, setModalNewsletterError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const audioRef = useRef<any>(null);
  
  const [planFormData, setPlanFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [planFormStatus, setPlanFormStatus] = useState('');
  
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });
  const [appointmentFormStatus, setAppointmentFormStatus] = useState('');
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [newsletterErrorMsg, setNewsletterErrorMsg] = useState('');
  
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    testimonial: '',
    rating: 5
  });
  const [testimonialFormStatus, setTestimonialFormStatus] = useState('');
  
  const [faqImage, setFaqImage] = useState('');
  
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [counts, setCounts] = useState({
    years: 0,
    clients: 0,
    projects: 0,
    satisfaction: 0,
    experts: 0,
    awards: 0
  });

  // Helper function to get image URL
  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return `http://localhost:8000${url}`;
    if (url.startsWith('storage')) return `http://localhost:8000/${url}`;
    if (url.startsWith('uploads')) return `http://localhost:8000/${url}`;
    return `http://localhost:8000/storage/uploads/${url}`;
  };

  // ✅ ========== SOUND + NEWSLETTER MODAL CODE ==========
  
  // Initialize AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    
    const playBeep = () => {
      try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (err) {
        console.log('Play error:', err);
      }
    };
    
    audioRef.current = { 
      play: playBeep, 
      context: audioCtx,
      resume: () => audioCtx.resume()
    };
    
    return () => {
      if (audioCtx) audioCtx.close();
    };
  }, []);

  // Play sound function
  const playSound = async () => {
    if (!audioRef.current) return;
    if (!soundEnabled) return;
    
    try {
      const ctx = audioRef.current.context;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      audioRef.current.play();
      console.log('🔊 SOUND PLAYED!');
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  // SHOW MODAL ON EVERY PAGE REFRESH
  useEffect(() => {
    const soundAllowed = localStorage.getItem('sound_enabled') === 'true';
    if (soundAllowed) {
      setSoundEnabled(true);
    }
    
    if (!isPageLoading && !loading) {
      setTimeout(() => {
        setShowNewsletterModal(true);
        console.log('📧 NEWSLETTER MODAL SHOULD BE VISIBLE NOW!');
      }, 1000);
    }
  }, [isPageLoading, loading]);

  // Handle newsletter submit from modal
  const handleModalNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalNewsletterStatus('sending');
    setModalNewsletterError('');
    
    try {
      const response = await API.post('/newsletter', { email: modalNewsletterEmail });
      
      if (response.data.success) {
        setModalNewsletterStatus('success');
        
        setSoundEnabled(true);
        localStorage.setItem('sound_enabled', 'true');
        
        await playSound();
        
        setTimeout(() => {
          setShowNewsletterModal(false);
          setModalNewsletterStatus('');
          setModalNewsletterEmail('');
        }, 1500);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setModalNewsletterStatus('error');
      setModalNewsletterError(error.response?.data?.message || 'Email already subscribed or invalid');
      setTimeout(() => {
        setModalNewsletterStatus('');
        setModalNewsletterError('');
      }, 2000);
    }
  };

  // Handle modal close (cross button)
  const closeNewsletterModal = async () => {
    setShowNewsletterModal(false);
    setSoundEnabled(true);
    localStorage.setItem('sound_enabled', 'true');
    await playSound();
  };

  // Play sound on navigation after enabled
  useEffect(() => {
    const soundAllowed = localStorage.getItem('sound_enabled') === 'true';
    if (soundAllowed && !showNewsletterModal && !soundPlayed) {
      setTimeout(() => {
        playSound();
        setSoundPlayed(true);
      }, 500);
    }
  }, [location.pathname, showNewsletterModal, soundPlayed]);

  // ✅ ========== END OF SOUND + NEWSLETTER MODAL CODE ==========

  // Fetch FAQ Image
  const fetchFaqImage = async () => {
    try {
      const response = await API.get('/faq-image');
      if (response.data.success && response.data.data) {
        setFaqImage(response.data.data.image_url);
      } else {
        setFaqImage('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=600&h=500&fit=crop');
      }
    } catch (error) {
      console.error('Error fetching FAQ image:', error);
      setFaqImage('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=600&h=500&fit=crop');
    }
  };

  useEffect(() => {
    fetchFaqImage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".services-section, .features-section, .stats-section, .process-section, .banner-section, .testimonials-section, .contact-section, .cta-section, .service-card, .feature-card, .stat-card, .process-card, .testimonial-card, .contact-form-container, .contact-info-card, .map-container, .section-header, .portfolio-item, .team-card, .pricing-card, .blog-card, .faq-item"
    );

    elements.forEach(el => {
      el.classList.add("hidden-element");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible-element");
            
            if (entry.target.classList.contains('services-grid') || 
                entry.target.classList.contains('features-grid') ||
                entry.target.classList.contains('portfolio-grid')) {
              const children = entry.target.children;
              Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                  (child as HTMLElement).style.opacity = '1';
                  (child as HTMLElement).style.transform = 'translateY(0)';
                }, index * 100);
              });
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        console.log('Fetching data from API...');
        
        const [
          servicesRes,
          teamRes,
          testimonialsRes,
          portfolioRes,
          pricingRes,
          faqsRes,
          bannersRes,
          featuresRes,
          processStepsRes,
          statisticsRes,
          companyInfoRes
        ] = await Promise.all([
          API.get('/services'),
          API.get('/team'),
          API.get('/testimonials'),
          API.get('/portfolio'),
          API.get('/pricing'),
          API.get('/faqs'),
          API.get('/banners'),
          API.get('/features'),
          API.get('/process-steps'),
          API.get('/statistics'),
          API.get('/company-info')
        ]);
        
        setServices(servicesRes.data.data || []);
        setTeam(teamRes.data.data || []);
        setTestimonials(testimonialsRes.data.data || []);
        setPortfolio(portfolioRes.data.data || []);
        setPricing(pricingRes.data.data || []);
        setFaqs(faqsRes.data.data || []);
        setBanners(bannersRes.data.data || []);
        setFeatures(featuresRes.data.data || []);
        setProcessSteps(processStepsRes.data.data || []);
        setStatistics(statisticsRes.data.data || []);
        setCompanyInfo(companyInfoRes.data.data || null);
        
        if (statisticsRes.data.data) {
          const stats = statisticsRes.data.data;
          const newCounts = { ...counts };
          stats.forEach((stat: any) => {
            if (stat.label.includes('Years')) newCounts.years = stat.value;
            if (stat.label.includes('Clients')) newCounts.clients = stat.value;
            if (stat.label.includes('Projects')) newCounts.projects = stat.value;
            if (stat.label.includes('Satisfaction')) newCounts.satisfaction = stat.value;
            if (stat.label.includes('Experts')) newCounts.experts = stat.value;
            if (stat.label.includes('Awards')) newCounts.awards = stat.value;
          });
          setCounts(newCounts);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      await API.post('/contact', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  };
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('sending');
    setNewsletterErrorMsg('');
    
    try {
      const response = await API.post('/newsletter', { email: newsletterEmail });
      
      if (response.data.success) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus(''), 3000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setNewsletterStatus('error');
      setNewsletterErrorMsg(error.response?.data?.message || 'Email already subscribed or invalid');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };
  
  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
    setPlanFormData({ name: '', email: '', phone: '', message: '' });
    setPlanFormStatus('');
  };

  const closeModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanFormStatus('sending');
    
    if (!planFormData.name || !planFormData.email || !planFormData.phone) {
      alert('Please fill all required fields');
      setPlanFormStatus('');
      return;
    }
    
    const purchaseData = {
      plan_id: selectedPlan.id.toString(),
      plan_name: selectedPlan.name,
      price: selectedPlan.price,
      period: selectedPlan.period,
      customer_name: planFormData.name,
      customer_email: planFormData.email,
      customer_phone: planFormData.phone,
      message: planFormData.message,
      status: 'pending'
    };
    
    try {
      const response = await API.post('/plan-purchase', purchaseData);
      
      if (response.data.success) {
        setPlanFormStatus('success');
        alert('✅ Request submitted successfully! We will contact you soon.');
        setPlanFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          closeModal();
          setPlanFormStatus('');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Something went wrong');
      }
      
    } catch (error: any) {
      console.error('Error submitting plan:', error);
      setPlanFormStatus('error');
      alert('❌ Error: ' + (error.response?.data?.message || error.message || 'Failed to submit'));
    }
  };

  const handleAppointmentClick = () => {
    setShowAppointmentModal(true);
    setAppointmentFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: ''
    });
    setAppointmentFormStatus('');
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
  };
  
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentFormStatus('sending');

    if (!appointmentFormData.name || !appointmentFormData.email || !appointmentFormData.phone || !appointmentFormData.date || !appointmentFormData.time) {
      alert('Please fill all required fields including date and time');
      setAppointmentFormStatus('');
      return;
    }

    const appointmentData = {
      full_name: appointmentFormData.name,
      email: appointmentFormData.email,
      phone: appointmentFormData.phone,
      appointment_date: appointmentFormData.date,
      appointment_time: appointmentFormData.time,
      message: appointmentFormData.message
    };

    try {
      const response = await API.post('/appointments', appointmentData);

      setAppointmentFormStatus('success');
      alert('✅ Appointment booked successfully!');

      setAppointmentFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      });

      if (showAppointmentModal) {
        closeAppointmentModal();
      }

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setAppointmentFormStatus('error');
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialFormStatus('sending');
    
    if (!testimonialFormData.name || !testimonialFormData.testimonial) {
      alert('Please fill all required fields');
      setTestimonialFormStatus('');
      return;
    }
    
    try {
      const response = await API.post('/testimonials', {
        client_name: testimonialFormData.name,
        testimonial_text: testimonialFormData.testimonial,
        rating: testimonialFormData.rating
      });
      
      if (response.data.success) {
        setTestimonialFormStatus('success');
        alert('✅ Thank you! Your testimonial will be reviewed and published soon.');
        setTestimonialFormData({ name: '', testimonial: '', rating: 5 });
        setShowTestimonialModal(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setTestimonialFormStatus('error');
      alert('❌ Error: ' + (error.response?.data?.message || 'Failed to submit'));
    } finally {
      setTimeout(() => setTestimonialFormStatus(''), 2000);
    }
  };

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter((item: any) => item.category === activeFilter);

  useEffect(() => {
    document.title = 'Home - Fusix Tech | Premium IT Solutions Provider';
    window.scrollTo(0, 0);
  }, []);

  const renderIcon = (iconName: string, size: number = 48) => {
    switch(iconName) {
      case 'Globe': return <Globe size={size} />;
      case 'Palette': return <Palette size={size} />;
      case 'Smartphone': return <Smartphone size={size} />;
      case 'Database': return <Database size={size} />;
      case 'Code': return <Code size={size} />;
      case 'PenTool': return <PenTool size={size} />;
      case 'Cpu': return <Cpu size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Rocket': return <Rocket size={size} />;
      case 'Clock': return <ClockIcon size={size} />;
      case 'Target': return <Target size={size} />;
      default: return <Code size={size} />;
    }
  };

  const statIcons = [
    <Trophy size={48} color="#FFD700" />,
    <UsersIcon size={48} color="#FFD700" />,
    <Rocket size={48} color="#FFD700" />,
    <AwardIcon size={48} color="#FFD700" />,
    <Target size={48} color="#FFD700" />,
    <BarChart size={48} color="#FFD700" />,
    <Sparkles size={48} color="#FFD700" />,
    <Activity size={48} color="#FFD700" />
  ];

  const renderStatIcon = (index: number) => {
    return statIcons[index % statIcons.length];
  };

  const clamp = (min: number, preferred: number, max: number) => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return min;
      if (width > 1200) return max;
      return preferred;
    }
    return preferred;
  };

  // ========== ANIMATED LOADING SCREEN ==========
  if (isPageLoading || loading) {
    return (
      <div style={{ 
        background: '#0A0A0A', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 'clamp(60px, 15vw, 80px)',
            height: 'clamp(60px, 15vw, 80px)',
            margin: '0 auto',
            position: 'relative',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '20px',
              transform: 'rotate(45deg)',
              animation: 'spin 2s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 'clamp(24px, 8vw, 32px)',
              fontWeight: 'bold',
              color: '#000'
            }}>F</div>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(22px, 6vw, 28px)', 
            color: '#FFD700', 
            marginTop: 'clamp(20px, 8vw, 30px)',
            marginBottom: 'clamp(15px, 5vw, 20px)',
            fontWeight: '700',
            letterSpacing: '2px',
            animation: 'fadeInUp 0.8s ease'
          }}>
            Fusix Tech
          </h1>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <div style={{
              width: 'clamp(8px, 3vw, 12px)',
              height: 'clamp(8px, 3vw, 12px)',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0s'
            }} />
            <div style={{
              width: 'clamp(8px, 3vw, 12px)',
              height: 'clamp(8px, 3vw, 12px)',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0.2s'
            }} />
            <div style={{
              width: 'clamp(8px, 3vw, 12px)',
              height: 'clamp(8px, 3vw, 12px)',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0.4s'
            }} />
          </div>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          @keyframes spin {
            0% { transform: rotate(45deg); }
            100% { transform: rotate(405deg); }
          }
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-15px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home-container" style={{ overflowX: 'hidden', marginTop: 'clamp(60px, 10vw, 70px)' }}>
      
      {/* ✅ VIP NEWSLETTER MODAL - LUXURY STYLE */}
      {showNewsletterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #0a0a0a, #050505)',
            borderRadius: '28px',
            padding: '36px 32px',
            maxWidth: '400px',
            width: '85%',
            textAlign: 'center',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.1) inset',
            position: 'relative'
          }}>
            
            {/* Crown Icon - VIP Badge */}
           

            {/* Close Button */}
            <button
              onClick={closeNewsletterModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: '#FFD700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.color = '#FFD700';
              }}
            >
              <X size={16} />
            </button>

            {/* Email Icon with VIP Hover Effect */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                transition: 'all 0.4s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 215, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
              }}
            >
              <Mail size={40} color="#000" />
            </div>
            
            <h2 style={{
              fontSize: '26px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '10px',
              letterSpacing: '-0.5px'
            }}>
              Join the Elite
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: '#aaa',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Get <span style={{ color: '#FFD700', fontWeight: '600' }}>exclusive tech insights</span>, early access to offers, and VIP updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleModalNewsletterSubmit}>
              <div style={{
                position: 'relative',
                marginBottom: '16px'
              }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={modalNewsletterEmail}
                  onChange={(e) => setModalNewsletterEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '50px',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontFamily: 'monospace'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD700';
                    e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.8)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                  }}
                />
              
              </div>
              
              <button
                type="submit"
                disabled={modalNewsletterStatus === 'sending'}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '50px',
                  color: '#000',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: modalNewsletterStatus === 'sending' ? 0.7 : 1,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  if (modalNewsletterStatus !== 'sending') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {modalNewsletterStatus === 'sending' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="spinner" style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #000',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block'
                    }}></span>
                    Processing...
                  </span>
                ) : (
                  'Subscribe '
                )}
              </button>
              
              {modalNewsletterStatus === 'success' && (
                <p style={{ color: '#4ade80', fontSize: '12px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  ✓ Welcome to the VIP club! Sound enabled.
                </p>
              )}
              {modalNewsletterStatus === 'error' && (
                <p style={{ color: '#f87171', fontSize: '12px', marginTop: '14px' }}>
                  {modalNewsletterError}
                </p>
              )}
            </form>
            
            <p style={{
              fontSize: '11px',
              color: '#555',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderTop: '1px solid rgba(255, 215, 0, 0.1)',
              paddingTop: '16px'
            }}>
              
            </p>
          </div>
        </div>
      )}

      {/* Floating Appointment Button */}
      <button
        onClick={handleAppointmentClick}
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
        title="Book Appointment"
      >
        <Calendar size={clamp(20, 24, 26)} color="#000000" />
      </button>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        alignItems: 'center'
      }}>
        
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 'clamp(150px, 40vw, 500px)',
          height: 'clamp(150px, 40vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 'clamp(150px, 30vw, 400px)',
          height: 'clamp(150px, 30vw, 400px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.05), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          flex: 1,
          zIndex: 2,
          textAlign: window.innerWidth < 768 ? 'center' : 'left',
          color: '#fff',
          padding: window.innerWidth < 768 ? '20px' : '40px',
          paddingLeft: window.innerWidth < 768 ? '20px' : '8%',
          maxWidth: window.innerWidth < 768 ? '100%' : '45%'
        }}>
          <span style={{
            fontSize: 'clamp(10px, 3vw, 18px)',
            letterSpacing: '4px',
            color: '#FFD700',
            display: 'block',
            marginBottom: '15px',
            fontWeight: '600'
          }}>WELCOME TO FUSIX TECH</span>
          <h1 style={{
            fontSize: 'clamp(24px, 7vw, 68px)',
            margin: '15px 0',
            lineHeight: '1.2',
            fontWeight: '800',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Innovative <span style={{ color: '#FFD700' }}>IT Solutions</span><br />
            For Your Business
          </h1>
          <p style={{
            fontSize: 'clamp(12px, 3.5vw, 20px)',
            marginBottom: '30px',
            opacity: 0.95,
            lineHeight: '1.5',
            maxWidth: window.innerWidth < 768 ? '100%' : '550px'
          }}>
            We deliver cutting-edge technology solutions that drive growth, 
            enhance security, and transform your digital presence.
          </p>
          <div>
            <button style={{
              padding: 'clamp(10px, 2.5vw, 16px) clamp(20px, 5vw, 40px)',
              fontSize: 'clamp(12px, 3.5vw, 16px)',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '50px',
              color: '#000',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(255,215,0,0.4)'
            }}>Get Started</button>
          </div>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: window.innerWidth < 768 ? '45%' : '70%',
          position: 'relative',
          zIndex: 1,
          paddingRight: window.innerWidth < 768 ? '0' : '40px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: window.innerWidth < 768 ? '100%' : '550px',
            height: '100%',
            position: 'relative',
            transform: window.innerWidth < 768 ? 'scale(1.4)' : 'scale(1.15)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <SplineSceneBasic />
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(15px, 4vw, 70px)',
          flexWrap: 'wrap',
          padding: 'clamp(8px, 2vw, 20px)',
          background: 'transparent',
          backdropFilter: 'blur(8px)',
          zIndex: 2,
          borderTop: '1px solid rgba(255,215,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', padding: '8px', minWidth: 'clamp(70px, 18vw, 100px)' }}>
            <svg width="clamp(25px, 5vw, 40px)" height="clamp(25px, 5vw, 40px)" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FFD700" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 'bold', color: '#FFD700' }}>{counts.years}+</div>
            <div style={{ fontSize: 'clamp(8px, 2.5vw, 12px)', color: '#fff' }}>YEARS EXP</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '8px', minWidth: 'clamp(70px, 18vw, 100px)' }}>
            <svg width="clamp(25px, 5vw, 40px)" height="clamp(25px, 5vw, 40px)" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="4" stroke="#FFD700" strokeWidth="2"/>
              <circle cx="15" cy="8" r="4" stroke="#FFD700" strokeWidth="2"/>
              <path d="M3 16C3 14 5 12 9 12C13 12 15 14 15 16M9 20C13 20 15 18 15 16" stroke="#FFD700" strokeWidth="2"/>
            </svg>
            <div style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 'bold', color: '#FFD700' }}>{counts.clients}+</div>
            <div style={{ fontSize: 'clamp(8px, 2.5vw, 12px)', color: '#fff' }}>CLIENTS</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '8px', minWidth: 'clamp(70px, 18vw, 100px)' }}>
            <svg width="clamp(25px, 5vw, 40px)" height="clamp(25px, 5vw, 40px)" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#FFD700" strokeWidth="2"/>
              <path d="M8 8H16M8 12H16M8 16H12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 'bold', color: '#FFD700' }}>{counts.projects}+</div>
            <div style={{ fontSize: 'clamp(8px, 2.5vw, 12px)', color: '#fff' }}>PROJECTS</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Services</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>What <span style={{ color: '#FFD700' }}>We Offer</span></h2>
            <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
              Comprehensive IT solutions tailored to your business needs
            </p>
          </div>

          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 300px), 1fr))',
            gap: 'clamp(20px, 5vw, 30px)'
          }}>
            {services.map((service: any) => (
              <div key={service.id} className="service-card" style={{
                background: '#1a1a1a',
                borderRadius: '20px',
                padding: 'clamp(20px, 5vw, 30px)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ marginBottom: '20px', color: '#FFD700' }}>
                  {renderIcon(service.icon_name, clamp(36, 42, 48))}
                </div>
                <h3 style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '15px' }}>{service.title}</h3>
                <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '1.6', color: '#ccc' }}>{service.description}</p>
                
                <div className="service-features" style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  margin: '20px 0'
                }}>
                  {service.features?.slice(0, 3).map((feature: any, idx: number) => (
                    <span key={idx} style={{
                      padding: '4px 10px',
                      background: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: '20px',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      color: '#FFD700'
                    }}>{feature.feature || feature}</span>
                  ))}
                </div>
                
                <a href={service.link || '#'} style={{
                  color: '#FFD700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'clamp(12px, 3vw, 14px)'
                }}>
                  Learn More <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HeroScrollDemo />

      {/* Portfolio Section */}
      <section className="portfolio-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Work</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Featured <span style={{ color: '#FFD700' }}>Projects</span></h2>
          </div>

          <div className="portfolio-filters" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(8px, 3vw, 15px)',
            marginBottom: 'clamp(30px, 8vw, 50px)',
            flexWrap: 'wrap'
          }}>
            {['all', 'development', 'design', 'ai', 'marketing'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: 'clamp(6px, 2vw, 10px) clamp(12px, 4vw, 24px)',
                  fontSize: 'clamp(11px, 3vw, 14px)',
                  background: activeFilter === filter ? '#FFD700' : 'transparent',
                  border: `1px solid ${activeFilter === filter ? '#FFD700' : 'rgba(255,215,0,0.3)'}`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: activeFilter === filter ? '#000' : '#FFD700'
                }}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="portfolio-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 80vw, 300px), 1fr))',
            gap: 'clamp(20px, 5vw, 30px)'
          }}>
            {filteredPortfolio && filteredPortfolio.length > 0 ? (
              filteredPortfolio.map((item: any) => (
                <div key={item.id} className="portfolio-item" style={{
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    aspectRatio: '16/9'
                  }}>
                    <img 
                      src={getImageUrl(item.image) || 'https://via.placeholder.com/400x225?text=No+Image'} 
                      alt={item.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      padding: '20px'
                    }}>
                      <h4 style={{ fontSize: 'clamp(16px, 4vw, 20px)', marginBottom: '10px', color: '#FFD700' }}>{item.title}</h4>
                      <p style={{ fontSize: 'clamp(11px, 3vw, 14px)', textAlign: 'center' }}>{item.client_name || item.client} • {item.project_year || item.year}</p>
                      <button style={{
                        marginTop: '15px',
                        padding: '10px',
                        background: '#FFD700',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}>
                        <ExternalLink size={20} color="#000" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '50px' }}>No portfolio items found</div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Why Choose Us</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>We Deliver <span style={{ color: '#FFD700' }}>Excellence</span></h2>
            <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
              Combining technical expertise with creative innovation
            </p>
          </div>
          
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 280px), 1fr))',
            gap: 'clamp(20px, 5vw, 30px)'
          }}>
            {features.map((feature: any) => (
              <div key={feature.id} className="feature-card" style={{
                background: '#1a1a1a',
                borderRadius: '20px',
                padding: 'clamp(20px, 5vw, 30px)',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '20px', color: '#FFD700' }}>
                  {renderIcon(feature.icon_name, clamp(32, 36, 40))}
                </div>
                <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', marginBottom: '15px' }}>{feature.title}</h3>
                <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '1.6', color: '#ccc' }}>{feature.description}</p>
                <div style={{
                  marginTop: '15px',
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  fontWeight: 'bold',
                  color: '#FFD700'
                }}>{feature.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" style={{ background: '#0A0A0A', padding: 'clamp(40px, 10vw, 80px) 0', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Achievements</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Company <span style={{ color: '#FFD700' }}>Statistics</span></h2>
          </div>
          
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', animation: 'scrollStats 30s linear infinite', width: 'fit-content' }}>
              {statistics && statistics.length > 0 ? (
                [...statistics, ...statistics].map((stat: any, index: number) => (
                  <div key={`${stat.id}-${index}`} style={{ flex: '0 0 auto', padding: '0 15px' }}>
                    <div style={{
                      background: 'transparent',
                      borderRadius: '20px',
                      padding: 'clamp(20px, 5vw, 30px)',
                      textAlign: 'center',
                      minWidth: 'clamp(160px, 40vw, 200px)',
                      border: '1px solid rgba(255,215,0,0.2)'
                    }}>
                      <div style={{ marginBottom: '15px' }}>{renderStatIcon(index)}</div>
                      <h2 style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0', color: '#FFD700' }}>{stat.value}{stat.suffix || ''}</h2>
                      <p style={{ fontSize: 'clamp(11px, 3vw, 14px)', color: '#aaa' }}>{stat.label}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '50px' }}>Loading statistics...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>How We Work</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Our <span style={{ color: '#FFD700' }}>Process</span></h2>
            <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
              A streamlined approach to deliver exceptional results
            </p>
          </div>
          
          {processSteps && processSteps.length > 0 ? (
            <ProcessBalls steps={processSteps} />
          ) : (
            <div style={{ textAlign: 'center', color: '#FFD700', padding: '50px' }}>
              Loading process steps...
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" style={{ padding: 'clamp(40px, 8vw, 60px) 0', background: '#0A0A0A' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 40px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Team</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 36px)', margin: '10px 0' }}>Meet The <span style={{ color: '#FFD700' }}>Experts</span></h2>
          </div>

          <div className="team-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px, 60vw, 280px), 1fr))',
            gap: 'clamp(15px, 4vw, 20px)'
          }}>
            {team && team.length > 0 ? (
              team.map((member: any) => (
                <div 
                  key={member.id} 
                  className="team-card-flip" 
                  style={{
                    background: 'transparent',
                    width: '100%',
                    height: 'clamp(280px, 55vw, 320px)',
                    perspective: '1000px',
                    cursor: 'pointer'
                  }}
                >
                  <div 
                    className="team-card-inner" 
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      textAlign: 'center',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      borderRadius: '16px'
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth > 768) {
                        e.currentTarget.style.transform = 'rotateY(180deg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotateY(0deg)';
                    }}
                  >
                    <div className="team-card-front" style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      background: '#1a1a1a',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ height: 'clamp(200px, 50vw, 250px)', overflow: 'hidden', flexShrink: 0 }}>
                        <img 
                          src={getImageUrl(member.image) || 'https://via.placeholder.com/300x250?text=No+Image'} 
                          alt={member.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            display: 'block'
                          }} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x250?text=No+Image';
                          }}
                        />
                      </div>
                      <div style={{ 
                        padding: '6px 6px 6px 6px',
                        backgroundColor: '#1a1a1a'
                      }}>
                        <h3 style={{ fontSize: 'clamp(15px, 4vw, 17px)', margin: 0, color: '#fff', fontWeight: 600 }}>{member.name}</h3>
                        <p style={{ color: '#FFD700', fontSize: 'clamp(12px, 3vw, 14px)', margin: '3px 0 0 0', fontWeight: 500 }}>{member.role}</p>
                      </div>
                    </div>

                    <div className="team-card-back" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
                      borderRadius: '16px',
                      transform: 'rotateY(180deg)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 'clamp(12px, 4vw, 16px)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      overflowY: 'auto'
                    }}>
                      <h3 style={{ 
                        fontSize: 'clamp(14px, 3.5vw, 16px)', 
                        color: '#FFD700', 
                        marginBottom: '8px',
                        textAlign: 'left',
                        borderBottom: '2px solid rgba(255,215,0,0.3)',
                        paddingBottom: '6px'
                      }}>
                        {member.name}
                      </h3>
                      
                      <div style={{ marginBottom: '8px', textAlign: 'left', flex: 1, overflowY: 'auto' }}>
                        <p style={{ 
                          fontSize: 'clamp(10px, 2.5vw, 12px)', 
                          color: '#ccc', 
                          lineHeight: '1.4',
                          margin: 0
                        }}>
                          {member.about || member.expertise || 'Full-stack development expert specializing in React, Node.js, and cloud architecture.'}
                        </p>
                      </div>
                      
                      <div style={{ 
                        marginBottom: '10px', 
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: 'clamp(9px, 2vw, 10px)', color: '#aaa', fontWeight: '500' }}>Exp:</span>
                        <span style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#FFD700', fontWeight: '600' }}>{member.experience || '8+ years'}</span>
                        <div style={{ 
                          flex: 1, 
                          height: '3px', 
                          background: '#333', 
                          borderRadius: '2px', 
                          overflow: 'hidden'
                        }}>
                          <div style={{ width: '70%', height: '100%', background: '#FFD700', borderRadius: '2px' }} />
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        justifyContent: 'center',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255,215,0,0.15)'
                      }}>
                        {member.social_linkedin && member.social_linkedin !== '#' && (
                          <a href={member.social_linkedin} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,215,0,0.1)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }}>
                            <Linkedin size={clamp(12, 13, 14)} color="#FFD700" />
                          </a>
                        )}
                        {member.social_twitter && member.social_twitter !== '#' && (
                          <a href={member.social_twitter} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,215,0,0.1)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }}>
                            <Twitter size={clamp(12, 13, 14)} color="#FFD700" />
                          </a>
                        )}
                        {member.social_github && member.social_github !== '#' && (
                          <a href={member.social_github} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,215,0,0.1)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }}>
                            <svg width={clamp(12, 13, 14)} height={clamp(12, 13, 14)} viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                            </svg>
                          </a>
                        )}
                        {member.social_instagram && member.social_instagram !== '#' && (
                          <a href={member.social_instagram} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,215,0,0.1)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }}>
                            <svg width={clamp(12, 13, 14)} height={clamp(12, 13, 14)} viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '50px' }}>Loading team members...</div>
            )}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="pricing-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Pricing</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Choose your <span style={{ color: '#FFD700' }}>plan</span></h2>
          </div>

          <div className="pricing-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 80vw, 300px), 1fr))',
            gap: 'clamp(20px, 5vw, 30px)'
          }}>
            {pricing && pricing.length > 0 ? (
              pricing.map((plan: any) => (
                <div key={plan.id} style={{
                  background: plan.is_recommended ? 'linear-gradient(145deg, #1f1f1f, #141414)' : '#1a1a1a',
                  borderRadius: '20px',
                  padding: 'clamp(25px, 6vw, 35px)',
                  textAlign: 'center',
                  position: 'relative',
                  border: plan.is_recommended ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                  transform: plan.is_recommended ? 'scale(1.02)' : 'scale(1)'
                }}>
                  {plan.is_recommended && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: 'clamp(10px, 3vw, 20px)',
                      background: '#FFD700',
                      color: '#000',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: 'bold'
                    }}>
                      Recommended
                    </div>
                  )}
                  <h3 style={{ fontSize: 'clamp(20px, 5vw, 26px)', marginBottom: '20px' }}>{plan.name}</h3>
                  <div style={{ marginBottom: '25px' }}>
                    <span style={{ fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: 'bold', color: '#FFD700' }}>{plan.price}</span>
                    <span style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}>/{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
                    {plan.features?.slice(0, 4).map((feature: any, idx: number) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        fontSize: 'clamp(12px, 3vw, 14px)'
                      }}>
                        <Check size={clamp(12, 14, 16)} color="#FFD700" /> {feature.feature || feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handlePlanClick(plan)}
                    style={{
                      width: '100%',
                      padding: 'clamp(10px, 3vw, 14px)',
                      background: plan.is_recommended ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,215,0,0.2)',
                      border: 'none',
                      borderRadius: '10px',
                      color: plan.is_recommended ? '#000' : '#FFD700',
                      cursor: 'pointer',
                      fontSize: 'clamp(13px, 3.5vw, 16px)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {plan.button_text || 'Select plan'}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '50px' }}>Loading pricing plans...</div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      {showPlanModal && selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }} onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <X size={20} />
            </button>
            
            <div style={{ padding: 'clamp(20px, 5vw, 30px)' }}>
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: 'clamp(24px, 6vw, 28px)', marginBottom: '5px' }}>Get started</h3>
                <p style={{ color: '#FFD700', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{selectedPlan.name} plan</p>
              </div>
              
              <form onSubmit={handlePlanSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="Full name"
                    value={planFormData.name} 
                    onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})} 
                    required 
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: 'clamp(14px, 3.5vw, 16px)'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type="email" 
                    placeholder="Email address"
                    value={planFormData.email} 
                    onChange={(e) => setPlanFormData({...planFormData, email: e.target.value})} 
                    required 
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: 'clamp(14px, 3.5vw, 16px)'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type="tel" 
                    placeholder="Phone number"
                    value={planFormData.phone} 
                    onChange={(e) => setPlanFormData({...planFormData, phone: e.target.value})} 
                    required 
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: 'clamp(14px, 3.5vw, 16px)'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <textarea 
                    placeholder="Anything else?"
                    rows={3} 
                    value={planFormData.message} 
                    onChange={(e) => setPlanFormData({...planFormData, message: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button type="submit" disabled={planFormStatus === 'sending'} style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontWeight: '600',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {planFormStatus === 'sending' ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }} onClick={closeAppointmentModal}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'clamp(20px, 5vw, 32px)',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: '600',
                color: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Calendar size={clamp(20, 22, 24)} color="#FFD700" />
                Book Appointment
              </h3>
              <button 
                onClick={closeAppointmentModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAppointmentSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={appointmentFormData.name}
                  onChange={(e) => setAppointmentFormData({...appointmentFormData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={appointmentFormData.email}
                  onChange={(e) => setAppointmentFormData({...appointmentFormData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 500 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={appointmentFormData.phone}
                    onChange={(e) => setAppointmentFormData({...appointmentFormData, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentFormData.date}
                    onChange={(e) => setAppointmentFormData({...appointmentFormData, date: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                  Preferred Time *
                </label>
                <input
                  type="time"
                  value={appointmentFormData.time}
                  onChange={(e) => setAppointmentFormData({...appointmentFormData, time: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#aaa' }}>
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Tell us what you'd like to discuss..."
                  rows={3}
                  value={appointmentFormData.message}
                  onChange={(e) => setAppointmentFormData({...appointmentFormData, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={appointmentFormStatus === 'sending'}
                style={{
                  width: '100%',
                  padding: 'clamp(14px, 3.5vw, 16px)',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '600',
                  opacity: appointmentFormStatus === 'sending' ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {appointmentFormStatus === 'sending' ? (
                  <>⏳ Booking...</>
                ) : (
                  <>📅 Book Appointment <ArrowRight size={clamp(16, 17, 18)} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Slider */}
      <section className="testimonials-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Testimonials</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>What <span style={{ color: '#FFD700' }}>Clients</span> Say</h2>
            
            <button
              onClick={() => setShowTestimonialModal(true)}
              style={{
                marginTop: '20px',
                padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)',
                background: 'transparent',
                border: '2px solid #FFD700',
                borderRadius: '50px',
                color: '#FFD700',
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD700';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#FFD700';
              }}
            >
              <Star size={clamp(14, 15, 16)} /> Share Your Experience
            </button>
          </div>

          <div className="testimonials-slider" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <button className="slider-arrow prev" onClick={prevTestimonial} style={{
              position: 'absolute',
              left: window.innerWidth < 768 ? '-30px' : '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,215,0,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              cursor: 'pointer',
              display: window.innerWidth < 768 ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <ChevronLeft size={clamp(20, 22, 24)} />
            </button>
            
            <div className="testimonials-container" style={{ position: 'relative', height: 'clamp(350px, 60vh, 400px)' }}>
              {testimonials.map((testimonial: any, index: number) => {
                const isActive = index === currentTestimonial;
                const isPrev = index === (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                const isNext = index === (currentTestimonial + 1) % testimonials.length;
                
                let scale = 0.6;
                let zIndex = 1;
                let opacity = 0;
                
                if (isActive) {
                  scale = 1;
                  zIndex = 3;
                  opacity = 1;
                } else if (isPrev || isNext) {
                  scale = 0.8;
                  zIndex = 2;
                  opacity = 0.8;
                }
                
                return (
                  <div
                    key={testimonial.id}
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) scale(${scale})`,
                      width: '100%',
                      maxWidth: '500px',
                      transition: 'all 0.5s ease',
                      zIndex: zIndex,
                      opacity: opacity,
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <div className="testimonial-card" style={{
                      background: '#1a1a1a',
                      borderRadius: '20px',
                      padding: 'clamp(25px, 6vw, 35px)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <p style={{
                        fontSize: 'clamp(13px, 3.5vw, 16px)',
                        lineHeight: '1.6',
                        marginBottom: '25px',
                        fontStyle: 'italic',
                        flex: 1
                      }}>"{testimonial.testimonial_text || testimonial.text}"</p>
                      
                      <h4 style={{ 
                        fontSize: 'clamp(16px, 4vw, 18px)', 
                        marginBottom: '12px', 
                        color: '#fff',
                        fontWeight: '600'
                      }}>
                        {testimonial.client_name || testimonial.name || 'Client'}
                      </h4>
                      
                      <div className="testimonial-rating" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={clamp(16, 17, 18)} 
                            fill={i < (testimonial.rating || 5) ? "#FFD700" : "none"} 
                            color="#FFD700" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="slider-arrow next" onClick={nextTestimonial} style={{
              position: 'absolute',
              right: window.innerWidth < 768 ? '-30px' : '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,215,0,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              cursor: 'pointer',
              display: window.innerWidth < 768 ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <ChevronRight size={clamp(20, 22, 24)} />
            </button>

            <div className="slider-dots" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '30px'
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  style={{
                    width: index === currentTestimonial ? 'clamp(25px, 6vw, 30px)' : 'clamp(8px, 2vw, 10px)',
                    height: 'clamp(8px, 2vw, 10px)',
                    borderRadius: '5px',
                    background: index === currentTestimonial ? '#FFD700' : 'rgba(255,215,0,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Submission Modal */}
      {showTestimonialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }} onClick={() => setShowTestimonialModal(false)}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'clamp(24px, 6vw, 32px)',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '450px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: 'clamp(20px, 5vw, 22px)',
                fontWeight: '600',
                color: '#FFD700'
              }}>
                Share Your Experience
              </h3>
              <button 
                onClick={() => setShowTestimonialModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleTestimonialSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={testimonialFormData.name}
                  onChange={(e) => setTestimonialFormData({...testimonialFormData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
                  Your Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialFormData({...testimonialFormData, rating: star})}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star size={clamp(24, 28, 30)} fill={star <= testimonialFormData.rating ? "#FFD700" : "none"} color="#FFD700" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
                  Your Testimonial *
                </label>
                <textarea
                  placeholder="Share your experience..."
                  rows={4}
                  value={testimonialFormData.testimonial}
                  onChange={(e) => setTestimonialFormData({...testimonialFormData, testimonial: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={testimonialFormStatus === 'sending'}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 3.5vw, 15px)',
                  fontWeight: '600',
                  opacity: testimonialFormStatus === 'sending' ? 0.7 : 1
                }}
              >
                {testimonialFormStatus === 'sending' ? 'Submitting...' : 'Submit Testimonial'}
              </button>
              
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#666', textAlign: 'center', marginTop: '16px' }}>
                Your testimonial will be reviewed before publishing.
              </p>
            </form>
          </div>
        </div>
      )}
      
      {/* FAQ Section */}
      <section className="faq-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 60px)' }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700', letterSpacing: '3px', fontWeight: '600', display: 'inline-block' }}>FAQ</span>
            <h2 style={{ 
              fontSize: 'clamp(28px, 6vw, 48px)', 
              margin: '15px 0', 
              color: '#fff', 
              fontWeight: '700',
              letterSpacing: '-1px'
            }}>
              Frequently Asked <span style={{ color: '#FFD700' }}>Questions</span>
            </h2>
            <p style={{ 
              fontSize: 'clamp(13px, 3vw, 16px)', 
              color: '#aaa', 
              marginTop: '10px', 
              lineHeight: '1.5',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Find answers to common questions about our services and process.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
            gap: 'clamp(30px, 8vw, 60px)',
            alignItems: 'center'
          }}>
            
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 215, 0, 0.15)'
            }}>
              <img 
                src={faqImage}
                alt="FAQ Illustration"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: window.innerWidth < 768 ? '250px' : '400px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            
            <div>
              <div>
                {faqs && faqs.length > 0 ? (
                  faqs.slice(0, 5).map((faq: any) => (
                    <div key={faq.id} className="faq-item" style={{
                      marginBottom: '12px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: activeFaq === faq.id ? 'rgba(255,215,0,0.05)' : 'transparent',
                      transition: 'background 0.3s ease'
                    }}>
                      <button 
                        onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                        style={{
                          width: '100%',
                          padding: 'clamp(12px, 4vw, 16px) clamp(16px, 4vw, 20px)',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontSize: 'clamp(13px, 3.5vw, 16px)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span style={{ flex: 1, paddingRight: '10px' }}>{faq.question}</span>
                        <ChevronRight size={clamp(16, 17, 18)} style={{
                          transition: 'transform 0.3s ease',
                          transform: activeFaq === faq.id ? 'rotate(90deg)' : 'rotate(0deg)',
                          color: '#FFD700',
                          flexShrink: 0
                        }} />
                      </button>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateRows: activeFaq === faq.id ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.3s ease'
                      }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{
                            padding: activeFaq === faq.id ? '0 20px 20px 20px' : '0 20px',
                            fontSize: 'clamp(12px, 3vw, 14px)',
                            lineHeight: '1.6',
                            color: '#ccc',
                            borderTop: activeFaq === faq.id ? '1px solid rgba(255,215,0,0.1)' : 'none'
                          }}>
                            <p style={{ margin: 0 }}>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#aaa', padding: '50px' }}>Loading FAQs...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0a0a0a' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Get In Touch</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Book Your <span style={{ color: '#FFD700' }}>Appointment</span></h2>
            <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
              Schedule a consultation with our experts. We're here to help you grow your business.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'clamp(20px, 5vw, 40px)',
            alignItems: 'stretch'
          }}>
            <div className="map-container" style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: 'clamp(300px, 50vw, 450px)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <iframe
                title="office-location"
                src={companyInfo?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.636256472517!2d-122.088654484685!3d37.422408979825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba5b3c4c0f0d%3A0x8c3c5f5f5f5f5f5f!2sGoogleplex!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '24px',
              padding: 'clamp(20px, 5vw, 32px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#ffffff'
              }}>
                Schedule a Meeting
              </h3>
              <p style={{
                fontSize: 'clamp(12px, 3vw, 14px)',
                color: '#aaa',
                marginBottom: '28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '16px'
              }}>
                Fill out the form and our team will contact you within 24 hours.
              </p>

              <form onSubmit={handleAppointmentSubmit}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth < 500 ? '1fr' : '1fr 1fr', 
                  gap: '16px', 
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={appointmentFormData.name}
                      onChange={(e) => setAppointmentFormData({...appointmentFormData, name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={appointmentFormData.email}
                      onChange={(e) => setAppointmentFormData({...appointmentFormData, email: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth < 500 ? '1fr' : '1fr 1fr', 
                  gap: '16px', 
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={appointmentFormData.date}
                      onChange={(e) => setAppointmentFormData({...appointmentFormData, date: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      value={appointmentFormData.time}
                      onChange={(e) => setAppointmentFormData({...appointmentFormData, time: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={appointmentFormData.phone}
                    onChange={(e) => setAppointmentFormData({...appointmentFormData, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '500', color: '#aaa' }}>
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Tell us what you'd like to discuss..."
                    rows={3}
                    value={appointmentFormData.message}
                    onChange={(e) => setAppointmentFormData({...appointmentFormData, message: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={appointmentFormStatus === 'sending'}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px)',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: '600',
                    opacity: appointmentFormStatus === 'sending' ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {appointmentFormStatus === 'sending' ? (
                    <>⏳ Booking...</>
                  ) : (
                    <>📅 Book Appointment <ArrowRight size={clamp(14, 15, 16)} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="newsletter-content" style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: 'clamp(24px, 6vw, 32px)', marginBottom: '15px' }}>Subscribe to Our Newsletter</h3>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', marginBottom: '25px', color: '#aaa' }}>Get the latest tech insights and updates directly in your inbox</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit} style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'clamp(10px, 3vw, 14px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 'clamp(13px, 3.5vw, 16px)'
                }}
              />
              <button type="submit" disabled={newsletterStatus === 'sending'} style={{
                padding: 'clamp(10px, 3vw, 14px) clamp(20px, 5vw, 30px)',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '10px',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(13px, 3.5vw, 16px)'
              }}>
                {newsletterStatus === 'sending' ? 'Subscribing...' : 'Subscribe'} <Send size={clamp(14, 15, 16)} />
              </button>
            </form>
            {newsletterStatus === 'success' && <p style={{color: '#4ade80', marginTop: '10px', fontSize: 'clamp(12px, 3vw, 14px)'}}>✅ Subscribed successfully!</p>}
            {newsletterStatus === 'error' && <p style={{color: '#f87171', marginTop: '10px', fontSize: 'clamp(12px, 3vw, 14px)'}}>❌ {newsletterErrorMsg}</p>}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scrollStats {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .testimonials-slider .slider-arrow {
            display: none !important;
          }
          .team-card-flip {
            height: 340px !important;
          }
          .team-card-back {
            padding: 12px !important;
          }
          .portfolio-filters button {
            padding: 6px 14px !important;
            font-size: 12px !important;
          }
          .pricing-section .pricing-grid {
            gap: 20px !important;
          }
          .faq-section h2 {
            font-size: 32px !important;
          }
          .team-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
          }
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .team-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .portfolio-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (max-width: 480px) {
          .team-card-flip {
            height: 300px !important;
          }
          .team-card-back p {
            font-size: 10px !important;
          }
          .service-card {
            padding: 20px !important;
          }
          .pricing-card {
            padding: 25px !important;
          }
          .faq-section h2 {
            font-size: 28px !important;
          }
          .section-title {
            font-size: 28px !important;
          }
        }
        
        @media (max-width: 768px) {
          .process-balls-container {
            transform: scale(0.9) !important;
          }
        }
        
        @media (max-width: 480px) {
          .process-balls-container {
            transform: scale(0.8) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;