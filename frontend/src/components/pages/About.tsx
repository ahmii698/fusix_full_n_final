// pages/About.tsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL, STORAGE_URL } from '../../../config';
import { 
  Award, Users, Target, Eye, Heart, Code, 
  CheckCircle, ArrowRight, Clock
} from 'lucide-react';
import SEO from '../SEO';

// Home page wale components import kar rahe hain
import TeamSection from './sections/TeamSection'; 
import FeaturesSection from './sections/FeaturesSection';

import './About.css';

const About = () => {
  const teamSectionRef = useRef<HTMLDivElement>(null);

  // --- States for Dynamic Data ---
  const [headerData, setHeaderData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [storyData, setStoryData] = useState<any>(null);
  const [principlesData, setPrinciplesData] = useState<any[]>([]);
  const [principlesHeading, setPrinciplesHeading] = useState<any>(null);
  
  // Team Data aur Features Data (Home page ki tarah)
  const [team, setTeam] = useState<any[]>([]);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // --- Animated Counters State ---
  const [counts, setCounts] = useState({
    years: 0,
    clients: 0,
    projects: 0,
    satisfaction: 0
  });

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Helper function to get image URL (Portfolio / admin panel wali same logic, STORAGE_URL ke saath) ---
  // Ye TeamSection aur FeaturesSection ko bhi pass hota hai, to un ki images bhi theek ho jayengi
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://via.placeholder.com/300x250?text=No+Image';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return `${STORAGE_URL}${url.replace('/storage', '')}`;
    if (url.startsWith('storage')) return `${STORAGE_URL}/${url.replace(/^storage\/?/, '')}`;
    if (url.startsWith('uploads')) return `${STORAGE_URL}/${url}`;
    return `${STORAGE_URL}/uploads/${url}`;
  };

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [headerRes, statsRes, storyRes, principlesRes, teamRes, featuresRes] = await Promise.all([
          axios.get(`${API_URL}/about-header`),
          axios.get(`${API_URL}/about-2`),
          axios.get(`${API_URL}/about-3-main`),
          axios.get(`${API_URL}/about-4-principles`),
          axios.get(`${API_URL}/team`),
          axios.get(`${API_URL}/features`) // Why Choose Us ke liye
        ]);

        setHeaderData(headerRes.data.data);
        setStatsData(statsRes.data.data);
        setStoryData(storyRes.data.data);
        setPrinciplesHeading(principlesRes.data.heading);
        setPrinciplesData(principlesRes.data.data);
        
        // Team data
        setTeam(teamRes.data?.data || teamRes.data || []);
        
        // Features data (Why Choose Us)
        setFeaturesData(featuresRes.data?.data || featuresRes.data || []);

      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Animated Counters Logic ---
  useEffect(() => {
    if (statsData.length === 0) return;

    const getNumericValue = (str: string) => {
      if (!str) return 0;
      return parseInt(str.replace(/\D/g, '')) || 0;
    };

    const targets = {
      years: getNumericValue(statsData[0]?.stat_number),
      clients: getNumericValue(statsData[1]?.stat_number),
      projects: getNumericValue(statsData[2]?.stat_number),
      satisfaction: getNumericValue(statsData[3]?.stat_number)
    };

    const duration = 3000;
    const steps = 60;
    const increment = {
      years: targets.years / steps,
      clients: targets.clients / steps,
      projects: targets.projects / steps,
      satisfaction: targets.satisfaction / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounts(prev => ({
          years: Math.min(Math.ceil(prev.years + increment.years), targets.years),
          clients: Math.min(Math.ceil(prev.clients + increment.clients), targets.clients),
          projects: Math.min(Math.ceil(prev.projects + increment.projects), targets.projects),
          satisfaction: Math.min(Math.ceil(prev.satisfaction + increment.satisfaction), targets.satisfaction)
        }));
        currentStep++;
      } else {
        setCounts(targets);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [statsData]);

  // Icon Mapping for Principles
  const getIconForPrinciple = (title: string) => {
    if (!title) return <Target size={40} />;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('mission')) return <Target size={40} />;
    if (lowerTitle.includes('vision')) return <Eye size={40} />;
    if (lowerTitle.includes('value')) return <Heart size={40} />;
    return <Target size={40} />;
  };

  // Loading State
  if (loading) {
    return (
      <div className="about-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="about-container">
      <SEO
        title="About Us | Fusix Tech"
        description="Learn about Fusix Tech, our expert team, our process and our mission to deliver innovative IT solutions."
        path="/about"
      />

      {/* Hero Section (Data from about_header) */}
      {headerData && (
        <section className="about-hero">
          <div className="hero-particles"></div>
          <div className="container">
            <div className="about-hero-content">
              <span className="hero-subtitle">{headerData.top_tagline}</span>
              <h1 className="hero-title">
                {headerData.main_heading_white} <span className="golden-text">{headerData.main_heading_yellow}</span>
              </h1>
              <p className="hero-description">
                {headerData.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section (Data from about_2) */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            {statsData.map((stat, index) => {
              let animatedValue = stat.stat_number;
              if (index === 0) animatedValue = counts.years + "+";
              if (index === 1) animatedValue = counts.clients + "+";
              if (index === 2) animatedValue = counts.projects + "+";
              if (index === 3) animatedValue = counts.satisfaction + "%";

              const icons = [<Clock size={32} />, <Users size={32} />, <Code size={32} />, <Award size={32} />];

              return (
                <div key={stat.id} className="stat-item">
                  <div className="stat-icon">{icons[index] || <Award size={32} />}</div>
                  <h3>{animatedValue}</h3>
                  <p>{stat.stat_label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section (Data from about_3_main) */}
      {storyData && (
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-content">
                <span className="section-subtitle">{storyData.section_tag}</span>
                <h2 className="section-title">
                  {storyData.heading_white} <span className="golden-text">{storyData.heading_yellow}</span>
                </h2>
                <p className="story-text">{storyData.paragraph_1}</p>
                <p className="story-text">{storyData.paragraph_2}</p>
                
                <div className="story-features">
                  <div className="story-feature">
                    <CheckCircle size={20} />
                    <span>{storyData.feature_1}</span>
                  </div>
                  <div className="story-feature">
                    <CheckCircle size={20} />
                    <span>{storyData.feature_2}</span>
                  </div>
                  <div className="story-feature">
                    <CheckCircle size={20} />
                    <span>{storyData.feature_3}</span>
                  </div>
                  <div className="story-feature">
                    <CheckCircle size={20} />
                    <span>{storyData.feature_4}</span>
                  </div>
                </div>
              </div>
              <div className="story-image">
                <img 
                  src={getImageUrl(storyData.image_path)} 
                  alt="Fusix Tech Team"
                  className="story-img"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission, Vision, Values (Data from about_4_principles) */}
      <section className="values-section">
        <div className="container">
          {principlesHeading && (
            <div className="section-header">
              <span className="section-subtitle">{principlesHeading.section_tag}</span>
              <h2 className="section-title">
                {principlesHeading.main_heading_white} <span className="golden-text">{principlesHeading.main_heading_yellow}</span>
              </h2>
            </div>
          )}

          <div className="values-grid">
            {principlesData.map((value) => (
              <div key={value.id} className={`value-card ${value.is_highlighted ? 'highlighted-card' : ''}`}>
                <div className="value-icon">{getIconForPrinciple(value.card_title)}</div>
                <h3>{value.card_title}</h3>
                <p>{value.card_description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Why Choose Us Section (Team se upar) - Home page wala component */}
      {featuresData.length > 0 && (
        <FeaturesSection features={featuresData} getImageUrl={getImageUrl} />
      )}

      {/* Team Section (Home page wala hi component) */}
      <div ref={teamSectionRef}>
        <TeamSection team={team} getImageUrl={getImageUrl} />
      </div>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Work With the Best?</h2>
            <p>Let's discuss how we can help transform your business</p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;